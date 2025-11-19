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
    const isMobile = window.innerWidth < 768;

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

    if (isMobile) {
        const desktopHeight = desktopElement?.clientHeight ?? (window.innerHeight - 50);
        newWindow.x = 10;
        newWindow.y = 10;
        newWindow.width = window.innerWidth - 25;
        newWindow.height = desktopHeight - 20;
        newWindow.isDraggable = false;
        newWindow.resizable = false;
    }

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

function createDesktopIcon(name: string, visual: string, onClick: () => void, x: number, y: number) {
    const iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon';
    iconEl.setAttribute('tabindex', '0');
    iconEl.style.left = `${x}px`;
    iconEl.style.top = `${y}px`;
    iconEl.innerHTML = `
        <div class="icon-visual">${visual}</div>
        <div class="icon-label">${name}</div>
    `;
    
    iconEl.addEventListener('click', onClick);
    
    desktopElement?.appendChild(iconEl);
}

// --- App Windows ---

function openGalleryWindow() {
    createWindow({
        title: 'Gallery',
        x: 100, y: 50, width: 800, height: 600,
        resizable: true,
        allowFullscreen: true,
        content: `<iframe 
                    src="https://artviewer.vercel.app/" 
                    style="width:100%; height:100%; border:0;"
                  ></iframe>`
    });
}

function openContactWindow() {
     createWindow({
        title: 'About',
        x: 250, y: 150, width: 400, height: 320,
        content: `
            <div class="text-content" style="text-align: center;">
                <p> ▂▃▄▅▆▇▉ ▂▃▄▅▆▇▉ ▂▃▄▅▆▇▉</p>
                <p style="margin: 15px 0;">I’ve been crafting audiovisual experiences since 2007. This is my gallery + workshop - selected A&V pieces and the brand-new tools I vibecode for all of us. WIP.</p>
                <p> ▂▃▄▅▆▇▉ ▂▃▄▅▆▇▉ ▂▃▄▅▆▇▉</p>
                <ul class="contact-list" style="margin-top: 20px;">
                    <li>Email: oblinof@gmail.com</li>
                    <li>Socials: <a href="https://linktr.ee/oblinof" target="_blank" rel="noopener noreferrer">linktr.ee/oblinof</a></li>
                </ul>
            </div>
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

function openDatafallWindow() {
    createWindow({
        title: 'Datafall',
        x: 150, y: 30, width: 700, height: 500,
        resizable: true,
        allowFullscreen: true,
        content: `<iframe 
                    src="https://datafall.vercel.app/" 
                    style="width:100%; height:100%; border:0;"
                  ></iframe>`
    });
}

function openPaintdelicWindow() {
    createWindow({
        title: 'Paintdelic',
        x: 180, y: 50, width: 800, height: 600,
        resizable: true,
        allowFullscreen: true,
        content: `<iframe 
                    src="https://paintedelic.vercel.app/" 
                    style="width:100%; height:100%; border:0;"
                  ></iframe>`
    });
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

function openEntityCollabWindow() {
    createWindow({
        title: 'Entity Collab',
        x: 220, y: 80, width: 640, height: 480,
        resizable: true,
        allowFullscreen: true,
        content: `<iframe 
                    src="entity_collab.html" 
                    style="width:100%; height:100%; border:0;"
                  ></iframe>`
    });
}

function openWordArpWindow() {
    createWindow({
        title: 'Word Arp',
        x: 250, y: 100, width: 900, height: 600,
        resizable: true,
        allowFullscreen: true,
        content: `<iframe 
                    src="https://wordarp.vercel.app/" 
                    style="width:100%; height:100%; border:0;" 
                  ></iframe>`
    });
}

function openExtractivistRealismWindow() {
    createWindow({
        title: 'Extractivist Realism 1.0',
        x: 180, y: 60, width: 800, height: 600,
        resizable: true,
        allowFullscreen: true,
        content: `<iframe 
                    src="https://extractivist-realism.vercel.app/" 
                    style="width:100%; height:100%; border:0;"
                  ></iframe>`
    });
}

function openRavecatWindow() {
    createWindow({
        title: 'Ravecat',
        x: 160, y: 40, width: 900, height: 700,
        resizable: true,
        allowFullscreen: true,
        content: `<iframe 
                    src="https://ravecat-beta.vercel.app/" 
                    style="width:100%; height:100%; border:0;"
                  ></iframe>`
    });
}

function openPsyBallzWindow() {
    createWindow({
        title: 'PsyBallz',
        x: 200, y: 80, width: 900, height: 700,
        resizable: true,
        allowFullscreen: true,
        content: `<iframe 
                    src="https://psyballs.vercel.app/" 
                    style="width:100%; height:100%; border:0;"
                  ></iframe>`
    });
}

function openBandcampWindow() {
    window.open('https://environment-texture.bandcamp.com/', '_blank');
}

function openSoundcloudWindow() {
    window.open('https://soundcloud.com/oblinof', '_blank');
}


const appDefinitions: AppDefinition[] = [
    { id: 'music', name: 'Music', icon: '♫', action: openMusicWindow },
    { id: 'gallery', name: 'Gallery', icon: '🖼️', action: openGalleryWindow },
    { id: 'contact', name: 'Contact', icon: '✉️', action: openContactWindow },
    { id: 'trash', name: 'Trash', icon: '🗑️', action: openTrashWindow },
    { id: 'datafall', name: 'Datafall', icon: '💧', action: openDatafallWindow },
    { id: 'paintdelic', name: 'Paintdelic', icon: '🎨', action: openPaintdelicWindow },
    { id: 'ambient', name: 'Ambient Portable', icon: '🔊', action: openAmbientPortableWindow },
    { id: 'entity', name: 'Entity Collab', icon: '👾', action: openEntityCollabWindow },
    { id: 'wordarp', name: 'Word Arp', icon: '🎹', action: openWordArpWindow },
    { id: 'realism', name: 'Extractivist Realism', icon: '👁️‍🗨️', action: openExtractivistRealismWindow },
    { id: 'ravecat', name: 'Ravecat', icon: '🐈', action: openRavecatWindow },
    { id: 'psyballz', name: 'PsyBallz', icon: '🔮', action: openPsyBallzWindow },
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
        html, body {
            margin: 0; padding: 0; 
            height: 100%;
            overflow: hidden;
        }
        body {
            font-family: var(--font-family); color: #000;
            background-color: #ccc;
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
        .contact-list a { color: #0000ff; text-decoration: underline; }
        .contact-list a:hover { color: #ff00ff; }


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
        
        /* --- Responsive Design for Mobile --- */
        @media (max-width: 768px) {
            .desktop {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                padding: 15px;
                justify-content: center;
                align-content: flex-start;
                overflow-y: auto; /* Allow scrolling for many icons */
            }

            .desktop-icon {
                position: relative !important; /* Override absolute positioning */
                left: auto !important;
                top: auto !important;
                width: 70px; /* Slightly smaller icons */
            }
            
            .desktop-icon .icon-visual {
                width: 45px;
                height: 45px;
                font-size: 28px;
            }
            
            .desktop-icon .icon-label {
                font-size: 14px;
            }

            .top-bar {
                height: 30px;
            }
            .brand {
                font-size: 16px;
            }
            .menu-item {
                font-size: 14px;
                padding: 2px 3px;
            }
            
            .bottom-bar {
                height: 20px;
            }
            .scrolling-text-container span {
                font-size: 14px;
            }

            .resize-handle {
                display: none !important;
            }
            
            .title-bar {
                cursor: default;
            }
        }
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

    const iconGrid = [
        ['music', 'gallery', 'contact', 'trash'],
        ['datafall', 'paintdelic', 'ambient', 'entity'],
        ['wordarp', 'realism', 'ravecat', 'psyballz'],
    ];

    const iconMap: { [key: string]: AppDefinition } = {};
    appDefinitions.forEach(app => iconMap[app.id] = app);
    
    const iconSpacingX = 90;
    const iconSpacingY = 100;
    const initialOffsetX = 20;
    const initialOffsetY = 20;

    iconGrid.forEach((row, rowIndex) => {
        row.forEach((id, colIndex) => {
            const app = iconMap[id];
            if (app) {
                const x = initialOffsetX + colIndex * iconSpacingX;
                const y = initialOffsetY + rowIndex * iconSpacingY;
                createDesktopIcon(app.name, app.icon, app.action, x, y);
            }
        });
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