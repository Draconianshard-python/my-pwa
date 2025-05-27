// Tab favicon SVG as string
const TAB_FAVICON = `<svg  xmlns="http://www.w3.org/2000/svg"  width="18"  height="18"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="tab-favicon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4.028 7.82a9 9 0 1 0 12.823 -3.4c-1.636 -1.02 -3.064 -1.02 -4.851 -1.02h-1.647" /><path d="M4.914 9.485c-1.756 -1.569 -.805 -5.38 .109 -6.17c.086 .896 .585 1.208 1.111 1.685c.88 -.275 1.313 -.282 1.867 0c.82 -.91 1.694 -2.354 2.628 -2.093c-1.082 1.741 -.07 3.733 1.371 4.173c-.17 .975 -1.484 1.913 -2.76 2.686c-1.296 .938 -.722 1.85 0 2.234c.949 .506 3.611 -1 4.545 .354c-1.698 .102 -1.536 3.107 -3.983 2.727c2.523 .957 4.345 .462 5.458 -.34c1.965 -1.52 2.879 -3.542 2.879 -5.557c-.014 -1.398 .194 -2.695 -1.26 -4.75" /></svg>`;

const tabBar = document.getElementById('tab-bar');
const newTabBtn = document.getElementById('new-tab-btn');
const addressInput = document.getElementById('address-input');
const contentDiv = document.getElementById('content');
const contextMenu = document.getElementById('tab-context-menu');

let tabs = [
    {
        title: 'Firefox PWA',
        url: 'https://your-pwa.local/',
        favicon: TAB_FAVICON,
        content: `<h1>Welcome to Your Firefox-Themed PWA!</h1>
        <p>This PWA mimics the look of the Firefox browser. You can customize this template further to add more tabs, toolbar buttons, or features.</p>`
    }
];
let activeTab = 0;
let tabContextIndex = null;

// Rendering Tabs
function renderTabs() {
    // Remove old .tab elements except new tab btn
    [...tabBar.querySelectorAll('.tab')].forEach(tab => tab.remove());

    tabs.forEach((tab, idx) => {
        const tabDiv = document.createElement('div');
        tabDiv.className = 'tab' + (idx === activeTab ? ' active' : '');
        tabDiv.title = tab.title;
        tabDiv.tabIndex = 0;

        // Favicon SVG
        const faviconSpan = document.createElement('span');
        faviconSpan.innerHTML = tab.favicon;
        tabDiv.appendChild(faviconSpan);

        const span = document.createElement('span');
        span.textContent = tab.title.length > 20 ? tab.title.substring(0, 17) + '…' : tab.title;
        tabDiv.appendChild(span);

        // Close button, only if >1 tab
        if (tabs.length > 1) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                closeTab(idx);
            };
            tabDiv.appendChild(closeBtn);
        }

        tabDiv.onclick = () => setActiveTab(idx);

        // Context menu (right click)
        tabDiv.oncontextmenu = (e) => {
            e.preventDefault();
            tabContextIndex = idx;
            showTabContextMenu(e.clientX, e.clientY);
        };

        tabBar.insertBefore(tabDiv, newTabBtn);
    });
}

// Set active tab
function setActiveTab(idx) {
    activeTab = idx;
    addressInput.value = tabs[activeTab].url;
    contentDiv.innerHTML = tabs[activeTab].content;
    renderTabs();
}

// Close tab
function closeTab(idx) {
    tabs.splice(idx, 1);
    if (activeTab >= tabs.length) activeTab = tabs.length - 1;
    setActiveTab(activeTab);
}

// New Tab
newTabBtn.onclick = () => {
    const n = tabs.length + 1;
    tabs.push({
        title: `New Tab ${n}`,
        url: `https://your-pwa.local/${n}`,
        favicon: TAB_FAVICON,
        content: `<h1>New Tab ${n}</h1><p>This is tab number ${n}. Add your own content here!</p>`
    });
    setActiveTab(tabs.length - 1);
};

// Toolbar button handlers
document.getElementById('back-btn').onclick = () => alert('Back button pressed (demo)');
document.getElementById('forward-btn').onclick = () => alert('Forward button pressed (demo)');
document.getElementById('reload-btn').onclick = () => setActiveTab(activeTab);
document.getElementById('home-btn').onclick = () => setActiveTab(0);
document.getElementById('share-btn').onclick = () => alert('Share button pressed (demo)');
document.getElementById('settings-btn').onclick = () => alert('Settings button pressed (demo)');
document.getElementById('devtools-btn').onclick = () => alert('Dev Tools button pressed (demo)');

// Address bar navigation
addressInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const url = addressInput.value.trim();
        tabs[activeTab].url = url;
        tabs[activeTab].title = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        tabs[activeTab].content = `<h1>${url}</h1><p>You navigated to <b>${url}</b>.</p>`;
        setActiveTab(activeTab);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
            case 't': newTabBtn.click(); e.preventDefault(); break;
            case 'w': if (tabs.length > 1) closeTab(activeTab); e.preventDefault(); break;
            case 'tab':
                setActiveTab((activeTab + 1) % tabs.length);
                e.preventDefault();
                break;
        }
    }
});

// Tab context menu
function showTabContextMenu(x, y) {
    contextMenu.style.display = 'block';
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
}
function hideTabContextMenu() {
    contextMenu.style.display = 'none';
    tabContextIndex = null;
}
contextMenu.addEventListener('mouseleave', hideTabContextMenu);
document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) hideTabContextMenu();
});
contextMenu.addEventListener('click', (e) => {
    if (!tabContextIndex && tabContextIndex !== 0) return;
    const action = e.target.getAttribute('data-action');
    if (action === 'reload') setActiveTab(tabContextIndex);
    else if (action === 'duplicate') {
        const t = tabs[tabContextIndex];
        tabs.splice(tabContextIndex+1, 0, {...t});
        setActiveTab(tabContextIndex+1);
    }
    else if (action === 'close' && tabs.length > 1) closeTab(tabContextIndex);
    hideTabContextMenu();
});

// Initial render
renderTabs();
setActiveTab(0);
