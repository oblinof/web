
// --- State Management ---
interface AppWindow {
    id: number;
    appId: string;
    title: string;
    content: string | HTMLElement;
    zIndex: number;
    element?: HTMLElement;
}

interface MusicAlbum {
    title: string;
    artist: string;
    iframe: string;
}

interface AppDefinition {
    id: string;
    name: string;
    description: string;
    icon: string; // Emoji or HTML for the icon
    color: string; // Accent color for the card
    category: 'SYSTEM' | 'MEDIA' | 'TOOLS' | 'XENO';
    action: () => void;
}

let windows: AppWindow[] = [];
let nextWindowId = 0;
let highestZIndex = 100;

// --- Data ---
const musicAlbums: MusicAlbum[] = [
    {
        title: 'Opalyn',
        artist: 'Faycle',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2788353006/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/opalyn">Opalyn by Faycle</a></iframe>`
    },
    {
        title: 'Kickgun & Dentalcore VOL2',
        artist: 'oblinof',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=105379128/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/kickgun-dentalcore-vol2">Kickgun &amp; Dentalcore VOL2 by oblinof</a></iframe>`
    },
    {
        title: 'Graphical Interface Trance',
        artist: 'Oblinof',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2659704266/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/graphical-interface-trance">Graphical Interface Trance by Oblinof</a></iframe>`
    },
    {
        title: 'edits, tools, & trash',
        artist: 'Oblinof',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2147918188/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/edits-tools-trash">edits, tools, &amp; trash by Oblinof</a></iframe>`
    },
    {
        title: 'Dogma',
        artist: 'Aloe Engine',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=193817841/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/dogma">Dogma by Aloe Engine</a></iframe>`
    },
    {
        title: ',-Dr3ja',
        artist: 'Oblinof',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=541149304/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/dr3ja">,-Dr3ja by Oblinof</a></iframe>`
    },
    {
        title: '842',
        artist: 'Aural Eq',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=1723178745/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/842">842 by Aural Eq</a></iframe>`
    },
    {
        title: 'Wifi Pineal',
        artist: 'Oblinof',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3419546872/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/wifi-pineal">Wifi Pineal by Oblinof</a></iframe>`
    }
];

// --- DOM Elements ---
const root = document.getElementById('root')!;
let windowsContainer: HTMLElement | null = null;
let tracklistPanel: HTMLElement | null = null;
let workspace: HTMLElement | null = null;

// --- Core Functions ---

function updateWorkspaceState() {
    if (!workspace) return;
    
    // If any window is open, we hide the tracklist (Menu) and show the Windows layer
    const hasActiveWindow = windows.length > 0;

    if (hasActiveWindow) {
        workspace.classList.add('app-active');
    } else {
        workspace.classList.remove('app-active');
    }
}

function createWindow(appId: string, title: string, content: string | HTMLElement) {
    // Single tasking mode: Close other windows first (Game Console style)
    if (windows.length > 0) {
        // Just clear the array and DOM for simplicity in this arcade style
        windows = [];
        if (windowsContainer) windowsContainer.innerHTML = '';
    }

    highestZIndex++;
    
    const newWindow: AppWindow = {
        id: nextWindowId++,
        appId: appId,
        title: title,
        content: content,
        zIndex: highestZIndex,
    };

    renderWindowElement(newWindow);
    windows.push(newWindow);
    updateWorkspaceState();
}

function renderWindowElement(win: AppWindow) {
    const windowEl = document.createElement('div');
    windowEl.id = `window-${win.id}`;
    windowEl.className = `ddr-window entrance-anim`;
    windowEl.style.zIndex = `${win.zIndex}`;
    
    // Header / Controls
    const headerHTML = `
        <div class="window-header">
            <div class="header-title-box">
                <span class="header-label">RUNNING //</span>
                <span class="header-name">${win.title}</span>
            </div>
            <div class="window-controls">
                <button class="ctrl-btn close-btn" title="EXIT APP">EXIT X</button>
            </div>
        </div>
        <div class="difficulty-bar">
             <span class="diff-tag active">SYSTEM BUSY</span>
             <span class="diff-stripes">////////////////////////////////////////////////</span>
        </div>
    `;

    windowEl.innerHTML = headerHTML;

    const contentContainer = document.createElement('div');
    contentContainer.className = 'window-body custom-scrollbar';
    
    if (typeof win.content === 'string') {
        contentContainer.innerHTML = win.content;
    } else {
        contentContainer.appendChild(win.content);
    }
    windowEl.appendChild(contentContainer);
    
    if (!windowsContainer) {
        windowsContainer = document.querySelector('.windows-layer');
    }
    if (windowsContainer) windowsContainer.appendChild(windowEl);
    win.element = windowEl;

    setTimeout(() => windowEl.classList.remove('entrance-anim'), 500);
    
    // Setup Events
    const closeBtn = windowEl.querySelector('.close-btn');
    closeBtn?.addEventListener('click', () => closeWindow(win));
}

function closeWindow(win: AppWindow) {
    if (win.element) {
        win.element.classList.add('closing');
        setTimeout(() => {
            win.element?.remove();
            windows = windows.filter(w => w.id !== win.id);
            updateWorkspaceState();
        }, 300);
    }
}

// --- App Content Generators ---

function openMusicWindow() {
    const container = document.createElement('div');
    container.className = 'music-grid';
    
    const djItem = document.createElement('div');
    djItem.className = 'music-item special-item';
    djItem.innerHTML = `
        <div class="disc-icon spinning">💿</div>
        <div class="music-info">
            <div class="music-title">DJ OBLI MIXES</div>
            <div class="music-artist">CLOUD STREAM</div>
        </div>
    `;
    djItem.onclick = () => createWindow('dj_obli', 'DJ OBLI // MIXES', `<iframe style="border: 0; width: 100%; height: 100%;" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1581868891&color=%2300ffff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>`);
    container.appendChild(djItem);

    musicAlbums.forEach((album, idx) => {
        const item = document.createElement('div');
        item.className = 'music-item';
        item.innerHTML = `
            <div class="disc-icon">🎵</div>
            <div class="music-info">
                <div class="music-title">${album.title}</div>
                <div class="music-artist">${album.artist}</div>
            </div>
        `;
        item.onclick = () => createWindow(`album_${idx}`, `AUDIO: ${album.title}`, album.iframe);
        container.appendChild(item);
    });

    createWindow('music', 'MUSIC SELECT', container);
}

function openGalleryWindow() {
    createWindow('gallery', 'VISUAL MODE', `<iframe src="https://artviewer.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`);
}

function openContactWindow() {
    createWindow('contact', 'PLAYER DATA', `
        <div class="profile-layout">
            <div class="profile-card">
                <div class="profile-header">
                    <div class="avatar-placeholder">☻</div>
                    <div class="profile-names">
                        <h2 class="glitch-text" data-text="OBLINOF">OBLINOF</h2>
                        <span class="subtitle">SYSTEM OPERATOR</span>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-row">
                        <span class="stat-label">CLASS</span>
                        <span class="stat-val">ARTIST/DESIGNER</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">RANK</span>
                        <span class="stat-val text-yellow">SSS</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">ZONE</span>
                        <span class="stat-val">AUDIOVISUAL METAMODEL</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">EXP</span>
                        <span class="stat-val">SINCE [2007]</span>
                    </div>
                </div>

                <div class="action-buttons">
                    <a href="mailto:oblinof@gmail.com" target="_blank" class="action-btn">
                        <span>✉ SEND MAIL</span>
                    </a>
                    <a href="https://linktr.ee/oblinof" target="_blank" class="action-btn">
                        <span>∞ NEURAL LINK</span>
                    </a>
                </div>
            </div>
        </div>
    `);
}

function openTrashWindow() {
    createWindow('trash', 'RECYCLE BIN', `<div class="empty-state">
        <div style="font-size: 64px; margin-bottom: 20px;">🗑</div>
        <div>NO GARBAGE DATA FOUND</div>
        <div style="font-size: 12px; color: #666; margin-top: 10px;">SYSTEM CLEAN</div>
    </div>`);
}


// --- App Configuration ---

const apps: AppDefinition[] = [
    { id: 'music', name: 'Music', description: 'Audio Lib', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M2 1h4v1h1v4h-2v-2h1v-2h-4v2h1v2h-2v-4h1z"/></svg>', color: '#ff00cc', category: 'MEDIA', action: openMusicWindow },
    { id: 'gallery', name: 'Gallery', description: 'Visuals', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M1 1h6v6h-6zm1 1v4h4v-4zm1 2l1 1 1-1 1 2h-4z"/></svg>', color: '#00ffff', category: 'MEDIA', action: openGalleryWindow },
    { id: 'contact', name: 'Profile', description: 'Player Info', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M3 1h2v2h-2zm-1 3h4v1h1v2h-6v-2h1z"/></svg>', color: '#ffcc00', category: 'SYSTEM', action: openContactWindow },
    
    { id: 'datafall', name: 'Datafall', description: 'Water Sim', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4 1h1v1h1v2h1v2h-1v1h-4v-1h-1v-2h1v-2h1v-1z"/></svg>', color: '#0088ff', category: 'TOOLS', action: () => createWindow('datafall', 'DATAFALL.EXE', `<iframe src="https://datafall.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'paintdelic', name: 'Paint', description: 'Pixel Art', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M2 1h3v1h1v2h-1v1h-1v2h-1v-2h-1v-1h-1v-2h1z"/></svg>', color: '#ff4444', category: 'TOOLS', action: () => createWindow('paintdelic', 'PAINTDELIC_V2', `<iframe src="https://paintedelic.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'ambient', name: 'Ambient', description: 'Synth', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M3 1h1v1h1v1h1v2h-1v1h-1v1h-1v-2h-2v-2h2z"/></svg>', color: '#aa00ff', category: 'TOOLS', action: () => createWindow('ambient', 'AMBIENT PORTABLE', `<iframe src="https://conversation-rope-497.app.ohara.ai" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'entity', name: 'Entity', description: 'Collab', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M2 1h4v1h1v1h1v2h-1v1h-1v-1h-4v1h-1v-1h-1v-2h1v-1h1zm1 2v1h1v-1zm2 0v1h1v-1z"/></svg>', color: '#00ff44', category: 'TOOLS', action: () => createWindow('entity', 'ENTITY COLLAB', `<iframe src="https://entity-collab.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'wordarp', name: 'WordArp', description: 'Console', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M1 2h6v4h-6zm1 1v2h1v-2zm2 0v2h1v-2z"/></svg>', color: '#ffffff', category: 'TOOLS', action: () => createWindow('wordarp', 'WORD ARP CONSOLE', `<iframe src="https://wordarp.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    
    { id: 'realism', name: 'Realism', description: 'Glitch FX', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M2 3h4v1h1v1h-1v1h-4v-1h-1v-1h1zm2 0v2h1v-2z"/></svg>', color: '#ff0000', category: 'XENO', action: () => createWindow('realism', 'EXTRACTIVIST REALISM', `<iframe src="https://extractivist-realism.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'ravecat', name: 'Ravecat', description: '3D Sim', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M1 2h1v1h4v-1h1v3h-1v2h-4v-2h-1zm2 2v1h1v-1zm2 0v1h1v-1z"/></svg>', color: '#ff8800', category: 'XENO', action: () => createWindow('ravecat', 'RAVECAT SIMULATION', `<iframe src="https://ravecat-beta.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'psyballz', name: 'PsyBallz', description: 'Physics', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M3 1h2v1h1v1h1v2h-1v1h-1v1h-2v-1h-1v-1h-1v-2h1v-1h1zm1 1v1h1v-1z"/></svg>', color: '#8800ff', category: 'XENO', action: () => createWindow('psyballz', 'PSYBALLZ', `<iframe src="https://psyballs.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'sydra', name: 'Sydra', description: 'Genetics', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M2 1h1v1h2v-1h1v1h-1v1h-2v1h2v1h1v1h-1v-1h-2v1h-1v-1h1v-1h2v-1h-2v-1h-1z"/></svg>', color: '#00ff88', category: 'XENO', action: () => createWindow('sydra', 'SYDRA GENETICS', `<iframe src="https://sydra-byhq.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    
    { id: 'trash', name: 'Trash', description: 'Empty', icon: '<svg viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M3 1h2v1h2v1h-6v-1h2zm-1 2h4v4h-4zm1 1v2h1v-2zm1 0v2h1v-2z"/></svg>', color: '#666666', category: 'SYSTEM', action: openTrashWindow },
];

// --- Render ---

function render() {
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,700;1,700&display=swap');

        :root {
            --ddr-yellow: #ffcc00;
            --ddr-cyan: #00ffff;
            --ddr-blue: #000033;
            --ddr-pink: #ff00cc;
            --ddr-dark: #000000;
            --font-main: 'Chakra Petch', sans-serif;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0; padding: 0;
            background-color: var(--ddr-blue);
            color: #fff;
            font-family: var(--font-main);
            overflow: hidden;
            height: 100vh;
            width: 100vw;
        }

        /* --- ANIMATIONS --- */
        @keyframes rainbow-text {
            0% { color: #fff; text-shadow: 2px 2px 0 #000; }
            25% { color: var(--ddr-cyan); text-shadow: 2px 2px 0 var(--ddr-pink); }
            50% { color: var(--ddr-yellow); text-shadow: 2px 2px 0 #000; }
            75% { color: var(--ddr-pink); text-shadow: 2px 2px 0 var(--ddr-cyan); }
            100% { color: #fff; text-shadow: 2px 2px 0 #000; }
        }

        @keyframes pulse-border {
            0% { box-shadow: 0 0 5px var(--ddr-cyan); }
            50% { box-shadow: 0 0 15px var(--ddr-cyan), 0 0 30px var(--ddr-cyan); }
            100% { box-shadow: 0 0 5px var(--ddr-cyan); }
        }

        @keyframes bgScroll {
            0% { background-position: 0 0; }
            100% { background-position: 50px 50px; }
        }

        /* --- BACKGROUND --- */
        #root {
            position: relative;
            width: 100%; height: 100%;
            background: 
                radial-gradient(circle at center, #001122 0%, #000 100%),
                linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 100% 100%, 30px 30px, 30px 30px;
            animation: bgScroll 10s linear infinite;
        }

        /* --- LAYOUT --- */
        .ddr-layout {
            display: flex;
            height: 100%;
            width: 100%;
            flex-direction: column;
            position: relative;
            z-index: 10;
            max-width: 600px;
            margin: 0 auto;
            background-color: #5a6b5d; /* Base hardware color */
            border-left: 10px solid #4a5a4d;
            border-right: 10px solid #4a5a4d;
            box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 0 50px rgba(0,0,0,0.8);
            padding: 10px;
            border-radius: 10px;
        }

        /* Hardware texture overlay */
        .ddr-layout::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><rect width="4" height="4" fill="none"/><path d="M0 0L4 4M4 0L0 4" stroke="rgba(0,0,0,0.05)" stroke-width="1"/></svg>');
            pointer-events: none;
            z-index: -1;
        }

        /* --- HEADER --- */
        .ddr-header {
            height: 60px;
            background: #2a3b2d;
            border: 2px solid #1a2b1d;
            border-bottom: 4px solid #111;
            border-top: 4px solid #7a8b7d;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            margin-bottom: 10px;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
            flex-shrink: 0;
            z-index: 200;
        }

        .header-logo {
            font-size: 24px;
            font-weight: 900;
            font-family: 'Courier New', Courier, monospace;
            color: #00ff00;
            text-shadow: 0 0 5px #00ff00;
            background: #000;
            padding: 5px 10px;
            border: 2px inset #333;
            border-radius: 3px;
        }
        .header-logo span { display: block; animation: pulse-glow 2s infinite; }

        @keyframes pulse-glow {
            0%, 100% { text-shadow: 0 0 5px #00ff00; color: #00ff00; }
            50% { text-shadow: 0 0 15px #00ff00, 0 0 20px #00ff00; color: #ccffcc; }
        }

        .bpm-counter {
            background: #000;
            color: #ff9900;
            font-family: 'Courier New', Courier, monospace;
            font-weight: bold;
            font-size: 16px;
            padding: 5px 10px;
            border: 2px inset #333;
            border-radius: 3px;
            text-shadow: 0 0 5px #ff9900;
        }

        /* --- WORKSPACE --- */
        .workspace {
            flex-grow: 1;
            position: relative;
            overflow: hidden;
            background: #000;
            border: 4px solid #333;
            border-radius: 5px;
            box-shadow: inset 0 0 20px rgba(0,255,255,0.1);
        }

        /* Screen scanlines */
        .workspace::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 4px, 6px 100%;
            pointer-events: none;
            z-index: 150;
        }

        /* --- APP SELECTOR (MAIN MENU) --- */
        .tracklist-panel {
            width: 100%;
            height: 100%;
            padding: 15px;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            grid-auto-rows: 140px;
            gap: 15px;
            align-content: start;
            transition: transform 0.4s ease, opacity 0.4s ease;
            background: #001122;
        }
        
        .workspace.app-active .tracklist-panel {
            transform: scale(1.1);
            opacity: 0;
            pointer-events: none;
            display: none;
        }

        /* --- ICON CARD (Hardware Button Style) --- */
        .track-btn {
            background: #d0d0d0;
            border: 2px solid #fff;
            border-bottom: 4px solid #888;
            border-right: 4px solid #888;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.1s;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
        }

        .track-btn:hover {
            background: #e0e0e0;
            transform: translateY(1px);
            border-bottom: 3px solid #888;
            border-right: 3px solid #888;
        }

        .track-btn:active {
            transform: translateY(3px) translateX(1px);
            border-bottom: 1px solid #888;
            border-right: 1px solid #888;
            box-shadow: 0 0 2px rgba(0,0,0,0.5);
            background: #c0c0c0;
        }

        .track-icon-large {
            font-size: 40px;
            margin-bottom: 10px;
            filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5));
            color: #333;
        }

        .track-info { text-align: center; z-index: 2; width: 100%; padding: 0 5px; }
        .track-title { font-size: 12px; font-weight: 800; color: #000; text-transform: uppercase; margin-bottom: 2px; font-family: 'Courier New', Courier, monospace; background: rgba(255,255,255,0.5); border-radius: 2px;}
        .track-desc { display: none; } /* Hide description for cleaner look */

        /* --- WINDOWS LAYER (FULL SCREEN) --- */
        .windows-layer {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 100;
            pointer-events: none;
            display: none;
        }
        
        .workspace.app-active .windows-layer {
            display: block;
            pointer-events: auto;
        }

        .ddr-window {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #001122;
            display: flex;
            flex-direction: column;
            animation: appOpen 0.2s ease-out;
        }

        @keyframes appOpen {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        .ddr-window.closing {
            animation: appClose 0.2s forwards;
        }
        @keyframes appClose {
            to { transform: scale(1.05); opacity: 0; }
        }

        /* Window Header - Hardware Style */
        .window-header {
            height: 40px;
            background: #4a5a4d;
            border-bottom: 2px solid #2a3b2d;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            flex-shrink: 0;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .header-title-box { display: flex; align-items: center; gap: 10px; }
        .header-label { font-size: 10px; color: #aaffaa; font-family: 'Courier New', Courier, monospace; }
        .header-name { font-size: 14px; font-weight: bold; color: #fff; text-transform: uppercase; font-family: 'Courier New', Courier, monospace; text-shadow: 1px 1px 0 #000; }

        .ctrl-btn {
            background: #cc3333;
            border: 2px solid #ff6666;
            border-bottom: 3px solid #660000;
            border-right: 3px solid #660000;
            color: #fff;
            padding: 2px 10px;
            font-weight: bold;
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
            text-shadow: 1px 1px 0 #000;
        }
        .ctrl-btn:active {
            transform: translateY(2px) translateX(1px);
            border-bottom: 1px solid #660000;
            border-right: 1px solid #660000;
        }

        .difficulty-bar {
            height: 15px;
            background: #000;
            display: flex;
            align-items: center;
            overflow: hidden;
            border-bottom: 2px solid #333;
            padding: 0 5px;
        }
        .diff-tag { font-size: 10px; color: #00ff00; font-family: 'Courier New', Courier, monospace; margin-right: 10px;}
        .diff-stripes { font-size: 10px; color: #00ff00; letter-spacing: 2px; white-space: nowrap; font-family: 'Courier New', Courier, monospace;}

        .window-body {
            flex-grow: 1;
            position: relative;
            background: #000;
            overflow: hidden;
        }
        .window-body iframe { width: 100%; height: 100%; border: none; filter: contrast(1.2) brightness(0.9); }

        /* --- APP SPECIFIC CONTENT --- */
        
        /* Profile / Player Info */
        .profile-layout {
            height: 100%; width: 100%;
            display: flex; align-items: center; justify-content: center;
            background: #001122;
            padding: 10px;
        }
        .profile-card {
            width: 100%; height: 100%;
            background: #000;
            border: 2px solid #00ff00;
            padding: 15px;
            display: flex; flex-direction: column;
        }

        .profile-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; border-bottom: 1px dashed #00ff00; padding-bottom: 15px; }
        .avatar-placeholder {
            width: 60px; height: 60px; background: #003300; border: 1px solid #00ff00;
            display: flex; align-items: center; justify-content: center; font-size: 30px; color: #00ff00;
        }
        .profile-names h2 { font-size: 24px; margin: 0; line-height: 1; color: #00ff00; font-family: 'Courier New', Courier, monospace; text-shadow: 0 0 5px #00ff00; }
        .subtitle { color: #aaffaa; font-size: 12px; font-family: 'Courier New', Courier, monospace; }

        .stats-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; flex-grow: 1; }
        .stat-row { background: #001100; padding: 8px; border: 1px solid #003300; display: flex; justify-content: space-between; align-items: center; }
        .stat-label { font-size: 12px; color: #aaffaa; font-family: 'Courier New', Courier, monospace; }
        .stat-val { font-size: 14px; color: #00ff00; font-weight: bold; font-family: 'Courier New', Courier, monospace; }
        .text-yellow { color: #ffcc00; text-shadow: 0 0 5px #ffcc00; }

        .action-buttons { display: flex; flex-direction: column; gap: 10px; }
        .action-btn {
            padding: 12px; text-align: center;
            background: #003300; color: #00ff00; font-weight: bold; text-decoration: none;
            border: 1px solid #00ff00;
            font-family: 'Courier New', Courier, monospace;
        }
        .action-btn:active { background: #00ff00; color: #000; }

        /* Music Grid */
        .music-grid {
            display: grid; grid-template-columns: 1fr;
            gap: 10px; padding: 10px;
            background: #001122;
        }
        .music-item {
            background: #000; border: 1px solid #00ff00; padding: 10px;
            display: flex; align-items: center; gap: 15px;
            cursor: pointer;
        }
        .music-item:active { background: #003300; }
        .disc-icon { font-size: 30px; color: #00ff00; }
        .spinning { animation: spin 2s linear infinite; }
        .music-info { text-align: left; }
        .music-title { font-weight: bold; color: #00ff00; font-family: 'Courier New', Courier, monospace; font-size: 14px; margin-bottom: 2px; }
        .music-artist { font-size: 10px; color: #aaffaa; font-family: 'Courier New', Courier, monospace; }
        .special-item { border-color: #ffcc00; }
        .special-item .music-title { color: #ffcc00; }
        .special-item .disc-icon { color: #ffcc00; }

        /* Empty State */
        .empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #00ff00; background: #000; font-family: 'Courier New', Courier, monospace; }

        /* --- MOBILE --- */
        @media (max-width: 600px) {
            .ddr-layout {
                border: none;
                border-radius: 0;
                padding: 0;
                max-width: 100%;
            }
            .tracklist-panel { grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
            .track-btn { height: 100px; }
            .track-icon-large { font-size: 30px; margin-bottom: 5px; }
            .track-title { font-size: 10px; }
        }
    `;
    document.head.appendChild(style);

    // 2. DOM Structure
    root.innerHTML = '';
    
    const layout = document.createElement('div');
    layout.className = 'ddr-layout';

    // Header
    layout.innerHTML = `
        <div class="ddr-header">
            <div class="header-logo"><span>OBLINOF OS</span></div>
            <div class="bpm-counter">READY</div>
        </div>
    `;

    // Workspace
    workspace = document.createElement('div');
    workspace.className = 'workspace';
    
    // Windows Container (Full Overlay)
    windowsContainer = document.createElement('div');
    windowsContainer.className = 'windows-layer';
    
    // Main Menu (Tracklist)
    tracklistPanel = document.createElement('div');
    tracklistPanel.className = 'tracklist-panel custom-scrollbar';

    apps.forEach(app => {
        const btn = document.createElement('div');
        btn.className = 'track-btn';
        // Add color hint to border
        btn.style.borderColor = app.color;
        
        btn.innerHTML = `
            <div class="track-icon-large" style="color: ${app.color}; filter: drop-shadow(0 0 5px ${app.color}) drop-shadow(1px 1px 2px rgba(0,0,0,0.5));">${app.icon}</div>
            <div class="track-info">
                <div class="track-title">${app.name}</div>
                <span class="track-desc" style="color:${app.color}">${app.description}</span>
            </div>
        `;
        
        // Add specific hover color logic via inline event for simplicity in this generated code
        btn.onmouseenter = () => { btn.style.background = '#e0e0e0'; };
        btn.onmouseleave = () => { btn.style.background = '#d0d0d0'; };

        btn.onclick = app.action;
        tracklistPanel.appendChild(btn);
    });

    workspace.appendChild(tracklistPanel);
    workspace.appendChild(windowsContainer);

    layout.appendChild(workspace);
    root.appendChild(layout);
}

function init() {
    render();
}

init();
