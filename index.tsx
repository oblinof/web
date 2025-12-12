
// --- State Management ---
interface AppWindow {
    id: number;
    appId: string; // Link to the app definition
    title: string;
    content: string | HTMLElement;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isDraggable: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    element?: HTMLElement;
    preMaximizeState?: { x: string; y: string; width: string; height: string };
}

interface MusicAlbum {
    title: string;
    artist: string;
    iframe: string;
}

interface AppDefinition {
    id: string;
    name: string;
    icon: string;
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


// --- Core Functions ---

function isMobileDevice() {
    return window.innerWidth < 800;
}

function createWindow(appId: string, title: string, content: string | HTMLElement, width = 800, height = 600) {
    // Check if window exists and is just minimized
    const existingWin = windows.find(w => w.appId === appId);
    if (existingWin) {
        restoreWindow(existingWin);
        return;
    }

    highestZIndex++;
    
    // Smart Positioning
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    
    // Arcade style: Center-Left biased
    let startX = 20;
    let startY = 100;
    
    if (isMobileDevice()) {
        width = viewportW;
        height = viewportH - 80; // Leave space for header
        startX = 0;
        startY = 80;
    } else {
        // Clamp to screen, avoid the right sidebar area (approx 300px)
        const availableW = viewportW - 320;
        if (width > availableW) width = availableW - 20;
        if (height > viewportH - 120) height = viewportH - 120;
        
        startX = (availableW - width) / 2;
        startY = (viewportH - height) / 2 + 30;
    }

    const newWindow: AppWindow = {
        id: nextWindowId++,
        appId: appId,
        title: title,
        content: content,
        x: startX,
        y: startY,
        width: width,
        height: height,
        zIndex: highestZIndex,
        isDraggable: !isMobileDevice(),
        isMinimized: false,
        isMaximized: isMobileDevice(), 
    };

    renderWindowElement(newWindow);
    windows.push(newWindow);
    updateTaskbarActiveState();
}

function renderWindowElement(win: AppWindow) {
    const windowEl = document.createElement('div');
    windowEl.id = `window-${win.id}`;
    windowEl.className = `arcade-window ${win.isMaximized ? 'maximized' : ''}`;
    windowEl.style.zIndex = `${win.zIndex}`;
    
    // Initial Styles
    if (!win.isMaximized) {
        windowEl.style.width = `${win.width}px`;
        windowEl.style.height = `${win.height}px`;
        windowEl.style.transform = `translate(${win.x}px, ${win.y}px)`;
    }

    // Header / Controls (Arcade Style)
    const headerHTML = `
        <div class="window-header">
            <div class="header-pill">STAGE: ${win.title}</div>
            <div class="window-controls">
                <button class="ctrl-btn minimize-btn">_</button>
                <button class="ctrl-btn maximize-btn">[]</button>
                <button class="ctrl-btn close-btn">X</button>
            </div>
        </div>
        <div class="window-decor-bar"></div>
    `;

    windowEl.innerHTML = headerHTML;

    // Content
    const contentContainer = document.createElement('div');
    contentContainer.className = 'window-body custom-scrollbar';
    
    if (typeof win.content === 'string') {
        contentContainer.innerHTML = win.content;
    } else {
        contentContainer.appendChild(win.content);
    }
    windowEl.appendChild(contentContainer);
    
    // Append to DOM
    if (!windowsContainer) {
        windowsContainer = document.createElement('div');
        windowsContainer.className = 'windows-layer';
        root.appendChild(windowsContainer);
    }
    windowsContainer.appendChild(windowEl);
    win.element = windowEl;

    // Event Listeners
    setupWindowEvents(win, windowEl);
}

function setupWindowEvents(win: AppWindow, el: HTMLElement) {
    const closeBtn = el.querySelector('.close-btn');
    const minBtn = el.querySelector('.minimize-btn');
    const maxBtn = el.querySelector('.maximize-btn');
    const header = el.querySelector('.window-header') as HTMLElement;

    closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWindow(win);
    });

    minBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        minimizeWindow(win);
    });

    maxBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMaximize(win);
    });

    el.addEventListener('mousedown', () => {
        bringToFront(win);
    });

    // Dragging Logic
    if (win.isDraggable) {
        header.addEventListener('mousedown', (e) => {
            if (win.isMaximized) return; 
            e.preventDefault();
            bringToFront(win);
            
            let shiftX = e.clientX - win.x;
            let shiftY = e.clientY - win.y;

            const onMouseMove = (ev: MouseEvent) => {
                win.x = ev.clientX - shiftX;
                win.y = ev.clientY - shiftY;
                el.style.transform = `translate(${win.x}px, ${win.y}px)`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}

function bringToFront(win: AppWindow) {
    if (win.zIndex < highestZIndex) {
        highestZIndex++;
        win.zIndex = highestZIndex;
        if (win.element) win.element.style.zIndex = `${highestZIndex}`;
    }
}

function closeWindow(win: AppWindow) {
    if (win.element) {
        win.element.classList.add('closing');
        setTimeout(() => {
            win.element?.remove();
            windows = windows.filter(w => w.id !== win.id);
            updateTaskbarActiveState();
        }, 200);
    }
}

function minimizeWindow(win: AppWindow) {
    win.isMinimized = true;
    if (win.element) {
        win.element.style.display = 'none';
    }
    updateTaskbarActiveState();
}

function restoreWindow(win: AppWindow) {
    win.isMinimized = false;
    if (win.element) {
        win.element.style.display = 'flex';
        bringToFront(win);
        win.element.classList.remove('minimizing');
        win.element.classList.add('restoring');
        setTimeout(() => win.element?.classList.remove('restoring'), 200);
    }
    updateTaskbarActiveState();
}

function toggleMaximize(win: AppWindow) {
    if (!win.element) return;
    
    if (win.isMaximized) {
        // Restore
        win.isMaximized = false;
        win.element.classList.remove('maximized');
        win.element.style.width = `${win.width}px`;
        window.setTimeout(() => {
             if(win.element) win.element.style.transform = `translate(${win.x}px, ${win.y}px)`;
        }, 10);
       
    } else {
        // Maximize
        win.preMaximizeState = {
            x: win.element.style.transform,
            y: win.element.style.top,
            width: win.element.style.width,
            height: win.element.style.height
        };
        win.isMaximized = true;
        win.element.classList.add('maximized');
        win.element.style.transform = 'none';
        win.element.style.width = '100%';
        win.element.style.height = '100%';
    }
}


// --- App Content Generators ---

function openMusicWindow() {
    const container = document.createElement('div');
    container.className = 'arcade-grid';
    
    // DJ Mix Item
    const djItem = document.createElement('div');
    djItem.className = 'arcade-item special-item';
    djItem.innerHTML = `
        <div class="item-badge">HOT</div>
        <div class="item-info">
            <div class="item-title">DJ OBLI</div>
            <div class="item-sub">Liminal Mixes</div>
        </div>
    `;
    djItem.onclick = () => createWindow('dj_obli', 'DJ OBLI // MIXES', `<iframe style="border: 0; width: 100%; height: 100%;" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1581868891&color=%2300ffff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>`);
    container.appendChild(djItem);

    // Albums
    musicAlbums.forEach((album, idx) => {
        const item = document.createElement('div');
        item.className = 'arcade-item';
        item.innerHTML = `
            <div class="item-badge">CD</div>
            <div class="item-info">
                <div class="item-title">${album.title}</div>
                <div class="item-sub">${album.artist}</div>
            </div>
        `;
        item.onclick = () => createWindow(`album_${idx}`, `AUDIO: ${album.title}`, album.iframe, 400, 500);
        container.appendChild(item);
    });

    createWindow('music', 'SELECT MUSIC', container);
}

function openGalleryWindow() {
    createWindow('gallery', 'VISUAL MODE', `<iframe src="https://artviewer.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`);
}

function openContactWindow() {
    createWindow('contact', 'PLAYER INFO', `
        <div class="profile-layout">
            <div class="profile-card">
                <h2 style="font-size: 32px; color: #ffcc00; font-style: italic;">OBLINOF</h2>
                <div style="background: #000; padding: 10px; border: 2px solid #00ffff; margin: 10px 0;">
                    <p>CLASS: MULTIMEDIA ARTIST</p>
                    <p>RANK: SSS</p>
                    <p>LOCATION: GRID_NODE_07</p>
                </div>
                <p>>> Crafting audiovisual experiences since [2007].</p>
                <div class="link-box">
                    <a href="mailto:oblinof@gmail.com" target="_blank">EMAIL TRANSMISSION</a>
                    <a href="https://linktr.ee/oblinof" target="_blank">NEURAL LINKTREE</a>
                </div>
            </div>
        </div>
    `, 500, 450);
}

function openTrashWindow() {
    createWindow('trash', 'RECYCLE', `<div class="empty-state">NO GARBAGE DATA FOUND</div>`, 300, 200);
}


// --- App Configuration ---

const apps: AppDefinition[] = [
    { id: 'music', name: 'Music Select', icon: '♫', category: 'MEDIA', action: openMusicWindow },
    { id: 'gallery', name: 'Visual Gallery', icon: '🖼', category: 'MEDIA', action: openGalleryWindow },
    { id: 'contact', name: 'Player Info', icon: '✉', category: 'SYSTEM', action: openContactWindow },
    { id: 'trash', name: 'Recycle Bin', icon: '🗑', category: 'SYSTEM', action: openTrashWindow },
    
    { id: 'datafall', name: 'Datafall', icon: '💧', category: 'TOOLS', action: () => createWindow('datafall', 'DATAFALL.EXE', `<iframe src="https://datafall.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'paintdelic', name: 'Paintdelic', icon: '🎨', category: 'TOOLS', action: () => createWindow('paintdelic', 'PAINTDELIC_V2', `<iframe src="https://paintedelic.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'ambient', name: 'Ambient', icon: '🔊', category: 'TOOLS', action: () => createWindow('ambient', 'AMBIENT PORTABLE', `<iframe src="https://conversation-rope-497.app.ohara.ai" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'entity', name: 'Entity', icon: '👾', category: 'TOOLS', action: () => createWindow('entity', 'ENTITY COLLAB', `<iframe src="https://entity-collab.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'wordarp', name: 'WordArp', icon: '🎹', category: 'TOOLS', action: () => createWindow('wordarp', 'WORD ARP CONSOLE', `<iframe src="https://wordarp.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    
    { id: 'realism', name: 'Realism', icon: '👁', category: 'XENO', action: () => createWindow('realism', 'EXTRACTIVIST REALISM', `<iframe src="https://extractivist-realism.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'ravecat', name: 'Ravecat', icon: '🐈', category: 'XENO', action: () => createWindow('ravecat', 'RAVECAT SIMULATION', `<iframe src="https://ravecat-beta.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'psyballz', name: 'PsyBallz', icon: '🔮', category: 'XENO', action: () => createWindow('psyballz', 'PSYBALLZ', `<iframe src="https://psyballs.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
    { id: 'sydra', name: 'Sydra', icon: '🧬', category: 'XENO', action: () => createWindow('sydra', 'SYDRA GENETICS', `<iframe src="https://sydra-byhq.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>`) },
];

function updateTaskbarActiveState() {
    apps.forEach(app => {
        const btn = document.getElementById(`track-btn-${app.id}`);
        if (btn) {
            const isOpen = windows.some(w => w.appId === app.id);
            if (isOpen) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });
}

// --- Render ---

function render() {
    // 1. CSS Styles
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        :root {
            --arcade-yellow: #ffcc00;
            --arcade-cyan: #00ffff;
            --arcade-pink: #ff00cc;
            --arcade-dark: #000b1e;
            --arcade-grid: #002244;
            --font-arcade: 'Share Tech Mono', sans-serif;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0; padding: 0;
            background-color: var(--arcade-dark);
            color: #fff;
            font-family: var(--font-arcade);
            overflow: hidden;
            height: 100vh;
            width: 100vw;
            /* Global Slant for speed */
        }

        /* --- BACKGROUND --- */
        #root {
            position: relative;
            width: 100%; height: 100%;
            background: 
                radial-gradient(circle at 50% 50%, transparent 20%, var(--arcade-dark) 80%),
                radial-gradient(circle, var(--arcade-grid) 2px, transparent 2.5px);
            background-size: 100% 100%, 20px 20px;
            animation: scrollBg 20s linear infinite;
        }
        
        @keyframes scrollBg {
            0% { background-position: 0 0, 0 0; }
            100% { background-position: 0 0, 40px 40px; }
        }

        /* --- MAIN LAYOUT --- */
        .arcade-layout {
            display: flex;
            height: 100%;
            width: 100%;
            flex-direction: column;
        }

        /* --- TOP BANNER (Select Music Style) --- */
        .arcade-header {
            height: 70px;
            background: linear-gradient(90deg, var(--arcade-yellow), #cc9900);
            border-bottom: 4px solid #fff;
            display: flex;
            align-items: center;
            padding: 0 20px;
            box-shadow: 0 5px 15px rgba(255, 204, 0, 0.5);
            z-index: 2000;
            clip-path: polygon(0 0, 100% 0, 100% 80%, 95% 100%, 0 100%);
        }

        .header-title {
            font-size: 32px;
            color: #000;
            font-weight: 900;
            font-style: italic;
            text-transform: uppercase;
            letter-spacing: -1px;
            text-shadow: 2px 2px 0px #fff;
            padding-right: 20px;
        }
        
        .bpm-display {
            background: #000;
            color: var(--arcade-pink);
            font-size: 24px;
            padding: 5px 15px;
            border-radius: 20px;
            border: 2px solid #fff;
            font-style: italic;
            animation: pulse 0.5s infinite alternate;
        }

        /* --- WORKSPACE (Split) --- */
        .workspace {
            display: flex;
            flex-grow: 1;
            overflow: hidden;
            position: relative;
        }

        /* --- RIGHT TRACKLIST (Sidebar) --- */
        .tracklist-panel {
            width: 300px;
            background: rgba(0,0,0,0.8);
            border-left: 2px solid var(--arcade-cyan);
            display: flex;
            flex-direction: column;
            padding: 20px 0;
            overflow-y: auto;
            position: relative;
            z-index: 1000;
        }
        
        .tracklist-panel::-webkit-scrollbar { width: 0px; }

        .category-header {
            color: var(--arcade-cyan);
            font-size: 14px;
            font-style: italic;
            text-align: right;
            padding-right: 20px;
            margin-top: 10px;
            margin-bottom: 5px;
            text-shadow: 0 0 5px var(--arcade-cyan);
            border-bottom: 1px solid var(--arcade-cyan);
        }

        .track-btn {
            height: 50px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: flex-end; /* Align right */
            padding-right: 20px;
            cursor: pointer;
            transition: transform 0.1s;
            position: relative;
            
            /* The pill shape background */
            background: linear-gradient(90deg, transparent 0%, #000 20%, #222 100%);
            border-radius: 25px 0 0 25px; /* Round left side */
            border-right: 5px solid #444;
        }

        .track-btn:hover {
            transform: translateX(-10px);
            background: linear-gradient(90deg, transparent 0%, #000 20%, #333 100%);
            border-right-color: var(--arcade-yellow);
        }

        .track-btn.active {
            transform: translateX(-15px);
            border-right: 5px solid var(--arcade-cyan);
            background: linear-gradient(90deg, transparent 0%, #001122 20%, #003344 100%);
        }
        
        .track-btn.active .track-name {
            color: var(--arcade-cyan);
            text-shadow: 0 0 5px var(--arcade-cyan);
        }

        .track-name {
            font-size: 18px;
            font-weight: bold;
            font-style: italic;
            color: #fff;
            text-transform: uppercase;
        }
        
        .track-icon {
            margin-left: 10px;
            font-size: 20px;
            width: 30px;
            text-align: center;
            color: var(--arcade-yellow);
        }
        
        .no-data {
            background: #555;
            color: #000;
            font-size: 10px;
            padding: 2px 4px;
            margin-left: 10px;
            border-radius: 2px;
            font-weight: bold;
        }

        /* --- WINDOWS --- */
        .arcade-window {
            position: absolute;
            background: rgba(0, 10, 30, 0.95);
            border: 3px solid var(--arcade-cyan);
            border-radius: 20px 0 20px 0; /* Arcade styling */
            display: flex;
            flex-direction: column;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.4), 5px 5px 0px rgba(0,0,0,0.5);
            transition: opacity 0.2s;
            overflow: hidden;
        }

        .arcade-window.maximized {
            top: 0 !important; left: 0 !important;
            width: 100% !important; height: 100% !important;
            transform: none !important;
            border-radius: 0;
            z-index: 5000 !important;
        }

        .window-header {
            height: 40px;
            background: linear-gradient(90deg, var(--arcade-cyan), #009999);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            user-select: none;
        }

        .header-pill {
            background: #000;
            color: #fff;
            padding: 2px 15px;
            border-radius: 15px;
            font-size: 16px;
            font-weight: bold;
            font-style: italic;
            border: 1px solid #fff;
        }

        .window-controls { display: flex; gap: 5px; }
        
        .ctrl-btn {
            width: 25px; height: 25px;
            background: #000;
            border: 2px solid #fff;
            color: #fff;
            font-weight: bold;
            border-radius: 50%;
            cursor: pointer;
        }
        .ctrl-btn:hover { background: #fff; color: #000; }
        .close-btn:hover { background: var(--arcade-pink); border-color: var(--arcade-pink); }

        .window-decor-bar {
            height: 5px;
            background: repeating-linear-gradient(45deg, #000, #000 10px, var(--arcade-yellow) 10px, var(--arcade-yellow) 20px);
        }

        .window-body {
            flex-grow: 1;
            overflow: auto;
            position: relative;
        }
        .window-body iframe { width: 100%; height: 100%; background: #000; border: none; }

        /* --- CONTENT STYLES --- */
        .arcade-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            padding: 20px;
        }

        .arcade-item {
            background: linear-gradient(135deg, #222, #000);
            border: 2px solid #555;
            padding: 10px;
            cursor: pointer;
            border-radius: 10px 0 10px 0;
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
        }
        
        .arcade-item:hover {
            border-color: var(--arcade-yellow);
            transform: scale(1.02);
            box-shadow: 0 0 10px var(--arcade-yellow);
        }
        
        .arcade-item.special-item {
            border-color: var(--arcade-pink);
            background: linear-gradient(135deg, #330022, #000);
        }

        .item-badge {
            position: absolute; top: 0; right: 0;
            background: var(--arcade-cyan); color: #000;
            font-weight: bold; font-size: 10px; padding: 2px 6px;
            border-bottom-left-radius: 5px;
        }
        
        .item-title { font-size: 18px; font-weight: bold; font-style: italic; color: #fff; }
        .item-sub { font-size: 12px; color: #aaa; }

        .profile-layout {
            display: flex; justify-content: center; align-items: center; height: 100%;
            background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMzMzIiAvPgo8L3N2Zz4=');
        }
        .profile-card {
            width: 80%; padding: 20px; border: 2px solid var(--arcade-yellow);
            background: rgba(0,0,0,0.8); text-align: center;
            border-radius: 20px;
        }
        .link-box a {
            display: block; margin-top: 10px; padding: 10px;
            background: var(--arcade-cyan); color: #000; text-decoration: none;
            font-weight: bold; border-radius: 20px;
        }
        .link-box a:hover { background: #fff; }
        .empty-state { height: 100%; display: flex; align-items: center; justify-content: center; color: #555; font-size: 20px; font-style: italic; }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.05); opacity: 0.8; }
        }

        /* --- MOBILE --- */
        @media (max-width: 800px) {
            .arcade-header { height: 60px; padding: 0 10px; }
            .header-title { font-size: 20px; }
            .bpm-display { font-size: 16px; }
            
            .workspace { flex-direction: column-reverse; } /* List at bottom */
            
            .tracklist-panel {
                width: 100%; height: 200px;
                border-left: none; border-top: 4px solid var(--arcade-cyan);
            }
            
            .track-btn {
                background: #111;
                margin: 2px 0;
                border-radius: 0;
                border-right: none; border-left: 5px solid #444;
                justify-content: flex-start;
                padding-left: 20px;
            }
            
            .track-btn:hover, .track-btn.active {
                transform: translateX(10px);
                border-left-color: var(--arcade-yellow);
            }
            
            .arcade-window {
                width: 100% !important; height: 100% !important;
                top: 0 !important; left: 0 !important; transform: none !important;
                border-radius: 0; border: none;
            }
            
            .window-decor-bar { display: none; }
        }
    `;
    document.head.appendChild(style);

    // 2. Structure
    root.innerHTML = '';
    
    const layout = document.createElement('div');
    layout.className = 'arcade-layout';

    // Header
    layout.innerHTML = `
        <div class="arcade-header">
            <div class="header-title">OBLINOF SYSTEM <span style="color:#fff">5th MIX</span></div>
            <div style="flex-grow:1"></div>
            <div class="bpm-display">180 BPM</div>
        </div>
    `;

    // Workspace
    const workspace = document.createElement('div');
    workspace.className = 'workspace';
    
    // Windows Container (Left Side on Desktop)
    windowsContainer = document.createElement('div');
    windowsContainer.className = 'windows-layer';
    // Must add style to make it overlay properly in the flex space
    windowsContainer.style.flexGrow = '1';
    windowsContainer.style.position = 'relative';
    
    // Tracklist (Right Side on Desktop)
    const tracklist = document.createElement('div');
    tracklist.className = 'tracklist-panel';

    const categories = ['MEDIA', 'TOOLS', 'SYSTEM', 'XENO'];
    const groupedApps: Record<string, AppDefinition[]> = {};
    apps.forEach(app => {
        if (!groupedApps[app.category]) groupedApps[app.category] = [];
        groupedApps[app.category].push(app);
    });

    categories.forEach(cat => {
        if (groupedApps[cat]) {
            const catHeader = document.createElement('div');
            catHeader.className = 'category-header';
            catHeader.innerText = cat;
            tracklist.appendChild(catHeader);

            groupedApps[cat].forEach(app => {
                const btn = document.createElement('div');
                btn.id = `track-btn-${app.id}`;
                btn.className = 'track-btn';
                btn.innerHTML = `
                    <span class="track-name">${app.name}</span>
                    <span class="no-data">APP</span>
                `;
                btn.onclick = app.action;
                tracklist.appendChild(btn);
            });
        }
    });

    workspace.appendChild(windowsContainer);
    workspace.appendChild(tracklist);
    layout.appendChild(workspace);
    
    root.appendChild(layout);
}

function init() {
    render();
}

init();
