#!/usr/bin/env -S dotnet --
#:package System.CommandLine@2.0.11
#:package YamlDotNet@18.1.0
#:property PublishAot=false

using System.CommandLine;
using System.Diagnostics;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

var uefiDumpOption = new Option<FileInfo>("--uefi-dump") { Required = true };
var manifestOption = new Option<FileInfo>("--manifest") { Required = true };
var outputDirOption = new Option<DirectoryInfo>("--output-dir") { Required = true };
var uefiExtractOption = new Option<FileInfo?>("--uefi-extract");
var ifrExtractorOption = new Option<FileInfo?>("--ifr-extractor");

var command = new RootCommand("Extract explicit UEFI sections from a firmware dump.");
command.Options.Add(uefiDumpOption);
command.Options.Add(manifestOption);
command.Options.Add(outputDirOption);
command.Options.Add(uefiExtractOption);
command.Options.Add(ifrExtractorOption);
command.SetAction(async result =>
{
    try
    {
        await ExtractAsync(
            result.GetRequiredValue(uefiDumpOption),
            result.GetRequiredValue(manifestOption),
            result.GetRequiredValue(outputDirOption),
            result.GetValue(uefiExtractOption),
            result.GetValue(ifrExtractorOption));
        return 0;
    }
    catch (ToolFailedException error)
    {
        Console.Error.WriteLine($"error: {error.Message}");
        Console.Error.WriteLine($"command: {FormatCommand(error.Executable, error.Arguments)}");
        if (!string.IsNullOrWhiteSpace(error.StandardOutput))
            Console.Error.WriteLine($"stdout:\n{error.StandardOutput}");
        if (!string.IsNullOrWhiteSpace(error.StandardError))
            Console.Error.WriteLine($"stderr:\n{error.StandardError}");
        return 1;
    }
    catch (Exception error)
    {
        Console.Error.WriteLine($"error: {error.Message}");
        return 1;
    }
});

return await command.Parse(args).InvokeAsync();

static async Task ExtractAsync(
    FileInfo uefiDump,
    FileInfo manifestFile,
    DirectoryInfo outputDirectory,
    FileInfo? requestedUefiExtract,
    FileInfo? requestedIfrExtractor)
{
    var dumpPath = Path.GetFullPath(uefiDump.FullName);
    var manifestPath = Path.GetFullPath(manifestFile.FullName);
    var outputPath = Path.GetFullPath(outputDirectory.FullName);
    RequireFile(dumpPath, "UEFI dump");
    RequireFile(manifestPath, "manifest");

    var sections = ValidateSections(LoadManifest(manifestPath), outputPath);
    var softwareDirectory = FindSoftwareDirectory(manifestPath);
    var uefiExtract = requestedUefiExtract?.FullName
        ?? Path.Combine(softwareDirectory, "UEFITool_NE_A72_win64/uefiextract");
    var ifrExtractor = requestedIfrExtractor?.FullName
        ?? Path.Combine(softwareDirectory, "IFRExtractor-RS-structured/ifrextractor");
    RequireExecutable(uefiExtract, "UEFIExtract");
    RequireExecutable(ifrExtractor, "IFRExtractor-RS-structured");

    Console.WriteLine($"UEFI dump: {dumpPath}");
    Console.WriteLine($"Manifest: {manifestPath}");
    Console.WriteLine($"Output: {outputPath}");
    Console.WriteLine($"UEFIExtract: {uefiExtract}");
    Console.WriteLine($"IFR extractor: {ifrExtractor}");

    Directory.CreateDirectory(outputPath);
    var temporaryPath = Path.Combine(Path.GetTempPath(), $"extract-ifr-{Guid.NewGuid():N}");
    Directory.CreateDirectory(temporaryPath);
    try
    {
        var headerRequests = new List<ExtractionRequest>();
        var bodyRequests = new List<ExtractionRequest>();
        foreach (var section in sections)
        {
            bodyRequests.Add(new(section, Path.Combine(temporaryPath, $"{section.Index}.body"), "body"));
            if (section.OutputMode == "section")
                headerRequests.Add(new(section, Path.Combine(temporaryPath, $"{section.Index}.header"), "header"));
        }

        await RunUefiExtractAsync(uefiExtract, dumpPath, headerRequests);
        await RunUefiExtractAsync(uefiExtract, dumpPath, bodyRequests);

        foreach (var section in sections)
        {
            var bodyDirectory = Path.Combine(temporaryPath, $"{section.Index}.body");
            var body = RequireExactlyOneFile(bodyDirectory, "body.bin", section);
            Directory.CreateDirectory(Path.GetDirectoryName(section.OutputPath)!);
            if (section.OutputMode == "section")
            {
                var headerDirectory = Path.Combine(temporaryPath, $"{section.Index}.header");
                var header = RequireExactlyOneFile(headerDirectory, "header.bin", section);
                await using var target = File.Create(section.OutputPath);
                await using (var source = File.OpenRead(header))
                    await source.CopyToAsync(target);
                await using (var source = File.OpenRead(body))
                    await source.CopyToAsync(target);
            }
            else
            {
                File.Copy(body, section.OutputPath, overwrite: true);
            }

            Console.WriteLine($"Extracted {section.Name}: {section.OutputPath}");
            if (section.IfrJsonPath is not null)
            {
                File.Delete(section.IfrJsonPath);
                await RunToolAsync(ifrExtractor, [section.OutputPath, "json"]);
                RequireFile(section.IfrJsonPath, $"IFR JSON for {section.Name}");
                Console.WriteLine($"IFR JSON: {section.IfrJsonPath}");
            }
        }
    }
    finally
    {
        Directory.Delete(temporaryPath, recursive: true);
    }
}

static Manifest LoadManifest(string path)
{
    var deserializer = new DeserializerBuilder()
        .WithNamingConvention(CamelCaseNamingConvention.Instance)
        .Build();
    return deserializer.Deserialize<Manifest>(File.ReadAllText(path))
        ?? throw new InvalidDataException("manifest is empty");
}

static List<ResolvedSection> ValidateSections(Manifest manifest, string outputDirectory)
{
    if (manifest.Version != 1 || manifest.Sections is not { Count: > 0 })
        throw new InvalidDataException("manifest must contain version: 1 and a non-empty sections list");

    var outputs = new HashSet<string>(StringComparer.Ordinal);
    return manifest.Sections.Select((section, index) =>
    {
        if (string.IsNullOrWhiteSpace(section.Name) || string.IsNullOrWhiteSpace(section.Output)
            || string.IsNullOrWhiteSpace(section.FileGuid) || section.ExpectedCount is null)
            throw new InvalidDataException($"section {index} has an empty required field");
        if (!Guid.TryParse(section.FileGuid, out _))
            throw new InvalidDataException($"invalid fileGuid for {section.Name}");
        if (section.SectionType is < 0 or > 0xFF)
            throw new InvalidDataException($"sectionType must be a byte for {section.Name}");
        if (section.OutputMode is not ("section" or "body"))
            throw new InvalidDataException($"invalid outputMode for {section.Name}");
        if (section.ExpectedCount != 1)
            throw new InvalidDataException($"expectedCount must be 1 for {section.Name}");

        var outputPath = ResolveOutputPath(outputDirectory, section.Output, "output");
        var ifrJsonPath = section.IfrJson is null ? null
            : ResolveOutputPath(outputDirectory, section.IfrJson, "ifrJson");
        if (!outputs.Add(outputPath) || ifrJsonPath is not null && !outputs.Add(ifrJsonPath))
            throw new InvalidDataException($"duplicate output for {section.Name}");
        return new ResolvedSection(index, section.Name, outputPath, section.FileGuid, section.SectionType,
            section.OutputMode, section.ExpectedCount.Value, ifrJsonPath);
    }).ToList();
}

static string ResolveOutputPath(string outputDirectory, string value, string field)
{
    if (string.IsNullOrWhiteSpace(value) || Path.IsPathRooted(value))
        throw new InvalidDataException($"{field} must be a non-empty relative path");
    var path = Path.GetFullPath(Path.Combine(outputDirectory, value));
    var relativePath = Path.GetRelativePath(outputDirectory, path);
    if (relativePath == "." || relativePath.StartsWith(".." + Path.DirectorySeparatorChar))
        throw new InvalidDataException($"{field} escapes --output-dir: {value}");
    return path;
}

static string FindSoftwareDirectory(string manifestPath)
{
    foreach (var start in new[] { Environment.CurrentDirectory, Path.GetDirectoryName(manifestPath)! })
    {
        for (var directory = new DirectoryInfo(start); directory is not null; directory = directory.Parent)
        {
            var softwareDirectory = Path.Combine(directory.FullName, "SOFTWARE");
            if (Directory.Exists(softwareDirectory))
                return softwareDirectory;
        }
    }
    throw new InvalidOperationException("could not locate SOFTWARE; pass --uefi-extract and --ifr-extractor");
}

static async Task RunUefiExtractAsync(string executable, string dump, List<ExtractionRequest> requests)
{
    if (requests.Count == 0)
        return;
    var arguments = new List<string> { dump };
    arguments.AddRange(requests.Select(request => request.Section.FileGuid));
    arguments.Add("-o");
    arguments.AddRange(requests.Select(request => request.Destination));
    arguments.Add("-m");
    arguments.AddRange(requests.Select(request => request.Mode));
    arguments.Add("-t");
    arguments.AddRange(requests.Select(request => $"0x{request.Section.SectionType:X}"));
    await RunToolAsync(executable, arguments);
}

static async Task RunToolAsync(string executable, IEnumerable<string> arguments)
{
    var argumentList = arguments.ToList();
    var startInfo = new ProcessStartInfo(executable)
    {
        UseShellExecute = false,
        RedirectStandardOutput = true,
        RedirectStandardError = true,
    };
    foreach (var argument in argumentList)
        startInfo.ArgumentList.Add(argument);
    using var process = Process.Start(startInfo) ?? throw new InvalidOperationException($"could not start {executable}");
    var standardOutput = process.StandardOutput.ReadToEndAsync();
    var standardError = process.StandardError.ReadToEndAsync();
    await process.WaitForExitAsync();
    await Task.WhenAll(standardOutput, standardError);
    if (process.ExitCode != 0)
        throw new ToolFailedException(executable, argumentList, process.ExitCode,
            standardOutput.Result, standardError.Result);
}

static string RequireExactlyOneFile(string directory, string expectedName, ResolvedSection section)
{
    if (!Directory.Exists(directory))
        throw new InvalidDataException($"no {expectedName} extracted for {section.Name}");
    var files = Directory.GetFiles(directory, "*.bin", SearchOption.AllDirectories);
    if (files.Length != section.ExpectedCount)
        throw new InvalidDataException($"expected {section.ExpectedCount} {section.ModeDescription} section for {section.Name}, found {files.Length}");
    var expectedPath = Path.Combine(directory, expectedName);
    RequireFile(expectedPath, $"{section.ModeDescription} for {section.Name}");
    return expectedPath;
}

static string FormatCommand(string executable, IEnumerable<string> arguments) => string.Join(" ",
    new[] { executable }.Concat(arguments).Select(argument => $"'{argument.Replace("'", "'\\''")}'"));

static void RequireFile(string path, string label)
{
    if (!File.Exists(path))
        throw new FileNotFoundException($"{label} not found", path);
}

static void RequireExecutable(string path, string label)
{
    RequireFile(path, label);
    if (!OperatingSystem.IsWindows() && (File.GetUnixFileMode(path) & UnixFileMode.UserExecute) == 0)
        throw new InvalidOperationException($"{label} is not executable: {path}");
}

sealed class Manifest
{
    public int Version { get; init; }
    public List<Section>? Sections { get; init; }
}

sealed class Section
{
    public string Name { get; init; } = "";
    public string Output { get; init; } = "";
    public string FileGuid { get; init; } = "";
    public int SectionType { get; init; }
    public string OutputMode { get; init; } = "";
    public int? ExpectedCount { get; init; }
    public string? IfrJson { get; init; }
}

sealed record ResolvedSection(int Index, string Name, string OutputPath, string FileGuid,
    int SectionType, string OutputMode, int ExpectedCount, string? IfrJsonPath)
{
    public string ModeDescription => OutputMode == "section" ? "PE32" : "body";
}
sealed record ExtractionRequest(ResolvedSection Section, string Destination, string Mode);
sealed class ToolFailedException(string executable, List<string> arguments, int exitCode,
    string standardOutput, string standardError)
    : InvalidOperationException($"{Path.GetFileName(executable)} exited with status {exitCode}")
{
    public string Executable { get; } = executable;
    public List<string> Arguments { get; } = arguments;
    public string StandardOutput { get; } = standardOutput;
    public string StandardError { get; } = standardError;
}
