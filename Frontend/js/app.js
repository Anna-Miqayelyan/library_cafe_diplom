const API = 'http://localhost:5226/api';

let books = [];
let menu = [];
let orders = [];
let currentUser = null;
let cart = [];
let reserved = [];
let favs = [];

// ─── ROLE CONFIG ────────────────────────────────────────────
const ROLES = {
    'Student': {
        badge: 'Student', cls: 'rp-s', home: 'home',
        nav: [
            { lk: 'home', p: 'home' },
            { lk: 'library', p: 'library' },
            { lk: 'cafe', p: 'cafe' },
            { lk: 'favorites', p: 'favorites' },
            { lk: 'reservations', p: 'reservations' },
            { lk: 'aiAssistant', p: 'aiPage' },
            { lk: 'profile', p: 'profile' }
        ],
        wallet: false, cart: false
    },
    'Librarian': {
        badge: 'Librarian', cls: 'rp-l', home: 'libDash',
        nav: [{ lk: 'dashboard', p: 'libDash' }, { lk: 'library', p: 'library' }, { lk: 'shelfMap', p: 'shelfMap' }, { lk: 'aiAssistant', p: 'aiPage' }, { lk: 'profile', p: 'profile' }],
        wallet: false, cart: false
    },
    'Café Staff': {
        badge: 'Café Staff', cls: 'rp-c', home: 'cafeDash',
        nav: [{ lk: 'dashboard', p: 'cafeDash' }, { lk: 'profile', p: 'profile' }],
        wallet: false, cart: false
    },
    'Admin': {
        badge: 'Admin', cls: 'rp-a', home: 'adminDash',
        nav: [
            { lk: 'dashboard', p: 'adminDash' },
            { lk: 'library', p: 'libDash' },
            { lk: 'cafe', p: 'cafeDash' },
            { lk: 'aiAssistant', p: 'aiPage' },
            { lk: 'profile', p: 'profile' }
            , { lk: 'shelfMap', p: 'shelfMap' }],
        wallet: false, cart: false
    }
};

// ─── INIT ────────────────────────────────────────────────────
window.onload = () => {
    var savedTheme = localStorage.getItem('lc_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    var tb = document.getElementById('themeToggle');
    if (tb) tb.textContent = savedTheme === 'dark' ? '☀' : '☾';
    loadStorage();
    // Apply language (default: Armenian)
    applyTranslations();
    document.querySelectorAll('.lang-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.lang === currentLang)
    );
    if (currentUser) showApp();
    else document.getElementById('authScreen').style.display = 'flex';
};

// ─── AUTH TABS ───────────────────────────────────────────────
function showLoginTab() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('regForm').style.display = 'none';
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabReg').classList.remove('active');
}

function showRegTab() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('regForm').style.display = 'block';
    document.getElementById('tabLogin').classList.remove('active');
    document.getElementById('tabReg').classList.add('active');
}

// ─── PASSWORD TOGGLE ─────────────────────────────────────────
function togglePw(inputId, btn) {
    const input = document.getElementById(inputId);
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    // Swap SVG icon
    btn.innerHTML = isHidden
        ? `<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" style="width:18px;height:18px">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
      </svg>`
        : `<svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" style="width:18px;height:18px">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
      </svg>`;
}

// ─── API ─────────────────────────────────────────────────────
async function api(path, opts = {}) {
    try {
        return await fetch(`${API}${path}`, {
            headers: { 'Content-Type': 'application/json' }, ...opts
        });
    } catch {
        notify('Cannot reach server. Is the backend running?', true);
        return null;
    }
}

// ─── LOGIN ───────────────────────────────────────────────────
async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPass').value;
    if (!email || !password) { notify('Please fill all fields', true); return; }

    const res = await api('/users/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (!res) return;
    if (!res.ok) { const e = await res.json(); notify(e.message || 'Invalid credentials', true); return; }

    const u = await res.json();
    currentUser = { id: u.id, name: u.fullname, email: u.email, role: u.role, wallet: 20000 };
    saveStorage(); showApp();
    notify('Welcome back, ' + currentUser.name.split(' ')[0]);
    if (typeof requestOrderNotifications !== 'undefined') requestOrderNotifications();
}

// ─── REGISTER ────────────────────────────────────────────────
async function handleRegister() {
    const fullname = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;
    if (!fullname || !email || !password) { notify('Please fill all fields', true); return; }

    const res = await api('/users/register', { method: 'POST', body: JSON.stringify({ fullname, email, password, role }) });
    if (!res) return;
    if (!res.ok) { const e = await res.json(); notify(e.message || 'Registration failed', true); return; }

    const u = await res.json();
    currentUser = { id: u.id, name: u.fullname, email: u.email, role: u.role, wallet: 20000 };
    saveStorage(); showApp();
    notify('Account created — welcome, ' + currentUser.name.split(' ')[0]);
}

// ─── LOGOUT ──────────────────────────────────────────────────
function logout() {
    currentUser = null; cart = []; reserved = []; favs = [];
    saveStorage();
    document.getElementById('mainNav').style.display = 'none';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPass').value = '';
    showLoginTab();
}

// ─── SHOW APP ────────────────────────────────────────────────
async function showApp() {
    if (typeof applyTranslations !== "undefined") applyTranslations();
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainNav').style.display = 'block';
    document.getElementById('mainApp').style.display = 'block';

    const cfg = ROLES[currentUser.role] || ROLES['Student'];

    // Nav
    document.getElementById('navLinks').innerHTML = cfg.nav.map(n =>
        `<li><a onclick="showPage('${n.p}')">${typeof t !== 'undefined' ? t(n.lk) : n.lk}</a></li>`
    ).join('');

    document.getElementById('logoBtn').onclick = () => showPage(cfg.home);

    // Role pill
    const rp = document.getElementById('rolePill');
    rp.textContent = cfg.badge;
    rp.className = 'role-pill ' + cfg.cls;



    // Hero greeting — typewriter effect
    const hn = document.getElementById('heroName');
    if (hn) {
        const first = currentUser.name.split(' ')[0];
        typewriterGreeting(hn, t('welcomeBack'), first);
    }

    await loadBooks();
    await loadMenu();

    if (!document.getElementById('cartFab')) {
        const fab = document.createElement('button');
        fab.id = 'cartFab';
        fab.title = 'View cart';
        fab.style.cssText = 'display:none;position:fixed;bottom:2rem;right:2rem;z-index:9000;width:60px;height:60px;background:#2c2825;color:#fff;border:none;border-radius:50%;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.3);flex-direction:column;gap:1px;font-family:inherit;transition:.2s';
        fab.onclick = () => openModal('cartModal');
        fab.innerHTML = '<span style="font-size:1.4rem;line-height:1">🛒</span><span class="cart-count-badge" style="font-size:.65rem;font-weight:800;line-height:1">0</span>';
        document.body.appendChild(fab);

        const modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.className = 'modal';
        modal.innerHTML = `<div class="modal-box" style="max-width:520px">
            <div class="modal-head">
                <h2>🛒 Your <em>Order</em></h2>
                <button class="m-close" onclick="closeModal('cartModal')"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" style="width:20px;height:20px"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg></button>
            </div>
            <div id="cartItems" style="max-height:55vh;overflow-y:auto"></div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:.9rem 0;border-top:1px solid var(--silk);margin-top:.5rem">
                <span style="font-weight:600;color:var(--smoke)">Total</span>
                <span style="font-size:1.15rem;font-weight:800;color:var(--ink)"><span id="cartTotal">0</span> AMD</span>
            </div>
            <button id="checkoutBtn" class="btn btn-primary" style="width:100%;padding:1rem;font-size:1rem" onclick="checkout()">Place Order (Cash)</button>
            <p style="text-align:center;font-size:.72rem;color:var(--mist);margin:.5rem 0 0">Payment is made in cash at the counter</p>
        </div>`;
        document.body.appendChild(modal);
    }
    requestOrderNotifications();
    startBorrowRequestPolling();

    showPage(cfg.home);

    const r = currentUser.role;
    if (r === 'Student') {
        renderStats(); renderTrending(); renderPopularMenu();
        renderLibrary('all'); renderCafe('all'); generateSeats();
        setTimeout(initCardTilt, 400);
        setTimeout(initCardTilt, 400);
    }
    if (r === 'Librarian' || r === 'Admin') loadLibDash();
    if (r === 'Café Staff' || r === 'Admin') loadCafeDash();
    if (r === 'Admin') loadAdminDash();
}

// ─── STORAGE ─────────────────────────────────────────────────
function saveStorage() {
    localStorage.setItem('lc2', JSON.stringify({ currentUser, cart, reserved, favs }));
}
function loadStorage() {
    const d = localStorage.getItem('lc2');
    if (d) {
        const p = JSON.parse(d); currentUser = p.currentUser; cart = p.cart || [];
        // Migrate old reserved format (numbers) to new format (objects)
        const raw = p.reserved || [];
        reserved = raw.map(r => typeof r === 'number' ? { seat: r, date: '', from: '', to: '' } : r);
        favs = p.favs || [];
    }
}

// ─── DATA ────────────────────────────────────────────────────
async function loadBooks() {
    const res = await api('/books');
    if (res && res.ok) {
        books = (await res.json()).map(b => ({
            id: b.id, title: b.title, author: b.author, category: b.category,
            isbn: b.isbn, shelf: b.bookshelf, available: b.isAvailable,
            status: b.isAvailable ? 'available' : 'borrowed',
            totalCount: b.totalCount || 1,
            borrowedCount: b.borrowedCount || 0,
            availableCount: b.availableCount || (b.isAvailable ? 1 : 0),
            imagePath: b.imagePath || null,
            pdfUrl: b.pdfUrl || null
        }));
    }
}

async function loadMenu() {
    const res = await api('/menuitems');
    if (res && res.ok) {
        menu = (await res.json()).map(m => ({
            id: m.id, name: m.itemName, category: m.category, price: m.price, imageUrl: m.imageUrl || null
        }));
    }
}

// ─── NAV ─────────────────────────────────────────────────────
function showPage(id) {
    if (id === 'home') setTimeout(initHeroCursorGlow, 150);
    if (id === 'home') setTimeout(initHeroCursorGlow, 100);
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pg = document.getElementById(id);
    if (pg) pg.classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', (a.getAttribute('onclick') || '').includes(`'${id}'`));
    });
    if (id === 'profile') updateProfile();
    if (id === 'favorites') renderFavs();
    if (id === 'library') renderLibrary('all');
    if (id === 'cafe') renderCafe('all');
    if (id === 'libDash') loadLibDash();
    if (id === 'cafeDash') loadCafeDash();
    if (id === 'adminDash') loadAdminDash();
    if (id === 'reservations') { initReservationPickers(); generateSeats(); initNotifBtn(); }
    if (id === 'shelfMap') renderShelfMap();
    if (id === 'aiPage') { initAiPage(); renderAiTrending(); }
}

// ─── HELPERS ─────────────────────────────────────────────────
const fmt = n => Number(n).toLocaleString('en');
const fmtDate = d => d ? new Date(d).toLocaleDateString() : '—';

function chip(text, cls) { return `<span class="chip ${cls}">${text}</span>`; }
function statusChip(s) {
    const m = {
        available: 'c-av', borrowed: 'c-bo', Overdue: 'c-bo', Pending: 'c-pe',
        Preparing: 'c-pr', Ready: 'c-re', Completed: 'c-do', Cancelled: 'c-ca'
    };
    const labels = {
        available: t('statusAvailable'), borrowed: t('statusBorrowed'),
        Overdue: t('statusOverdue'), Pending: t('statusPending'),
        Preparing: t('statusPreparing'), Ready: t('statusReady'),
        Completed: t('statusCompleted'), Cancelled: 'Cancelled'
    };
    return chip(labels[s] || s, m[s] || 'c-av');
}

// ─── BOOK CARD ───────────────────────────────────────────────
function bookCard(b) {
    const fav = favs.some(f => f.id === b.id && f.type === 'book');
    const cats = { Fiction: 'F', Technology: 'T', Science: 'S', 'Non-Fiction': 'N' };
    const imgHtml = b.imagePath
        ? `<img src="${b.imagePath}" alt="${b.title}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--r-sm) var(--r-sm) 0 0">`
        : `<div class="card-img-icon">${cats[b.category] || '◈'}</div>`;
    const avail = b.availableCount ?? (b.available ? 1 : 0);
    const total = b.totalCount || 1;
    const copyBadge = total > 1 ? `<span style="font-size:.75rem;color:var(--smoke);margin-left:.4rem">${avail}/${total} ${t("copies")}</span>` : '';
    // Corner ribbon
    let ribbon = '';
    if (b.availableCount === 1 || (b.totalCount === 1 && b.available)) {
        ribbon = '<div class="card-ribbon card-ribbon--warn">Last copy</div>';
    } else if (b.id <= 3) {
        ribbon = '<div class="card-ribbon">Popular</div>';
    } else if (b.totalCount && b.availableCount === b.totalCount) {
        ribbon = '<div class="card-ribbon">New</div>';
    }

    return `
  <div class="card">
    ${getBookRibbon(b)}
    <button class="fav-btn ${fav ? 'on' : ''}" onclick="event.stopPropagation();toggleFav(${b.id},'book')">${fav ? '♥' : '♡'}</button>
    <div class="card-img">${imgHtml}</div>
    <div class="card-body">
      <div class="card-ey">${b.category} · Shelf ${b.shelf || '—'}</div>
      <div class="card-title">${b.title}</div>
      <div class="card-author">${b.author}</div>
      <div style="display:flex;align-items:center;gap:.3rem;margin:.3rem 0">${statusChip(b.status)}${copyBadge}</div>
      <div class="card-actions">
        ${avail > 0
            ? `<button class="btn btn-primary btn-sm" onclick="requestBorrow(${b.id})">📋 Request</button>`
            : `<button class="btn btn-ghost btn-sm" onclick="joinQueue(${b.id})">${t("joinQueue")}</button>`}
        ${b.pdfUrl ? `<button class="btn btn-ghost btn-sm" onclick="openPdf(${b.id})">${t("readPdf")}</button>` : ''}
        <button class="btn btn-ghost btn-sm fav-action-btn ${fav ? 'fav-on' : ''}" onclick="event.stopPropagation();toggleFav(${b.id},'book')">${fav ? '♥' : '♡'}</button>
      </div>
    </div>
  </div>`;
}


// ─── PDF VIEWER ──────────────────────────────────────────────
function openPdf(id) {
    const b = books.find(x => x.id === id);
    if (!b || !b.pdfUrl) { notify('No PDF available for this book', true); return; }
    document.getElementById('pdfModalTitle').innerHTML = `${b.title} <em>PDF</em>`;
    document.getElementById('pdfViewer').src = b.pdfUrl;
    openModal('pdfModal');
}

// ─── MENU CARD ───────────────────────────────────────────────
function menuCard(m) {
    const fav = favs.some(f => f.id === m.id && f.type === 'menu');
    const cats = { 'Hot Drinks': '◉', 'Cold Drinks': '◎', 'Breakfast': '○', 'Sandwiches': '▣', 'Salads': '◈', 'Desserts': '◆' };
    const icon = cats[m.category] || '◈';
    const imgHtml = m.imageUrl
        ? `<img src="${m.imageUrl}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--r-sm) var(--r-sm) 0 0">`
        : `<div class="card-img-icon">${icon}</div>`;
    return `
  <div class="card">
    <button class="fav-btn ${fav ? 'on' : ''}" onclick="event.stopPropagation();toggleFav(${m.id},'menu')">${fav ? '♥' : '♡'}</button>
    <div class="card-img">${imgHtml}</div>
    <div class="card-body">
      <div class="card-ey">${m.category}</div>
      <div class="card-title">${m.name}</div>
      <div class="card-price">${fmt(m.price)} AMD</div>
      <div class="card-actions">
        <button class="btn btn-primary btn-sm" onclick="addToCart(${m.id})">${t("addToCart")}</button>
        <button class="btn btn-ghost btn-sm fav-action-btn ${fav ? 'fav-on' : ''}" onclick="event.stopPropagation();toggleFav(${m.id},'menu')">${fav ? '♥' : '♡'}</button>
      </div>
    </div>
  </div>`;
}

function empty(msg) {
    return `<div class="empty"><div class="empty-l">Nothing here yet</div><div class="empty-m">${msg}</div></div>`;
}

// ─── STUDENT RENDERS ─────────────────────────────────────────
function renderStats() {
    const e1 = document.getElementById('statBooks');
    const e2 = document.getElementById('statItems');
    if (e1) animateCounter(e1, books.filter(b => b.available).length, 1200);
    if (e2) animateCounter(e2, menu.length, 1200);
}

function renderTrending() {
    const el = document.getElementById('trendingBooks'); if (!el) return;
    const s = books.slice(0, 5);
    el.innerHTML = s.length ? s.map(bookCard).join('') : empty('The collection is empty');
}

function renderPopularMenu() {
    const el = document.getElementById('popularMenu'); if (!el) return;
    const s = menu.slice(0, 5);
    el.innerHTML = s.length ? s.map(menuCard).join('') : empty('No menu items yet');
}

function renderLibrary(cat) {
    const el = document.getElementById('libraryBooks'); if (!el) return;
    const f = cat === 'all' ? books : books.filter(b => b.category === cat);
    el.innerHTML = f.length ? f.map(bookCard).join('') : empty('Nothing in this category');
}

function renderCafe(cat) {
    const el = document.getElementById('cafeMenu'); if (!el) return;
    const f = cat === 'all' ? menu : menu.filter(m => m.category === cat);
    el.innerHTML = f.length ? f.map(menuCard).join('') : empty('Nothing in this category');
}

function filterBooks(cat, btn) {
    document.querySelectorAll('#library .tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderLibrary(cat);
}

function filterMenu(cat, btn) {
    document.querySelectorAll('#cafe .tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderCafe(cat);
}

// ─── FAVORITES ───────────────────────────────────────────────
function toggleFav(id, type) {
    const i = favs.findIndex(f => f.id === id && f.type === type);
    if (i > -1) { favs.splice(i, 1); notify('Removed from favorites'); }
    else { favs.push({ id, type }); notify('Added to favorites'); }
    saveStorage();
    renderTrending(); renderPopularMenu(); renderLibrary('all'); renderCafe('all');
    const fp = document.getElementById('favorites');
    if (fp && fp.classList.contains('active')) renderFavs();
}

function renderFavs() {
    const el = document.getElementById('favContent'); if (!el) return;
    if (!favs.length) { el.innerHTML = empty('Save books and menu items to find them here'); return; }
    const fb = favs.filter(f => f.type === 'book').map(f => books.find(b => b.id === f.id)).filter(Boolean);
    const fm = favs.filter(f => f.type === 'menu').map(f => menu.find(m => m.id === f.id)).filter(Boolean);
    let h = '';
    if (fb.length) h += `<div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--graphite);margin-bottom:1rem">Books</div><div class="cards-grid">${fb.map(bookCard).join('')}</div>`;
    if (fm.length) h += `<div style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:var(--graphite);margin:2rem 0 1rem">Café Items</div><div class="cards-grid">${fm.map(menuCard).join('')}</div>`;
    el.innerHTML = h;
}

// ─── BORROW ──────────────────────────────────────────────────
async function borrowBook(id) { await requestBorrow(id); }

async function requestBorrow(id) {
    if (!currentUser) { notify('Please sign in', true); return; }
    const book = books.find(b => b.id === id);
    if (!book) return;

    const res = await api('/borrowrequests', {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser.id, bookId: id, durationDays: 14 })
    });
    if (!res) return;
    if (!res.ok) { const e = await res.json().catch(() => ({})); notify(e.message || 'Could not submit request', true); return; }

    const req = await res.json();
    _seenBorrowStatuses[req.id] = 'Pending';
    notify('📋 Borrow request sent for "' + book.title + '". The librarian will review it shortly.');
    await loadBooks(); renderLibrary('all'); renderTrending();
}

// ─── CART ────────────────────────────────────────────────────
function addToCart(id) {
    const item = menu.find(m => m.id === id); if (!item) return;
    const ex = cart.find(c => c.id === id);
    if (ex) ex.qty++; else cart.push({ ...item, qty: 1 });
    updateCartBadge();
    notify('🛒 ' + item.name + ' added! Tap the cart to order.');
    saveStorage();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCartBadge(); renderCartModal(); saveStorage();
}

function changeQty(id, d) {
    const item = cart.find(c => c.id === id); if (!item) return;
    item.qty += d;
    if (item.qty <= 0) removeFromCart(id);
    else { updateCartBadge(); renderCartModal(); saveStorage(); }
}

function updateCartBadge() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-count-badge').forEach(el => el.textContent = count);
    const el = document.getElementById('cartCount'); if (el) el.textContent = count;
    const fab = document.getElementById('cartFab');
    if (fab) fab.style.display = count > 0 ? 'flex' : 'none';
}

function renderCartModal() {
    const el = document.getElementById('cartItems'); if (!el) return;
    if (!cart.length) { el.innerHTML = empty('Your cart is empty'); document.getElementById('cartTotal').textContent = '0'; return; }
    el.innerHTML = cart.map(item => `
    <div class="cart-row">
      <div>
        <div class="ci-n">${item.name}</div>
        <div class="ci-p">${fmt(item.price)} AMD each</div>
      </div>
      <div class="ci-ctrl">
        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
        <span class="qty-n">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        <button class="btn-del" style="margin-left:.5rem" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>`).join('');
    document.getElementById('cartTotal').textContent = fmt(cart.reduce((s, i) => s + i.price * i.qty, 0));
}

async function checkout() {
    if (!currentUser) { notify('Please sign in', true); return; }
    if (!cart.length) { notify('Your cart is empty', true); return; }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    const btn = document.getElementById('checkoutBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Placing order…'; }

    const res = await api('/cafeorders', {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser.id, orderType: 'Dine-in', items: cart.map(i => ({ itemId: i.id, quantity: i.qty })) })
    });
    if (btn) { btn.disabled = false; btn.textContent = 'Place Order (Cash)'; }
    if (!res) return;
    if (!res.ok) { const e = await res.json().catch(() => ({})); notify(e.message || 'Order failed', true); return; }

    const order = await res.json().catch(() => null);
    notify('✅ Order placed! Total: ' + fmt(total) + ' AMD — we will notify you when it is ready!');
    cart = []; updateCartBadge(); closeModal('cartModal'); saveStorage();
    if (order?.id) startOrderStatusPolling(order.id);
}

// ─── ORDER STATUS POLLING ─────────────────────────────────────────────
const _orderPollers = {};
function startOrderStatusPolling(orderId) {
    if (_orderPollers[orderId]) return;
    let lastStatus = 'Pending';
    _orderPollers[orderId] = setInterval(async () => {
        try {
            const res = await api('/cafeorders/' + orderId);
            if (!res || !res.ok) return;
            const o = await res.json();
            if (o.status !== lastStatus) {
                lastStatus = o.status;
                showOrderStatusBanner(orderId, o.status);
                if (Notification.permission === 'granted') {
                    const msgs = { Preparing: 'Your order is being prepared ☕', Ready: 'Your order is READY for pickup! 🔔', Completed: 'Order completed. Enjoy! ✅', Cancelled: 'Your order was cancelled ❌' };
                    if (msgs[o.status]) new Notification('Library Café — Order #' + orderId, { body: msgs[o.status], tag: 'order-' + orderId });
                }
                if (o.status === 'Completed' || o.status === 'Cancelled') { clearInterval(_orderPollers[orderId]); delete _orderPollers[orderId]; }
            }
        } catch { }
    }, 12000);
}
function showOrderStatusBanner(orderId, status) {
    const old = document.getElementById('order-banner-' + orderId); if (old) old.remove();
    var _om = { Preparing: '👨‍🍳 Order #' + orderId + ' is being prepared...', Ready: '🔔 Order #' + orderId + ' is READY for pickup!', Completed: '✅ Order #' + orderId + ' completed. Enjoy!', Cancelled: '❌ Order #' + orderId + ' was cancelled.' };
    if (_om[status]) lcNotifAdd(_om[status], 'order');
    const cfg = { Preparing: { bg: '#fff8e1', border: '#ffd54f', icon: '👨‍🍳', msg: 'Your order is being prepared…' }, Ready: { bg: '#e8f5e9', border: '#66bb6a', icon: '🔔', msg: 'Your order is READY for pickup!' }, Completed: { bg: '#e3f2fd', border: '#64b5f6', icon: '✅', msg: 'Enjoy!' }, Cancelled: { bg: '#fdecea', border: '#ef9a9a', icon: '❌', msg: 'Your order was cancelled.' } };
    const c = cfg[status]; if (!c) return;
    const b = document.createElement('div');
    b.id = 'order-banner-' + orderId;
    b.style.cssText = 'position:fixed;bottom:2rem;left:2rem;z-index:9998;background:' + c.bg + ';border:1.5px solid ' + c.border + ';border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.1);max-width:320px;padding:.85rem 1.1rem;display:flex;align-items:center;gap:.75rem;animation:slideUp .3s ease';
    b.innerHTML = '<span style="font-size:1.4rem">' + c.icon + '</span><div style="flex:1"><div style="font-size:.8rem;font-weight:700;color:#1a1a1a">Order #' + orderId + ' — ' + status + '</div><div style="font-size:.75rem;color:#555;margin-top:.1rem">' + c.msg + '</div></div><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:1rem;color:#999">✕</button>';
    document.body.appendChild(b);
    if (status !== 'Ready') setTimeout(() => { if (b.parentNode) { b.style.animation = 'slideDown .3s forwards'; setTimeout(() => b.remove(), 300); } }, 8000);
}
function requestOrderNotifications() {
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
}

// ─── BORROW REQUEST POLLING (student) ────────────────────────────────
let _borrowRequestPoller = null;
const _seenBorrowStatuses = {};

function startBorrowRequestPolling() {
    if (_borrowRequestPoller || !currentUser || currentUser.role !== 'Student') return;
    _borrowRequestPoller = setInterval(async () => {
        try {
            const res = await api('/borrowrequests/user/' + currentUser.id);
            if (!res || !res.ok) return;
            const reqs = await res.json();
            reqs.forEach(r => {
                const prev = _seenBorrowStatuses[r.id];
                if (prev && prev !== r.status) {
                    showBorrowRequestBanner(r);
                    if (Notification.permission === 'granted') {
                        const msgs = { Approved: 'Your request for "' + r.bookTitle + '" was APPROVED! Come pick it up 📚', Rejected: 'Your request for "' + r.bookTitle + '" was declined.', Taken: 'Enjoy reading "' + r.bookTitle + '"! ✅' };
                        if (msgs[r.status]) new Notification('Library Café — Book Request', { body: msgs[r.status], tag: 'breq-' + r.id });
                    }
                }
                _seenBorrowStatuses[r.id] = r.status;
            });
        } catch { }
    }, 10000);
}

function showBorrowRequestBanner(req) {
    const old = document.getElementById('breq-banner-' + req.id); if (old) old.remove();
    var _bm = { Approved: '✅ Book "' + req.bookTitle + '" approved! Come pick it up.', Rejected: '❌ Book "' + req.bookTitle + '" request was declined.', Taken: '📚 Enjoy "' + req.bookTitle + '"! Return by the due date.' };
    if (_bm[req.status]) lcNotifAdd(_bm[req.status], 'book');
    const cfg = {
        Approved: { bg: '#e8f5e9', border: '#66bb6a', icon: '✅', msg: 'Your request was approved! Come pick up "' + req.bookTitle + '".' },
        Rejected: { bg: '#fdecea', border: '#ef9a9a', icon: '❌', msg: 'Request for "' + req.bookTitle + '" was declined.' },
        Taken: { bg: '#e3f2fd', border: '#64b5f6', icon: '📚', msg: 'Enjoy "' + req.bookTitle + '"! Return by the due date.' }
    };
    const c = cfg[req.status]; if (!c) return;
    const b = document.createElement('div');
    b.id = 'breq-banner-' + req.id;
    b.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:9998;background:' + c.bg + ';border:1.5px solid ' + c.border + ';border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.1);max-width:320px;padding:.85rem 1.1rem;display:flex;align-items:center;gap:.75rem;animation:slideUp .3s ease';
    b.innerHTML = '<span style="font-size:1.4rem">' + c.icon + '</span><div style="flex:1"><div style="font-size:.8rem;font-weight:700;color:#1a1a1a">Book Request — ' + req.status + '</div><div style="font-size:.75rem;color:#555;margin-top:.1rem">' + c.msg + '</div></div><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:1rem;color:#999">✕</button>';
    document.body.appendChild(b);
    if (req.status !== 'Approved') setTimeout(() => { if (b.parentNode) { b.style.animation = 'slideDown .3s forwards'; setTimeout(() => b.remove(), 300); } }, 9000);
}

// ─── SEATS ───────────────────────────────────────────────────
// ─── RESERVATIONS ────────────────────────────────────────────
// Each reservation: { seat, date, from, to }
// "taken" seats = seats reserved by OTHER users for overlapping slot
// We simulate other users with a deterministic hash (no random)


function initReservationPickers() {
    const dateEl = document.getElementById('resDate');
    const fromEl = document.getElementById('resFrom');
    const toEl = document.getElementById('resTo');
    if (!dateEl || !fromEl || !toEl) return;
    if (!dateEl.value) dateEl.value = new Date().toISOString().split('T')[0];
    if (fromEl.options.length === 0) {
        for (let h = 9; h <= 20; h++) {
            const val = String(h).padStart(2, '0') + ':00';
            fromEl.add(new Option(val, val));
            toEl.add(new Option(val, val));
        }
        fromEl.value = '09:00';
        toEl.value = '10:00';
    }
}

// Simple deterministic hash — same inputs always give same output, no randomness
function deterministicHash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
    return Math.abs(h);
}


function getTakenSeats(date, from, to) {
    return [];
}

function slotsOverlap(f1, t1, f2, t2) {
    return f1 < t2 && t1 > f2;
}

function generateSeats() {
    initReservationPickers();
    const el = document.getElementById('seatMap');
    if (!el) return;

    const date = document.getElementById('resDate')?.value || '';
    const from = document.getElementById('resFrom')?.value || '09:00';
    const to = document.getElementById('resTo')?.value || '10:00';

    if (!date) { notify('Please select a date', true); return; }
    if (from >= to) { notify('End time must be after start time', true); return; }

    const HOURS = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

    const myTables = reserved.filter(r => r.date === date && r.from === from && r.to === to).map(r => r.seat);
    const myOverlap = reserved.filter(r => r.date === date && slotsOverlap(r.from, r.to, from, to) && !(r.from === from && r.to === to)).map(r => r.seat);
    const takenByOthers = getTakenSeats(date, from, to).filter(t => !myTables.includes(t) && !myOverlap.includes(t));

    // Per-table hourly state: 'mine' | 'other' | 'free'
    const occ = {};
    for (let t = 1; t <= 7; t++) { occ[t] = {}; HOURS.forEach(h => { occ[t][h] = 'free'; }); }

    // My reservations mark occupied hours
    reserved.filter(r => r.date === date).forEach(r => {
        HOURS.forEach((h, hi) => {
            if (hi >= HOURS.length - 1) return;
            const nxt = HOURS[hi + 1] + ':00';
            if (slotsOverlap(r.from, r.to, h + ':00', nxt) && occ[r.seat])
                occ[r.seat][h] = 'mine';
        });
    });
    //// Others' bookings (deterministic)
    //for (let t=1;t<=7;t++){
    //    HOURS.forEach((h,hi)=>{
    //        if (hi>=HOURS.length-1) return;
    //        const hf=h+':00', ht=HOURS[hi+1]+':00';
    //        if (deterministicHash(date+hf+ht+'tbl'+t)%3===0 && occ[t][h]==='free')
    //            occ[t][h]='other';
    //    });
    //}

    el.innerHTML = '';
    const names = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7'];
    const emojis = ['\u{1F4DA}', '\u{1F4DA}', '\u2615', '\u2615', '\u2615', '\u{1F4BB}', '\u{1F4BB}'];

    for (let t = 1; t <= 7; t++) {
        const isMine = myTables.includes(t);
        const isTaken = takenByOthers.includes(t) || myOverlap.includes(t);

        const card = document.createElement('div');
        card.className = 'tc ' + (isMine ? 'tc-mine' : isTaken ? 'tc-taken' : 'tc-free');

        // header
        card.innerHTML = `<div class="tc-hdr">
            <span class="tc-em">${emojis[t - 1]}</span>
            <span class="tc-nm">${names[t - 1]}</span>
            ${isMine ? '<span class="tc-tag tag-mine">\u2713 Yours</span>' : isTaken ? '<span class="tc-tag tag-taken">Unavailable</span>' : '<span class="tc-tag tag-free">Available</span>'}
        </div>`;

        // hour grid
        const grid = document.createElement('div');
        grid.className = 'tc-grid';
        HOURS.forEach((h, hi) => {
            if (hi >= HOURS.length - 1) return;
            const hf = h + ':00', ht = HOURS[hi + 1] + ':00';
            const state = occ[t][h];
            const cell = document.createElement('div');
            cell.className = 'tc-cell tc-' + state;
            cell.title = hf + '\u2013' + ht + ' \u2014 ' + (state === 'mine' ? 'Your booking' : state === 'other' ? 'Reserved' : 'Free \u2014 click to reserve');
            const lbl = document.createElement('span');
            lbl.className = 'tc-hlbl';
            lbl.textContent = h;
            cell.appendChild(lbl);
            if (state === 'free') {
                cell.onclick = () => { reserveSeat(t, date, hf, ht); generateSeats(); };
                cell.style.cursor = 'pointer';
            }
            grid.appendChild(cell);
        });
        card.appendChild(grid);

        // action button for selected slot
        if (isMine) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-ghost tc-btn';
            btn.textContent = '\u2715 Cancel ' + from + '\u2013' + to;
            btn.onclick = () => { cancelSeatReservation(t, date, from, to); generateSeats(); };
            card.appendChild(btn);
        } else if (!isTaken) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary tc-btn';
            btn.textContent = 'Reserve ' + from + '\u2013' + to;
            btn.onclick = () => { reserveSeat(t, date, from, to); generateSeats(); };
            card.appendChild(btn);
        }

        el.appendChild(card);
    }
    renderMyReservations();
}



function reserveSeat(seat, date, from, to) {
    reserved.push({ seat, date, from, to });
    saveStorage();
    notify('Table ' + seat + ' reserved ' + from + '–' + to);
    if (typeof scheduleReservationNotification === 'function')
        scheduleReservationNotification(seat, date, from);
}


function cancelSeatReservation(seat, date, from, to) {
    reserved = reserved.filter(r => !(r.seat === seat && r.date === date && r.from === from && r.to === to));
    saveStorage();
    notify('Table ' + seat + ' reservation cancelled');
    renderMyReservations();
}

function renderMyReservations() {
    const el = document.getElementById('myReservationsList');
    if (!el) return;
    if (!reserved.length) { el.innerHTML = ''; return; }
    const sorted = [...reserved].sort((a, b) => (a.date + a.from).localeCompare(b.date + b.from));
    const rows = sorted.map(r => {
        const oc = 'cancelSeatReservation(' + r.seat + ',\'' + r.date + '\',\'' + r.from + '\',\'' + r.to + '\');generateSeats()';
        return '<div class="my-res-row">'
            + '<div class="my-res-tbl">T' + r.seat + '</div>'
            + '<span class="my-res-info">' + r.date + ' &nbsp; ' + r.from + '–' + r.to + '</span>'
            + '<button class="my-res-del" onclick="' + oc + '" title="Cancel">✕</button>'
            + '</div>';
    }).join('');
    el.innerHTML = '<p class="my-res-title">' + t('myReservations') + '</p>'
        + '<div class="my-res-list">' + rows + '</div>';
}

// ─── BOOKSHELF MAP ────────────────────────────────────────────
async function renderShelfMap() {
    const el = document.getElementById('shelfMapContent'); if (!el) return;
    el.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--mist)">Loading…</div>';

    // Reload books to make sure we have fresh data
    await loadBooks();

    // Group books by shelf prefix (A, B, C etc)
    const shelves = {};
    books.forEach(b => {
        const shelf = b.shelf || 'Unknown';
        const section = shelf.match(/^[A-Za-z]+/)?.[0]?.toUpperCase() || '?';
        if (!shelves[section]) shelves[section] = [];
        shelves[section].push(b);
    });

    if (!Object.keys(shelves).length) {
        el.innerHTML = '<p style="text-align:center;padding:3rem;color:var(--mist)">No books in the system yet.</p>';
        return;
    }

    el.innerHTML = Object.entries(shelves).sort(([a], [b]) => a.localeCompare(b)).map(([section, sBooks]) => {
        const slots = {};
        sBooks.forEach(b => { slots[b.shelf] = slots[b.shelf] || []; slots[b.shelf].push(b); });
        return `
        <div style="margin-bottom:2rem">
            <div class="sec-head"><h2>Section <em>${section}</em></h2></div>
            <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-top:1rem">
                ${Object.entries(slots).sort(([a], [b]) => a.localeCompare(b)).map(([shelf, shelfBooks]) => `
                <div style="background:var(--paper);border:1px solid var(--silk);border-radius:var(--r-md);padding:1rem;min-width:160px;max-width:220px;flex:1">
                    <div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:600;color:var(--ink);margin-bottom:.6rem;padding-bottom:.4rem;border-bottom:2px solid var(--gold)">
                        📚 Shelf ${shelf}
                    </div>
                    ${shelfBooks.map(b => {
            const avail = b.availableCount ?? (b.available ? 1 : 0);
            const total = b.totalCount || 1;
            const color = avail > 0 ? 'var(--sage)' : 'var(--danger)';
            return `<div style="padding:.3rem 0;border-bottom:1px solid var(--silk);font-size:.82rem" title="${b.title} by ${b.author}">
                            <div style="font-weight:500;color:var(--graphite);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.title}</div>
                            <div style="color:var(--smoke);font-size:.75rem">${b.author} · <span style="color:${color}">${avail}/${total}</span></div>
                        </div>`;
        }).join('')}
                </div>`).join('')}
            </div>
        </div>`;
    }).join('');
}


// ─── PASSWORD CHANGE ─────────────────────────────────────────
document.addEventListener('input', function (e) {
    if (e.target.id !== 'pwNew') return;
    const v = e.target.value;
    const el = document.getElementById('pwStrength');
    if (!el) return;
    if (!v) { el.textContent = ''; return; }
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    const labels = [t('pwWeak'), t('pwFair'), t('pwGood'), t('pwStrong')];
    const colors = ['var(--danger)', '#f59e0b', '#3b82f6', 'var(--sage)'];
    el.textContent = '● ' + (labels[score - 1] || t('pwTooShort'));
    el.style.color = colors[score - 1] || 'var(--danger)';
});

async function changePassword() {
    const current = document.getElementById('pwCurrent')?.value?.trim() || '';
    const newPw = document.getElementById('pwNew')?.value || '';
    const confirm = document.getElementById('pwConfirm')?.value || '';

    if (!current) { notify('Enter your current password', true); return; }
    if (newPw.length < 8) { notify('New password must be at least 8 characters', true); return; }
    if (!/[A-Z]/.test(newPw)) { notify('Password must contain at least one uppercase letter', true); return; }
    if (!/[0-9]/.test(newPw)) { notify('Password must contain at least one number', true); return; }
    if (newPw !== confirm) { notify('Passwords do not match', true); return; }

    const res = await api(`/users/${currentUser.id}/change-password`, {
        method: 'POST',
        body: JSON.stringify({ currentPassword: current, newPassword: newPw })
    });
    if (!res) return;
    if (!res.ok) { const e = await res.json(); notify(e.message || 'Failed to change password', true); return; }
    notify(t('notifyPasswordUpdated'));
    ['pwCurrent', 'pwNew', 'pwConfirm'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
    });
    document.getElementById('pwStrength').textContent = '';
}

// ─── BOOK RESERVATION QUEUE ──────────────────────────────────
async function joinQueue(bookId) {
    if (!currentUser) { notify(t('notifySignIn'), true); return; }
    const book = books.find(b => b.id === bookId);
    const title = book ? book.title : 'this book';

    // Store queue locally until backend endpoint is ready
    const queued = JSON.parse(localStorage.getItem('lc_queue') || '[]');
    const already = queued.find(q => q.userId === currentUser.id && q.bookId === bookId);
    if (already) {
        notify(`You are already in the queue for "${title}"`, true);
        return;
    }
    queued.push({ userId: currentUser.id, bookId, title, joinedAt: new Date().toISOString() });
    localStorage.setItem('lc_queue', JSON.stringify(queued));
    notify(`Added to queue for "${title}". You will be notified when a copy is available.`);
}

async function leaveQueue(bookId) {
    const queued = JSON.parse(localStorage.getItem('lc_queue') || '[]');
    const updated = queued.filter(q => !(q.userId === currentUser.id && q.bookId === bookId));
    localStorage.setItem('lc_queue', JSON.stringify(updated));
    notify(t('notifyQueueLeft'));
}

async function leaveQueue(bookId) {
    const res = await api(`/bookreservations/cancel`, {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser.id, bookId })
    });
    if (!res) return;
    if (res.ok) { notify(t('notifyQueueLeft')); await loadBooks(); renderLibrary('all'); }
}

// ─── PROFILE ─────────────────────────────────────────────────
async function updateProfile() {
    if (!currentUser) return;
    document.getElementById('profName').textContent = currentUser.name;
    document.getElementById('profRole').textContent = currentUser.role;
    document.getElementById('profEmail').textContent = currentUser.email;
    const br = await api(`/users/${currentUser.id}/borrowings`);
    if (br && br.ok) {
        const data = await br.json();
        document.getElementById('profBorrowed').textContent = data.length;
        document.getElementById('borrowHist').innerHTML = data.length
            ? data.map(b => `<tr><td>${b.bookTitle}</td><td>${fmtDate(b.borrowDate)}</td><td>${fmtDate(b.dueDate)}</td><td>${statusChip(b.returnDate ? 'Completed' : b.isOverdue ? 'Overdue' : 'available')}</td></tr>`).join('')
            : `<tr><td colspan="4" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">No borrowing history yet</td></tr>`;
    }

    const or = await api(`/users/${currentUser.id}/orders`);
    if (or && or.ok) {
        const data = await or.json();
        document.getElementById('orderHist').innerHTML = data.length
            ? data.map(o => `<tr><td>${(o.items || []).map(i => `${i.itemName} ×${i.quantity}`).join(', ')}</td><td>${fmtDate(o.orderDate)}</td><td>${fmt(o.totalAmount)} AMD</td><td>${statusChip(o.status)}</td></tr>`).join('')
            : `<tr><td colspan="4" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">No orders yet</td></tr>`;
    }
}

// ─── LIBRARIAN ───────────────────────────────────────────────

// ─── LIBRARIAN: VIEW/MANAGE BORROWINGS FOR A BOOK ────────────
async function toggleBookBorrowed(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const res = await api(`/borrowings?active=true`);
    if (!res || !res.ok) { notify('Could not load borrowings', true); return; }
    const data = await res.json();
    const active = data.filter(b => b.bookId === bookId);

    const modal = document.getElementById('bookBorrowingsModal');
    const title = document.getElementById('bookBorrowingsTitle');
    const tbody = document.getElementById('bookBorrowingsTb');
    if (!modal || !tbody) return;

    title.innerHTML = `Borrowings: <em>${book.title}</em>`;
    if (!active.length) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:2rem;color:var(--mist)">No active borrowings for this book</td></tr>`;
    } else {
        tbody.innerHTML = active.map(b => `<tr>
            <td>${b.userFullname}</td>
            <td>${fmtDate(b.borrowDate)}</td>
            <td>${fmtDate(b.dueDate)}</td>
            <td>${b.isOverdue
                ? `<span style="color:var(--danger);font-weight:500">⚠ Overdue ${Math.floor((Date.now() - new Date(b.dueDate)) / (86400000))}d</span>`
                : statusChip('available')}
                <button class="btn btn-primary btn-sm" style="margin-left:.5rem" onclick="returnBook(${b.id});closeModal('bookBorrowingsModal');loadLibDash()">Return</button>
            </td>
        </tr>`).join('');
    }
    openModal('bookBorrowingsModal');
}


// ─── LIBRARIAN: BORROW BOOK FOR STUDENT ──────────────────────
async function openLibBorrowModal(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    const res = await api('/users');
    if (!res || !res.ok) { notify('Could not load users', true); return; }
    const users = await res.json();
    const students = users.filter(u => u.role === 'Student');
    document.getElementById('libBorrowTitle').innerHTML = `${t('borrow')}: <em>${book.title}</em>`;
    document.getElementById('libBorrowBookId').value = bookId;
    const sel = document.getElementById('libBorrowUser');
    sel.innerHTML = students.length
        ? students.map(u => `<option value="${u.id}">${u.fullname} (${u.email})</option>`).join('')
        : '<option disabled>No students registered</option>';
    document.getElementById('libBorrowDays').value = 14;
    openModal('libBorrowModal');
}

async function submitLibBorrow() {
    const bookId = parseInt(document.getElementById('libBorrowBookId').value);
    const userId = parseInt(document.getElementById('libBorrowUser').value);
    const days = parseInt(document.getElementById('libBorrowDays').value) || 14;
    if (!bookId || !userId) { notify(t('notifyFillFields'), true); return; }
    const res = await api('/borrowings', {
        method: 'POST',
        body: JSON.stringify({ userId, bookId, durationDays: days })
    });
    if (!res) return;
    if (!res.ok) { const e = await res.json().catch(() => ({})); notify(e.message || 'Could not borrow', true); return; }
    notify(t('notifyBorrowed'));
    closeModal('libBorrowModal');
    await loadLibDash();
}


// ─── 15-MINUTE RESERVATION NOTIFICATIONS ───────────────────────────────
function requestNotifPermission() {
    if (!('Notification' in window)) { notify('Notifications not supported', true); return; }
    Notification.requestPermission().then(perm => {
        const btn = document.getElementById('notifBtn');
        if (perm === 'granted') {
            if (btn) { btn.textContent = '🔔 Reminders On'; btn.classList.add('notif-on'); }
            notify('Reminders enabled! You will be notified 15 min before each reservation.');
            reserved.forEach(r => scheduleReservationNotification(r.seat, r.date, r.from));
        } else {
            if (btn) btn.textContent = '🔕 Reminders Off';
            notify('Permission denied', true);
        }
    });
}

function scheduleReservationNotification(tableNum, date, from) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const resTime = new Date(date + 'T' + from + ':00');
    const notifyAt = new Date(resTime.getTime() - 15 * 60 * 1000);
    const delay = notifyAt - new Date();
    if (delay <= 0) return;
    setTimeout(() => {
        const still = reserved.find(r => r.seat === tableNum && r.date === date && r.from === from);
        if (!still) return;
        showNotifBanner(tableNum, date, from);
        const n = new Notification('📚 Library Café — Reminder', {
            body: 'Table ' + tableNum + ' starts at ' + from + ' (15 min remaining)',
            tag: 'res-' + tableNum + '-' + date + '-' + from
        });
        n.onclick = () => { window.focus(); n.close(); };
    }, delay);
}

function showNotifBanner(tableNum, date, from) {
    const old = document.getElementById('res-notif-banner');
    if (old) old.remove();
    const b = document.createElement('div');
    b.id = 'res-notif-banner';
    b.className = 'res-notif-banner';
    b.innerHTML =
        '<div class="rnb-inner">' +
        '<span class="rnb-icon">🔔</span>' +
        '<div class="rnb-text">' +
        '<strong>Reservation in 15 minutes</strong>' +
        '<span>Table ' + tableNum + ' at ' + from + ' — ' + date + '</span>' +
        '</div>' +
        '<div class="rnb-actions">' +
        '<button class="btn btn-primary btn-sm" onclick="dismissNotifBanner()">Got it!</button>' +
        '<button class="btn btn-ghost btn-sm" onclick="cancelFromBanner(' + tableNum + ',\'' + date + '\',\'' + from + '\')">Cancel reservation</button>' +
        '</div>' +
        '</div>';
    document.body.appendChild(b);
    setTimeout(() => { const el = document.getElementById('res-notif-banner'); if (el) el.remove(); }, 60000);
}

function dismissNotifBanner() {
    const b = document.getElementById('res-notif-banner');
    if (b) { b.style.animation = 'slideDown .3s forwards'; setTimeout(() => b.remove(), 300); }
}

function cancelFromBanner(tableNum, date, from) {
    const r = reserved.find(r2 => r2.seat === tableNum && r2.date === date && r2.from === from);
    if (r) cancelSeatReservation(r.seat, r.date, r.from, r.to);
    dismissNotifBanner(); generateSeats();
}

function initNotifBtn() {
    const btn = document.getElementById('notifBtn');
    if (!btn) return;
    if (!('Notification' in window)) { btn.style.display = 'none'; return; }
    if (Notification.permission === 'granted') {
        btn.textContent = '🔔 Reminders On'; btn.classList.add('notif-on');
    }
}

async function loadLibDash() {
    await loadBooks();
    const tot = books.length;
    const avail = books.filter(b => b.available).length;
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('lsTotal', tot); set('lsAvail', avail); set('lsBorr', tot - avail);

    const ov = await api('/borrowings/overdue');
    if (ov && ov.ok) { const d = await ov.json(); set('lsOver', d.length); }

    const bt = document.getElementById('libBooksTable');
    if (bt) bt.innerHTML = books.length
        ? books.map(b => {
            const avail = b.availableCount ?? (b.available ? 1 : 0);
            const total = b.totalCount || 1;
            return `<tr>
                <td>${b.title}</td><td>${b.author}</td><td>${b.category}</td>
                <td>${b.isbn || '—'}</td><td>${b.shelf || '—'}</td>
                <td>${avail}/${total} ${statusChip(b.status)}</td>
                <td style="display:flex;gap:.4rem">
                    <button class="btn btn-ghost btn-sm" onclick="openEditBook(${b.id})">${t("edit")}</button>
                    <button class="btn btn-ghost btn-sm" onclick="toggleBookBorrowed(${b.id})">📋 ${t("activeBorrowings")}</button>
                    ${avail > 0
                    ? `<button class="btn btn-primary btn-sm" onclick="openLibBorrowModal(${b.id})">📤 ${t('borrow')}</button>`
                    : `<button class="btn btn-ghost btn-sm" style="opacity:.45" disabled>📤 ${t('allBorrowed')}</button>`}
                    <button class="btn-del" onclick="deleteBook(${b.id})">${t("delete")}</button>
                </td></tr>`;
        }).join('')
        : `<tr><td colspan="7" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">${t("libraryCatalog")}…</td></tr>`;

    const br = await api('/borrowings?active=true');
    if (br && br.ok) {
        const data = await br.json();
        const tb = document.getElementById('libBorrTable');
        if (tb) tb.innerHTML = data.length
            ? data.map(b => `<tr><td>${b.userFullname}</td><td>${b.bookTitle}</td><td>${fmtDate(b.borrowDate)}</td><td>${fmtDate(b.dueDate)}</td><td>${statusChip(b.isOverdue ? 'Overdue' : 'available')}</td><td><button class="btn btn-primary btn-sm" onclick="returnBook(${b.id})">${t("returnBook")}</button></td></tr>`).join('')
            : `<tr><td colspan="6" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">${t("activeBorrowings")}…</td></tr>`;
    }

    // Pending borrow requests
    await loadBorrowRequests();
}

async function loadBorrowRequests() {
    const res = await api('/borrowrequests?status=Pending');
    if (!res || !res.ok) return;
    const reqs = await res.json();

    // Also load approved (waiting for pickup)
    const resA = await api('/borrowrequests?status=Approved');
    const approved = (resA && resA.ok) ? await resA.json() : [];
    const all = [...reqs, ...approved];

    const tb = document.getElementById('libRequestsTb');
    if (!tb) return;

    if (!all.length) {
        tb.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--mist);font-style:italic">No pending requests</td></tr>`;
        return;
    }

    tb.innerHTML = all.map(r => {
        const isPending = r.status === 'Pending';
        const isApproved = r.status === 'Approved';
        return `<tr>
            <td>${r.userFullname}</td>
            <td>${r.bookTitle}<br><span style="font-size:.75rem;color:var(--mist)">${r.bookAuthor}</span></td>
            <td>${fmtDate(r.requestDate)}</td>
            <td>${r.durationDays} days</td>
            <td>
                <span class="chip ${isPending ? 'c-pe' : 'c-re'}" style="margin-right:.4rem">${r.status}</span>
                ${isPending ? `
                    <button class="btn btn-primary btn-sm" onclick="approveRequest(${r.id})">✅ Approve</button>
                    <button class="btn-del" style="margin-left:.3rem" onclick="rejectRequest(${r.id})">✕ Reject</button>
                ` : isApproved ? `
                    <button class="btn btn-primary btn-sm" onclick="markTaken(${r.id})">📚 Mark as Taken</button>
                ` : ''}
            </td>
        </tr>`;
    }).join('');
}

async function approveRequest(id) {
    const res = await api('/borrowrequests/' + id + '/approve', { method: 'PUT', body: '{}' });
    if (!res || !res.ok) { notify('Failed to approve', true); return; }
    notify('✅ Request approved — student can now pick up the book.');
    loadBorrowRequests();
}

async function rejectRequest(id) {
    if (!confirm('Reject this borrow request?')) return;
    const res = await api('/borrowrequests/' + id + '/reject', { method: 'PUT', body: JSON.stringify('') });
    if (!res || !res.ok) { notify('Failed to reject', true); return; }
    notify('Request rejected.');
    loadBorrowRequests();
}

async function markTaken(id) {
    const res = await api('/borrowrequests/' + id + '/taken', { method: 'PUT', body: '{}' });
    if (!res || !res.ok) { notify('Failed to mark as taken', true); return; }
    notify('📚 Book marked as borrowed!');
    loadBorrowRequests();
    await loadBooks(); loadLibDash();
}

// ─── FILE → BASE64 HELPER ──────────────────────────────────
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Resize + compress image before upload (max 800px, 70% quality)
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                const MAX = 800;
                let w = img.width, h = img.height;
                if (w > MAX || h > MAX) {
                    if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
                    else { w = Math.round(w * MAX / h); h = MAX; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
function previewBookImage(input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('bkImagePreviewImg').src = e.target.result;
        document.getElementById('bkImagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
}
function clearBookImage() {
    const f = document.getElementById('bkImageFile'); if (f) f.value = '';
    const p = document.getElementById('bkImagePreview'); if (p) p.style.display = 'none';
    const i = document.getElementById('bkImagePreviewImg'); if (i) i.src = '';
}
function previewBookPdf(input) {
    const file = input.files[0]; if (!file) return;
    const n = document.getElementById('bkPdfName'); if (n) n.textContent = '📄 ' + file.name;
    const p = document.getElementById('bkPdfPreview'); if (p) p.style.display = 'block';
}
function clearBookPdf() {
    const f = document.getElementById('bkPdfFile'); if (f) f.value = '';
    const p = document.getElementById('bkPdfPreview'); if (p) p.style.display = 'none';
    const n = document.getElementById('bkPdfName'); if (n) n.textContent = '';
}
function openAddBook() {
    document.getElementById('bkEditId').value = '';
    document.getElementById('addBookTitle').innerHTML = t('addNewBook');
    document.getElementById('bkSubmitBtn').textContent = t('addToCollection');
    ['bkTitle', 'bkAuthor', 'bkISBN', 'bkShelf'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('bkCount').value = 1;
    document.getElementById('bkCat').value = 'Fiction';
    clearBookImage(); clearBookPdf();
    openModal('addBookModal');
}
function openEditBook(id) {
    const b = books.find(x => x.id === id); if (!b) return;
    document.getElementById('bkEditId').value = b.id;
    document.getElementById('addBookTitle').innerHTML = t('editBook');
    document.getElementById('bkSubmitBtn').textContent = t('saveChanges');
    document.getElementById('bkTitle').value = b.title;
    document.getElementById('bkAuthor').value = b.author;
    document.getElementById('bkCat').value = b.category;
    document.getElementById('bkISBN').value = b.isbn || '';
    document.getElementById('bkShelf').value = b.shelf || '';
    document.getElementById('bkCount').value = b.totalCount || 1;
    clearBookImage(); clearBookPdf();
    if (b.imagePath) {
        document.getElementById('bkImagePreviewImg').src = b.imagePath;
        document.getElementById('bkImagePreview').style.display = 'block';
    }
    if (b.pdfUrl) {
        document.getElementById('bkPdfName').textContent = '📄 PDF already uploaded';
        document.getElementById('bkPdfPreview').style.display = 'block';
    }
    openModal('addBookModal');
}
async function submitBook() {
    const editId = document.getElementById('bkEditId')?.value || '';
    const title = document.getElementById('bkTitle')?.value.trim() || '';
    const author = document.getElementById('bkAuthor')?.value.trim() || '';
    const category = document.getElementById('bkCat')?.value || 'Fiction';
    const isbn = document.getElementById('bkISBN')?.value.trim() || '';
    const bookshelf = document.getElementById('bkShelf')?.value.trim() || '';
    const totalCount = parseInt(document.getElementById('bkCount')?.value) || 1;
    if (!title || !author || !isbn || !bookshelf) { notify(t('notifyFillFields'), true); return; }

    const imageFile = document.getElementById('bkImageFile')?.files[0];
    const pdfFile = document.getElementById('bkPdfFile')?.files[0];
    const btn = document.getElementById('bkSubmitBtn');
    const origText = btn.textContent;
    btn.textContent = 'Saving…'; btn.disabled = true;

    try {
        // Use FormData so files are sent as real streams — no base64 conversion, no slowdown
        const fd = new FormData();
        fd.append('title', title);
        fd.append('author', author);
        fd.append('category', category);
        fd.append('isbn', isbn);
        fd.append('bookshelf', bookshelf);
        fd.append('totalCount', totalCount);
        if (imageFile) fd.append('imageFile', imageFile);
        if (pdfFile) fd.append('pdfFile', pdfFile);

        const url = editId ? `${API}/books/${editId}/upload` : `${API}/books/upload`;
        const method = editId ? 'PUT' : 'POST';

        const res = await fetch(url, { method, body: fd });
        if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            notify(e.message || 'Failed to save book', true);
            btn.textContent = origText; btn.disabled = false;
            return;
        }
        notify(editId ? `"${title}" updated` : `"${title}" added to collection`);
        btn.textContent = origText; btn.disabled = false;
        closeModal('addBookModal');
        await loadBooks(); loadLibDash();
        if (currentUser.role === 'Admin') loadAdminDash();
    } catch (err) {
        notify('Error saving book: ' + err.message, true);
        btn.textContent = origText; btn.disabled = false;
    }
}
function addBook() { submitBook(); }

async function deleteBook(id) {
    if (!confirm('Delete this book from the collection?')) return;
    const res = await api(`/books/${id}`, { method: 'DELETE' });
    if (!res) return;
    if (!res.ok) { notify('Cannot delete this book', true); return; }
    notify('Book removed'); loadLibDash();
    if (currentUser.role === 'Admin') loadAdminDash();
}

async function returnBook(borrowingId) {
    const res = await api(`/borrowings/${borrowingId}/return`, { method: 'PUT', body: JSON.stringify({ returnDate: new Date().toISOString() }) });
    if (!res) return;
    if (!res.ok) { notify('Failed to process return', true); return; }
    notify(t('notifyReturned')); loadLibDash(); await loadBooks();
}

// ─── CAFÉ STAFF ──────────────────────────────────────────────
async function loadCafeDash() {
    await loadMenu();
    const res = await api('/cafeorders');
    if (res && res.ok) {
        orders = await res.json();
        const pending = orders.filter(o => o.status === 'Pending').length;
        const completed = orders.filter(o => o.status === 'Completed').length;
        const todayRev = orders.filter(o => new Date(o.orderDate).toDateString() === new Date().toDateString()).reduce((s, o) => s + o.totalAmount, 0);
        const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
        set('csTotal', orders.length); set('csPending', pending); set('csCompleted', completed); set('csRevenue', fmt(todayRev));
        renderOrdersTable(orders);
    }
    const mt = document.getElementById('cafeMenuTb');
    if (mt) mt.innerHTML = menu.length
        ? menu.map(m => `<tr>
            <td style="display:flex;align-items:center;gap:.6rem">
                ${m.imageUrl ? `<img src="${m.imageUrl}" style="width:34px;height:34px;object-fit:cover;border-radius:5px;flex-shrink:0">` : `<div style="width:34px;height:34px;background:var(--snow);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:.85rem;flex-shrink:0">☕</div>`}
                ${m.name}
            </td>
            <td>${m.category}</td><td>${fmt(m.price)} AMD</td>
            <td style="display:flex;gap:.4rem">
                <button class="btn btn-ghost btn-sm" onclick="openEditMenuItem(${m.id})">✏️ Edit</button>
                <button class="btn-del" onclick="deleteMenuItem(${m.id})">Delete</button>
            </td></tr>`).join('')
        : `<tr><td colspan="4" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">No menu items yet</td></tr>`;
}

function renderOrdersTable(data) {
    const tb = document.getElementById('cafeOrdersTb'); if (!tb) return;
    tb.innerHTML = data.length
        ? data.map(o => `<tr>
        <td>#${o.id}</td><td>${o.userFullname}</td>
        <td style="font-size:.8rem">${(o.items || []).map(i => `${i.itemName} ×${i.quantity}`).join(', ')}</td>
        <td>${fmt(o.totalAmount)} AMD</td><td>${o.orderType}</td>
        <td>${statusChip(o.status)}</td>
        <td><select class="status-select" onchange="updateStatus(${o.id},this.value)">
          ${['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map(s => `<option ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select></td>
      </tr>`).join('')
        : `<tr><td colspan="7" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">No orders yet</td></tr>`;
}

function filterOrders(status, btn) {
    document.querySelectorAll('#cafeDash .tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderOrdersTable(status === 'all' ? orders : orders.filter(o => o.status === status));
}

async function updateStatus(id, status) {
    const res = await api(`/cafeorders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    if (!res) return;
    if (!res.ok) { notify('Failed to update status', true); return; }
    notify(`Order #${id} → ${status}`); loadCafeDash();
}

function openAddMenuItem() {
    const t = document.getElementById('menuModalTitle'); const b = document.getElementById('menuModalSubmitBtn');
    if (t) t.textContent = 'Add Menu Item'; if (b) b.textContent = 'Add to Menu';
    ['miName', 'miPrice'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const cat = document.getElementById('miCat'); if (cat) cat.value = 'Hot Drinks';
    const prev = document.getElementById('miImagePreview'); if (prev) { prev.style.display = 'none'; prev.src = ''; }
    const fi = document.getElementById('miImage'); if (fi) fi.value = '';
    window._editingMenuId = null; openModal('menuModal');
}
function openEditMenuItem(id) {
    const m = menu.find(x => x.id === id); if (!m) return;
    const t = document.getElementById('menuModalTitle'); const b = document.getElementById('menuModalSubmitBtn');
    if (t) t.textContent = 'Edit Menu Item'; if (b) b.textContent = 'Save Changes';
    const nm = document.getElementById('miName'); if (nm) nm.value = m.name;
    const ct = document.getElementById('miCat'); if (ct) ct.value = m.category;
    const pr = document.getElementById('miPrice'); if (pr) pr.value = m.price;
    const prev = document.getElementById('miImagePreview');
    if (prev) { if (m.imageUrl) { prev.src = m.imageUrl; prev.style.display = 'block'; } else { prev.style.display = 'none'; prev.src = ''; } }
    const fi = document.getElementById('miImage'); if (fi) fi.value = '';
    window._editingMenuId = id; openModal('menuModal');
}
function previewMenuImage(input) {
    const file = input.files[0]; if (!file) return;
    const prev = document.getElementById('miImagePreview'); if (!prev) return;
    const reader = new FileReader();
    reader.onload = e => { prev.src = e.target.result; prev.style.display = 'block'; };
    reader.readAsDataURL(file);
}
async function submitMenuModal() {
    const itemName = (document.getElementById('miName')?.value || '').trim();
    const category = document.getElementById('miCat')?.value || 'Hot Drinks';
    const price = parseFloat(document.getElementById('miPrice')?.value || '0');
    const imageFile = document.getElementById('miImage')?.files[0];
    if (!itemName || !price) { notify('Please fill name and price', true); return; }
    const btn = document.getElementById('menuModalSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
    let imageUrl = null;
    if (imageFile) { try { imageUrl = await compressImage(imageFile); } catch { imageUrl = await readFileAsBase64(imageFile); } }
    const isEdit = !!window._editingMenuId;
    const payload = { itemName, category, price };
    if (imageUrl) payload.imageUrl = imageUrl;
    else if (isEdit) { const ex = menu.find(x => x.id === window._editingMenuId); if (ex?.imageUrl) payload.imageUrl = ex.imageUrl; }
    const url = isEdit ? '/menuitems/' + window._editingMenuId : '/menuitems';
    const method = isEdit ? 'PUT' : 'POST';
    const result = await api(url, { method, body: JSON.stringify(payload) });
    if (btn) { btn.disabled = false; btn.textContent = isEdit ? 'Save Changes' : 'Add to Menu'; }
    if (!result) return;
    if (!result.ok) { const e = await result.json().catch(() => ({})); notify(e.message || 'Error', true); return; }
    notify(isEdit ? '"' + itemName + '" updated!' : '"' + itemName + '" added!');
    closeModal('menuModal'); loadCafeDash();
}
async function addMenuItem() { openAddMenuItem(); }

async function deleteMenuItem(id) {
    if (!confirm('Remove this item from the menu?')) return;
    const res = await api(`/menuitems/${id}`, { method: 'DELETE' });
    if (!res) return;
    if (!res.ok) { notify('Cannot delete item', true); return; }
    notify('Menu item removed'); loadCafeDash();
}

// ─── ADMIN ───────────────────────────────────────────────────
async function loadAdminDash() {
    await loadBooks(); await loadMenu();
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };

    const ur = await api('/users');
    if (ur && ur.ok) {
        const users = await ur.json();
        set('asUsers', users.length);
        const tb = document.getElementById('adminUsersTb');
        if (tb) tb.innerHTML = users.map(u => `<tr><td>${u.fullname}</td><td>${u.email}</td><td>${rolePillHtml(u.role)}</td><td><button class="btn-del" onclick="deleteUser(${u.id})" ${u.id === currentUser.id ? 'disabled' : ''}>Delete</button></td></tr>`).join('');
    }

    set('asBooks', books.length);
    const bk = document.getElementById('adminBooksTb');
    if (bk) bk.innerHTML = books.map(b => {
        const avail = b.availableCount ?? (b.available ? 1 : 0);
        const total = b.totalCount || 1;
        return `<tr><td>${b.title}</td><td>${b.author}</td><td>${b.category}</td>
            <td>${avail}/${total} ${statusChip(b.status)}</td>
            <td style="display:flex;gap:.4rem">
                <button class="btn btn-ghost btn-sm" onclick="openEditBook(${b.id})">${t("edit")}</button>
                <button class="btn-del" onclick="deleteBook(${b.id})">${t("delete")}</button>
            </td></tr>`;
    }).join('');

    const or = await api('/cafeorders');
    if (or && or.ok) {
        const data = await or.json();
        const rev = data.reduce((s, o) => s + o.totalAmount, 0);
        set('asOrders', data.length); set('asRevenue', fmt(rev));
        const otb = document.getElementById('adminOrdersTb');
        if (otb) otb.innerHTML = data.map(o => `<tr><td>#${o.id}</td><td>${o.userFullname}</td><td>${fmt(o.totalAmount)} AMD</td><td>${fmtDate(o.orderDate)}</td><td>${statusChip(o.status)}</td></tr>`).join('');
    }
}

function rolePillHtml(role) {
    const m = { 'Student': 'rp-s', 'Librarian': 'rp-l', 'Café Staff': 'rp-c', 'Admin': 'rp-a' };
    return `<span class="role-pill ${m[role] || 'rp-s'}">${role}</span>`;
}

async function deleteUser(id) {
    if (!confirm('Delete this user account?')) return;
    const res = await api(`/users/${id}`, { method: 'DELETE' });
    if (!res) return;
    if (!res.ok) { notify('Cannot delete user', true); return; }
    notify('User deleted'); loadAdminDash();
}

// ─── SEARCH ──────────────────────────────────────────────────
async function performSearch() {
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    const cat = document.getElementById('searchCat').value;
    if (!q) { notify('Enter a search term', true); return; }

    if (cat === 'books' || cat === 'all') {
        const res = await api(`/books?search=${encodeURIComponent(q)}`);
        if (res && res.ok) {
            const data = await res.json();
            if (data.length) {
                books = data.map(b => ({ id: b.id, title: b.title, author: b.author, category: b.category, isbn: b.isbn, shelf: b.bookshelf, available: b.isAvailable, status: b.isAvailable ? 'available' : 'borrowed', totalCount: b.totalCount || 1, borrowedCount: b.borrowedCount || 0, availableCount: b.availableCount || (b.isAvailable ? 1 : 0), imagePath: b.imagePath || null, pdfUrl: b.pdfUrl || null }));
                showPage('library'); renderLibrary('all');
                notify(`Found ${data.length} book${data.length === 1 ? '' : 's'}`);
                return;
            }
        }
    }
    if (cat === 'menu' || cat === 'all') {
        const f = menu.filter(m => m.name.toLowerCase().includes(q));
        if (f.length) { showPage('cafe'); notify(`Found ${f.length} item${f.length === 1 ? '' : 's'}`); }
        else notify('No results found for "' + q + '"', true);
    }
}

// ─── MODALS ──────────────────────────────────────────────────
function openModal(id) {
    document.getElementById(id).classList.add('active');
    if (id === 'cartModal') renderCartModal();
}
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
window.onclick = e => { if (e.target.classList.contains('modal')) e.target.classList.remove('active'); };

// ─── NOTIFY ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
//  AI ASSISTANT — replace the entire AI section in app.js
// ═══════════════════════════════════════════════════════════

let aiInitialized = false;
let aiLastCall = 0; // timestamp of last API call

// Minimum ms between AI calls — prevents 429 rate limit errors
const AI_COOLDOWN = 3000;

function initAiPage() {
    if (aiInitialized) return;
    aiInitialized = true;
    renderAiTrending();
    // Don't auto-call on load — let user click instead
    const el = document.getElementById('historyWidget');
    if (el) el.innerHTML = `<div class="ai-hist-item">
        <span class="ai-hist-year">Tip</span>
        <span>Click "📅 Today in history" to load today's events.</span>
    </div>`;
}

// ─── RATE LIMIT GUARD ────────────────────────────────────────
function canCallAi() {
    const now = Date.now();
    if (now - aiLastCall < AI_COOLDOWN) {
        notify(`Please wait a moment before sending another message.`, true);
        return false;
    }
    aiLastCall = now;
    return true;
}

// ─── QUICK PROMPT BUTTONS ────────────────────────────────────
function aiQuick(type) {
    const borrowed = books.filter(b => !b.available).slice(0, 3).map(b => b.title).join(', ') || 'various books';
    const prompts = {
        recommend: `I'm a student at a library café. Books I've recently borrowed: ${borrowed}. Suggest 4 books I might enjoy, with a short reason for each.`,
        history: `What are 3 fascinating historical events that happened on ${new Date().toLocaleDateString('en', { month: 'long', day: 'numeric' })}? Keep each to 2 sentences.`,
        cafe: `I'm reading "${books.find(b => !b.available)?.title || 'a mystery novel'}" at a library café. Suggest 3 café drinks or snacks that pair well with this type of book.`,
        summary: `Give me a 3-sentence summary of a classic novel every student should know, and explain why it still matters today.`
    };
    document.getElementById('aiInput').value = prompts[type];
    sendAiMessage();
}

// ─── SEND MESSAGE ────────────────────────────────────────────
async function sendAiMessage() {
    if (!canCallAi()) return;

    const input = document.getElementById('aiInput');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';

    appendAiMsg(msg, 'user');
    const typingEl = appendAiTyping();

    try {
        const systemPrompt = `You are a friendly, knowledgeable assistant for a Library Café — a cosy space where students read books and enjoy coffee. Help with book recommendations, historical trivia, café pairings, and reading culture. Keep responses warm, concise and engaging. The library currently has books like: ${books.slice(0, 8).map(b => b.title).join(', ')}.`;

        const response = await api('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ message: msg, systemPrompt })
        });

        typingEl.remove();

        if (response && response.ok) {
            const data = await response.json();
            appendAiMsg(data.reply, 'bot');
            if (/recommend|suggest|should read/i.test(msg)) updateAiSuggest(data.reply);
        } else if (response && response.status === 429) {
            appendAiMsg('⚠️ Too many requests — the AI is rate limited. Please wait 30 seconds and try again.', 'bot');
        } else if (response && response.status === 503) {
            appendAiMsg('⚠️ AI is not configured. Ask your admin to add the Gemini:ApiKey to appsettings.json.', 'bot');
        } else {
            const err = response ? await response.json().catch(() => ({})) : {};
            appendAiMsg(`Sorry, something went wrong: ${err.message || 'Unknown error'}`, 'bot');
        }
    } catch (err) {
        typingEl.remove();
        appendAiMsg('Connection error. Please make sure the backend is running.', 'bot');
    }
}

// ─── MESSAGE BUILDERS ────────────────────────────────────────
function appendAiMsg(text, role) {
    const el = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = 'ai-msg' + (role === 'user' ? ' ai-msg-user' : '');
    div.innerHTML = `
        <div class="ai-avatar ${role === 'user' ? 'ai-avatar-user' : ''}">${role === 'user' ? 'ME' : 'AI'}</div>
        <div class="ai-bubble">${text.replace(/\n/g, '<br>')}</div>`;
    el.appendChild(div);
    el.scrollTop = el.scrollHeight;
    return div;
}

function appendAiTyping() {
    const el = document.getElementById('aiMessages');
    const div = document.createElement('div');
    div.className = 'ai-msg';
    div.innerHTML = `<div class="ai-avatar">AI</div>
        <div class="ai-bubble"><span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span></div>`;
    el.appendChild(div);
    el.scrollTop = el.scrollHeight;
    return div;
}

// ─── READING SUGGESTIONS SIDEBAR ─────────────────────────────
//function updateAiSuggest(text) {
//    const titles = text.match(/"([^"]+)"/g) || [];
//    if (!titles.length) return;
//    const el = document.getElementById('aiSuggest');
//    if (!el) return;
//    el.innerHTML = titles.slice(0, 5).map(t => `
//        <div class="ai-suggest-item">
//            <span>📖</span>
//            <span>${t.replace(/"/g, '')}</span>
//        </div>`).join('');
//}

// ─── TODAY IN HISTORY (only called when user clicks the button) ──
async function loadTodayHistory() {
    if (!canCallAi()) return;
    const el = document.getElementById('historyWidget');
    if (!el) return;
    el.innerHTML = '<div class="spin"></div>';
    try {
        const dateStr = new Date().toLocaleDateString('en', { month: 'long', day: 'numeric' });
        const response = await api('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({
                message: `Give me exactly 3 notable historical events that happened on ${dateStr} in different centuries. Return ONLY a JSON array like: [{"year":"1969","event":"Description here"}]. No extra text, no markdown.`
            })
        });
        if (response && response.ok) {
            const data = await response.json();
            const raw = (data.reply || '').replace(/```json|```/g, '').trim();
            const events = JSON.parse(raw);
            el.innerHTML = events.map(e => `
                <div class="ai-hist-item">
                    <span class="ai-hist-year">${e.year}</span>
                    <span>${e.event}</span>
                </div>`).join('');
        } else if (response && response.status === 429) {
            el.innerHTML = `<div class="ai-hist-item"><span class="ai-hist-year">⚠️</span><span>Rate limited — wait 30 seconds and try again.</span></div>`;
        } else {
            throw new Error('bad response');
        }
    } catch {
        el.innerHTML = `<div class="ai-hist-item">
            <span class="ai-hist-year">Did you know?</span>
            <span>Books have existed for over 5,000 years — the first written records date to ancient Mesopotamia.</span>
        </div>`;
    }
}


// ═══════════════════════════════════════════════════════════
//  VISUAL FEATURES
// ═══════════════════════════════════════════════════════════

// ── Typewriter greeting ──────────────────────────────────────
function typewriterGreeting(el, welcomeText, firstName) {
    el.innerHTML = '';
    el.style.borderRight = '2px solid var(--gold)';
    el.style.paddingRight = '4px';
    const full = welcomeText + ', ';
    let i = 0;
    function typeChar() {
        if (i < full.length) {
            el.textContent = full.slice(0, i + 1);
            i++;
            setTimeout(typeChar, 38);
        } else {
            el.innerHTML = full + '<em id="_twName" style="color:rgba(255,255,255,.5)"></em>!';
            const nameEl = document.getElementById('_twName');
            let j = 0;
            function typeName() {
                if (j < firstName.length) {
                    nameEl.textContent = firstName.slice(0, j + 1);
                    j++;
                    setTimeout(typeName, 55);
                } else {
                    el.style.borderRight = 'none';
                    el.style.paddingRight = '0';
                }
            }
            typeName();
        }
    }
    typeChar();
}

// ── Animated counter ─────────────────────────────────────────
function animateCounter(el, target, duration) {
    if (!el) return;
    const start = performance.now();
    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * ease).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
}

// ── Toast notification ───────────────────────────────────────
function notify(msg, isError) {
    isError = isError || false;
    var type = isError ? 'error' : 'info';
    var m = msg.toLowerCase();
    if (!isError) {
        if (m.indexOf('cart') > -1) type = 'cart';
        else if (m.indexOf('order') > -1) type = 'order';
        else if (m.indexOf('book') > -1 || m.indexOf('borrow') > -1) type = 'book';
        else if (m.indexOf('reserv') > -1 || m.indexOf('seat') > -1) type = 'seat';
        else if (m.indexOf('favor') > -1) type = 'fav';
    }
    lcNotifAdd(msg, type);
}

// ── Corner ribbons (called inside bookCard) ──────────────────
function getBookRibbon(b) {
    var avail = b.availableCount !== undefined ? b.availableCount : (b.available ? 1 : 0);
    var total = b.totalCount || 1;
    if (avail === 1 && total > 1) return '<div class="card-ribbon card-ribbon--warn">Last</div>';
    if (avail === 1 && total === 1 && !b.available) return '';
    if (b.id <= 3) return '<div class="card-ribbon">Popular</div>';
    return '';
}

// ── 3D Card Tilt ─────────────────────────────────────────────
function initCardTilt() {
    document.querySelectorAll('.card').forEach(function (card) {
        if (card._tiltInit) return;
        card._tiltInit = true;
        card.style.transition = 'transform .15s ease, box-shadow .15s ease';
        card.style.willChange = 'transform';

        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = 'perspective(600px) rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 10) + 'deg) scale(1.03)';
            card.style.boxShadow = (-x * 12) + 'px ' + (y * 12) + 'px 32px rgba(0,0,0,.22)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)';
            card.style.boxShadow = '';
        });
    });
}

// Re-init tilt after each render
var _origRenderLibrary = renderLibrary;
renderLibrary = function (cat) { _origRenderLibrary(cat); setTimeout(initCardTilt, 200); };
var _origRenderTrending = renderTrending;
renderTrending = function () { _origRenderTrending(); setTimeout(initCardTilt, 200); };
var _origRenderCafe = renderCafe;
renderCafe = function (cat) { _origRenderCafe(cat); setTimeout(initCardTilt, 200); };

// ── Hero cursor glow ─────────────────────────────────────────
function initHeroCursorGlow() {
    var hero = document.querySelector('.hero');
    if (!hero || hero._glowInit) return;
    hero._glowInit = true;

    var glow = document.createElement('div');
    glow.style.cssText = 'position:absolute;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.13) 0%,transparent 70%);pointer-events:none;transform:translate(-50%,-50%);z-index:0;opacity:0;transition:opacity .3s ease';
    hero.appendChild(glow);

    hero.addEventListener('mouseenter', function () { glow.style.opacity = '1'; });
    hero.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });
    hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        glow.style.left = (e.clientX - r.left) + 'px';
        glow.style.top = (e.clientY - r.top) + 'px';
    });
}

// ── Theme toggle ─────────────────────────────────────────────
function toggleTheme() {
    var html = document.documentElement;
    var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('lc_theme', next);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = next === 'dark' ? '☀' : '☾';
}
// ═══════════════════════════════════════════════════════════
//  NOTIFICATION PANEL
// ═══════════════════════════════════════════════════════════
var _lcNotifs = [];

var _lcNotifIcons = {
    info: '✓', error: '✕', cart: '🛒',
    order: '☕', book: '📚', seat: '🪑', fav: '♥'
};

function lcNotifAdd(msg, type) {
    type = type || 'info';
    _lcNotifs.unshift({
        id: Date.now() + '' + Math.floor(Math.random() * 9999),
        msg: msg,
        type: type,
        time: new Date(),
        read: false
    });
    if (_lcNotifs.length > 60) _lcNotifs.pop();

    // Red badge on bell
    var badge = document.getElementById('notifBadge');
    if (badge) badge.style.display = 'block';

    // Re-render list if panel already open
    var panel = document.getElementById('notifPanel');
    if (panel && panel.style.display === 'flex') _lcRenderList();
}

function _lcTimeAgo(date) {
    var s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 10) return 'Just now';
    if (s < 60) return s + 's ago';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return date.toLocaleDateString();
}

function _lcRenderList() {
    var list = document.getElementById('notifList');
    if (!list) return;
    if (_lcNotifs.length === 0) {
        list.innerHTML = '<div style="padding:3rem 1rem;text-align:center;color:var(--mist);font-size:.82rem;font-style:italic;">No notifications yet</div>';
        return;
    }
    list.innerHTML = _lcNotifs.map(function (n) {
        var ic = _lcNotifIcons[n.type] || '•';
        var bord = n.type === 'error' ? '#e07060' : 'var(--gold)';
        var bg = n.read ? 'transparent' : 'rgba(201,168,76,.06)';
        var ago = _lcTimeAgo(n.time);
        var safe = n.msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return '<div style="display:flex;align-items:flex-start;gap:10px;padding:11px 14px;border-bottom:1px solid var(--silver);background:' + bg + ';transition:background .15s"'
            + ' onmouseenter="this.style.background=\'var(--snow)\'"'
            + ' onmouseleave="this.style.background=\'' + (n.read ? 'transparent' : 'rgba(201,168,76,.06)') + '\'">'
            + '<span style="font-size:.95rem;flex-shrink:0;padding-top:1px;padding-left:8px;border-left:2.5px solid ' + bord + ';line-height:1.5">' + ic + '</span>'
            + '<div style="flex:1;min-width:0">'
            + '<div style="font-size:.8rem;color:var(--ink);line-height:1.45">' + safe + '</div>'
            + '<div style="font-size:.68rem;color:var(--mist);margin-top:2px">' + ago + '</div>'
            + '</div>'
            + '<button onclick="lcNotifDel(\'' + n.id + '\')" style="background:none;border:none;cursor:pointer;font-size:.75rem;color:var(--mist);flex-shrink:0;padding:0 3px"'
            + ' onmouseenter="this.style.color=\'var(--ink)\'"'
            + ' onmouseleave="this.style.color=\'var(--mist)\'">✕</button>'
            + '</div>';
    }).join('');
}

function lcNotifDel(id) {
    _lcNotifs = _lcNotifs.filter(function (n) { return n.id !== id; });
    _lcRenderList();
    if (_lcNotifs.filter(function (n) { return !n.read; }).length === 0) {
        var badge = document.getElementById('notifBadge');
        if (badge) badge.style.display = 'none';
    }
}

function clearAllNotifs() {
    _lcNotifs = [];
    _lcRenderList();
    var badge = document.getElementById('notifBadge');
    if (badge) badge.style.display = 'none';
}

function toggleNotifPanel() {
    var panel = document.getElementById('notifPanel');
    var overlay = document.getElementById('notifOverlay');
    if (!panel) return;
    if (panel.style.display === 'flex') {
        closeNotifPanel();
    } else {
        panel.style.display = 'flex';
        if (overlay) overlay.style.display = 'block';
        _lcRenderList();
        // mark all read, hide badge
        _lcNotifs.forEach(function (n) { n.read = true; });
        var badge = document.getElementById('notifBadge');
        if (badge) badge.style.display = 'none';
    }
}

function closeNotifPanel() {
    var panel = document.getElementById('notifPanel');
    var overlay = document.getElementById('notifOverlay');
    if (panel) panel.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}
// ─── AI TRENDING BOOKS ────────────────────────────────────────
function renderAiTrending() {
    var el = document.getElementById('aiTrendingBooks');
    if (!el) return;
    if (!books || books.length === 0) {
        el.innerHTML = '<p style="color:var(--mist);font-size:.82rem;font-style:italic;">No books loaded yet.</p>';
        return;
    }
    var sorted = books.slice().sort(function (a, b) {
        return ((b.borrowedCount || 0) - (a.borrowedCount || 0)) || (a.id - b.id);
    }).slice(0, 8);
    var medals = ['🥇', '🥈', '🥉'];
    el.innerHTML = sorted.map(function (b, i) {
        var avail = b.availableCount !== undefined ? b.availableCount : (b.available ? 1 : 0);
        var sCol = avail > 0 ? '#2d7a3a' : '#9b3a2a';
        var sBg = avail > 0 ? '#e8f5e9' : '#fdf2f0';
        var sTxt = avail > 0 ? 'Available' : 'Borrowed';
        var img = b.imagePath
            ? '<img src="' + b.imagePath + '" style="width:44px;height:60px;object-fit:cover;border-radius:4px;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,.12);">'
            : '<div style="width:44px;height:60px;background:var(--snow);border-radius:4px;border:1px solid var(--silver);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">📚</div>';
        var rank = medals[i] || ('<span style="font-size:.72rem;font-weight:700;color:var(--mist);">#' + (i + 1) + '</span>');
        var borrows = b.borrowedCount ? ' <span style="font-size:.65rem;color:var(--mist);">📖 ' + b.borrowedCount + '</span>' : '';
        var isLast = i === sorted.length - 1;
        return '<div style="display:flex;align-items:center;gap:12px;padding:11px 0;' + (isLast ? '' : 'border-bottom:1px solid var(--silver);') + '">'
            + '<span style="width:24px;text-align:center;flex-shrink:0;font-size:1.05rem;">' + rank + '</span>'
            + img
            + '<div style="flex:1;min-width:0;">'
            + '<div style="font-family:\'Cormorant Garamond\',serif;font-size:1rem;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + b.title + '</div>'
            + '<div style="font-size:.73rem;color:var(--smoke);margin-top:2px;">' + b.author + '</div>'
            + '<div style="margin-top:5px;">'
            + '<span style="font-size:.64rem;font-weight:600;color:' + sCol + ';background:' + sBg + ';padding:2px 8px;border-radius:99px;">' + sTxt + '</span>'
            + borrows
            + '</div>'
            + '</div>'
            + '</div>';
    }).join('');
}