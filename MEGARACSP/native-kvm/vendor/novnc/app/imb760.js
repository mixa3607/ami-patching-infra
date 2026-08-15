import UI from './ui.js';

window.addEventListener('load', () => {
    const statusBar = document.createElement('div');
    statusBar.id = 'imb760_status_bar';
    statusBar.setAttribute('role', 'status');
	const connectionStatus = document.createElement('span');
	connectionStatus.className = 'imb760_status_item';
    const hostStatus = document.createElement('span');
    hostStatus.className = 'imb760_status_item';
    const frameRate = document.createElement('span');
    frameRate.className = 'imb760_status_metric';
    const cursorPosition = document.createElement('span');
    cursorPosition.className = 'imb760_status_metric';
    statusBar.append(connectionStatus, hostStatus, frameRate, cursorPosition);
    document.getElementById('noVNC_container').before(statusBar);

	const setStatus = (element, state, text) => {
		element.dataset.state = state;
		element.textContent = text;
	};
    const refreshStatus = async () => {
		const connected = document.documentElement.classList.contains('noVNC_connected');
		setStatus(connectionStatus, connected ? 'active' : 'unavailable',
			connected ? 'KVM connected' : 'KVM reconnecting');
		try {
			const response = await fetch('/kvm/status', { cache: 'no-store' });
			if (!response.ok) throw Error(response.status);
			const status = await response.json();
			setStatus(hostStatus, status.video === 'active' ? 'active' : 'unavailable',
				status.video === 'active' ? 'Host video active' : 'Host video unavailable');
		} catch {
			setStatus(hostStatus, 'unavailable', 'Host status unavailable');
		}
    };
    let frameCount = 0;
    let lastFrameCount = 0;
    let observedRfb;
    const observeFrames = () => {
        if (observedRfb === UI.rfb) return;
        observedRfb = UI.rfb;
        frameCount = 0;
        lastFrameCount = 0;
        if (observedRfb) observedRfb.addEventListener('framebufferupdate', () => frameCount++);
    };
    const updateFrameRate = () => {
        observeFrames();
        const rate = frameCount - lastFrameCount;
        lastFrameCount = frameCount;
        frameRate.textContent = `${rate} FPS`;
    };
    document.getElementById('noVNC_container').addEventListener('pointermove', (event) => {
        const canvas = event.currentTarget.querySelector('canvas');
        if (!canvas) return;
        const bounds = canvas.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const x = Math.max(0, Math.min(canvas.width - 1,
            Math.floor((event.clientX - bounds.left) * canvas.width / bounds.width)));
        const y = Math.max(0, Math.min(canvas.height - 1,
            Math.floor((event.clientY - bounds.top) * canvas.height / bounds.height)));
        cursorPosition.textContent = `Cursor ${x}, ${y}`;
    });
    document.getElementById('noVNC_container').addEventListener('pointerleave', () => {
        cursorPosition.textContent = 'Cursor --, --';
    });
    refreshStatus();
    setInterval(refreshStatus, 2000);
    updateFrameRate();
    setInterval(updateFrameRate, 1000);

	for (const id of ['noVNC_shutdown_button', 'noVNC_reboot_button', 'noVNC_reset_button']) {
		const button = document.getElementById(id);
		button.disabled = true;
		button.title = 'Power controls are disabled';
	}

    const clipboard = document.getElementById('noVNC_clipboard_text');
    const pasteButton = document.createElement('button');
    pasteButton.type = 'button';
    pasteButton.id = 'imb760_paste_button';
    pasteButton.textContent = 'Type Clipboard';
    const pasteStatus = document.createElement('p');
    pasteStatus.id = 'imb760_paste_status';
    const updatePasteStatus = () => {
        const text = clipboard.value;
        const bytes = new TextEncoder().encode(text).length;
        const replaced = [...text].filter((character) => character.codePointAt(0) > 0x7f).length;
        if (bytes > 16 * 1024) {
            pasteButton.disabled = true;
            pasteStatus.textContent = `${bytes} bytes exceeds the 16 KiB limit`;
        } else {
            pasteButton.disabled = false;
            pasteStatus.textContent = `${bytes} bytes${replaced ? `; ${replaced} non-ASCII characters become ?` : ''}`;
        }
    };
    clipboard.addEventListener('input', updatePasteStatus);
    pasteButton.addEventListener('click', () => {
        UI.clipboardSend();
        pasteStatus.textContent = 'Sent to BMC';
    });
    clipboard.insertAdjacentElement('afterend', pasteButton);
    pasteButton.insertAdjacentElement('afterend', pasteStatus);
    updatePasteStatus();

    const postButton = document.createElement('input');
    postButton.type = 'image';
    postButton.id = 'imb760_post_button';
    postButton.src = 'app/images/info.svg';
    postButton.alt = 'POST';
    postButton.title = 'POST code history';
    postButton.className = 'noVNC_button';
    const postPanel = document.createElement('section');
    postPanel.id = 'imb760_post_panel';
    const postTitle = document.createElement('strong');
    postTitle.textContent = 'POST code history';
    const postRefresh = document.createElement('button');
    postRefresh.type = 'button';
    postRefresh.textContent = 'Refresh';
    const postOutput = document.createElement('pre');
    postPanel.append(postTitle, postRefresh, postOutput);
    document.getElementById('noVNC_control_bar').append(postButton, postPanel);

    const postLabels = {
        'a0': 'IDE initialization', 'a1': 'IDE reset', 'a2': 'IDE detect', 'a3': 'IDE enable',
        'a8': 'Setup verification', 'a9': 'Setup start', 'aa': 'Setup input wait',
        'b0': 'Runtime services', 'b1': 'Runtime services', 'b3': 'Memory test', 'b4': 'USB hot plug',
        'b6': 'NVRAM configuration', 'b7': 'NVRAM configuration', 'b8': 'Password check',
        'ba': 'CPU initialization', 'bb': 'CPU initialization', 'bc': 'AP initialization',
        'bf': 'CPU initialization', 'c7': 'OEM initialization', 'd0': 'CPU initialization',
        'e0': 'SMM initialization', 'e1': 'SMM initialization', 'e9': 'SMM initialization',
        'ef': 'SMM initialization', '90': 'PCI bus initialization', '91': 'PCI bus initialization',
        '92': 'PCI bus initialization', '94': 'PCI bus initialization', '95': 'PCI bus initialization',
        '96': 'PCI bus initialization', '97': 'PCI bus initialization', '98': 'PCI bus initialization',
        '99': 'PCI bus initialization', '9a': 'PCI bus initialization', '9c': 'PCI bus initialization',
    };
    const codesFrom = (text) => [...text.matchAll(/0x([0-9a-f]{2})/gi)].map((match) => match[1].toLowerCase());
    const transitions = (codes) => codes.filter((code, index) => index === 0 || code !== codes[index - 1]);
    const renderHistory = (name, codes) => {
        const decoded = transitions(codes).map((code) => `0x${code.toUpperCase()} ${postLabels[code] || 'Unmapped'}`);
        return `${name}: ${codes.length} samples\nRaw: ${codes.map((code) => `0x${code}`).join(' ')}\nChanges:\n${decoded.join('\n')}`;
    };
    const refreshPostCodes = async () => {
        postRefresh.disabled = true;
        postOutput.textContent = 'Reading BMC snoop history...';
        try {
            const response = await fetch('/post-codes', { cache: 'no-store' });
            if (!response.ok) throw Error(`POST endpoint returned ${response.status}`);
            const sections = (await response.text()).split('Previous Post Codes are ...');
            const current = codesFrom(sections[0]);
            const previous = codesFrom(sections[1] || '');
            postOutput.textContent = `${renderHistory('Current', current)}\n\n${renderHistory('Previous', previous)}`;
        } catch (error) {
            postOutput.textContent = `POST history unavailable: ${error.message}`;
        } finally {
            postRefresh.disabled = false;
        }
    };
    postButton.addEventListener('click', () => {
        postPanel.classList.toggle('imb760_open');
        if (postPanel.classList.contains('imb760_open')) refreshPostCodes();
    });
    postRefresh.addEventListener('click', refreshPostCodes);
});
