// --- Data ---
interface MusicAlbum {
    title: string;
    artist: string;
    iframe: string;
}

const musicAlbums: MusicAlbum[] = [
    { title: 'Opalyn', artist: 'Faycle', iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2788353006/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless></iframe>` },
    { title: 'Kickgun & Dentalcore VOL2', artist: 'oblinof', iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=105379128/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless></iframe>` },
    { title: 'Graphical Interface Trance', artist: 'Oblinof', iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2659704266/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless></iframe>` },
    { title: 'edits, tools, & trash', artist: 'Oblinof', iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=2147918188/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless></iframe>` },
    { title: 'Dogma', artist: 'Aloe Engine', iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=193817841/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless></iframe>` },
    { title: ',-Dr3ja', artist: 'Oblinof', iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=541149304/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless></iframe>` },
    { title: '842', artist: 'Aural Eq', iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=1723178745/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless></iframe>` },
    { title: 'Wifi Pineal', artist: 'Oblinof', iframe: `<iframe style="border: 0; width: 100%; height: 100%;" src="https://bandcamp.com/EmbeddedPlayer/album=3419546872/size=large/bgcol=000000/linkcol=00ffff/tracklist=false/transparent=true/" seamless></iframe>` }
];

interface AppDefinition {
    id: string;
    name: string;
    description: string;
    category: 'SYSTEM' | 'MEDIA' | 'TOOLS' | 'XENO';
    color: string;
    content: string | (() => HTMLElement);
}

function getMusicContent() {
    const container = document.createElement('div');
    container.className = 'music-menu';
    
    const djItem = document.createElement('button');
    djItem.className = 'bios-btn';
    djItem.innerHTML = `> [EXEC] DJ OBLI MIXES`;
    djItem.onclick = () => launchApp('dj_obli', 'DJ OBLI // MIXES', `<iframe style="border: 0; width: 100%; height: 100%;" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1581868891&color=%2300ffff&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>`);
    container.appendChild(djItem);

    musicAlbums.forEach((album, idx) => {
        const item = document.createElement('button');
        item.className = 'bios-btn';
        item.innerHTML = `> [EXEC] ${album.title.toUpperCase()} - ${album.artist.toUpperCase()}`;
        item.onclick = () => launchApp(`album_${idx}`, `AUDIO: ${album.title}`, album.iframe);
        container.appendChild(item);
    });
    return container;
}

const apps: AppDefinition[] = [
    { id: 'music', name: 'Music', description: 'Audio Lib', category: 'MEDIA', color: '#0f0', content: getMusicContent },
    { id: 'gallery', name: 'Gallery', description: 'Visuals', category: 'MEDIA', color: '#0f0', content: `<iframe src="https://artviewer.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>` },
    { id: 'contact', name: 'Profile', description: 'Player Info', category: 'SYSTEM', color: '#0f0', content: `
        <div class="bios-profile">
            <pre>
=========================================
  USER PROFILE: OBLINOF
  CLASS: ARTIST/DESIGNER
  RANK: SSS
  ZONE: AUDIOVISUAL METAMODEL
=========================================
            </pre>
            <a href="mailto:oblinof@gmail.com" target="_top" class="bios-link">> SEND MAIL</a><br><br>
            <a href="https://linktr.ee/oblinof" target="_top" class="bios-link">> NEURAL LINK</a>
        </div>
    ` },
    { id: 'datafall', name: 'Datafall', description: 'Water Sim', category: 'TOOLS', color: '#0ff', content: `<iframe src="/datafall.html" style="width:100%; height:100%; border:0;"></iframe>` },
    { id: 'paintdelic', name: 'Paint', description: 'Pixel Art', category: 'TOOLS', color: '#0ff', content: `<iframe src="/paintdelic.html" style="width:100%; height:100%; border:0;"></iframe>` },
    { id: 'ambient', name: 'Ambient', description: 'Synth', category: 'TOOLS', color: '#0ff', content: `<iframe src="https://conversation-rope-497.app.ohara.ai" style="width:100%; height:100%; border:0;"></iframe>` },
    { id: 'entity', name: 'Entity', description: 'Collab', category: 'TOOLS', color: '#0ff', content: `<iframe src="/entity_collab.html" style="width:100%; height:100%; border:0;"></iframe>` },
    { id: 'wordarp', name: 'WordArp', description: 'Console', category: 'TOOLS', color: '#0ff', content: `<iframe src="/word_arp.html" style="width:100%; height:100%; border:0;"></iframe>` },
    { id: 'realism', name: 'Realism', description: 'Glitch FX', category: 'XENO', color: '#f0f', content: `<iframe src="/extractivist_realism.html" style="width:100%; height:100%; border:0;"></iframe>` },
    { id: 'ravecat', name: 'Ravecat', description: '3D Sim', category: 'XENO', color: '#f0f', content: `<iframe src="/ravecat.html" style="width:100%; height:100%; border:0;"></iframe>` },
    { id: 'psyballz', name: 'PsyBallz', description: 'Physics', category: 'XENO', color: '#f0f', content: `<iframe src="https://psyballs.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>` },
    { id: 'sydra', name: 'Sydra', description: 'Genetics', category: 'XENO', color: '#f0f', content: `<iframe src="https://sydra-byhq.vercel.app/" style="width:100%; height:100%; border:0;"></iframe>` },
    { id: 'trash', name: 'Trash', description: 'Empty', category: 'SYSTEM', color: '#0f0', content: `<div class="bios-profile"><pre>RECYCLE BIN IS EMPTY.\nSYSTEM CLEAN.</pre></div>` },
];

// --- State ---
let isBooting = true;
let activeApp: { id: string, title: string, content: string | HTMLElement } | null = null;

// --- DOM ---
const root = document.getElementById('root')!;

function renderStyle() {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --bg: #000000;
            --text: #00ff00;
            --text-dim: #008800;
            --highlight: #00ff00;
            --highlight-text: #000000;
            --cyan: #00ffff;
            --magenta: #ff00ff;
            --yellow: #ffff00;
        }
        *, *::before, *::after { box-sizing: border-box; }
        html {
            scroll-behavior: smooth;
        }
        body, html {
            margin: 0; padding: 0;
            width: 100%; height: 100%;
            background-color: var(--bg);
            color: var(--text);
            font-family: 'VT323', 'Courier New', monospace;
            font-size: 16px; /* Base font size for mobile */
            overflow: hidden;
            text-transform: uppercase;
            touch-action: manipulation; /* Eliminate 300ms tap delay */
        }
        #root {
            width: 100%; height: 100%;
        }
        .crt {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none !important; z-index: 9999;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 4px, 6px 100%;
        }
        .scanline {
            width: 100%; height: 100px; z-index: 9998; position: absolute; pointer-events: none !important;
            background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,255,0,0.2) 50%, rgba(0,0,0,0) 100%);
            opacity: 0.1; animation: scanline 6s linear infinite;
        }
        @keyframes scanline {
            0% { top: -100px; }
            100% { top: 100%; }
        }
        .container {
            width: 100%; height: 100%; position: relative; z-index: 10;
            display: flex; flex-direction: column;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        /* Boot Screen */
        .boot-screen { padding: 1rem; white-space: pre-wrap; word-wrap: break-word; font-size: 1.1rem; }
        .cursor { display: inline-block; width: 10px; height: 1.2em; background: var(--text); animation: blink 1s step-end infinite; vertical-align: bottom; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        /* Main Menu */
        .main-menu {
            padding: 1rem; display: flex; flex-direction: column; height: 100%; overflow-y: auto; overflow-x: hidden;
            animation: turn-on 0.5s ease-out;
        }
        @keyframes turn-on {
            0% { transform: scale(1, 0.01); opacity: 0; filter: brightness(3); }
            50% { transform: scale(1, 1); opacity: 1; filter: brightness(1.5); }
            100% { transform: scale(1, 1); opacity: 1; filter: brightness(1); }
        }
        .header { 
            text-align: center; margin-bottom: 1.5rem; color: var(--cyan); 
            border-bottom: 2px dashed var(--cyan); padding-bottom: 0.5rem; 
            max-width: 100%; overflow: hidden; 
            font-size: clamp(1.2rem, 5vw, 2rem); /* Fluid typography */
        }
        .grid { 
            display: grid; 
            grid-template-columns: 1fr; /* Mobile first: 1 column */
            gap: 1.5rem; 
        }
        .category { margin-bottom: 1.5rem; }
        .category-title { color: var(--yellow); border-bottom: 1px solid var(--text-dim); margin-bottom: 0.8rem; padding-bottom: 0.3rem; font-size: 1.2rem; }
        .bios-btn {
            cursor: pointer; 
            padding: 12px 10px; /* Larger touch target */
            min-height: 44px; /* Minimum touch target height */
            transition: all 0.1s; display: block;
            color: var(--text); text-decoration: none;
            background: transparent; border: none; text-align: left; font-family: inherit; font-size: 1.1rem; width: 100%;
        }
        .bios-btn:hover, .bios-btn:active { background: var(--highlight); color: var(--highlight-text); }
        .bios-btn .desc { 
            color: var(--text-dim); font-size: 0.9rem; 
            display: block; margin-top: 5px; /* Block on mobile */
        }
        .bios-btn:hover .desc, .bios-btn:active .desc { color: var(--highlight-text); }
        
        /* Fullscreen App */
        .fullscreen-app {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            display: flex; flex-direction: column; background: #000; z-index: 100;
            animation: crt-flicker 0.1s infinite;
        }
        @keyframes crt-flicker {
            0% { opacity: 0.98; }
            50% { opacity: 1; }
            100% { opacity: 0.99; }
        }
        .app-topbar {
            background: var(--highlight); color: var(--highlight-text);
            padding: 5px 15px; display: flex; justify-content: space-between; align-items: center;
            font-weight: bold; flex-shrink: 0;
            min-height: 44px; /* Touch target */
        }
        .btn-exit {
            background: #000; color: var(--highlight); border: 1px solid #000;
            font-family: inherit; font-size: 1rem; cursor: pointer; padding: 5px 15px;
            text-transform: uppercase; min-height: 36px;
        }
        .btn-exit:hover, .btn-exit:active { background: var(--text); color: #000; }
        .app-content { flex-grow: 1; position: relative; overflow: hidden; }
        .app-content iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; display: block; }
        
        /* Misc */
        .bios-profile { padding: 1rem; max-width: 100%; overflow: hidden; }
        .bios-link { 
            color: var(--cyan); text-decoration: none; cursor: pointer; 
            display: inline-block; word-break: break-all;
            padding: 10px 0; min-height: 44px; /* Touch target */
        }
        .bios-link:hover, .bios-link:active { background: var(--cyan); color: #000; }
        .music-menu { padding: 1rem; }
        pre { white-space: pre-wrap; word-wrap: break-word; max-width: 100%; overflow-x: hidden; margin: 0; font-family: inherit; }
        .header-line { overflow: hidden; white-space: nowrap; text-overflow: clip; width: 100%; }

        /* Tablet & Desktop overrides */
        @media (min-width: 850px) {
            body, html { font-size: 20px; }
            .grid { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
            .bios-btn .desc { display: inline; margin-left: 15px; margin-top: 0; font-size: 18px; }
            .boot-screen { padding: 20px; }
            .main-menu { padding: 20px; }
        }
    `;
    document.head.appendChild(style);
}

function launchApp(id: string, title: string, content: string | HTMLElement | (() => HTMLElement)) {
    let resolvedContent: string | HTMLElement;
    if (typeof content === 'function') {
        resolvedContent = content();
    } else {
        resolvedContent = content;
    }
    activeApp = { id, title, content: resolvedContent };
    renderUI();
}

function closeApp() {
    activeApp = null;
    renderUI();
}

function renderBootScreen() {
    const bootLines = [
        "OBLINOF BIOS v2.4.1",
        "Copyright (C) 2026, Oblinof Systems Inc.",
        "",
        "CPU: Quantum Processor 9000 at 8.4 GHz",
        "Memory Test : 64000000K OK",
        "",
        "Initializing USB Controllers .. Done.",
        "Loading Neural Interface ...... Done.",
        "Establishing Uplink ........... Done.",
        "",
        "Booting OS...",
    ];

    const container = document.createElement('div');
    container.className = 'boot-screen';
    
    let currentLine = 0;
    
    const textNode = document.createElement('span');
    container.appendChild(textNode);
    
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    container.appendChild(cursor);

    const interval = setInterval(() => {
        if (currentLine < bootLines.length) {
            textNode.textContent += bootLines[currentLine] + '\n';
            currentLine++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                isBooting = false;
                renderUI();
            }, 500);
        }
    }, 150);

    return container;
}

function renderMainMenu() {
    const container = document.createElement('div');
    container.className = 'main-menu';
    
    const header = document.createElement('div');
    header.className = 'header';
    header.innerHTML = `
        <div class="header-line">====================================================================================================</div>
        <div>OBLINOF OS - MAIN MENU</div>
        <div class="header-line">====================================================================================================</div>
    `;
    container.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'grid';

    const categories = ['SYSTEM', 'MEDIA', 'TOOLS', 'XENO'];
    
    categories.forEach(cat => {
        const catApps = apps.filter(a => a.category === cat);
        if (catApps.length === 0) return;

        const catDiv = document.createElement('div');
        catDiv.className = 'category';
        catDiv.innerHTML = `<div class="category-title">[ ${cat} ]</div>`;
        
        catApps.forEach(app => {
            const btn = document.createElement('button');
            btn.className = 'bios-btn';
            btn.innerHTML = `> ${app.name.padEnd(12, ' ')} <span class="desc">// ${app.description}</span>`;
            btn.onclick = () => launchApp(app.id, app.name, app.content);
            catDiv.appendChild(btn);
        });
        
        grid.appendChild(catDiv);
    });

    container.appendChild(grid);
    
    const footer = document.createElement('div');
    footer.style.marginTop = 'auto';
    footer.style.paddingTop = '20px';
    footer.style.color = 'var(--text-dim)';
    footer.innerHTML = `> USE MOUSE OR TOUCH TO EXECUTE PROGRAM.<br>> SYSTEM READY. <span class="cursor"></span>`;
    container.appendChild(footer);

    return container;
}

function renderFullscreenApp() {
    if (!activeApp) return document.createElement('div');

    const container = document.createElement('div');
    container.className = 'fullscreen-app';

    const topbar = document.createElement('div');
    topbar.className = 'app-topbar';
    topbar.innerHTML = `
        <span>RUNNING: ${activeApp.title}.EXE</span>
    `;
    
    const exitBtn = document.createElement('button');
    exitBtn.className = 'btn-exit';
    exitBtn.textContent = '[X] EXIT';
    exitBtn.onclick = closeApp;
    topbar.appendChild(exitBtn);

    const content = document.createElement('div');
    content.className = 'app-content custom-scrollbar';
    
    if (typeof activeApp.content === 'string') {
        content.innerHTML = activeApp.content;
    } else {
        content.appendChild(activeApp.content);
    }

    container.appendChild(topbar);
    container.appendChild(content);

    return container;
}

function renderUI() {
    root.innerHTML = '';
    
    // Ensure CRT and scanline are only added once
    if (!document.querySelector('.crt')) {
        const crt = document.createElement('div');
        crt.className = 'crt';
        document.body.appendChild(crt);
        
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        document.body.appendChild(scanline);
    }

    const container = document.createElement('div');
    container.className = 'container';

    if (isBooting) {
        container.appendChild(renderBootScreen());
    } else if (activeApp) {
        container.appendChild(renderFullscreenApp());
    } else {
        container.appendChild(renderMainMenu());
    }

    root.appendChild(container);
}

function init() {
    renderStyle();
    renderUI();
}

init();
