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
            headers: { 'Content-Type': 'application/json' },
            ...opts
        });
    } catch (error) {
        notify('Cannot reach server. Is the backend running?', true);
        return null;
    }
}

// ─── LOGIN ───────────────────────────────────────────────────
// ─── REGISTER (Step 1 — send code) ───────────────────────────
async function handleRegister() {
    const fullname = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;
    const phone = document.getElementById('regPhone').value.trim();

    function showRegError(msg) {
        let el = document.getElementById('regError');
        if (!el) {
            el = document.createElement('p');
            el.id = 'regError';
            el.style.cssText = 'color:#c0392b;font-size:.82rem;margin:.5rem 0 0;text-align:center;padding:.5rem;background:#fdecea;border-radius:6px';
            document.getElementById('regForm').appendChild(el);
        }
        el.textContent = msg;
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearRegError() {
        const el = document.getElementById('regError');
        if (el) el.textContent = '';
    }

    if (!fullname) { showRegError('Please enter your full name.'); return; }
    if (!email) { showRegError(t('notifyEmailRequired')); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showRegError(t('notifyEmailInvalid')); return; }
    if (!password) { showRegError(t('notifyPasswordRequired')); return; }
    if (password.length < 6) { showRegError(t('notifyPasswordMinLength')); return; }
    if (!role) { showRegError(t('notifyRoleRequired')); return; }
    if (!phone) { showRegError(t('notifyPhoneRequired')); return; }
    if (phone.length < 8) { showRegError(t('notifyPhoneInvalid')); return; }

    clearRegError();

    const btn = document.getElementById('regBtn');
    btn.disabled = true;
    btn.textContent = 'Sending code…';

    const res = await api('/users/register/send-code', {
        method: 'POST',
        body: JSON.stringify({ fullname, email, password, role, phone })
    });

    btn.disabled = false;
    btn.textContent = 'Create Account';
    if (!res) return;
    if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        showRegError(e.message || 'Something went wrong. Please try again.');
        return;
    }

    // ── ALL roles go through email verification first ──────────
    // Save role so handleVerifyCode knows what to do after
    window._pendingEmail = email;
    window._pendingRole = role;

    document.getElementById('verifyEmailHint').textContent = email;
    document.getElementById('regForm').style.display = 'none';
    document.getElementById('verifyForm').style.display = 'block';
}
async function loadPendingApprovals() {
    const res = await api('/users/pending');
    if (!res || !res.ok) return;
    const pending = await res.json();

    const badge = document.getElementById('pendingApprovalBadge');
    if (badge) badge.textContent = pending.length > 0 ? pending.length : '';

    const tb = document.getElementById('adminPendingTb');
    if (!tb) return;

    if (!pending.length) {
        tb.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--mist);font-style:italic">${t('noPendingApprovals')}</td></tr>`;
        return;
    }

    tb.innerHTML = pending.map(u => `<tr>
        <td>${u.fullname}</td>
        <td>${u.email}</td>
        <td>${u.phoneNumber || '—'}</td>
        <td>${rolePillHtml(u.role)}</td>
        <td style="display:flex;gap:.5rem;padding:.5rem 0">
            <button class="btn btn-primary btn-sm" onclick="approveUser(${u.userId})">✅ ${t('approve')}</button>
            <button class="btn-del" onclick="rejectUser(${u.userId})">✕ ${t('reject')}</button>
        </td>
    </tr>`).join('');
}

async function approveUser(id) {
    const res = await api(`/users/${id}/approve`, { method: 'PUT', body: '{}' });
    if (!res || !res.ok) { notify(t('notifyApproveFailed'), true); return; }
    notify(t('notifyUserApproved'));
    loadPendingApprovals();
    loadAdminDash();
}

async function rejectUser(id) {
    if (!confirm(t('confirmRejectUser'))) return;
    const res = await api(`/users/${id}`, { method: 'DELETE' });
    if (!res || !res.ok) { notify(t('notifyRejectFailed'), true); return; }
    notify(t('notifyUserRejected'));
    loadPendingApprovals();
    loadAdminDash();
}
const errEl = document.getElementById('loginError');
if (errEl) errEl.textContent = '';
async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPass').value;
    if (!email || !password) { notify(t('notifyFillFields'), true); return; }

    const res = await api('/users/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (!res) return;
    if (!res.ok) {
        const e = await res.json();
        const msg = e.message || 'Invalid credentials';
        // Show inline error on the login form
        let errEl = document.getElementById('loginError');
        if (!errEl) {
            errEl = document.createElement('p');
            errEl.id = 'loginError';
            errEl.style.cssText = 'color:#c0392b;font-size:.85rem;margin:.75rem 0 0;text-align:center;padding:.6rem;background:#fdecea;border-radius:6px';
            document.getElementById('loginForm').appendChild(errEl);
        }
        errEl.textContent = msg;
        notify(msg, true);
        return;
    }
    const u = await res.json();
    currentUser = { id: u.id, name: u.fullname, email: u.email, role: u.role, phone: u.phone || '', wallet: 20000 };


    // ✅ ADD THIS - Fetch favorites after successful login
    //await loadUserFavorites(currentUser.id);

    saveStorage(); showApp();
    notify(t('welcomeBack') + ', ' + currentUser.name.split(' ')[0] + '!');
}
async function loadUserFavorites(userId) {
    try {
        const res = await api(`/favorites/${userId}`, { method: 'GET' });
        if (res && res.ok) {
            const favorites = await res.json();
            // Store favorites in a global variable or state
            window.userFavorites = favorites;
            console.log('Loaded favorites:', favorites);
        } else {
            window.userFavorites = [];
        }
    } catch (error) {
        console.error('Failed to load favorites:', error);
        window.userFavorites = [];
    }
}

// ✅ ADD THIS - Function to save favorite (when user clicks heart/star)
async function addFavorite(itemId, itemType) {
    if (!currentUser) {
        notify('Please login to add favorites', true);
        return false;
    }

    const res = await api('/favorites', {
        method: 'POST',
        body: JSON.stringify({
            userId: currentUser.id,
            itemId: itemId,
            itemType: itemType
        })
    });

    if (res && res.ok) {
        await loadUserFavorites(currentUser.id); // Reload favorites
        notify('Added to favorites!');
        return true;
    }
    return false;
}

// ✅ ADD THIS - Function to remove favorite
async function removeFavorite(itemId, itemType) {
    if (!currentUser) return false;

    const res = await api('/favorites', {
        method: 'DELETE',
        body: JSON.stringify({
            userId: currentUser.id,
            itemId: itemId,
            itemType: itemType
        })
    });

    if (res && res.ok) {
        await loadUserFavorites(currentUser.id); // Reload favorites
        notify('Removed from favorites');
        return true;
    }
    return false;
}

// ✅ ADD THIS - Helper to check if an item is favorited
function isFavorite(itemId, itemType) {
    if (!window.userFavorites) return false;
    return window.userFavorites.some(fav =>
        fav.itemId === itemId && fav.itemType === itemType
    );
}
//    function clearRegError() {
//        const el = document.getElementById('regError');
//        if (el) el.textContent = '';
//    }

//    if (!fullname) { showRegError('Please enter your full name.'); return; }
//    if (!email) { showRegError('Please enter your email address.'); return; }

//    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//    if (!emailRegex.test(email)) { showRegError('Please enter a valid email (e.g. name@gmail.com)'); return; }

//    if (!password) { showRegError(t('notifyPasswordRequired')); return; }
//    if (password.length < 6) { showRegError('Password must be at least 6 characters.'); return; }
//    if (!role) { showRegError('Please select a role.'); showRegError(t('notifyPasswordRequired'));return; }

//    clearRegError();

//    const btn = document.getElementById('regBtn');
//    btn.disabled = true; btn.textContent = 'Sending code…';

//    const res = await api('/users/register/send-code', {
//        method: 'POST',
//        body: JSON.stringify({ fullname, email, password, role })
//    });

//    btn.disabled = false; btn.textContent = 'Create Account';
//    if (!res) return;
//    if (!res.ok) {
//        const e = await res.json().catch(() => ({}));
//        showRegError(e.message || 'Something went wrong. Please try again.');
//        return;
//    }

//    document.getElementById('verifyEmailHint').textContent = email;
//    document.getElementById('regForm').style.display = 'none';
//    document.getElementById('verifyForm').style.display = 'block';
//    window._pendingEmail = email;
//}
// Step 2 — verify code
async function handleVerifyCode() {
    const code = document.getElementById('verifyCode').value.trim();

    function showVerifyError(msg) {
        let el = document.getElementById('verifyError');
        if (!el) {
            el = document.createElement('p');
            el.id = 'verifyError';
            el.style.cssText = 'color:#c0392b;font-size:.82rem;margin:.5rem 0 0;text-align:center;padding:.5rem;background:#fdecea;border-radius:6px';
            document.getElementById('verifyForm').appendChild(el);
        }
        el.textContent = msg;
    }

    if (!code || code.length < 6) { showVerifyError(t('notifyEnterCode')); return; }

    const res = await api('/users/register/verify', {
        method: 'POST',
        body: JSON.stringify({ email: window._pendingEmail, code })
    });
    if (!res) return;
    if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        showVerifyError(e.message || 'Invalid code. Please try again.');
        return;
    }

    const u = await res.json();

    // ── Roles that need admin approval ─────────────────────────
    const needsApproval = ['Librarian', 'Café Staff', 'Admin'].includes(window._pendingRole);
    if (needsApproval) {
        // User is now saved in DB with IsApproved=false — admin will see them
        document.getElementById('verifyForm').style.display = 'none';
        document.getElementById('pendingApprovalMsg').style.display = 'block';
        return;
    }

    // ── Student — log straight in ───────────────────────────────
    currentUser = {
        id: u.id,
        name: u.fullname,
        email: u.email,
        role: u.role,
        phone: u.phone || '',
        wallet: 20000
    };
    saveStorage();
    showApp();
    notify('✅ ' + t('verifyAccount') + ' — ' + t('welcomeBack') + ', ' + currentUser.name.split(' ')[0] + '!');
}

// ─── LOGOUT ──────────────────────────────────────────────────
function logout() {
    if (currentUser) localStorage.setItem('lc_favs_' + currentUser.id, JSON.stringify(favs));
    currentUser = null; cart = []; reserved = []; favs = [];
    localStorage.setItem('lc2', JSON.stringify({ currentUser, cart, reserved }));
    document.getElementById('mainNav').style.display = 'none';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPass').value = '';
    showLoginTab();
}
// ─── TYPEWRITER GREETING ─────────────────────────────────────
function typewriterGreeting(el, welcomeText, firstName) {
    if (!el) return;
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
            if (nameEl) {
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
    }
    typeChar();
}
// ─── SHOW APP ────────────────────────────────────────────────
async function showApp() {
    if (typeof applyTranslations !== "undefined") applyTranslations();
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('mainNav').style.display = 'block';
    document.getElementById('mainApp').style.display = 'block';

    const cfg = ROLES[currentUser.role] || ROLES['Student'];

    document.getElementById('navLinks').innerHTML = cfg.nav.map(n =>
        `<li><a onclick="showPage('${n.p}')">${typeof t !== 'undefined' ? t(n.lk) : n.lk}</a></li>`
    ).join('');
    document.getElementById('logoBtn').onclick = () => showPage(cfg.home);

    const rp = document.getElementById('rolePill');
    rp.textContent = cfg.badge;
    rp.className = 'role-pill ' + cfg.cls;

    const hn = document.getElementById('heroName');
    if (hn) {
        const first = currentUser.name.split(' ')[0];
        typewriterGreeting(hn, t('welcomeBack'), first);
    }

    await loadBooks();
    await loadMenu();

    favs = [];
    const favRes = await api('/favorites/' + currentUser.id);
    console.log('favRes status:', favRes?.status);
    if (favRes && favRes.ok) {
        const data = await favRes.json();
        console.log('RAW favorites from API:', JSON.stringify(data));
        favs = data.map(f => ({ id: f.itemId, type: f.itemType }));
        console.log('Mapped favs:', JSON.stringify(favs));
    }

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
        <h2>${t('yourCart')}</h2>
        <button class="m-close" onclick="closeModal('cartModal')">...</button>
    </div>
    <div id="cartItems" style="max-height:55vh;overflow-y:auto"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:.9rem 0;border-top:1px solid var(--silk);margin-top:.5rem">
        <span style="font-weight:600;color:var(--smoke)">${t('total')}</span>
        <span style="font-size:1.15rem;font-weight:800;color:var(--ink)"><span id="cartTotal">0</span> ${t('amd')}</span>
    </div>
    <button id="checkoutBtn" class="btn btn-primary" style="width:100%;padding:1rem;font-size:1rem" onclick="checkout()">${t('placeOrderCash')}</button>
    <p style="text-align:center;font-size:.72rem;color:var(--mist);margin:.5rem 0 0">${t('paymentCashAtCounter')}</p>
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
    }
    if (r === 'Librarian' || r === 'Admin') loadLibDash();
    if (r === 'Café Staff' || r === 'Admin') loadCafeDash();
    if (r === 'Admin') { loadAdminDash(); _lastUserCount = 0; _lastUserList = []; setTimeout(_checkNewRegistrations, 2000); }
}
    // ─── STORAGE ─────────────────────────────────────────────────
    function saveStorage() {
        localStorage.setItem('lc2', JSON.stringify({ currentUser, cart, reserved }));
        if (currentUser) localStorage.setItem('lc_favs_' + currentUser.id, JSON.stringify(favs));
    }

    function loadStorage() {
        const d = localStorage.getItem('lc2');
        if (d) {
            const p = JSON.parse(d);
            currentUser = p.currentUser;
            cart = p.cart || [];
            const raw = p.reserved || [];
            reserved = raw.map(r => typeof r === 'number' ? { seat: r, date: '', from: '', to: '' } : r);
        }
        favs = [];
        if (currentUser) {
            const f = localStorage.getItem('lc_favs_' + currentUser.id);
            favs = f ? JSON.parse(f) : [];
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
                id: m.id, name: m.itemName, type: m.category, price: m.price, imageUrl: m.imageUrl || null
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

        // Կատեգորիաների թարգմանություն
        const categoryMap = {
            'Fiction': t('fiction'),
            'Non-Fiction': t('nonFiction'),
            'Technology': t('technology'),
            'Science': t('science')
        };
        const categoryHy = categoryMap[b.category] || b.category;

        const cats = { Fiction: 'F', Technology: 'T', Science: 'S', 'Non-Fiction': 'N' };
        const imgHtml = b.imagePath
            ? `<img src="${b.imagePath}" alt="${b.title}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--r-sm) var(--r-sm) 0 0">`
            : `<div class="card-img-icon">${cats[b.category] || '◈'}</div>`;
        const avail = b.availableCount ?? (b.available ? 1 : 0);
        const total = b.totalCount || 1;
        const copyBadge = total > 1 ? `<span style="font-size:.75rem;color:var(--smoke);margin-left:.4rem">${avail}/${total} ${t("copies")}</span>` : '';

        // Shelf-ի թարգմանություն
        const shelfText = b.shelf ? `${t('shelf')} ${b.shelf}` : t('noShelf');

        return `
  <div class="card">
    ${getBookRibbon(b)}
    <button class="fav-btn ${fav ? 'on' : ''}" onclick="event.stopPropagation();toggleFav(${b.id},'book')">${fav ? '♥' : '♡'}</button>
    <div class="card-img">${imgHtml}</div>
    <div class="card-body">
      <div class="card-ey">${categoryHy} · ${shelfText}</div>
      <div class="card-title">${b.title}</div>
      <div class="card-author">${b.author}</div>
      <div style="display:flex;align-items:center;gap:.3rem;margin:.3rem 0">${statusChip(b.status)}${copyBadge}</div>
      <div class="card-actions">
        ${avail > 0
                ? `<button class="btn btn-primary btn-sm" onclick="requestBorrow(${b.id})">📋 ${t('request')}</button>`
                : isInQueue(b.id)
                    ? `<button class="btn btn-ghost btn-sm" onclick="leaveQueue(${b.id})">✕ ${t('leaveQueue')}</button>`
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

        // Կատեգորիաների թարգմանություն
        const categoryMap = {
            'Hot Drinks': t('hotDrinks'),
            'Cold Drinks': t('coldDrinks'),
            'Breakfast': t('breakfast'),
            'Sandwiches': t('sandwiches'),
            'Salads': t('salads'),
            'Desserts': t('desserts')
        };
        const categoryHy = categoryMap[m.category] || m.category;

        // Icon-ները մնում են նույնը (դրանք պատկերակներ են)
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
      <div class="card-ey">${categoryHy}</div>
      <div class="card-title">${m.name}</div>
      <div class="card-price">${fmt(m.price)} ${t('amd')}</div>
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
async function toggleFav(id, type) {
    if (!currentUser) return;
    const i = favs.findIndex(f => f.id === id && f.type === type);
    if (i > -1) {
        favs.splice(i, 1);
        await api('/favorites', {
            method: 'DELETE',
            body: JSON.stringify({ userId: currentUser.id, itemId: id, itemType: type })
        });
        notify(t('notifyFavRemoved'));
    } else {
        favs.push({ id, type });
        await api('/favorites', {
            method: 'POST',
            body: JSON.stringify({ userId: currentUser.id, itemId: id, itemType: type })
        });
        notify(t('notifyFavAdded'));
    }
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

        // Find the button and show click feedback
        const buttons = document.querySelectorAll(`button[onclick*="requestBorrow(${id})"]`);
        buttons.forEach(btn => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓ ' + t('sent');
            btn.style.background = 'var(--sage)';
            setTimeout(() => {
                if (btn && btn.parentNode) {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }
            }, 1000);
        });

        const res = await api('/borrowrequests', {
            method: 'POST',
            body: JSON.stringify({ userId: currentUser.id, bookId: id, durationDays: 14 })
        });
        if (!res) return;
        if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            notify(e.message || 'Could not submit request', true);
            return;
        }

        const req = await res.json();
        _seenBorrowStatuses[req.id] = 'Pending';
        notify('📋 ' + t('borrowRequestSent').replace('{title}', book.title));
        await loadBooks();
        renderLibrary('all');
        renderTrending();
    }

    // ─── CART ────────────────────────────────────────────────────
    function addToCart(id) {
        const item = menu.find(m => m.id === id); if (!item) return;
        const ex = cart.find(c => c.id === id);
        if (ex) ex.qty++; else cart.push({ ...item, qty: 1 });
        updateCartBadge();
        notify(t('notifyCartAdded').replace('{name}', item.name));

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
        if (!cart.length) { el.innerHTML = empty(t('cartEmpty')); document.getElementById('cartTotal').textContent = '0'; return; }
        el.innerHTML = cart.map(item => `
    <div class="cart-row">
      <div>
        <div class="ci-n">${item.name}</div>
        <div class="ci-p">${fmt(item.price)} ${t('amdPerItem')}</div>
      </div>
      <div class="ci-ctrl">
        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
        <span class="qty-n">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        <button class="btn-del" style="margin-left:.5rem" onclick="removeFromCart(${item.id})">${t('remove')}</button>
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
        notify(t('notifyOrderPlaced').replace('{total}', fmt(total)));
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
                        const msgs = { Preparing: t('orderPreparing'), Ready: t('orderReady'), Completed: t('orderCompleted'), Cancelled: t('orderCancelled') }; if (msgs[o.status]) new Notification('Library Café — Order #' + orderId, { body: msgs[o.status], tag: 'order-' + orderId });
                    }
                    if (o.status === 'Completed' || o.status === 'Cancelled') { clearInterval(_orderPollers[orderId]); delete _orderPollers[orderId]; }
                }
            } catch { }
        }, 12000);
    }
    function showOrderStatusBanner(orderId, status) {
        const old = document.getElementById('order-banner-' + orderId); if (old) old.remove();
        const cfg = {
            Preparing: { bg: '#fff8e1', border: '#ffd54f', icon: '👨‍🍳', msg: t('orderPreparing') },
            Ready: { bg: '#e8f5e9', border: '#66bb6a', icon: '🔔', msg: t('orderReady') },
            Completed: { bg: '#e3f2fd', border: '#64b5f6', icon: '✅', msg: t('orderCompleted') },
            Cancelled: { bg: '#fdecea', border: '#ef9a9a', icon: '❌', msg: t('orderCancelled') }
        };
        const c = cfg[status];
        if (!c) return;
        lcNotifAdd(c.msg, 'order');
        const b = document.createElement('div');
        b.id = 'order-banner-' + orderId;
        b.style.cssText = 'position:fixed;bottom:2rem;left:2rem;z-index:9998;background:' + c.bg + ';border:1.5px solid ' + c.border + ';border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.1);max-width:320px;padding:.85rem 1.1rem;display:flex;align-items:center;gap:.75rem;animation:slideUp .3s ease';
        b.innerHTML = '<span style="font-size:1.4rem">' + c.icon + '</span><div style="flex:1"><div style="font-size:.8rem;font-weight:700;color:#1a1a1a">' + t('orderNotification') + ' #' + orderId + ' — ' + status + '</div><div style="font-size:.75rem;color:#555;margin-top:.1rem">' + c.msg + '</div></div><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:1rem;color:#999">✕</button>';
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

                // Sync localStorage queue with what the server actually has
                const serverQueued = reqs.filter(r => r.status === 'Queued').map(r => r.bookId);
                const lc = JSON.parse(localStorage.getItem('lc_queue') || '[]')
                    .filter(e => e.userId === currentUser.id);
                // Add any server-queued entries missing from localStorage
                let changed = false;
                serverQueued.forEach(bookId => {
                    if (!lc.some(e => e.bookId === bookId)) { lc.push({ userId: currentUser.id, bookId }); changed = true; }
                });
                if (changed) localStorage.setItem('lc_queue', JSON.stringify(lc));

                reqs.forEach(r => {
                    const prev = _seenBorrowStatuses[r.id];
                    if (prev && prev !== r.status) {
                        // Queued → Pending means book became available — remove from local queue
                        if (prev === 'Queued' && r.status === 'Pending') {
                            const q = JSON.parse(localStorage.getItem('lc_queue') || '[]');
                            localStorage.setItem('lc_queue', JSON.stringify(
                                q.filter(e => !(e.userId === currentUser.id && e.bookId === r.bookId))
                            ));
                            // Show a special "book is free" banner
                            showBorrowRequestBanner({ ...r, status: 'BookAvailable' });
                        } else {
                            showBorrowRequestBanner(r);
                        }
                        if (Notification.permission === 'granted') {
                            const msgs = {
                                BookAvailable: t('bookAvailable').replace('{title}', r.bookTitle),
                                Approved: t('requestApproved').replace('{title}', r.bookTitle),
                                Rejected: t('requestRejected').replace('{title}', r.bookTitle),
                                Taken: t('bookTaken').replace('{title}', r.bookTitle)
                            };
                            if (msgs[r.status === 'Pending' && prev === 'Queued' ? 'BookAvailable' : r.status])
                                new Notification('Library Café — Book Request', {
                                    body: msgs[r.status === 'Pending' && prev === 'Queued' ? 'BookAvailable' : r.status],
                                    tag: 'breq-' + r.id
                                });
                        }
                    }
                    _seenBorrowStatuses[r.id] = r.status;
                });
            } catch { }
        }, 10000);
    }

    function showBorrowRequestBanner(req) {
        const old = document.getElementById('breq-banner-' + req.id); if (old) old.remove();
        var _bm = {
            BookAvailable: '📚 "' + req.bookTitle + '" is now available! ',
            Approved: '✅ Book "' + req.bookTitle + '" approved! Come pick it up.',
            Rejected: '❌ Book "' + req.bookTitle + '" request was declined.',
            Taken: '📚 Enjoy "' + req.bookTitle + '"! Return by the due date.'
        };
        if (_bm[req.status]) lcNotifAdd(_bm[req.status], 'book');
        const cfg = {
            BookAvailable: { bg: '#e8f5e9', border: '#66bb6a', icon: '📚', msg: t('bookAvailable').replace('{title}', req.bookTitle) },
            Approved: { bg: '#e8f5e9', border: '#66bb6a', icon: '✅', msg: t('requestApproved').replace('{title}', req.bookTitle) },
            Rejected: { bg: '#fdecea', border: '#ef9a9a', icon: '❌', msg: t('requestRejected').replace('{title}', req.bookTitle) },
            Taken: { bg: '#e3f2fd', border: '#64b5f6', icon: '📚', msg: t('bookTaken').replace('{title}', req.bookTitle) }
        };
        const c = cfg[req.status]; if (!c) return;
        const b = document.createElement('div');
        b.id = 'breq-banner-' + req.id;
        b.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:9998;background:' + c.bg + ';border:1.5px solid ' + c.border + ';border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,.1);max-width:320px;padding:.85rem 1.1rem;display:flex;align-items:center;gap:.75rem;animation:slideUp .3s ease';
        b.innerHTML = '<span style="font-size:1.4rem">' + c.icon + '</span><div style="flex:1"><div style="font-size:.8rem;font-weight:700;color:#1a1a1a">' + t('bookRequest') + ' — ' + req.status + '</div><div style="font-size:.75rem;color:#555;margin-top:.1rem">' + c.msg + '</div></div><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:1rem;color:#999">✕</button>'; document.body.appendChild(b);
        if (req.status !== 'Approved' && req.status !== 'BookAvailable') setTimeout(() => { if (b.parentNode) { b.style.animation = 'slideDown .3s forwards'; setTimeout(() => b.remove(), 300); } }, 9000);
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

        const today = new Date().toISOString().split('T')[0];
        dateEl.min = today;
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


    // ─── SEATS (backend-synced) ───────────────────────────────────

    function getTakenSeats(date, from, to) {
        return []; // now handled by backend fetch in generateSeats
    }

    function slotsOverlap(f1, t1, f2, t2) {
        return f1 < t2 && t1 > f2;
    }
    async function generateSeats() {
        // Ստուգել currentUser-ը
        if (!currentUser) {
            const el = document.getElementById('seatMap');
            if (el) el.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--mist)">' + t('pleaseLoginToReserve') + '</div>';            return;
        }

        initReservationPickers();
        const el = document.getElementById('seatMap');
        if (!el) return;

        const date = document.getElementById('resDate')?.value || '';
        const from = document.getElementById('resFrom')?.value || '09:00';
        const to = document.getElementById('resTo')?.value || '10:00';

        if (!date) {
            const tFn = typeof t !== 'undefined' ? t : (key) => key;
            notify(tFn('notifySelectDate'), true);
            return;
        }
        if (from >= to) {
            const tFn = typeof t !== 'undefined' ? t : (key) => key;
            notify(tFn('notifyInvalidTime'), true);
            return;
        }

        const tFn = typeof t !== 'undefined' ? t : (key) => key;
        el.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--mist)">' + tFn('loadingSeats') + '</div>';

        // Fetch ALL reservations for this date from backend
        let allReservations = [];
        try {
            const res = await api('/seatreservations?date=' + date);
            if (res && res.ok) allReservations = await res.json();
        } catch (err) {
            console.error('Error fetching reservations:', err);
        }

        const HOURS = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

        // My reservations = same userId
        const myRes = allReservations.filter(r => r.userId === currentUser.id);
        // Others' reservations
        const othersRes = allReservations.filter(r => r.userId !== currentUser.id);

        const myTables = myRes.filter(r => r.from === from && r.to === to).map(r => r.seatNumber);
        const takenByOthers = othersRes
            .filter(r => slotsOverlap(r.from, r.to, from, to))
            .map(r => r.seatNumber)
            .filter(s => !myTables.includes(s));

        // Per-table hourly state
        const occ = {};
        for (let t = 1; t <= 7; t++) { occ[t] = {}; HOURS.forEach(h => { occ[t][h] = 'free'; }); }

        myRes.forEach(r => {
            HOURS.forEach((h, hi) => {
                if (hi >= HOURS.length - 1) return;
                const nxt = HOURS[hi + 1] + ':00';
                if (slotsOverlap(r.from, r.to, h + ':00', nxt) && occ[r.seatNumber])
                    occ[r.seatNumber][h] = 'mine';
            });
        });
        othersRes.forEach(r => {
            HOURS.forEach((h, hi) => {
                if (hi >= HOURS.length - 1) return;
                const nxt = HOURS[hi + 1] + ':00';
                if (slotsOverlap(r.from, r.to, h + ':00', nxt) && occ[r.seatNumber] && occ[r.seatNumber][h] === 'free')
                    occ[r.seatNumber][h] = 'other';
            });
        });

        el.innerHTML = '';
        const names = ['Սեղան 1', 'Սեղան 2', 'Սեղան 3', 'Սեղան 4', 'Սեղան 5', 'Սեղան 6', 'Սեղան 7'];
        // const emojis = ['📚', '📚', '☕', '☕', '☕', '💻', '💻'];

        for (let t = 1; t <= 7; t++) {
            const isMine = myTables.includes(t);
            const isTaken = takenByOthers.includes(t);

            const card = document.createElement('div');
            card.className = 'tc ' + (isMine ? 'tc-mine' : isTaken ? 'tc-taken' : 'tc-free');
            card.style.cssText = 'background:var(--white);border:1px solid var(--silver);border-radius:12px;padding:1rem;margin-bottom:1rem';

            let statusText = '';
            if (isMine) statusText = '✓ ' + tFn('yourBooking');
            else if (isTaken) statusText = tFn('unavailable');
            else statusText = tFn('available');

            card.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem">
               
                <span style="font-weight:bold">${names[t - 1]}</span>
                <span style="background:${isMine ? '#d4af37' : isTaken ? '#fdecea' : '#e8f5e9'};padding:2px 8px;border-radius:20px;font-size:0.7rem">${statusText}</span>
            </div>
            <div style="display:flex;gap:4px;margin-top:0.5rem">
                ${HOURS.slice(0, -1).map((h, idx) => {
                const state = occ[t][h];
                const isFree = state === 'free';
                const nextHour = HOURS[idx + 1];
                return `<div 
                        style="flex:1;height:40px;border-radius:4px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:4px;cursor:${isFree ? 'pointer' : 'default'};background:${state === 'mine' ? '#d4af37' : state === 'other' ? '#fdecea' : '#e8f5e9'};border:1px solid ${state === 'mine' ? '#b8922a' : state === 'other' ? '#ef9a9a' : '#a5d6a7'}"
                        ${isFree ? `onclick="reserveSeat(${t},'${date}','${h}:00','${nextHour}:00')"` : ''}
                        title="${h}:00 - ${nextHour}:00">
                        <span style="font-size:0.6rem;font-weight:600;opacity:0.75">${h}</span>
                    </div>`;
            }).join('')}
            </div>
        `;

            if (isMine) {
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'btn btn-ghost';
                cancelBtn.style.cssText = 'width:100%;margin-top:0.5rem;padding:0.3rem;font-size:0.8rem';
                cancelBtn.textContent = '✕ ' + tFn('cancel') + ' ' + from + '–' + to;
                cancelBtn.onclick = () => cancelSeatReservation(t, date, from, to);
                card.appendChild(cancelBtn);
            } else if (!isTaken) {
                const reserveBtn = document.createElement('button');
                reserveBtn.className = 'btn btn-primary';
                reserveBtn.style.cssText = 'width:100%;margin-top:0.5rem;padding:0.3rem;font-size:0.8rem';
                reserveBtn.textContent = tFn('reserve') + ' ' + from + '–' + to;
                reserveBtn.onclick = () => reserveSeat(t, date, from, to);
                card.appendChild(reserveBtn);
            }

            el.appendChild(card);
        }
        renderMyReservations(myRes);
    }

    async function reserveSeat(seat, date, from, to) {
        const res = await api('/seatreservations', {
            method: 'POST',
            body: JSON.stringify({ userId: currentUser.id, seatNumber: seat, date, from, to })
        });
        if (!res) return;
        if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            notify(e.message || 'Could not reserve seat', true);
            return;
        }
        notify(t('notifyReservationMade').replace('{seat}', seat).replace('{from}', from).replace('{to}', to));
        if (typeof scheduleReservationNotification === 'function')
            scheduleReservationNotification(seat, date, from);
        generateSeats();
    }

    async function cancelSeatReservation(seat, date, from, to) {
        const params = new URLSearchParams({ userId: currentUser.id, seatNumber: seat, date, from, to });
        const res = await api('/seatreservations?' + params.toString(), { method: 'DELETE' });
        if (!res) return;
        if (!res.ok) { notify('Could not cancel reservation', true); return; }
        notify(t('notifyReservationCancelled').replace('{seat}', seat));
        generateSeats();
    }

    function renderMyReservations(myRes) {
        const el = document.getElementById('myReservationsList');
        if (!el) return;
        if (!myRes || !myRes.length) { el.innerHTML = ''; return; }
        const sorted = [...myRes].sort((a, b) => (a.date + a.from).localeCompare(b.date + b.from));
        const rows = sorted.map(r => {
            const oc = 'cancelSeatReservation(' + r.seatNumber + ',\'' + r.date + '\',\'' + r.from + '\',\'' + r.to + '\')';
            return '<div class="my-res-row">'
                + '<div class="my-res-tbl">T' + r.seatNumber + '</div>'
                + '<span class="my-res-info">' + r.date + ' &nbsp; ' + r.from + '–' + r.to + '</span>'
                + '<button class="my-res-del" onclick="' + oc + '" title="Cancel">✕</button>'
                + '</div>';
        }).join('');
        el.innerHTML = '<p class="my-res-title">' + t('myReservations') + '</p>'
            + '<div class="my-res-list">' + rows + '</div>';
    }

    // ─── BOOKSHELF MAP ────────────────────────────────────────────
    async function renderShelfMap() {
        const el = document.getElementById('shelfMapContent');
        if (!el) return;

        el.innerHTML = '<div class="spin"></div>';
        await loadBooks();

        const shelves = {};
        books.forEach(b => {
            const shelf = b.shelf || 'Անհայտ';
            const section = shelf.match(/^[A-Za-z]+/)?.[0]?.toUpperCase() || 'Այլ';
            if (!shelves[section]) shelves[section] = [];
            shelves[section].push(b);
        });

        if (Object.keys(shelves).length === 0) {
            el.innerHTML = `<div class="empty-shelf-message">
            <span>📚</span>
            <p>Դեռևս գրքեր չկան գրադարանում</p>
        </div>`;
            return;
        }

        const sectionIcons = {
            'A': '📖', 'B': '📘', 'C': '📙', 'D': '📕',
            'F': '📗', 'H': '📚', 'L': '📖', 'N': '📘',
            'Այլ': '📚'
        };

        el.innerHTML = `<div class="shelf-container">
        ${Object.entries(shelves).sort(([a], [b]) => a.localeCompare(b)).map(([section, sectionBooks]) => {
            const slots = {};
            sectionBooks.forEach(b => {
                slots[b.shelf] = slots[b.shelf] || [];
                slots[b.shelf].push(b);
            });

            return `<div class="shelf-section">
                <div class="section-title">
                    ${sectionIcons[section] || '📚'} ${t('section')} ${section}
                </div>
                <div class="shelf-grid">
                    ${Object.entries(slots).sort(([a], [b]) => a.localeCompare(b)).map(([shelfName, shelfBooks]) => {
                return `<div class="shelf-card">
                            <div class="shelf-header">
                                <span>📚</span>
                                <span>${shelfName}</span>
                            </div>
                            <div class="shelf-books">
                                ${shelfBooks.map(book => {
                    const avail = book.availableCount ?? (book.available ? 1 : 0);
                    const statusClass = avail > 0 ? 'status-available' : 'status-borrowed';
                    const statusText = avail > 0 ? t('statusAvailable') : t('statusBorrowed');
                    const copiesText = book.totalCount > 1 ? ` (${avail}/${book.totalCount})` : '';
                    return `<div class="shelf-book-item">
                                        <div class="book-info">
                                            <div class="book-title" title="${book.title}">${book.title}</div>
                                            <div class="book-author">${book.author}</div>
                                        </div>
                                        <div class="book-status ${statusClass}">${statusText}${copiesText}</div>
                                    </div>`;
                }).join('')}
                            </div>
                        </div>`;
            }).join('')}
                </div>
            </div>`;
        }).join('')}
    </div>`;
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
    // Queue is stored as BorrowRequest with Status="Queued" on the backend.
    // We mirror bookId in localStorage so bookCard can flip the button instantly.

    function isInQueue(bookId) {
        if (!currentUser) return false;
        const q = JSON.parse(localStorage.getItem('lc_queue') || '[]');
        return q.some(e => e.userId === currentUser.id && e.bookId === bookId);
    }

    async function joinQueue(bookId) {
        if (!currentUser) { notify(t('notifySignIn'), true); return; }
        const book = books.find(b => b.id === bookId);
        const title = book ? book.title : 'this book';

        if (isInQueue(bookId)) {
            notify(t('alreadyInQueue').replace('{title}', title), true); return;
        }

        // POST to /borrowrequests — backend will set Status="Queued" because book is unavailable
        const res = await api('/borrowrequests', {
            method: 'POST',
            body: JSON.stringify({ userId: currentUser.id, bookId, durationDays: 14 })
        });
        if (!res) return;
        if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            notify(e.message || 'Could not join the queue', true);
            return;
        }

        // Mirror in localStorage so button flips immediately without waiting for re-render
        const q = JSON.parse(localStorage.getItem('lc_queue') || '[]');
        q.push({ userId: currentUser.id, bookId });
        localStorage.setItem('lc_queue', JSON.stringify(q));

        notify(t('notifyQueueJoined').replace('{title}', title));
        renderLibrary('all'); renderTrending();
    }

    async function leaveQueue(bookId) {
        if (!currentUser) return;
        const book = books.find(b => b.id === bookId);
        const title = book ? book.title : 'this book';

        // DELETE by userId+bookId — no need to know the request ID
        const res = await api(`/borrowrequests/cancel?userId=${currentUser.id}&bookId=${bookId}`, {
            method: 'DELETE'
        });

        // Always remove from localStorage so button flips immediately
        const q = JSON.parse(localStorage.getItem('lc_queue') || '[]');
        localStorage.setItem('lc_queue', JSON.stringify(
            q.filter(e => !(e.userId === currentUser.id && e.bookId === bookId))
        ));

        if (!res || !res.ok) { notify('Could not leave queue', true); return; }
        notify(t('notifyQueueLeft').replace('{title}', title));

        renderLibrary('all'); renderTrending();
    }

    // ─── PROFILE ─────────────────────────────────────────────────
    async function updateProfile() {
        if (!currentUser) return;
        document.getElementById('profName').textContent = currentUser.name;
        document.getElementById('profRole').textContent = currentUser.role;
        document.getElementById('profEmail').textContent = currentUser.email;
        const phoneInput = document.getElementById('profPhone');
        if (phoneInput) phoneInput.value = currentUser.phone || '';
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
            // Add colspan to header — find where the table header is defined and add a Phone column
            // Then in tbody.innerHTML, add the phone cell:

            tbody.innerHTML = active.map(b => `<tr>
    <td>${b.userFullname}</td>
    <td>${b.userPhone || '—'}</td>
    <td>${fmtDate(b.borrowDate)}</td>
    <td>${fmtDate(b.dueDate)}</td>
    <td>${b.isOverdue
                    ? `<span style="color:var(--danger);font-weight:500">⚠ Overdue ${Math.floor((Date.now() - new Date(b.dueDate)) / 86400000)}d</span>`
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
                if (btn) { btn.textContent = '🔔 ' + t('remindersOn'); btn.classList.add('notif-on'); }
                notify(t('remindersEnabled'));
            } else {
                if (btn) btn.textContent = '🔕 ' + t('remindersOff');
                notify(t('permissionDenied'), true);
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
            '<strong>' + t('reservationReminder') + '</strong>' +
            '<span>' + t('table') + ' ' + tableNum + ' ' + t('at') + ' ' + from + ' — ' + date + '</span>' +
            '</div>' +
            '<div class="rnb-actions">' +
            '<button class="btn btn-primary btn-sm" onclick="dismissNotifBanner()">' + t('gotIt') + '</button>' +
            '<button class="btn btn-ghost btn-sm" onclick="cancelFromBanner(' + tableNum + ',\'' + date + '\',\'' + from + '\')">' + t('cancelReservation') + '</button>' +
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
            btn.textContent = '🔔 ' + t('remindersOn'); btn.classList.add('notif-on');
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
            <td style="padding:0.8rem">${b.title}</td>
            <td style="padding:0.8rem">${b.author}</td>
            <td style="padding:0.8rem">${b.category}</td>
            <td style="padding:0.8rem">${b.isbn || '—'}</td>
            <td style="padding:0.8rem">${b.shelf || '—'}</td>
            <td style="padding:0.8rem">${avail}/${total} ${statusChip(b.status)}</td>
            <td style="display:flex;gap:.4rem;padding:0.8rem">
                <button class="btn btn-ghost btn-sm" onclick="openEditBook(${b.id})">${t("edit")}</button>
                <button class="btn btn-ghost btn-sm" onclick="toggleBookBorrowed(${b.id})">📋 ${t("activeBorrowings")}</button>
                ${avail > 0
                        ? `<button class="btn btn-primary btn-sm" onclick="openLibBorrowModal(${b.id})">📤 ${t('borrow')}</button>`
                        : `<button class="btn btn-ghost btn-sm" style="opacity:.45" disabled>📤 ${t('allBorrowed')}</button>`}
                <button class="btn-del" onclick="deleteBook(${b.id})">${t("delete")}</button>
            </td>
        </tr>`;
            }).join('')
            : `<tr><td colspan="7" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">${t("libraryCatalog")}…</td></tr>`;
        const br = await api('/borrowings?active=true');
        if (br && br.ok) {
            const data = await br.json();
            const tb = document.getElementById('libBorrTable');
            if (tb) tb.innerHTML = data.length
                ? data.map(b => `<tr><td>${b.userFullname}</td><td>${b.userPhone || '—'}</td><td>${b.bookTitle}</td><td>${fmtDate(b.borrowDate)}</td><td>${fmtDate(b.dueDate)}</td><td>${statusChip(b.isOverdue ? 'Overdue' : 'available')}</td><td><button class="btn btn-primary btn-sm" onclick="returnBook(${b.id})">${t("returnBook")}</button></td></tr>`).join('')
                : `<tr><td colspan="6" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">${t("activeBorrowings")}…</td></tr>`;
        }

        // Pending borrow requests
        await loadBorrowRequests();
    }

    async function loadBorrowRequests() {
        const res = await api('/borrowrequests?status=Pending');
        if (!res || !res.ok) return;
        const reqs = await res.json();

        // Also load Approved (waiting for pickup) and Queued (waitlist)
        const resA = await api('/borrowrequests?status=Approved');
        const approved = (resA && resA.ok) ? await resA.json() : [];
        const resQ = await api('/borrowrequests?status=Queued');
        const queued = (resQ && resQ.ok) ? await resQ.json() : [];
        const all = [...reqs, ...approved, ...queued];

        const tb = document.getElementById('libRequestsTb');
        if (!tb) return;

        if (!all.length) {
            tb.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--mist);font-style:italic">No pending requests</td></tr>`;
            return;
        }

        tb.innerHTML = all.map(r => {
            const isPending = r.status === 'Pending';
            const isApproved = r.status === 'Approved';
            const isQueued = r.status === 'Queued';

            // Status-ի թարգմանություն
            let statusText = '';
            if (r.status === 'Pending') statusText = t('statusPending');
            else if (r.status === 'Approved') statusText = t('statusApproved');
            else if (r.status === 'Queued') statusText = t('statusQueued');
            else statusText = r.status;

            return `<tr>
        <td>${r.userFullname}</td>
        <td>${r.bookTitle}<br><span style="font-size:.75rem;color:var(--mist)">${r.bookAuthor}</span></td>
        <td>${fmtDate(r.requestDate)}</td>
        <td>${r.durationDays} ${t('days')}</td>
        <td>
            <span class="chip ${isPending ? 'c-pe' : isApproved ? 'c-re' : 'c-bo'}" style="margin-right:.4rem">${statusText}</span>
            ${isPending ? `
                <button class="btn btn-primary btn-sm" onclick="approveRequest(${r.id})">✅ ${t('approve')}</button>
                <button class="btn-del" style="margin-left:.3rem" onclick="rejectRequest(${r.id})">✕ ${t('reject')}</button>
            ` : isApproved ? `
                <button class="btn btn-primary btn-sm" onclick="markTaken(${r.id})">📚 ${t('markAsTaken')}</button>
            ` : isQueued ? `
                <span style="font-size:.75rem;color:var(--mist)">⏳ ${t('waitingForCopy')}</span>
            ` : ''}
        </td>
    </tr>`;
        }).join('');
    }

    async function approveRequest(id) {
        const res = await api('/borrowrequests/' + id + '/approve', { method: 'PUT', body: '{}' });
        if (!res || !res.ok) { notify(t('notifyApproveFailed'), true); return; }
        notify(t('notifyRequestApproved'));
        loadBorrowRequests();
    }

    async function rejectRequest(id) {
        if (!confirm(t('confirmRejectRequest'))) return;
        const res = await api('/borrowrequests/' + id + '/reject', { method: 'PUT', body: JSON.stringify('') });
        if (!res || !res.ok) { notify(t('notifyRejectFailed'), true); return; }
        notify(t('notifyRequestRejected'));
        loadBorrowRequests();
    }

    async function markTaken(id) {
        const res = await api('/borrowrequests/' + id + '/taken', { method: 'PUT', body: '{}' });
        if (!res || !res.ok) { notify(t('notifyMarkTakenFailed'), true); return; }
        notify(t('notifyMarkedAsBorrowed'));
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
            document.getElementById('bkPdfName').textContent = '📄 ' + t('pdfUploaded');
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
        btn.textContent = t('saving'); btn.disabled = true;

        try {
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
                notify(e.message || t('notifySaveFailed'), true);
                btn.textContent = origText; btn.disabled = false;
                return;
            }
            notify(editId ? t('notifyBookUpdated').replace('{title}', title) : t('notifyBookAdded').replace('{title}', title));
            btn.textContent = origText; btn.disabled = false;
            closeModal('addBookModal');
            await loadBooks(); loadLibDash();
            if (currentUser.role === 'Admin') loadAdminDash();
        } catch (err) {
            notify(t('notifySaveError') + ': ' + err.message, true);
            btn.textContent = origText; btn.disabled = false;
        }
    }
    function addBook() { submitBook(); }

    async function deleteBook(id) {
        if (!confirm(t('confirmDeleteBook'))) return;
        const res = await api(`/books/${id}`, { method: 'DELETE' });
        if (!res) return;
        if (!res.ok) { notify(t('notifyDeleteFailed'), true); return; }
        notify(t('notifyBookRemoved')); loadLibDash();
        if (currentUser.role === 'Admin') loadAdminDash();
    }

    async function returnBook(borrowingId) {
        const res = await api(`/borrowings/${borrowingId}/return`, { method: 'PUT', body: JSON.stringify({ returnDate: new Date().toISOString() }) });
        if (!res) return;
        if (!res.ok) { notify('Failed to process return', true); return; }
        notify(t('notifyReturned')); loadLibDash(); await loadBooks();
    }

    // ─── CAFÉ STAFF ──────────────────────────────────────────────
    // ========== CAFÉ STAFF FUNCTIONS ==========

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
            ? menu.map(m => {
                // Կատեգորիայի (type) թարգմանություն
                const typeMap = {
                    'Hot Drinks': t('hotDrinks'),
                    'Cold Drinks': t('coldDrinks'),
                    'Breakfast': t('breakfast'),
                    'Sandwiches': t('sandwiches'),
                    'Salads': t('salads'),
                    'Desserts': t('desserts')
                };
                const typeHy = typeMap[m.type] || m.type;

                return `<tr>
                <td style="display:flex;align-items:center;gap:.6rem;padding:0.8rem">
                    ${m.imageUrl ? `<img src="${m.imageUrl}" style="width:34px;height:34px;object-fit:cover;border-radius:5px;flex-shrink:0">` : `<div style="width:34px;height:34px;background:var(--snow);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:.85rem;flex-shrink:0">☕</div>`}
                    ${m.name}
                </td>
                <td style="padding:0.8rem">${typeHy}</td>
                <td style="padding:0.8rem">${fmt(m.price)} AMD</td>
                <td style="display:flex;gap:.4rem;padding:0.8rem">
                    <button class="btn btn-ghost btn-sm" onclick="openEditMenuItem(${m.id})">✏️ ${t('edit')}</button>
                    <button class="btn-del" onclick="deleteMenuItem(${m.id})">${t('delete')}</button>
                </td>
            </tr>`;
            }).join('')
            : `<td><td colspan="4" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">${t('noMenuItemsYet')}</td></tr>`;
    }

    function renderOrdersTable(data) {
        const tb = document.getElementById('cafeOrdersTb');
        if (!tb) return;

        if (!data || data.length === 0) {
            tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">${t('noOrdersYet')}</td><tr>`;
            return;
        }

        tb.innerHTML = data.map(o => `<tr>
        <td style="padding:0.8rem">#${o.id}</td>
        <td style="padding:0.8rem">${o.userFullname || o.userName || '—'}</td>
        <td style="padding:0.8rem;font-size:0.8rem">${(o.items || []).map(i => `${i.itemName} ×${i.quantity}`).join(', ')}</td>
        <td style="padding:0.8rem">${fmt(o.totalAmount)} AMD</td>
        <td style="padding:0.8rem">${o.orderType || 'Dine-in'}</td>
        <td style="padding:0.8rem">${statusChip(o.status)}</td>
        <td style="padding:0.8rem">
            <select class="status-select" onchange="updateStatus(${o.id},this.value)" style="padding:0.3rem 0.5rem;border-radius:4px;border:1px solid var(--silver);background:var(--white);cursor:pointer">
                <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>${t('statusPending')}</option>
                <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>${t('statusPreparing')}</option>
                <option value="Ready" ${o.status === 'Ready' ? 'selected' : ''}>${t('statusReady')}</option>
                <option value="Completed" ${o.status === 'Completed' ? 'selected' : ''}>${t('statusCompleted')}</option>
                <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>${t('statusCancelled')}</option>
            </select>
        </td>
    </table>`).join('');
    }

    function filterOrders(status, btn) {
        document.querySelectorAll('#cafeDash .tab').forEach(t => t.classList.remove('active'));
        if (btn) btn.classList.add('active');
        renderOrdersTable(status === 'all' ? orders : orders.filter(o => o.status === status));
    }

    async function updateStatus(id, status) {
        const res = await api(`/cafeorders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
        if (!res) return;
        if (!res.ok) { notify(t('notifyUpdateStatusFailed'), true); return; }

        let statusText = '';
        if (status === 'Pending') statusText = t('statusPending');
        else if (status === 'Preparing') statusText = t('statusPreparing');
        else if (status === 'Ready') statusText = t('statusReady');
        else if (status === 'Completed') statusText = t('statusCompleted');
        else if (status === 'Cancelled') statusText = t('statusCancelled');
        else statusText = status;

        notify(t('notifyOrderStatusUpdated').replace('{id}', id).replace('{status}', statusText));
        loadCafeDash();
    }

    function openAddMenuItem() {
        const titleEl = document.getElementById('menuModalTitle');
        const btnEl = document.getElementById('menuModalSubmitBtn');
        if (titleEl) titleEl.innerHTML = t('addMenuItem');
        if (btnEl) btnEl.textContent = t('addToCollection');
        ['miName', 'miPrice'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
        const cat = document.getElementById('miCat'); if (cat) cat.value = 'Hot Drinks';
        const prev = document.getElementById('miImagePreview'); if (prev) { prev.style.display = 'none'; prev.src = ''; }
        const fi = document.getElementById('miImage'); if (fi) fi.value = '';
        window._editingMenuId = null; openModal('menuModal');
    }

    function openEditMenuItem(id) {
        const m = menu.find(x => x.id === id); if (!m) return;
        const titleEl = document.getElementById('menuModalTitle');
        const btnEl = document.getElementById('menuModalSubmitBtn');
        if (titleEl) titleEl.innerHTML = t('editMenuItem');
        if (btnEl) btnEl.textContent = t('saveChanges');
        const nm = document.getElementById('miName'); if (nm) nm.value = m.name;
        const ct = document.getElementById('miCat'); if (ct) ct.value = m.type;
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
    const type = document.getElementById('miCat')?.value || 'Hot Drinks';
    const price = parseFloat(document.getElementById('miPrice')?.value || '0');
    const imageFile = document.getElementById('miImage')?.files[0];

    if (!itemName || !price) { notify(t('notifyFillFields'), true); return; }

    const btn = document.getElementById('menuModalSubmitBtn');
    if (btn) { btn.disabled = true; btn.textContent = t('saving'); }

    const isEdit = !!window._editingMenuId;

    // Build FormData — backend now accepts multipart/form-data
    const fd = new FormData();
    fd.append('itemName', itemName);
    fd.append('category', type);
    fd.append('price', price);
    if (imageFile) fd.append('imageFile', imageFile);   // ← goes to Cloudinary

    const url = isEdit ? `${API}/menuitems/${window._editingMenuId}` : `${API}/menuitems`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        // NOTE: Do NOT set Content-Type header — browser sets it automatically
        //       with the correct multipart boundary when using FormData.
        const result = await fetch(url, { method, body: fd });

        if (btn) { btn.disabled = false; btn.textContent = isEdit ? t('saveChanges') : t('addToCollection'); }

        if (!result) return;
        if (!result.ok) {
            const e = await result.json().catch(() => ({}));
            notify(e.message || t('notifySaveFailed'), true);
            return;
        }

        notify(isEdit
            ? t('notifyMenuItemUpdated').replace('{name}', itemName)
            : t('notifyMenuItemAdded').replace('{name}', itemName));

        closeModal('menuModal');
        loadCafeDash();

    } catch (err) {
        if (btn) { btn.disabled = false; btn.textContent = isEdit ? t('saveChanges') : t('addToCollection'); }
        notify(t('notifySaveError') + ': ' + err.message, true);
    }
}

    async function addMenuItem() { openAddMenuItem(); }

    async function deleteMenuItem(id) {
        if (!confirm(t('confirmDeleteMenuItem'))) return;
        const res = await api(`/menuitems/${id}`, { method: 'DELETE' });
        if (!res) return;
        if (!res.ok) {
            const e = await res.json().catch(() => ({}));
            notify(e.message || t('notifyDeleteFailed'), true);
            return;
        }
        notify(t('notifyMenuItemRemoved'));
        loadCafeDash();
    }
    // ─── ADMIN ───────────────────────────────────────────────────
    async function loadAdminDash() {
        await loadBooks(); await loadMenu(); await loadPendingApprovals();
        const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };

        const ur = await api('/users');
        if (ur && ur.ok) {
            const users = await ur.json();
            set('asUsers', users.length);
            const tb = document.getElementById('adminUsersTb');
            if (tb) tb.innerHTML = users.map(u => `<tr><td>${u.fullname}</td><td>${u.email}</td><td>${u.phone || '—'}</td><td>${rolePillHtml(u.role)}</td><td><button class="btn-del" onclick="deleteUser(${u.id})" ${u.id === currentUser.id ? 'disabled' : ''}>Delete</button></td></tr>`).join('');
        }

        set('asBooks', books.length);
        const bk = document.getElementById('adminBooksTb');
        if (bk) {
            if (books.length === 0) {
                bk.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">${t('noBooksYet')}</td></tr>`;
            } else {
                bk.innerHTML = books.map(b => {
                    const avail = b.availableCount ?? (b.available ? 1 : 0);
                    const total = b.totalCount || 1;
                    return `<td>
        <td style="padding:0.8rem">${b.title}</td>
        <td style="padding:0.8rem">${b.author}</td>
        <td style="padding:0.8rem">${b.category}${b.shelf ? ' · ' + b.shelf : ''}</td>
        <td style="padding:0.8rem">${avail}/${total} ${statusChip(b.status)}</td>
        <td style="display:flex;gap:.4rem;padding:0.8rem">
            <button class="btn btn-ghost btn-sm" onclick="openEditBook(${b.id})">✏️ ${t('edit')}</button>
            <button class="btn-del" onclick="deleteBook(${b.id})">🗑️ ${t('delete')}</button>
        </td>
    </table>`;
                }).join('');
            }
        }

        const or = await api('/cafeorders');
        if (or && or.ok) {
            const data = await or.json();
            const rev = data.reduce((s, o) => s + o.totalAmount, 0);
            set('asOrders', data.length); set('asRevenue', fmt(rev));
            const otb = document.getElementById('adminOrdersTb');
            if (otb) otb.innerHTML = data.map(o => `<tr><td>#${o.id}</td><td>${o.userFullname}</td><td>${fmt(o.totalAmount)} AMD</td><td>${fmtDate(o.orderDate)}</td><td>${statusChip(o.status)}</td></tr>`).join('');
        }
    }
    async function updatePhone() {
        const phone = document.getElementById('profPhone').value.trim();
        if (!phone) { notify('Please enter a phone number', true); return; }
        currentUser.phone = phone;
        saveStorage();
        const res = await api(`/users/${currentUser.id}`, {
            method: 'PUT',
            body: JSON.stringify({ phone })
        });
        if (!res || !res.ok) { notify('Could not update phone', true); return; }
        notify(' Phone number updated!');
    }
    //function rolePillHtml(role) {
    //    const m = { 'Student': 'rp-s', 'Librarian': 'rp-l', 'Café Staff': 'rp-c', 'Admin': 'rp-a' };
    //    return `<span class="role-pill ${m[role] || 'rp-s'}">${role}</span>`;
    //}

    //    async function deleteUser(id) {
    //    if (!confirm('Delete this user account? This will permanently delete all their data (borrowings, orders, reviews, etc.).')) return;

    //    try {
    //        const res = await api(`/users/${id}`, { method: 'DELETE' });

    //        // Check if response exists
    //        if (!res) {
    //            notify('Cannot reach server', true);
    //            return;
    //        }

    //        // Check if deletion was successful
    //        if (res.ok) {
    //            notify('User deleted successfully');
    //            loadAdminDash(); // Refresh the admin dashboard
    //        } else {
    //            // Try to get error message from response
    //            const errorData = await res.json().catch(() => ({}));
    //            const errorMsg = errorData.message || `Failed to delete user (Status: ${res.status})`;
    //            notify(errorMsg, true);
    //        }
    //    } catch (error) {
    //        console.error('Delete user error:', error);
    //        notify('An error occurred while deleting the user', true);
    //        }

    //}

    //// ─── ADMIN ───────────────────────────────────────────────────
    //async function loadAdminDash() {
    //    await loadBooks(); await loadMenu();
    //    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };

    //    const ur = await api('/users');
    //    if (ur && ur.ok) {
    //        const users = await ur.json();
    //        set('asUsers', users.length);
    //        const tb = document.getElementById('adminUsersTb');
    //        if (tb) tb.innerHTML = users.map(u => `<tr><td>${u.fullname}</td><td>${u.email}</td><td>${u.phone || '—'}</td><td>${rolePillHtml(u.role)}</td><td><button class="btn-del" onclick="deleteUser(${u.id})" ${u.id === currentUser.id ? 'disabled' : ''}>Delete</button></td></tr>`).join('');
    //    }

    //    set('asBooks', books.length);
    //    const bk = document.getElementById('adminBooksTb');
    //    if (bk) {
    //        if (books.length === 0) {
    //            bk.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2.5rem;color:var(--mist);font-style:italic">${t('noBooksYet')}</td></tr>`;
    //        } else {
    //            bk.innerHTML = books.map(b => {
    //                const avail = b.availableCount ?? (b.available ? 1 : 0);
    //                const total = b.totalCount || 1;
    //                return `<td>
    //        <td style="padding:0.8rem">${b.title}</td>
    //        <td style="padding:0.8rem">${b.author}</td>
    //        <td style="padding:0.8rem">${b.category}${b.shelf ? ' · ' + b.shelf : ''}</td>
    //        <td style="padding:0.8rem">${avail}/${total} ${statusChip(b.status)}</td>
    //        <td style="display:flex;gap:.4rem;padding:0.8rem">
    //            <button class="btn btn-ghost btn-sm" onclick="openEditBook(${b.id})">✏️ ${t('edit')}</button>
    //            <button class="btn-del" onclick="deleteBook(${b.id})">🗑️ ${t('delete')}</button>
    //        </td>
    //    </table>`;
    //            }).join('');
    //        }
    //    }

    //    const or = await api('/cafeorders');
    //    if (or && or.ok) {
    //        const data = await or.json();
    //        const rev = data.reduce((s, o) => s + o.totalAmount, 0);
    //        set('asOrders', data.length); set('asRevenue', fmt(rev));
    //        const otb = document.getElementById('adminOrdersTb');
    //        if (otb) otb.innerHTML = data.map(o => `<tr><td>#${o.id}</td><td>${o.userFullname}</td><td>${fmt(o.totalAmount)} AMD</td><td>${fmtDate(o.orderDate)}</td><td>${statusChip(o.status)}</td></tr>`).join('');
    //    }
    //}
    //async function updatePhone() {
    //    const phone = document.getElementById('profPhone').value.trim();
    //    if (!phone) { notify('Please enter a phone number', true); return; }
    //    currentUser.phone = phone;
    //    saveStorage();
    //    const res = await api(`/users/${currentUser.id}`, {
    //        method: 'PUT',
    //        body: JSON.stringify({ phone })
    //    });
    //    if (!res || !res.ok) { notify('Could not update phone', true); return; }
    //    notify(' Phone number updated!');
    //}
function rolePillHtml(role) {
    const m = { 'Student': 'rp-s', 'Librarian': 'rp-l', 'Café Staff': 'rp-c', 'Admin': 'rp-a' };
    const roleNames = {
        'Student': t('student'),
        'Librarian': t('librarian'),
        'Café Staff': t('cafeStaff'),
        'Admin': t('admin')
    };
    const displayName = roleNames[role] || role;
    return `<span class="role-pill ${m[role] || 'rp-s'}">${displayName}</span>`;
}

async function deleteUser(id) {
    if (!confirm(t('confirmDeleteUser'))) return;
    try {
        const res = await api(`/users/${id}`, { method: 'DELETE' });
        if (!res) { notify(t('serverUnreachable'), true); return; }
        if (res.ok) { notify(t('notifyUserDeleted')); loadAdminDash(); }
        else {
            const e = await res.json().catch(() => ({}));
            notify(e.message || t('notifyDeleteFailed') + ` (${res.status})`, true);
        }
    } catch (err) {
        notify(t('notifyDeleteUserError'), true);
    }
}
    // ─── ADMIN: NEW REGISTRATION MONITOR ─────────────────────────
    let _lastUserCount = 0;
    let _lastUserList = [];

    async function _checkNewRegistrations() {
        if (!currentUser || currentUser.role !== 'Admin') return;
        try {
            const res = await api('/users/pending');
            if (!res || !res.ok) return;
            const pending = await res.json();

            const known = JSON.parse(localStorage.getItem('lc_known_pending') || '[]');
            const newOnes = pending.filter(u => !known.includes(u.userId));
            newOnes.forEach(u => {
                const roleName = { 'Librarian': t('librarian'), 'Café Staff': t('cafeStaff'), 'Admin': t('admin') }[u.role] || u.role;
                lcNotifAdd(`🔔 ${t('newRegistrationNeedsApproval')}: ${roleName} - ${u.fullname}`, 'book');            });
            if (newOnes.length > 0) {
                localStorage.setItem('lc_known_pending', JSON.stringify(pending.map(u => u.userId)));
                if (document.getElementById('adminPendingTb')) loadPendingApprovals();
            }
        } catch (e) { console.error('Monitor:', e); }
    }

    setInterval(_checkNewRegistrations, 15000);
    setTimeout(_checkNewRegistrations, 3000);

    // ─── INIT ─────────────────────────────────────────────────
    window.onload = () => {
        var savedTheme = localStorage.getItem('lc_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        var tb = document.getElementById('themeToggle');
        if (tb) tb.textContent = savedTheme === 'dark' ? '☀' : '☾';
        loadStorage();
        applyTranslations();
        document.querySelectorAll('.lang-btn').forEach(b =>
            b.classList.toggle('active', b.dataset.lang === currentLang)
        );
        if (currentUser) showApp();
        else document.getElementById('authScreen').style.display = 'flex';
    };
    // ─── SEARCH ──────────────────────────────────────────────────
    async function performSearch() {
        const q = document.getElementById('searchInput').value.trim().toLowerCase();
        const cat = document.getElementById('searchCat').value;
        if (!q) { notify(t('notifyEnterSearchTerm'), true); return; }

        if (cat === 'books' || cat === 'all') {
            const res = await api(`/books?search=${encodeURIComponent(q)}`);
            if (res && res.ok) {
                const data = await res.json();
                if (data.length) {
                    books = data.map(b => ({
                        id: b.id, title: b.title, author: b.author, category: b.category,
                        isbn: b.isbn, shelf: b.bookshelf, available: b.isAvailable,
                        status: b.isAvailable ? 'available' : 'borrowed',
                        totalCount: b.totalCount || 1, borrowedCount: b.borrowedCount || 0,
                        availableCount: b.availableCount || (b.isAvailable ? 1 : 0),
                        imagePath: b.imagePath || null, pdfUrl: b.pdfUrl || null
                    }));
                    showPage('library'); renderLibrary('all');
                    notify(t('searchResultsBooks').replace('{count}', data.length));
                    return;
                }
            }
        }
        if (cat === 'menu' || cat === 'all') {
            const f = menu.filter(m => m.name.toLowerCase().includes(q));
            if (f.length) { showPage('cafe'); notify(t('searchResultsMenu').replace('{count}', f.length)); }
            else notify(t('searchNoResults').replace('{query}', q), true);
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
        <span class="ai-hist-year">📜</span>
        <span>${t('aiHistoryFallback')}</span>
    </div>`;
}
    // ─── RATE LIMIT GUARD ────────────────────────────────────────
    function canCallAi() {
        const now = Date.now();
        if (now - aiLastCall < AI_COOLDOWN) {
            notify(t('aiRateLimit'), true);
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
                appendAiMsg('⚠️ ' + t('aiRateLimit'), 'bot');
            } else if (response && response.status === 503) {
                appendAiMsg('⚠️ ' + t('aiNotConfigured'), 'bot');
            } else {
                const err = response ? await response.json().catch(() => ({})) : {};
                appendAiMsg(t('aiConnectionError'), 'bot');
            }
        } catch (err) {
            typingEl.remove();
            appendAiMsg(t('aiConnectionError'), 'bot');
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
                el.innerHTML = `<div class="ai-hist-item">
    <span class="ai-hist-year">📜</span>
    <span>${t('aiHistoryFallback')}</span>
</div>`;
            } else {
                throw new Error('bad response');
            }
        } catch {
            el.innerHTML = `<div class="ai-hist-item">
    <span class="ai-hist-year">📜</span>
    <span>${t('aiHistoryFallback')}</span>
</div>`;
        }
    }


    // ═══════════════════════════════════════════════════════════
    //  VISUAL FEATURES
    // ═══════════════════════════════════════════════════════════

    // ── Typewriter greeting ──────────────────────────────────────

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
    function _lcRenderList() {
        var list = document.getElementById('notifList');
        if (!list) return;
        if (_lcNotifs.length === 0) {
            list.innerHTML = '<div style="padding:3rem 1rem;text-align:center;color:var(--mist);font-size:.82rem;font-style:italic;">' + t('noNotifications') + '</div>';
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
    } function _lcTimeAgo(date) {
        var s = Math.floor((Date.now() - date.getTime()) / 1000);
        if (s < 10) return t('justNow');
        if (s < 60) return s + ' ' + t('secondsAgo');
        if (s < 3600) return Math.floor(s / 60) + ' ' + t('minutesAgo');
        if (s < 86400) return Math.floor(s / 3600) + ' ' + t('hoursAgo');
        return date.toLocaleDateString();
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
            el.innerHTML = '<p style="color:var(--mist);font-size:.82rem;font-style:italic;">' + t('noBooksYet') + '</p>'; return;
        }
        var sorted = books.slice().sort(function (a, b) {
            return ((b.borrowedCount || 0) - (a.borrowedCount || 0)) || (a.id - b.id);
        }).slice(0, 8);
        var medals = ['🥇', '🥈', '🥉'];
        el.innerHTML = sorted.map(function (b, i) {
            var avail = b.availableCount !== undefined ? b.availableCount : (b.available ? 1 : 0);
            var sCol = avail > 0 ? '#2d7a3a' : '#9b3a2a';
            var sBg = avail > 0 ? '#e8f5e9' : '#fdf2f0';
            var sTxt = avail > 0 ? t('statusAvailable') : t('statusBorrowed'); var img = b.imagePath
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
