import contextlib
import io
import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

import bios_state_lab as lab


IFR = '''Program version: 1.6.0, Extraction mode: UEFI
0x0: FormSet Guid: 11111111-2222-3333-4444-555555555555, Title: "Test", Help: "" { }
0x1: \tVarStoreEfi Guid: AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE, VarStoreId: 0x1, Attributes: 0x3, Size: 0x2, Name: "TestSetup" { }
0x2: \tOneOf Prompt: "Controller", Help: "", QuestionFlags: 0x10, QuestionId: 0x1, VarStoreId: 0x1, VarOffset: 0x0, Flags: 0x10, Size: 8, Min: 0x0, Max: 0x1, Step: 0x0 { }
0x3: \tSuppressIf { }
0x4: \t\tEqIdVal QuestionId: 0x1, Value: 0x0 { }
0x5: \t\tOneOf Prompt: "Child", Help: "", QuestionFlags: 0x10, QuestionId: 0x2, VarStoreId: 0x1, VarOffset: 0x1, Flags: 0x10, Size: 8, Min: 0x0, Max: 0x1, Step: 0x0 { }
0x6: \tEnd { }
'''


class BiosStateLabTest(unittest.TestCase):
    def test_registry_rebuild_and_state(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "test.uefi.ifr.txt").write_text(IFR)
            registry_path = root / "registry.json"
            lab.build_registry(SimpleNamespace(ifr_root=root, output=registry_path))
            registry = json.loads(registry_path.read_text())
            self.assertEqual(registry["question_count"], 2)

            efivars = root / "efivars"
            efivars.mkdir()
            (efivars / "TestSetup-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee").write_bytes(b"\x07\0\0\0\0\0")
            snapshot_path = root / "snapshot.json"
            lab.snapshot(SimpleNamespace(efivars=efivars, output=snapshot_path))

            stdout = io.StringIO()
            with contextlib.redirect_stdout(stdout):
                lab.state(SimpleNamespace(registry=registry_path, snapshot=snapshot_path))
            state = json.loads(stdout.getvalue())
            self.assertEqual(state["coverage"]["present_varstores"], 1)
            self.assertEqual(state["coverage"]["missing_varstores"], [])
            child = next(item for item in state["questions"] if item["question"]["prompt"] == "Child")
            self.assertTrue(child["state"]["hidden"])


if __name__ == "__main__":
    unittest.main()
