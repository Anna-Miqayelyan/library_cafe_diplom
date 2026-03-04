// ═══════════════════════════════════════════════════════════
//  LIBRARY CAFÉ — app.js
// ═══════════════════════════════════════════════════════════

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
            { l: 'Home', p: 'home' },
            { l: 'Library', p: 'library' },
            { l: 'Café', p: 'cafe' },
            { l: 'Favorites', p: 'favorites' },
            { l: 'Reservations', p: 'reservations' },
            { l: 'AI Assistant', p: 'aiPage' },
            { l: 'Profile', p: 'profile' }
        ],
        wallet: true, cart: true
    },
    'Librarian': {
        badge: 'Librarian', cls: 'rp-l', home: 'libDash',
        nav: [{ l: 'Dashboard', p: 'libDash' }, { l: 'Library', p: 'library' }, { l: 'AI Assistant', p: 'aiPage' }, { l: 'Profile', p: 'profile' }],
        wallet: false, cart: false
    },
    'Café Staff': {
        badge: 'Café Staff', cls: 'rp-c', home: 'cafeDash',
        nav: [{ l: 'Dashboard', p: 'cafeDash' }, { l: 'Profile', p: 'profile' }],
        wallet: false, cart: false
    },
    'Admin': {
        badge: 'Admin', cls: 'rp-a', home: 'adminDash',
        nav: [
            { l: 'Dashboard', p: 'adminDash' },
            { l: 'Library', p: 'libDash' },
            { l: 'Café', p: 'cafeDash' },
            { l: 'AI Assistant', p: 'aiPage' },
            { l: 'Profile', p: 'profile' }
        ],
        wallet: false, cart: false
    }
};

// ─── INIT ────────────────────────────────────────────────────
window.onload = () => {
    loadStorage();
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
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainNav').style.display = 'block';
    document.getElementById('mainApp').style.display = 'block';

    const cfg = ROLES[currentUser.role] || ROLES['Student'];

    // Nav
    document.getElementById('navLinks').innerHTML = cfg.nav.map(n =>
        `<li><a onclick="showPage('${n.p}')">${n.l}</a></li>`
    ).join('');

    document.getElementById('logoBtn').onclick = () => showPage(cfg.home);

    // Role pill
    const rp = document.getElementById('rolePill');
    rp.textContent = cfg.badge;
    rp.className = 'role-pill ' + cfg.cls;

    // Wallet / cart
    document.getElementById('walletDisplay').style.display = cfg.wallet ? 'block' : 'none';
    document.getElementById('cartBtn').style.display = cfg.cart ? 'block' : 'none';
    if (cfg.wallet) document.getElementById('walletDisplay').textContent = fmt(currentUser.wallet) + ' AMD';

    // Hero greeting
    const hn = document.getElementById('heroName');
    if (hn) {
        const first = currentUser.name.split(' ')[0];
        hn.innerHTML = `Good to see <em>${first}</em> again.`;
    }

    await loadBooks();
    await loadMenu();

    showPage(cfg.home);

    const r = currentUser.role;
    if (r === 'Student') {
        renderStats(); renderTrending(); renderPopularMenu();
        renderLibrary('all'); renderCafe('all'); generateSeats();
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
    if (d) { const p = JSON.parse(d); currentUser = p.currentUser; cart = p.cart || []; reserved = p.reserved || []; favs = p.favs || []; }
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
            id: m.id, name: m.itemName, category: m.category, price: m.price
        }));
    }
}

// ─── NAV ─────────────────────────────────────────────────────
function showPage(id) {
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
    if (id === 'reservations') generateSeats();
    if (id === 'aiPage') initAiPage();
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
    return chip(s, m[s] || 'c-av');
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
    const copyBadge = total > 1 ? `<span style="font-size:.75rem;color:var(--smoke);margin-left:.4rem">${avail}/${total} copies</span>` : '';
    return `
  <div class="card">
    <button class="fav-btn ${fav ? 'on' : ''}" onclick="event.stopPropagation();toggleFav(${b.id},'book')">${fav ? '♥' : '♡'}</button>
    <div class="card-img">${imgHtml}</div>
    <div class="card-body">
      <div class="card-ey">${b.category} · Shelf ${b.shelf || '—'}</div>
      <div class="card-title">${b.title}</div>
      <div class="card-author">${b.author}</div>
      <div style="display:flex;align-items:center;gap:.3rem;margin:.3rem 0">${statusChip(b.status)}${copyBadge}</div>
      <div class="card-actions">
        ${avail > 0
            ? `<button class="btn btn-primary btn-sm" onclick="borrowBook(${b.id})">Borrow</button>`
            : `<button class="btn btn-ghost btn-sm" disabled>All Borrowed</button>`}
        ${b.pdfUrl ? `<button class="btn btn-ghost btn-sm" onclick="openPdf(${b.id})">📄 Read PDF</button>` : ''}
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
    return `
  <div class="card">
    <button class="fav-btn ${fav ? 'on' : ''}" onclick="event.stopPropagation();toggleFav(${m.id},'menu')">${fav ? '♥' : '♡'}</button>
    <div class="card-img">
      <div class="card-img-icon">${icon}</div>
    </div>
    <div class="card-body">
      <div class="card-ey">${m.category}</div>
      <div class="card-title">${m.name}</div>
      <div class="card-price">${fmt(m.price)} AMD</div>
      <div class="card-actions">
        <button class="btn btn-primary btn-sm" onclick="addToCart(${m.id})">Add to Cart</button>
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
    if (e1) e1.textContent = books.filter(b => b.available).length;
    if (e2) e2.textContent = menu.length;
}

function renderTrending() {
    const el = document.getElementById('trendingBooks'); if (!el) return;
    const s = books.slice(0, 4);
    el.innerHTML = s.length ? s.map(bookCard).join('') : empty('The collection is empty');
}

function renderPopularMenu() {
    const el = document.getElementById('popularMenu'); if (!el) return;
    const s = menu.slice(0, 4);
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
async function borrowBook(id) {
    if (!currentUser) { notify('Please sign in first', true); return; }
    const res = await api('/borrowings', { method: 'POST', body: JSON.stringify({ userId: currentUser.id, bookId: id }) });
    if (!res) return;
    if (!res.ok) { const e = await res.json(); notify(e.message || 'Could not borrow', true); return; }
    const b = await res.json();
    const bk = books.find(x => x.id === id);
    if (bk) { bk.available = false; bk.status = 'borrowed'; }
    notify(`"${b.bookTitle}" borrowed — due ${fmtDate(b.dueDate)}`);
    renderTrending(); renderLibrary('all'); renderStats();
}

// ─── CART ────────────────────────────────────────────────────
function addToCart(id) {
    const item = menu.find(m => m.id === id); if (!item) return;
    const ex = cart.find(c => c.id === id);
    if (ex) ex.qty++; else cart.push({ ...item, qty: 1 });
    updateCartBadge();
    notify(item.name + ' added to cart');
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
    document.getElementById('cartCount').textContent = cart.reduce((s, i) => s + i.qty, 0);
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
    if (currentUser.wallet < total) { notify('Insufficient balance', true); return; }

    const res = await api('/cafeorders', {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser.id, orderType: 'Dine-in', items: cart.map(i => ({ itemId: i.id, quantity: i.qty })) })
    });
    if (!res) return;
    if (!res.ok) { const e = await res.json(); notify(e.message || 'Order failed', true); return; }

    currentUser.wallet -= total;
    document.getElementById('walletDisplay').textContent = fmt(currentUser.wallet) + ' AMD';
    notify('Order placed — total ' + fmt(total) + ' AMD');
    cart = []; updateCartBadge(); closeModal('cartModal'); saveStorage();
}

// ─── SEATS ───────────────────────────────────────────────────
function generateSeats() {
    const el = document.getElementById('seatMap'); if (!el) return;
    el.innerHTML = '';
    for (let i = 1; i <= 40; i++) {
        const s = document.createElement('div');
        s.className = 'seat';
        s.textContent = i;
        if (reserved.includes(i)) {
            s.classList.add('mine');
        } else if (Math.random() > 0.35) {
            s.classList.add('avail');
            s.onclick = () => toggleSeat(i, s);
        } else {
            s.classList.add('taken');
        }
        el.appendChild(s);
    }
}

function toggleSeat(n, el) {
    if (reserved.includes(n)) {
        reserved = reserved.filter(x => x !== n);
        el.classList.replace('mine', 'avail');
        el.onclick = () => toggleSeat(n, el);
        notify('Seat ' + n + ' reservation cancelled');
    } else {
        reserved.push(n);
        el.classList.replace('avail', 'mine');
        el.onclick = null;
        notify('Seat ' + n + ' reserved');
    }
    saveStorage();
}

// ─── PROFILE ─────────────────────────────────────────────────
async function updateProfile() {
    if (!currentUser) return;
    document.getElementById('profName').textContent = currentUser.name;
    document.getElementById('profRole').textContent = currentUser.role;
    document.getElementById('profEmail').textContent = currentUser.email;
    document.getElementById('profWallet').textContent = fmt(currentUser.wallet) + ' AMD';
    document.getElementById('profFines').textContent = '0 AMD';

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
                    <button class="btn btn-ghost btn-sm" onclick="openEditBook(${b.id})">Edit</button>
                    <button class="btn-del" onclick="deleteBook(${b.id})">Delete</button>
                </td></tr>`;
        }).join('')
        : `<tr><td colspan="7" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">No books yet</td></tr>`;

    const br = await api('/borrowings?active=true');
    if (br && br.ok) {
        const data = await br.json();
        const tb = document.getElementById('libBorrTable');
        if (tb) tb.innerHTML = data.length
            ? data.map(b => `<tr><td>${b.userFullname}</td><td>${b.bookTitle}</td><td>${fmtDate(b.borrowDate)}</td><td>${fmtDate(b.dueDate)}</td><td>${statusChip(b.isOverdue ? 'Overdue' : 'available')}</td><td><button class="btn btn-primary btn-sm" onclick="returnBook(${b.id})">Return</button></td></tr>`).join('')
            : `<tr><td colspan="6" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">No active borrowings</td></tr>`;
    }
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
    document.getElementById('addBookTitle').innerHTML = 'Add New <em>Book</em>';
    document.getElementById('bkSubmitBtn').textContent = 'Add to Collection';
    ['bkTitle', 'bkAuthor', 'bkISBN', 'bkShelf'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('bkCount').value = 1;
    document.getElementById('bkCat').value = 'Fiction';
    clearBookImage(); clearBookPdf();
    openAddBook();
}
function openEditBook(id) {
    const b = books.find(x => x.id === id); if (!b) return;
    document.getElementById('bkEditId').value = b.id;
    document.getElementById('addBookTitle').innerHTML = 'Edit <em>Book</em>';
    document.getElementById('bkSubmitBtn').textContent = 'Save Changes';
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
    if (!title || !author || !isbn || !bookshelf) { notify('Please fill all required fields', true); return; }

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
    notify('Book returned successfully'); loadLibDash(); await loadBooks();
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
        ? menu.map(m => `<tr><td>${m.name}</td><td>${m.category}</td><td>${fmt(m.price)} AMD</td><td><button class="btn-del" onclick="deleteMenuItem(${m.id})">Delete</button></td></tr>`).join('')
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

async function addMenuItem() {
    const itemName = document.getElementById('miName').value.trim();
    const category = document.getElementById('miCat').value;
    const price = parseFloat(document.getElementById('miPrice').value);
    if (!itemName || !price) { notify('Please fill all fields', true); return; }

    const res = await api('/menuitems', { method: 'POST', body: JSON.stringify({ itemName, category, price }) });
    if (!res) return;
    if (!res.ok) { notify('Failed to add item', true); return; }
    notify('"' + itemName + '" added to menu');
    closeModal('addMenuModal');
    document.getElementById('miName').value = ''; document.getElementById('miPrice').value = '';
    loadCafeDash();
}

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
                <button class="btn btn-ghost btn-sm" onclick="openEditBook(${b.id})">Edit</button>
                <button class="btn-del" onclick="deleteBook(${b.id})">Delete</button>
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
                books = data.map(b => ({ id: b.id, title: b.title, author: b.author, category: b.category, isbn: b.isbn, shelf: b.bookshelf, available: b.isAvailable, status: b.isAvailable ? 'available' : 'borrowed' }));
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
function notify(msg, isError = false) {
    const el = document.getElementById('notif');
    const txt = document.getElementById('notifText');
    const ico = document.getElementById('notifIcon');
    txt.textContent = msg;
    ico.textContent = isError ? '×' : '—';
    ico.style.color = isError ? '#c8624a' : 'var(--gold)';
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3500);
}
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
function updateAiSuggest(text) {
    const titles = text.match(/"([^"]+)"/g) || [];
    if (!titles.length) return;
    const el = document.getElementById('aiSuggest');
    if (!el) return;
    el.innerHTML = titles.slice(0, 5).map(t => `
        <div class="ai-suggest-item">
            <span>📖</span>
            <span>${t.replace(/"/g, '')}</span>
        </div>`).join('');
}

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