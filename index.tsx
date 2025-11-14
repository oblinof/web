// --- State Management ---
interface AppWindow {
    id: number;
    title?: string;
    content: string | HTMLElement;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    hasTitleBar: boolean;
    isDraggable: boolean;
    resizable?: boolean;
    allowFullscreen?: boolean;
    element?: HTMLElement;
    className?: string;
    preFullscreenState?: { x: string; y: string; width: string; height: string };
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
    action: () => void;
    position?: { x: number; y: number };
}


let windows: AppWindow[] = [];
let nextWindowId = 0;
let highestZIndex = 10;

// --- Data ---
const musicAlbums: MusicAlbum[] = [
    {
        title: 'Opalyn',
        artist: 'Faycle',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2788353006/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/opalyn">Opalyn by Faycle</a></iframe>`
    },
    {
        title: 'Kickgun & Dentalcore VOL2',
        artist: 'oblinof',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=105379128/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/kickgun-dentalcore-vol2">Kickgun &amp; Dentalcore VOL2 by oblinof</a></iframe>`
    },
    {
        title: 'Graphical Interface Trance',
        artist: 'Oblinof',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2659704266/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/graphical-interface-trance">Graphical Interface Trance by Oblinof</a></iframe>`
    },
    {
        title: 'edits, tools, & trash',
        artist: 'Oblinof',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2147918188/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/edits-tools-trash">edits, tools, &amp; trash by Oblinof</a></iframe>`
    },
    {
        title: 'Dogma',
        artist: 'Aloe Engine',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=193817841/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/dogma">Dogma by Aloe Engine</a></iframe>`
    },
    {
        title: ',-Dr3ja',
        artist: 'Oblinof',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=541149304/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/dr3ja">,-Dr3ja by Oblinof</a></iframe>`
    },
    {
        title: '842',
        artist: 'Aural Eq',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=1723178745/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/842">842 by Aural Eq</a></iframe>`
    },
    {
        title: 'Wifi Pineal',
        artist: 'Oblinof',
        iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3419546872/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" seamless><a href="https://environment-texture.bandcamp.com/album/wifi-pineal">Wifi Pineal by Oblinof</a></iframe>`
    }
];

// --- DOM Elements ---
const root = document.getElementById('root')!;
let desktopElement: HTMLElement | null = null;


// --- Core Functions ---

function createWindow(options: Partial<AppWindow>) {
    highestZIndex++;
    const newWindow: AppWindow = {
        id: nextWindowId++,
        title: 'Untitled',
        content: '',
        x: 50,
        y: 50,
        width: 400,
        height: 200,
        zIndex: highestZIndex,
        hasTitleBar: true,
        isDraggable: true,
        resizable: false,
        allowFullscreen: false,
        ...options,
    };

    const windowEl = document.createElement('div');
    windowEl.className = `window ${newWindow.className || ''}`;
    windowEl.style.left = `${newWindow.x}px`;
    windowEl.style.top = `${newWindow.y}px`;
    windowEl.style.width = `${newWindow.width}px`;
    windowEl.style.height = `${newWindow.height}px`;
    windowEl.style.zIndex = `${newWindow.zIndex}`;

    let titleBarHTML = '';
    if (newWindow.hasTitleBar) {
         const fullscreenBtnHTML = newWindow.allowFullscreen ? `<div class="fullscreen-btn" aria-label="Toggle Fullscreen"></div>` : '';
        titleBarHTML = `
        <div class="title-bar">
            <div class="close-btn" aria-label="Close"></div>
            ${fullscreenBtnHTML}
            <span class="title-text">${newWindow.title}</span>
        </div>`;
    }

    windowEl.innerHTML = `
        ${titleBarHTML}
        <div class="window-content"></div>
    `;
    
    const contentEl = windowEl.querySelector('.window-content') as HTMLElement;
    if (typeof newWindow.content === 'string') {
        contentEl.innerHTML = newWindow.content;
    } else {
        contentEl.appendChild(newWindow.content);
    }

    newWindow.element = windowEl;
    windows.push(newWindow);
    desktopElement?.appendChild(windowEl);
    
    const closeBtn = windowEl.querySelector('.close-btn');
    closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        windowEl.remove();
        windows = windows.filter(w => w.id !== newWindow.id);
    });
    
    const fullscreenBtn = windowEl.querySelector('.fullscreen-btn');
    fullscreenBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFullscreen(newWindow);
    });

    if (newWindow.isDraggable) {
        makeDraggable(windowEl, newWindow);
    }
     if (newWindow.resizable) {
        makeResizable(windowEl, newWindow);
    }
    
    windowEl.addEventListener('mousedown', () => {
        focusWindow(newWindow.id);
    });

    return newWindow;
}

function toggleFullscreen(win: AppWindow) {
    if (!win.element) return;
    const isFullscreen = win.element.classList.contains('fullscreen');

    if (isFullscreen) {
        win.element.classList.remove('fullscreen');
        if (win.preFullscreenState) {
            win.element.style.left = win.preFullscreenState.x;
            win.element.style.top = win.preFullscreenState.y;
            win.element.style.width = win.preFullscreenState.width;
            win.element.style.height = win.preFullscreenState.height;
        }
    } else {
        win.preFullscreenState = {
            x: win.element.style.left,
            y: win.element.style.top,
            width: win.element.style.width,
            height: win.element.style.height,
        };
        win.element.classList.add('fullscreen');
    }
}


function focusWindow(id: number) {
    const win = windows.find(w => w.id === id);
    if (win && win.zIndex < highestZIndex) {
        highestZIndex++;
        win.zIndex = highestZIndex;
        if(win.element) {
            win.element.style.zIndex = `${win.zIndex}`;
        }
    }
}

function makeDraggable(element: HTMLElement, windowState: AppWindow) {
    const titleBar = element.querySelector<HTMLElement>('.title-bar');
    if (!titleBar || !windowState.isDraggable) return;

    let offsetX = 0, offsetY = 0;

    const onMouseDown = (e: MouseEvent) => {
        if (element.classList.contains('fullscreen')) return;

        const target = e.target as HTMLElement;
        if (target.classList.contains('close-btn') || target.classList.contains('fullscreen-btn')) {
            return;
        }
        
        e.preventDefault();
        focusWindow(windowState.id);
        
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    titleBar.addEventListener('mousedown', onMouseDown);
}

function makeResizable(element: HTMLElement, windowState: AppWindow) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    element.appendChild(resizeHandle);

    let startX = 0, startY = 0;
    let startWidth = 0, startHeight = 0;

    const onMouseDown = (e: MouseEvent) => {
        if (element.classList.contains('fullscreen')) return;
        e.preventDefault();
        e.stopPropagation();

        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView!.getComputedStyle(element).width, 10);
        startHeight = parseInt(document.defaultView!.getComputedStyle(element).height, 10);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        element.style.width = `${Math.max(200, newWidth)}px`;
        element.style.height = `${Math.max(150, newHeight)}px`;
    };

    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    resizeHandle.addEventListener('mousedown', onMouseDown);
}

function createDesktopIcon(name: string, visual: string, x: number, y: number, onDoubleClick: () => void) {
    const iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon';
    iconEl.style.left = `${x}px`;
    iconEl.style.top = `${y}px`;
    iconEl.setAttribute('tabindex', '0');
    iconEl.innerHTML = `
        <div class="icon-visual">${visual}</div>
        <div class="icon-label">${name}</div>
    `;
    
    iconEl.addEventListener('dblclick', onDoubleClick);
    iconEl.addEventListener('click', () => iconEl.focus());
    
    desktopElement?.appendChild(iconEl);
}

// --- App Windows ---

function openGalleryWindow() {
    createWindow({
        title: 'Gallery',
        x: 200, y: 100, width: 380, height: 280,
        content: `
            <div class="gallery-grid">
                <div class="gallery-item"><div class="img-placeholder"></div><span>Project Alpha</span></div>
                <div class="gallery-item"><div class="img-placeholder"></div><span>Study in B&W</span></div>
                <div class="gallery-item"><div class="img-placeholder"></div><span>Digitalscape</span></div>
                <div class="gallery-item"><div class="img-placeholder"></div><span>Retrofuture</span></div>
            </div>
        `
    });
}

function openContactWindow() {
     createWindow({
        title: 'Contact',
        x: 250, y: 150, width: 280, height: 160,
        content: `
            <ul class="contact-list">
                <li>Email: oblinof@web.com</li>
                <li>Social: @oblinof_art</li>
                <li>Web: oblinof.com</li>
            </ul>
        `
    });
}

function openAlbumPlayerWindow(album: MusicAlbum) {
    createWindow({
        title: album.title,
        x: Math.random() * 200 + 100,
        y: Math.random() * 150 + 120,
        width: 370,
        height: 500,
        resizable: true,
        content: album.iframe
    });
}

function openDjObliWindow() {
    const soundcloudIframe = `<iframe style="border: 0; width: 100%; height: 100%;" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1581868891&color=%23000000&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>`;

    createWindow({
        title: 'DJ OBLI - Liminal Mixes',
        x: Math.random() * 200 + 150,
        y: Math.random() * 150 + 100,
        width: 450,
        height: 450,
        resizable: true,
        content: soundcloudIframe
    });
}

function openMusicWindow() {
    const folderContent = document.createElement('div');
    folderContent.className = 'folder-grid';
    
    musicAlbums.forEach(album => {
        const iconEl = document.createElement('div');
        iconEl.className = 'folder-icon';
        iconEl.setAttribute('tabindex', '0');
        iconEl.innerHTML = `
            <div class="icon-visual">💽</div>
            <div class="icon-label">${album.title}</div>
            <div class="icon-sublabel">${album.artist}</div>
        `;
        iconEl.addEventListener('dblclick', () => openAlbumPlayerWindow(album));
        iconEl.addEventListener('click', () => iconEl.focus());
        folderContent.appendChild(iconEl);
    });

    // Add DJ OBLI Icon
    const djIconEl = document.createElement('div');
    djIconEl.className = 'folder-icon';
    djIconEl.setAttribute('tabindex', '0');
    djIconEl.innerHTML = `
        <div class="icon-visual">🎧</div>
        <div class="icon-label">DJ OBLI</div>
        <div class="icon-sublabel">Liminal Mixes</div>
    `;
    djIconEl.addEventListener('dblclick', () => openDjObliWindow());
    djIconEl.addEventListener('click', () => djIconEl.focus());
    folderContent.appendChild(djIconEl);

    createWindow({
        title: 'Music',
        x: 100, y: 120, width: 450, height: 350,
        content: folderContent
    });
}

function openTrashWindow() {
     createWindow({
        title: 'Trash',
        x: 300, y: 200, width: 200, height: 120,
        content: `<div class="text-content"><p style="text-align:center; padding-top: 10px;">Trash is empty.</p></div>`
    });
}

async function openDatafallWindow() {
    try {
        const response = await fetch('./datafall.html');
        if (!response.ok) {
            throw new Error(`Failed to fetch datafall.html: ${response.statusText}`);
        }
        const htmlContent = await response.text();
        const escapedHtml = htmlContent.replace(/"/g, '&quot;');

        createWindow({
            title: 'Datafall',
            x: 150, y: 30, width: 700, height: 500,
            resizable: true,
            allowFullscreen: true,
            content: `<iframe 
                        srcdoc="${escapedHtml}" 
                        style="width:100%; height:100%; border:0;" 
                        sandbox="allow-scripts allow-same-origin"
                      ></iframe>`
        });
    } catch (error) {
        console.error("Failed to load Datafall content:", error);
        createWindow({
            title: 'Error',
            x: 250, y: 150, width: 320, height: 140,
            content: `<div class="text-content"><p>Could not load the Datafall application.</p><p>Please check the console for more details.</p></div>`
        });
    }
}

async function openPaintdelicWindow() {
    try {
        const response = await fetch('./paintdelic.html');
        if (!response.ok) {
            throw new Error(`Failed to fetch paintdelic.html: ${response.statusText}`);
        }
        const htmlContent = await response.text();
        const escapedHtml = htmlContent.replace(/"/g, '&quot;');

        createWindow({
            title: 'Paintdelic',
            x: 180, y: 50, width: 800, height: 600,
            resizable: true,
            allowFullscreen: true,
            content: `<iframe 
                        srcdoc="${escapedHtml}" 
                        style="width:100%; height:100%; border:0;" 
                        sandbox="allow-scripts allow-same-origin"
                      ></iframe>`
        });
    } catch (error) {
        console.error("Failed to load Paintdelic content:", error);
        createWindow({
            title: 'Error',
            x: 250, y: 150, width: 320, height: 140,
            content: `<div class="text-content"><p>Could not load the Paintdelic application.</p><p>Please check the console for more details.</p></div>`
        });
    }
}

function openAmbientPortableWindow() {
    createWindow({
        title: 'Ambient Portable',
        x: 200, y: 70, width: 500, height: 650,
        resizable: true,
        allowFullscreen: true,
        content: `<iframe 
                    src="https://conversation-rope-497.app.ohara.ai" 
                    style="width:100%; height:100%; border:0;"
                  ></iframe>`
    });
}

async function openEntityCollabWindow() {
    try {
        const response = await fetch('./entity_collab.html');
        if (!response.ok) {
            throw new Error(`Failed to fetch entity_collab.html: ${response.statusText}`);
        }
        const htmlContent = await response.text();
        const escapedHtml = htmlContent.replace(/"/g, '&quot;');

        createWindow({
            title: 'Entity Collab',
            x: 220, y: 80, width: 640, height: 480,
            resizable: true,
            allowFullscreen: true,
            content: `<iframe 
                        srcdoc="${escapedHtml}" 
                        style="width:100%; height:100%; border:0;" 
                        sandbox="allow-scripts allow-same-origin"
                      ></iframe>`
        });
    } catch (error) {
        console.error("Failed to load Entity Collab content:", error);
        createWindow({
            title: 'Error',
            x: 250, y: 150, width: 320, height: 140,
            content: `<div class="text-content"><p>Could not load the Entity Collab application.</p><p>Please check the console for more details.</p></div>`
        });
    }
}

async function openWordArpWindow() {
    try {
        const response = await fetch('./word_arp.html');
        if (!response.ok) {
            throw new Error(`Failed to fetch word_arp.html: ${response.statusText}`);
        }
        const htmlContent = await response.text();
        const escapedHtml = htmlContent.replace(/"/g, '&quot;');

        createWindow({
            title: 'Word Arp',
            x: 250, y: 100, width: 900, height: 600,
            resizable: true,
            allowFullscreen: true,
            content: `<iframe 
                        srcdoc="${escapedHtml}" 
                        style="width:100%; height:100%; border:0;" 
                        sandbox="allow-scripts allow-same-origin"
                      ></iframe>`
        });
    } catch (error) {
        console.error("Failed to load Word Arp content:", error);
        createWindow({
            title: 'Error',
            x: 250, y: 150, width: 320, height: 140,
            content: `<div class="text-content"><p>Could not load the Word Arp application.</p><p>Please check the console for more details.</p></div>`
        });
    }
}

async function openExtractivistRealismWindow() {
    try {
        const response = await fetch('./extractivist_realism.html');
        if (!response.ok) {
            throw new Error(`Failed to fetch extractivist_realism.html: ${response.statusText}`);
        }
        const htmlContent = await response.text();
        const escapedHtml = htmlContent.replace(/"/g, '&quot;');

        createWindow({
            title: 'Extractivist Realism 1.0',
            x: 180, y: 60, width: 800, height: 600,
            resizable: true,
            allowFullscreen: true,
            content: `<iframe 
                        srcdoc="${escapedHtml}" 
                        style="width:100%; height:100%; border:0;" 
                        sandbox="allow-scripts allow-same-origin"
                      ></iframe>`
        });
    } catch (error) {
        console.error("Failed to load Extractivist Realism content:", error);
        createWindow({
            title: 'Error',
            x: 250, y: 150, width: 320, height: 140,
            content: `<div class="text-content"><p>Could not load the Extractivist Realism application.</p><p>Please check the console for more details.</p></div>`
        });
    }
}

async function openRavecatWindow() {
    try {
        const response = await fetch('./ravecat.html');
        if (!response.ok) {
            throw new Error(`Failed to fetch ravecat.html: ${response.statusText}`);
        }
        const htmlContent = await response.text();
        const escapedHtml = htmlContent.replace(/"/g, '&quot;');

        createWindow({
            title: 'Ravecat',
            x: 160, y: 40, width: 900, height: 700,
            resizable: true,
            allowFullscreen: true,
            content: `<iframe 
                        srcdoc="${escapedHtml}" 
                        style="width:100%; height:100%; border:0;" 
                        sandbox="allow-scripts allow-same-origin"
                      ></iframe>`
        });
    } catch (error) {
        console.error("Failed to load Ravecat content:", error);
        createWindow({
            title: 'Error',
            x: 250, y: 150, width: 320, height: 140,
            content: `<div class="text-content"><p>Could not load the Ravecat application.</p><p>Please check the console for more details.</p></div>`
        });
    }
}

async function openPsyBallzWindow() {
    try {
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hybrid Physics Synth</title>
    <!-- Load Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Load Tone.js for audio synthesis -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js"></script>
    <style>
        /* System Font for the Windows 3.11 Aesthetic */
        body {
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            background-color: #c0c0c0; /* Classic Windows Gray */
            /* Removed min-height and padding for full-screen layout */
            display: flex;
            flex-direction: column; /* Stacks header and canvas vertically */
            height: 100vh; /* Full viewport height */
            margin: 0;
            padding: 0;
            overflow: hidden; /* Prevents scrollbars */
        }

        /* Classic Windows 3D Container look */
        .system-window {
            background-color: #ffffff;
            border: 2px solid #000000;
            box-shadow: 
                inset -1px -1px #808080, /* Dark lower-right shadow */
                inset 1px 1px #ffffff,   /* Light upper-left highlight */
                -2px 2px 0 #000000;      /* Actual shadow for the window lift */
            border-radius: 0; /* Sharp edges */
            flex-shrink: 0; /* Important: Prevents controls bar from being squeezed */
        }
        
        /* Classic Windows Button Style */
        .system-button {
            background-color: #c0c0c0;
            border: 2px solid #000000;
            box-shadow: 
                inset -1px -1px #000000, /* Pressed inner shadow - Darker */
                inset 1px 1px #ffffff,   /* Pressed inner highlight - Lighter */
                -2px 2px 0 #000000;      /* Raised state actual shadow */
            transition: none;
            cursor: pointer;
            color: #000000;
            font-weight: bold;
        }
        .system-button:active {
            box-shadow: 
                inset 1px 1px #000000, /* Pressed state inner shadow - Darker */
                inset -1px -1px #ffffff; /* Pressed state inner highlight - Lighter */
            transform: translate(1px, 1px); /* Shift button down-right when pressed */
        }
        
        /* Input styling */
        select {
            border: 1px solid #000000;
            background-color: #ffffff;
            box-shadow: inset 1px 1px #808080, inset -1px -1px #ffffff;
            border-radius: 0;
            color: #000000;
        }
        
        /* Canvas Styling: Must be transparent/dark for psychedelic trails */
        canvas {
            border: 1px solid #000000;
            background-color: transparent; 
            border-radius: 0;
            cursor: crosshair;
        }

        /* Container for the canvas to ensure it fills the remaining height */
        #canvas-wrapper {
            background-color: #c0c0c0; /* Match body background */
            padding: 8px; /* Small border padding */
            flex-grow: 1; /* Key to filling the remaining vertical space */
            width: 100%;
        }
    </style>
</head>
<body class="flex flex-col h-screen m-0 p-0 overflow-hidden"> 

    <!-- HEADER / CONTROLS (Barra Superior Compacta) -->
    <div id="header-controls" class="system-window p-2 w-full"> 
        <div class="flex flex-wrap items-center justify-center gap-3">
            
            <!-- Audio and Reset Buttons -->
            <div class="flex gap-2">
                <button id="startButton" class="system-button p-1 px-3 text-xs">
                    <span id="startText">Start Audio</span>
                </button>
                
                <button id="resetButton" class="system-button p-1 px-3 text-xs">
                    Reset
                </button>
            </div>
            
            <!-- Root Note Selector -->
            <div class="flex items-center gap-1">
                <label for="rootNote" class="text-xs font-semibold">Root:</label>
                <select id="rootNote" class="p-0.5 text-xs">
                    <option value="C">C</option><option value="C#">C#</option>
                    <option value="D">D</option><option value="D#">D#</option>
                    <option value="E">E</option><option value="F">F</option>
                    <option value="F#">F#</option><option value="G">G</option>
                    <option value="G#">G#</option><option value="A">A</option>
                    <option value="A#">A#</option><option value="B">B</option>
                </select>
            </div>

            <!-- Scale Type Selector -->
            <div class="flex items-center gap-1">
                <label for="scaleType" class="text-xs font-semibold">Scale:</label>
                <select id="scaleType" class="p-0.5 text-xs">
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                    <option value="pentatonic">Pentatonic</option>
                    <option value="dorian">Dorian</option>
                    <option value="phrygian">Phrygian</option>
                    <option value="chromatic">Chromatic</option>
                </select>
            </div>

            <!-- Preset Selector (Updated to Emojis) -->
            <div class="flex items-center gap-1">
                <label for="synthPreset" class="text-xs font-semibold">Preset:</label>
                <select id="synthPreset" class="p-0.5 text-xs">
                    <option value="✨">✨ Warm Pluck</option>
                    <option value="🌀">🌀 Duo Swirl</option>
                    <option value="💾">💾 Retro Organ</option>
                    <option value="🔔">🔔 Crystal Bell</option>
                    <option value="🫧">🫧 Bubble Pop</option>
                    <option value="⚡️">⚡️ Phase Lead</option>
                    <option value="📻">📻 Lo-Fi Drone</option>
                    <option value="🥁">🥁 Gamelan</option>
                    <option value="🤖">🤖 Cyborg Voice</option>
                    <option value="💫">💫 Glitter Sweep</option>
                </select>
            </div>
            
        </div>
    </div>
    
    <!-- CANVAS CONTAINER (Ocupa el resto de la pantalla) -->
    <div id="canvas-wrapper"> 
        <!-- Canvas for Physics Simulation (Psychedelic) -->
        <canvas id="physicsCanvas" class="w-full h-full"></canvas>
    </div>

    <script type="module">
        // ===================================================================
        // 1. Firebase/Authentication Template (Not Used for Physics/Audio)
        // ===================================================================
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        // ===================================================================
        // 2. Physics and Audio Engine Definitions
        // ===================================================================

        const canvas = document.getElementById('physicsCanvas');
        const ctx = canvas.getContext('2d');
        const startButton = document.getElementById('startButton');
        const resetButton = document.getElementById('resetButton');
        
        // Physics variables
        let balls = [];
        const GRAVITY = 0.0;
        const FRICTION = 0.9999;
        const BOUNCE_DAMPING = 0.98;
        const MIN_RADIUS = 10;
        const MAX_RADIUS = 30;
        const MAX_VELOCITY = 15; // Límite de velocidad para mejorar el rendimiento en móviles
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };
        let newBallPos = { x: 0, y: 0 };
        let isAudioReady = false;
        
        // Generative Background Variables
        const BACKGROUND_CLEAR_ALPHA = 0.05; // Creates the trail effect
        let noiseOffset = 0; // Used to create subtle movement in the gradient

        // Tone.js instances
        let fmSynth; 
        let masterLimiter; 
        let masterCompressor; 
        let vibrato; 
        let chorus; 
        let reverb; // Nuevo: para el ambiente
        let delay; // Nuevo: para ecos y repeticiones
        const NUM_VOICES = 12; 

        // 10 Complex Presets (Keys updated to Emojis)
        const complexPresets = {
            '✨': { cType: 'sine', mType: 'square', harmonicity: 1, modulationIndex: 1.5, detune: 0, decay: 0.3, lfoFreq: 0.1, lfoAmt: 0.01, chorusRate: 1.5, chorusDepth: 0.5, chorusWet: 0.6 },
            '🌀': { cType: 'sawtooth', mType: 'triangle', harmonicity: 8, modulationIndex: 3, detune: 15, decay: 3.5, lfoFreq: 0.3, lfoAmt: 0.05, chorusRate: 2, chorusDepth: 0.8, chorusWet: 0.5 },
            '💾': { cType: 'square', mType: 'sine', harmonicity: 0.5, modulationIndex: 10, detune: -5, decay: 1.0, lfoFreq: 0.5, lfoAmt: 0.02, chorusRate: 1, chorusDepth: 0.3, chorusWet: 0.7 },
            '🔔': { cType: 'triangle', mType: 'sine', harmonicity: 12, modulationIndex: 1, detune: 0, decay: 2.0, lfoFreq: 0.1, lfoAmt: 0.005, chorusRate: 3, chorusDepth: 0.6, chorusWet: 0.4 },
            '🫧': { cType: 'square', mType: 'sawtooth', harmonicity: 1.0, modulationIndex: 5, detune: 30, decay: 0.1, lfoFreq: 1.5, lfoAmt: 0.1, chorusRate: 4, chorusDepth: 0.7, chorusWet: 0.8 },
            '⚡️': { cType: 'triangle', mType: 'square', harmonicity: 4, modulationIndex: 6, detune: 10, decay: 0.8, lfoFreq: 0.7, lfoAmt: 0.08, chorusRate: 0.5, chorusDepth: 0.4, chorusWet: 0.3 },
            '📻': { cType: 'sine', mType: 'sawtooth', harmonicity: 2.0, modulationIndex: 1.0, detune: -10, decay: 4.0, lfoFreq: 0.05, lfoAmt: 0.03, chorusRate: 0.1, chorusDepth: 0.2, chorusWet: 0.9 },
            '🥁': { cType: 'triangle', mType: 'sine', harmonicity: 1.5, modulationIndex: 0.5, detune: 50, decay: 1.5, lfoFreq: 0.1, lfoAmt: 0.01, chorusRate: 0.8, chorusDepth: 0.1, chorusWet: 0.2 },
            '🤖': { cType: 'sawtooth', mType: 'square', harmonicity: 4.5, modulationIndex: 4.0, detune: -10, decay: 2.5, lfoFreq: 0.4, lfoAmt: 0.06, chorusRate: 1.2, chorusDepth: 0.6, chorusWet: 0.7 },
            '💫': { cType: 'sine', mType: 'sine', harmonicity: 1.0, modulationIndex: 20, detune: 0, decay: 0.7, lfoFreq: 0.9, lfoAmt: 0.03, chorusRate: 2.5, chorusDepth: 0.9, chorusWet: 0.5 }
        };

        let selectedPresetName = '✨'; // Updated initial selection to emoji
        let synthSettings = complexPresets[selectedPresetName];
        
        // Scale definitions
        const scaleDefinitions = {
            'major': [0, 2, 4, 5, 7, 9, 11],
            'minor': [0, 2, 3, 5, 7, 8, 10], 
            'pentatonic': [0, 2, 4, 7, 9],
            'dorian': [0, 2, 3, 5, 7, 9, 10], 
            'phrygian': [0, 1, 3, 5, 7, 8, 10], 
            'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] 
        };

        /**
         * Applies the current synthSettings to the Tone.js nodes.
         */
        function applySynthSettings() {
            if (!fmSynth || !vibrato || !chorus || !synthSettings) return;
            
            fmSynth.set({
                harmonicity: synthSettings.harmonicity,
                modulationIndex: synthSettings.modulationIndex,
                modulation: { detune: synthSettings.detune, type: synthSettings.mType }, 
                oscillator: { type: synthSettings.cType }, 
                envelope: { decay: synthSettings.decay }
            });
            
            vibrato.frequency.value = synthSettings.lfoFreq;
            vibrato.depth.value = synthSettings.lfoAmt;
            
            chorus.rate = synthSettings.chorusRate;
            chorus.depth = synthSettings.chorusDepth;
            chorus.wet.value = synthSettings.chorusWet;
        }

        /**
         * Initializes and connects all Tone.js audio nodes, including new effects.
         */
        function setupSynths() {
            // Limiter set to -8dB to prevent clipping/breaking the audio (safety net)
            masterLimiter = new Tone.Limiter(-8).toDestination(); 
            
            // Compressor for dynamic range control (intelligent peak reduction)
            masterCompressor = new Tone.Compressor({
                threshold: -18, // Start compressing sounds above -18dB
                ratio: 4,       // Aggressive but musical compression
                attack: 0.005,
                release: 0.1
            }).connect(masterLimiter); // Connects to the Limiter

            // Effects
            vibrato = new Tone.Vibrato({ max: 15, type: 'sawtooth' }); 
            chorus = new Tone.Chorus({});
            
            // NUEVOS EFECTOS
            // Wet reducido a 0.2 para mayor serenidad y evitar saturación con alta polifonía.
            delay = new Tone.PingPongDelay({ 
                delayTime: '4n', 
                feedback: 0.4, 
                wet: 0.2 
            }); 
            // Wet reducido a 0.4 para mayor serenidad y evitar saturación con alta polifonía.
            reverb = new Tone.Reverb({ 
                decay: 4, // 4 segundos de cola
                wet: 0.4 
            }).toDestination(); 

            fmSynth = new Tone.PolySynth({
                polyphony: NUM_VOICES,
                synth: Tone.FMSynth,
                options: { 
                    // Volumen base más bajo (-20dB) para dar más headroom a los efectos y evitar clipping.
                    volume: -20, 
                    // Attack más suave (0.05) y release más largo (0.8) para un sonido más sereno.
                    envelope: { attack: 0.05, sustain: 0.05, release: 0.8 }, 
                    modulationEnvelope: { attack: 0.05, decay: 0.5, sustain: 0.1, release: 0.5 }
                }
            }); 

            // Audio Chain: Synth -> Chorus -> Vibrato -> Delay -> Reverb -> Compressor -> Limiter -> Destination
            fmSynth.chain(chorus, vibrato, delay, reverb, masterCompressor, Tone.Destination);
            
            setupControlListeners();
            applySynthSettings(); 
        }

        // Ball Class
        class Ball {
            constructor(x, y, color, radius) {
                this.x = x;
                this.y = y;
                this.vx = 0;
                this.vy = 0;
                this.r = radius; 
                this.color = color;
                this.mass = this.r / 10; 
                this.isStatic = false; 
                this.flash = false; 
            }

            // Maps Y position to a pitch in the selected scale
            getPitch() {
                const rootNote = document.getElementById('rootNote').value;
                const scaleType = document.getElementById('scaleType').value;
                const octave = 4; 
                
                const intervals = scaleDefinitions[scaleType];
                let scaleNotes = [];
                const rootMidi = Tone.Midi(rootNote + octave).toMidi();
                
                for (let i = 0; i < 24; i++) { 
                    const intervalIndex = i % intervals.length;
                    const octaveShift = Math.floor(i / intervals.length);
                    const midiNote = rootMidi + (octaveShift * 12) + intervals[intervalIndex];
                    
                    if (midiNote > rootMidi + 24) break; 
                    
                    scaleNotes.push(Tone.Midi(midiNote).toNote());
                }
                
                if (scaleNotes.length === 0) scaleNotes.push(rootNote + octave); 

                let normalizedY = 1 - (this.y / canvas.height); 
                const index = Math.min(scaleNotes.length - 1, Math.floor(normalizedY * scaleNotes.length));
                
                return scaleNotes[index];
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

                const drawColor = this.color;
                ctx.fillStyle = drawColor;
                
                // Reactive Glow/Shadow based on collision (flash state)
                ctx.shadowColor = this.flash ? '#ffffff' : this.color;
                ctx.shadowBlur = this.flash ? 30 : 10;
                ctx.fill();
                
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; 
                ctx.stroke();

                ctx.closePath();
                ctx.restore();
                this.flash = false; 
            }

            update() {
                if (this.isStatic) return;

                this.vy += GRAVITY;
                this.vx *= FRICTION;
                this.vy *= FRICTION;

                this.x += this.vx;
                this.y += this.vy;
                
                // Limitar la velocidad para evitar picos de cálculo en móviles
                this.vx = Math.min(Math.max(this.vx, -MAX_VELOCITY), MAX_VELOCITY);
                this.vy = Math.min(Math.max(this.vy, -MAX_VELOCITY), MAX_VELOCITY);


                let playSound = false;

                // Horizontal Bounce
                if (this.x + this.r > canvas.width) {
                    this.x = canvas.width - this.r;
                    this.vx = -this.vx * BOUNCE_DAMPING;
                    playSound = true;
                } else if (this.x - this.r < 0) {
                    this.x = this.r;
                    this.vx = -this.vx * BOUNCE_DAMPING;
                    playSound = true;
                }

                // Vertical Bounce
                if (this.y + this.r > canvas.height) {
                    this.y = canvas.height - this.r;
                    this.vy = -this.vy * BOUNCE_DAMPING;
                    playSound = true;
                } else if (this.y - this.r < 0) {
                    this.y = this.r;
                    this.vy = -this.vy * BOUNCE_DAMPING;
                    playSound = true;
                }

                // Play sound on collision
                if (playSound && isAudioReady) {
                    const velocityMagnitude = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                    this.playSound(Math.min(0.015, velocityMagnitude / 300)); 
                    this.flash = true; // Trigger visual reactivity
                }
            }

            playSound(velocityMultiplier = 0.5) {
                if (!isAudioReady || !fmSynth) return;
                const pitch = this.getPitch();
                
                const velocityMagnitude = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                const baseVolume = 0.2; // Adjusted base volume for new compressor headroom
                const maxVolume = 0.5; // Adjusted maximum volume
                // El volumen se escala en función de la velocidad, pero la velocidad ya está limitada.
                const volume = Math.min(maxVolume, baseVolume + (velocityMagnitude * velocityMultiplier)); 
                
                fmSynth.triggerAttackRelease(pitch, '0.2', Tone.now(), volume); 
            }
        }

        // Generates a random color from the psychedelic palette
        function getRandomPsychedelicColor() {
            const colors = [
                'rgba(255, 105, 180, 0.9)', 
                'rgba(0, 255, 255, 0.9)',   
                'rgba(255, 255, 0, 0.9)',   
                'rgba(148, 0, 211, 0.9)',   
                'rgba(50, 205, 50, 0.9)'    
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        // Helper function for random radius
        function getRandomRadius() {
            return Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
        }

        /**
         * Draws the generative, flowing psychedelic background using dynamic gradients.
         */
        function drawGenerativeBackground(ctx, width, height) {
            noiseOffset += 0.005; // Speed of change

            const t = performance.now() * 0.0001 + noiseOffset;
            
            // Define three key colors that shift over time using HSL
            const colorA = 'hsl(' + (Math.sin(t) * 180 + 200) + ', 100%, 50%)'; // Blue/Pink shift
            const colorB = 'hsl(' + (Math.sin(t * 1.5) * 180 + 100) + ', 100%, 50%)'; // Green/Yellow shift
            const colorC = 'hsl(' + (Math.sin(t * 0.7) * 180 + 300) + ', 100%, 50%)'; // Purple/Red shift

            // Create a radial gradient centered randomly based on time/noise
            const centerX = width * (0.5 + Math.sin(t * 2) * 0.3);
            const centerY = height * (0.5 + Math.cos(t * 2.2) * 0.3);
            const radius = Math.max(width, height) * 0.7;

            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            
            gradient.addColorStop(0, colorA);
            gradient.addColorStop(0.5, colorB);
            gradient.addColorStop(1, colorC);

            // Draw the background with low alpha to maintain trails (psychedelic effect)
            ctx.globalAlpha = BACKGROUND_CLEAR_ALPHA; 
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height); 
        }


        // ===================================================================
        // 3. Collision and Animation Loop
        // ===================================================================

        function checkBallCollisions() {
            // (Collision logic remains the same for stable physics)
            for (let i = 0; i < balls.length; i++) {
                for (let j = i + 1; j < balls.length; j++) {
                    const b1 = balls[i];
                    const b2 = balls[j];

                    const dx = b2.x - b1.x;
                    const dy = b2.y - b1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDist = b1.r + b2.r;

                    if (distance < minDist) {
                        const angle = Math.atan2(dy, dx);
                        const cos = Math.cos(angle);
                        const sin = Math.sin(angle);

                        const v1 = { x: b1.vx * cos + b1.vy * sin, y: b1.vy * cos - b1.vx * sin };
                        const v2 = { x: b2.vx * cos + b2.vy * sin, y: b2.vy * cos - b2.vx * sin };
                        
                        const overlap = minDist - distance;
                        const totalMass = b1.mass + b2.mass;
                        const mtdX = overlap * cos;
                        const mtdY = overlap * sin;

                        b1.x -= mtdX * (b2.mass / totalMass);
                        b1.y -= mtdY * (b2.mass / totalMass);
                        b2.x += mtdX * (b1.mass / totalMass);
                        b2.y += mtdY * (b1.mass / totalMass);
                        
                        const finalV1x = v2.x;
                        const finalV2x = v1.x;
                        
                        b1.vx = (finalV1x * cos - v1.y * sin) * BOUNCE_DAMPING;
                        b1.vy = (v1.y * cos + finalV1x * sin) * BOUNCE_DAMPING;
                        b2.vx = (finalV2x * cos - v2.y * sin) * BOUNCE_DAMPING;
                        b2.vy = (v2.y * cos + finalV2x * sin) * BOUNCE_DAMPING;
                    }
                }
            }
        }

        function resizeCanvas() {
            const canvasWrapper = document.getElementById('canvas-wrapper');
            // Canvas width/height should match the container size set by CSS (w-full h-full)
            canvas.width = canvasWrapper.clientWidth - 16; // Adjust for 2x8px padding
            canvas.height = canvasWrapper.clientHeight - 16; // Adjust for 2x8px padding
        }
        
        // Main Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            // 1. Draw the generative, flowing background
            drawGenerativeBackground(ctx, canvas.width, canvas.height); 

            ctx.globalAlpha = 1.0;

            // 2. Update and draw all balls
            for (const ball of balls) {
                ball.update();
                ball.draw();
            }
            
            // 3. Check and resolve collisions
            checkBallCollisions();

            // 4. Draw drag line (vibrant feedback)
            if (isDragging) {
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = '#ff00ff'; 
                ctx.lineWidth = 5;
                ctx.setLineDash([8, 8]);
                ctx.moveTo(dragStart.x, dragStart.y);
                ctx.lineTo(newBallPos.x, newBallPos.y);
                ctx.stroke();
                
                // Draw temporary ball (white core, purple glow)
                const tempRadius = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, 
                    MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * (Math.sqrt(Math.pow(dragStart.x - newBallPos.x, 2) + Math.pow(dragStart.y - newBallPos.y, 2)) / 300)
                ));

                ctx.beginPath();
                ctx.arc(newBallPos.x, newBallPos.y, tempRadius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; 
                ctx.shadowColor = '#ff00ff';
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }
        }
        
        // ===================================================================
        // 4. Control Listeners (Presets, Audio, Mouse/Touch)
        // ===================================================================
        
        function applyPreset(presetName) {
            const preset = complexPresets[presetName];
            if (!preset) return;

            synthSettings = preset;
            applySynthSettings(); 
        }

        function setupControlListeners() {
            document.getElementById('synthPreset').addEventListener('change', (e) => {
                selectedPresetName = e.target.value;
                applyPreset(selectedPresetName);
            });
            
            resetButton.addEventListener('click', () => {
                balls = []; 
            });
        }
        
        function getMousePos(evt) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

        // Unified Pointer Handlers for Mouse and Touch
        canvas.addEventListener('mousedown', handlePointerDown);
        canvas.addEventListener('mousemove', handlePointerMove);
        canvas.addEventListener('mouseup', handlePointerUp);

        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handlePointerDown(e.touches[0]); }, { passive: false });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); handlePointerMove(e.touches[0]); }, { passive: false });
        canvas.addEventListener('touchend', (e) => { e.preventDefault(); handlePointerUp(e.changedTouches[0]); }, { passive: false });

        function handlePointerDown(e) {
            if (!isAudioReady) return; 
            // NOTE: getMousePos works for both mouse and touch if clientX/Y is available
            const pos = getMousePos(e);
            isDragging = true;
            dragStart = pos;
            newBallPos = pos;
        }

        function handlePointerMove(e) {
            if (!isDragging) return;
            // NOTE: getMousePos works for both mouse and touch if clientX/Y is available
            newBallPos = getMousePos(e);
        }

        function handlePointerUp(e) {
            if (!isDragging) return;
            isDragging = false;
            
            // NOTE: getMousePos works for both mouse and touch if clientX/Y is available
            const launchEnd = getMousePos(e);
            
            // REDUCIDO: Multiplicador de 0.15 a 0.1 para reducir la velocidad inicial y la carga de cálculo en móviles.
            const vx = (dragStart.x - launchEnd.x) * 0.1; 
            const vy = (dragStart.y - launchEnd.y) * 0.1;
            const radius = getRandomRadius(); 
            
            const newBall = new Ball(dragStart.x, dragStart.y, getRandomPsychedelicColor(), radius); 
            newBall.vx = vx;
            newBall.vy = vy;

            balls.push(newBall);
        }

        // Start Audio Context Button
        startButton.addEventListener('click', async () => {
            if (Tone.context.state !== 'running') {
                try {
                    await Tone.start();
                    isAudioReady = true;
                    
                    document.getElementById('startText').textContent = 'Audio Running';
                    startButton.style.backgroundColor = '#7cfc00'; // Lime green for "running"
                    startButton.disabled = true;

                } catch (error) {
                    console.error("Error starting audio context:", error);
                }
            }
        });
        
        window.addEventListener('resize', resizeCanvas);

        // Initialization
        window.onload = function () {
            resizeCanvas();
            setupSynths();
            animate();
            applyPreset(selectedPresetName); 
        }
    </script>
</body>
</html>`;
        const escapedHtml = htmlContent.replace(/"/g, '&quot;');

        createWindow({
            title: 'PsyBallz',
            x: 200, y: 80, width: 900, height: 700,
            resizable: true,
            allowFullscreen: true,
            content: `<iframe 
                        srcdoc="${escapedHtml}" 
                        style="width:100%; height:100%; border:0;" 
                        sandbox="allow-scripts allow-same-origin"
                      ></iframe>`
        });
    } catch (error) {
        console.error("Failed to load PsyBallz content:", error);
        createWindow({
            title: 'Error',
            x: 250, y: 150, width: 320, height: 140,
            content: `<div class="text-content"><p>Could not load the PsyBallz application.</p><p>Please check the console for more details.</p></div>`
        });
    }
}

function openBandcampWindow() {
    window.open('https://environment-texture.bandcamp.com/', '_blank');
}

function openSoundcloudWindow() {
    window.open('https://soundcloud.com/oblinof', '_blank');
}


const appDefinitions: AppDefinition[] = [
    { id: 'music', name: 'Music', icon: '♫', action: openMusicWindow, position: { x: 30, y: 40 } },
    { id: 'gallery', name: 'Gallery', icon: '🖼️', action: openGalleryWindow, position: { x: 30, y: 140 } },
    { id: 'contact', name: 'Contact', icon: '✉️', action: openContactWindow, position: { x: 30, y: 240 } },
    { id: 'trash', name: 'Trash', icon: '🗑️', action: openTrashWindow, position: { x: 30, y: 340 } },
    
    { id: 'datafall', name: 'Datafall', icon: '💧', action: openDatafallWindow, position: { x: 130, y: 40 } },
    { id: 'paintdelic', name: 'Paintdelic', icon: '🎨', action: openPaintdelicWindow, position: { x: 130, y: 140 } },
    { id: 'ambient', name: 'Ambient Portable', icon: '🔊', action: openAmbientPortableWindow, position: { x: 130, y: 240 } },
    { id: 'entity', name: 'Entity Collab', icon: '👾', action: openEntityCollabWindow, position: { x: 130, y: 340 } },

    { id: 'wordarp', name: 'Word Arp', icon: '🎹', action: openWordArpWindow, position: { x: 230, y: 40 } },
    { id: 'realism', name: 'Extractivist Realism', icon: '👁️‍🗨️', action: openExtractivistRealismWindow, position: { x: 230, y: 140 } },
    { id: 'ravecat', name: 'Ravecat', icon: '🐈', action: openRavecatWindow, position: { x: 230, y: 240 } },
    { id: 'psyballz', name: 'PsyBallz', icon: '🔮', action: openPsyBallzWindow, position: { x: 230, y: 340 } },
];


// --- UI Rendering ---
function render() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes subtle-move {
            from { background-position: 0 0; }
            to { background-position: 2px 2px; }
        }
        @keyframes scroll-text {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        :root { --font-family: 'VT323', monospace; }
        body {
            margin: 0; padding: 0; font-family: var(--font-family); color: #000;
            overflow: hidden; background-color: #ccc;
            background-image: repeating-conic-gradient(#aaa 0% 25%, #ccc 0% 50%);
            background-size: 2px 2px; image-rendering: pixelated;
            animation: subtle-move 2s linear infinite;
            -webkit-font-smoothing: none; font-smooth: never; cursor: default;
        }
        #root { width: 100vw; height: 100vh; position: relative; }
        
        .top-bar {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 25px;
            background: #fff;
            border-bottom: 1px solid #000;
            box-shadow: 2px 2px 0px #000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            z-index: 10000;
            user-select: none;
        }
        .brand { font-weight: bold; font-size: 18px; }
        .menu { display: flex; gap: 15px; }
        .menu-item {
            cursor: pointer;
            font-size: 16px;
            position: relative;
            padding: 2px 5px;
        }
        .menu-item:hover {
            background: #000;
            color: #fff;
        }
        .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: #fff;
            border: 1px solid #000;
            box-shadow: 2px 2px 0px #000;
            min-width: 120px;
            z-index: 10001;
        }
        .dropdown-item {
            padding: 5px 10px;
            font-size: 16px;
            cursor: pointer;
        }
        .dropdown-item:hover {
            background: #000;
            color: #fff;
        }
        
        .desktop { position: absolute; top: 25px; left: 0; right: 0; bottom: 25px; }
        
        .bottom-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 25px;
            background: #000;
            color: #fff;
            z-index: 10000;
            user-select: none;
            display: flex;
        }
        .marquee {
            flex-grow: 1;
            overflow: hidden;
            display: flex;
            align-items: center;
        }
        .scrolling-text-container {
            display: flex;
            width: max-content;
            animation: scroll-text 40s linear infinite;
        }
        .scrolling-text-container span {
            white-space: nowrap;
            font-size: 16px;
        }

        .window {
            position: absolute; background: #fff; border: 1px solid #000;
            box-shadow: 2px 2px 0px #000; display: flex; flex-direction: column;
        }
        .title-bar {
            height: 19px; padding: 0 5px; border-bottom: 1px solid #000;
            background-image: repeating-linear-gradient(to bottom, #fff, #fff 1px, transparent 1px, transparent 3px);
            background-color: #fff; cursor: move; user-select: none;
            text-align: center; font-size: 16px; line-height: 19px; position: relative;
        }
        .title-text { pointer-events: none; }
        .close-btn {
            position: absolute; top: 4px; left: 4px; width: 11px; height: 11px;
            border: 1px solid #000; cursor: pointer;
        }
        .close-btn:active { background: #000; }
        
        .fullscreen-btn {
            position: absolute; top: 4px; left: 20px; width: 11px; height: 11px;
            border: 1px solid #000; cursor: pointer;
        }
        .fullscreen-btn::after {
            content: ''; position: absolute; top: 2px; left: 2px;
            width: 5px; height: 5px; border: 1px solid #000;
        }
        .fullscreen-btn:active { background: #000; }

        .window.fullscreen .fullscreen-btn::after {
            top: 1px; left: 1px; width: 7px; height: 7px; border: none;
            border-left: 2px solid #000; border-top: 2px solid #000;
            transform: rotate(225deg);
        }
        .window.fullscreen .fullscreen-btn:active::after {
             border-left: 2px solid #fff; border-top: 2px solid #fff;
        }


        .window-content { padding: 2px; flex-grow: 1; overflow: auto; }
        .window-content iframe { border: none; background-color: #1a1a1a; }
        
        .desktop-icon {
            position: absolute; width: 80px; display: flex; flex-direction: column;
            align-items: center; text-align: center; user-select: none; padding: 4px; cursor: pointer;
            transition: transform 0.1s ease-out;
        }
        .desktop-icon:hover {
            transform: translateY(-2px);
        }
        .desktop-icon:focus { outline: none; }
        .desktop-icon .icon-visual {
            width: 50px; height: 50px; border: 1px solid black; background: #fff;
            font-size: 32px; display: flex; align-items: center; justify-content: center;
            margin-bottom: 4px; font-family: monospace;
        }
        .desktop-icon .icon-label { background: #fff; padding: 0 4px; font-size: 16px; }
        .desktop-icon:focus .icon-label, .desktop-icon:hover .icon-label { 
            background: #000; color: #fff; 
        }
        .desktop-icon:active .icon-visual { filter: invert(1); }

        .text-content { padding: 10px; font-size: 16px; line-height: 1.4; }

        .gallery-grid {
            display: grid; grid-template-columns: repeat(2, 1fr);
            gap: 15px; padding: 10px; height: 100%; box-sizing: border-box;
        }
        .gallery-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .img-placeholder {
            width: 120px; height: 90px;
            background: repeating-conic-gradient(#bbb 0% 25%, #ddd 0% 50%);
            background-size: 4px 4px; border: 1px solid #000; margin-bottom: 4px;
        }

        .contact-list { list-style: none; padding: 15px; margin: 0; font-size: 16px; }
        .contact-list li { padding: 5px 0; }

        .resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 12px;
            height: 12px;
            cursor: se-resize;
            z-index: 1;
        }
        .resize-handle::after {
            content: '';
            position: absolute;
            bottom: 1px;
            right: 1px;
            width: 5px;
            height: 5px;
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
        }
        
        .folder-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 10px;
        }
        .folder-icon {
            width: 90px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            user-select: none;
            padding: 4px;
            cursor: pointer;
        }
        .folder-icon:focus { outline: none; }
        .folder-icon .icon-visual {
            width: 50px; height: 50px;
            font-size: 32px; display: flex; align-items: center; justify-content: center;
            margin-bottom: 4px;
        }
        .folder-icon .icon-label { background: #fff; padding: 0 4px; font-size: 14px; word-break: break-word; }
        .folder-icon .icon-sublabel { font-size: 12px; color: #555; }
        .folder-icon:focus .icon-label, .folder-icon:hover .icon-label {
            background: #000; color: #fff;
        }

        .window.fullscreen {
            top: 25px !important;
            left: 0 !important;
            width: 100vw !important;
            height: calc(100vh - 50px) !important;
            box-shadow: none;
            border: none;
            z-index: 20000 !important;
        }
        .window.fullscreen .resize-handle { display: none; }
    `;
    document.head.appendChild(style);

    const scrollingText = " Metamodel Art  ✦  Oblinof New Multiversal Order  ✦  Social Development  ✦  Experimental Capital  ✦  ";

    root.innerHTML = `
        <div class="top-bar">
            <span class="brand">oblinof</span>
            <div class="menu">
                <div class="menu-item" id="music-menu-btn">
                    music
                    <div class="dropdown-menu" id="music-dropdown">
                        <div class="dropdown-item" id="music-folder">folder</div>
                        <div class="dropdown-item" id="music-bandcamp">bandcamp</div>
                        <div class="dropdown-item" id="music-soundcloud">soundcloud</div>
                    </div>
                </div>
                <div class="menu-item" id="art-menu-btn">art</div>
                <div class="menu-item" id="about-menu-btn">about</div>
            </div>
        </div>
        <div class="desktop"></div>
        <div class="bottom-bar">
             <div class="marquee">
                <div class="scrolling-text-container">
                    <span>${scrollingText}</span>
                    <span>${scrollingText}</span>
                </div>
             </div>
        </div>
        `;

    desktopElement = root.querySelector('.desktop');

    // Create desktop icons from definitions
    appDefinitions.forEach(app => {
        if (app.position) {
            createDesktopIcon(app.name, app.icon, app.position.x, app.position.y, app.action);
        }
    });
    
    // --- Top Bar Logic ---
    const musicMenuBtn = root.querySelector('#music-menu-btn') as HTMLElement;
    const musicDropdown = root.querySelector('#music-dropdown') as HTMLElement;

    musicMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        musicDropdown.style.display = musicDropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (musicDropdown.style.display === 'block' && !musicMenuBtn.contains(e.target as Node)) {
            musicDropdown.style.display = 'none';
        }
    });

    root.querySelector('#music-folder')?.addEventListener('click', () => {
        openMusicWindow();
        musicDropdown.style.display = 'none';
    });
    root.querySelector('#music-bandcamp')?.addEventListener('click', () => {
        openBandcampWindow();
        musicDropdown.style.display = 'none';
    });
    root.querySelector('#music-soundcloud')?.addEventListener('click', () => {
        openSoundcloudWindow();
        musicDropdown.style.display = 'none';
    });
    root.querySelector('#art-menu-btn')?.addEventListener('click', openGalleryWindow);
    root.querySelector('#about-menu-btn')?.addEventListener('click', openContactWindow);
}

function init() {
    render();
}

init();