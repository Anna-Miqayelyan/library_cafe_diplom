// ============================================================
// LIBRARY CAFÉ - app.js
// All data comes from the C# backend API (PostgreSQL)
// ============================================================

const API_BASE = 'http://localhost:5226/api';
// Local cache of data fetched from API
let bookDatabase = [];
let menuDatabase = [];

let currentUser = null;
let cart = [];
let reservedSeats = [];
let favorites = [];

// ============================================================
// INITIALIZE APP
// ============================================================
window.onload = async function () {
    loadFromStorage();
    await loadBooks();
    await loadMenuItems();
    updateStats();
    renderTrendingBooks();
    renderPopularMenu();
    renderLibraryBooks('all');
    renderCafeMenu('all');
    generateSeatMap();

    const firstLibraryTab = document.querySelector('#library .tab');
    if (firstLibraryTab) firstLibraryTab.classList.add('active');
};

// ============================================================
// API HELPERS
// ============================================================
async function apiFetch(path, options = {}) {
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        return res;
    } catch (err) {
        showNotification('Cannot reach server. Is the backend running?');
        return null;
    }
}

// ============================================================
// DATA LOADING FROM API
// ============================================================
async function loadBooks() {
    const res = await apiFetch('/books');
    if (res && res.ok) {
        const data = await res.json();
        // Map backend fields to what the UI expects
        bookDatabase = data.map(b => ({
            id: b.id,
            title: b.title,
            author: b.author,
            category: b.category,
            status: b.isAvailable ? 'available' : 'borrowed',
            icon: '📕',
            image: '',
            description: `Bookshelf: ${b.bookshelf} | ISBN: ${b.isbn}`
        }));
    }
}

async function loadMenuItems() {
    const res = await apiFetch('/menuitems');
    if (res && res.ok) {
        const data = await res.json();
        menuDatabase = data.map(m => ({
            id: m.id,
            name: m.itemName,
            category: m.category,
            price: m.price,
            icon: '☕',
            image: '',
            description: `${m.category} | Rating: ${m.averageRating ? m.averageRating.toFixed(1) + ' ⭐' : 'No ratings yet'}`
        }));
    }
}

// ============================================================
// LOCAL STORAGE (cart, favorites, seats — not sensitive data)
// ============================================================
function saveToStorage() {
    const data = { currentUser, cart, reservedSeats, favorites };
    localStorage.setItem('LibraryCafe', JSON.stringify(data));
}

function loadFromStorage() {
    const saved = localStorage.getItem('LibraryCafe');
    if (saved) {
        const data = JSON.parse(saved);
        currentUser = data.currentUser || null;
        cart = data.cart || [];
        reservedSeats = data.reservedSeats || [];
        favorites = data.favorites || [];
        if (currentUser) updateUIForLoggedInUser();
        updateCartDisplay();
    }
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    if (pageId === 'profile') {
        if (!currentUser) {
            showNotification('Please login to view your profile');
            showPage('home');
            openModal('loginModal');
            return;
        }
        updateProfilePage();
    }
    if (pageId === 'favorites') renderFavorites();
    if (pageId === 'library') renderLibraryBooks('all');
    if (pageId === 'cafe') renderCafeMenu('all');
}

// ============================================================
// AUTHENTICATION — connected to API
// ============================================================
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const res = await apiFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    if (!res) return;

    if (!res.ok) {
        const err = await res.json();
        showNotification(err.message || 'Invalid email or password');
        return;
    }

    const user = await res.json();
    // Backend returns: { id, fullname, email, role }
    currentUser = {
        id: user.id,
        name: user.fullname,
        email: user.email,
        role: user.role,
        wallet: 20000,  // wallet is not in DB yet, kept locally
        fines: 0
    };

    updateUIForLoggedInUser();
    closeModal('loginModal');
    showNotification(`Welcome back, ${currentUser.name}!`);
    saveToStorage();
}

async function handleRegister(e) {
    e.preventDefault();
    const fullname = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    const res = await apiFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify({ fullname, email, password, role })
    });

    if (!res) return;

    if (!res.ok) {
        const err = await res.json();
        showNotification(err.message || 'Registration failed');
        return;
    }

    const user = await res.json();
    currentUser = {
        id: user.id,
        name: user.fullname,
        email: user.email,
        role: user.role,
        wallet: 20000,
        fines: 0
    };

    updateUIForLoggedInUser();
    closeModal('registerModal');
    showNotification('Registration successful! Welcome to Library Café!');
    saveToStorage();
}

function logout() {
    currentUser = null;
    cart = [];
    favorites = [];
    reservedSeats = [];
    document.getElementById('userInfo').classList.remove('active');
    document.getElementById('authButtons').style.display = 'flex';
    updateCartDisplay();
    showNotification('Logged out successfully');
    saveToStorage();
    showPage('home');
}

function updateUIForLoggedInUser() {
    document.getElementById('userInfo').classList.add('active');
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('walletDisplay').textContent = `${currentUser.wallet.toFixed(0)} AMD`;
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================
function renderTrendingBooks() {
    const container = document.getElementById('trendingBooks');
    const trending = bookDatabase.slice(0, 4);

    if (trending.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); text-align:center; padding:2rem;">Loading books...</p>';
        return;
    }

    container.innerHTML = trending.map(book => `
        <div class="card">
            <button class="btn-favorite ${favorites.some(f => f.id === book.id && f.type === 'book') ? 'active' : ''}"
                onclick="event.stopPropagation(); toggleFavorite(${book.id}, 'book')">
                ${favorites.some(f => f.id === book.id && f.type === 'book') ? '❤️' : '🤍'}
            </button>
            <div class="card-image">
                ${book.image ? `<img src="${book.image}" alt="${book.title}">` : book.icon}
            </div>
            <div class="card-content">
                <div class="card-title">${book.title}</div>
                <div class="card-subtitle">${book.author}</div>
                <div class="card-description">${book.description}</div>
                <span class="card-status status-${book.status}">${book.status === 'available' ? 'Available' : 'Borrowed'}</span>
                <div class="card-actions">
                    ${book.status === 'available'
            ? `<button class="btn btn-primary btn-small" onclick="borrowBook(${book.id})">Borrow</button>`
            : `<button class="btn btn-secondary btn-small" disabled>Borrowed</button>`
        }
                </div>
            </div>
        </div>
    `).join('');
}

function renderPopularMenu() {
    const container = document.getElementById('popularMenu');
    const popular = menuDatabase.slice(0, 4);

    if (popular.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); text-align:center; padding:2rem;">Loading menu...</p>';
        return;
    }

    container.innerHTML = popular.map(item => `
        <div class="card">
            <button class="btn-favorite ${favorites.some(f => f.id === item.id && f.type === 'menu') ? 'active' : ''}"
                onclick="event.stopPropagation(); toggleFavorite(${item.id}, 'menu')">
                ${favorites.some(f => f.id === item.id && f.type === 'menu') ? '❤️' : '🤍'}
            </button>
            <div class="card-image">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.icon}
            </div>
            <div class="card-content">
                <div class="card-title">${item.name}</div>
                <div class="card-subtitle">${item.category}</div>
                <div class="card-description">${item.description}</div>
                <div class="card-price">${Number(item.price).toFixed(0)} AMD</div>
                <div class="card-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCart(${item.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderLibraryBooks(category) {
    const container = document.getElementById('libraryBooks');
    const filtered = category === 'all' ? bookDatabase : bookDatabase.filter(b => b.category === category);

    if (filtered.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); text-align:center; padding:2rem;">No books found.</p>';
    } else {
        container.innerHTML = filtered.map(book => `
            <div class="card">
                <button class="btn-favorite ${favorites.some(f => f.id === book.id && f.type === 'book') ? 'active' : ''}"
                    onclick="event.stopPropagation(); toggleFavorite(${book.id}, 'book')">
                    ${favorites.some(f => f.id === book.id && f.type === 'book') ? '❤️' : '🤍'}
                </button>
                <div class="card-image">
                    ${book.image ? `<img src="${book.image}" alt="${book.title}">` : book.icon}
                </div>
                <div class="card-content">
                    <div class="card-title">${book.title}</div>
                    <div class="card-subtitle">${book.author}</div>
                    <div class="card-subtitle" style="margin-top: 0.5rem;">Category: ${book.category}</div>
                    <span class="card-status status-${book.status}">${book.status === 'available' ? 'Available' : 'Borrowed'}</span>
                    <div class="card-actions">
                        ${book.status === 'available'
                ? `<button class="btn btn-primary btn-small" onclick="borrowBook(${book.id})">Borrow</button>`
                : `<button class="btn btn-secondary btn-small" disabled>Borrowed</button>`
            }
                    </div>
                </div>
            </div>
        `).join('');
    }

    document.querySelectorAll('#library .tab').forEach(t => t.classList.remove('active'));
    if (event && event.target && event.target.classList.contains('tab')) {
        event.target.classList.add('active');
    }
}

function renderCafeMenu(category) {
    const container = document.getElementById('cafeMenu');
    const filtered = category === 'all' ? menuDatabase : menuDatabase.filter(m => m.category === category);

    if (filtered.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); text-align:center; padding:2rem;">No items found.</p>';
    } else {
        container.innerHTML = filtered.map(item => `
            <div class="card">
                <button class="btn-favorite ${favorites.some(f => f.id === item.id && f.type === 'menu') ? 'active' : ''}"
                    onclick="event.stopPropagation(); toggleFavorite(${item.id}, 'menu')">
                    ${favorites.some(f => f.id === item.id && f.type === 'menu') ? '❤️' : '🤍'}
                </button>
                <div class="card-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.icon}
                </div>
                <div class="card-content">
                    <div class="card-title">${item.name}</div>
                    <div class="card-subtitle">${item.category}</div>
                    <div class="card-description">${item.description}</div>
                    <div class="card-price">${Number(item.price).toFixed(0)} AMD</div>
                    <div class="card-actions">
                        <button class="btn btn-primary btn-small" onclick="addToCart(${item.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    document.querySelectorAll('#cafe .tab').forEach(t => t.classList.remove('active'));
    if (event && event.target && event.target.classList.contains('tab')) {
        event.target.classList.add('active');
    }
}

// ============================================================
// FAVORITES (stored locally — no DB table for favorites)
// ============================================================
function toggleFavorite(itemId, type) {
    const existingIndex = favorites.findIndex(f => f.id === itemId && f.type === type);
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        showNotification('Removed from favorites');
    } else {
        favorites.push({ id: itemId, type: type });
        showNotification('Added to favorites!');
    }
    saveToStorage();
    renderTrendingBooks();
    renderPopularMenu();
    rerenderActiveLibraryTab();
    rerenderActiveCafeTab();
    if (document.getElementById('favorites').classList.contains('active')) renderFavorites();
}

function rerenderActiveLibraryTab() {
    const tab = document.querySelector('#library .tab.active');
    if (!tab) return;
    const text = tab.textContent.trim();
    const map = { 'All Books': 'all', 'Fiction': 'Fiction', 'Non-Fiction': 'Non-Fiction', 'Technology': 'Technology', 'Science': 'Science' };
    renderLibraryBooks(map[text] || 'all');
}

function rerenderActiveCafeTab() {
    const tab = document.querySelector('#cafe .tab.active');
    if (!tab) return;
    const text = tab.textContent.trim();
    const map = { 'All Items': 'all', 'Hot Drinks': 'Hot Drinks', 'Cold Drinks': 'Cold Drinks', 'Breakfast': 'Breakfast', 'Sandwiches': 'Sandwiches', 'Salads': 'Salads', 'Desserts': 'Desserts' };
    renderCafeMenu(map[text] || 'all');
}

function renderFavorites() {
    const container = document.getElementById('favoritesContent');
    if (favorites.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">No favorites yet. Start adding items you love!</p>';
        return;
    }

    const favoriteBooks = favorites.filter(f => f.type === 'book')
        .map(fav => bookDatabase.find(b => b.id === fav.id)).filter(Boolean);
    const favoriteMenuItems = favorites.filter(f => f.type === 'menu')
        .map(fav => menuDatabase.find(m => m.id === fav.id)).filter(Boolean);

    let html = '';

    if (favoriteBooks.length > 0) {
        html += `
            <div style="margin-bottom: 3rem;">
                <h3 style="color: var(--primary); margin-bottom: 1.5rem; font-size: 1.5rem;">❤️ Favorite Books (${favoriteBooks.length})</h3>
                <div class="cards-grid">
                    ${favoriteBooks.map(book => `
                        <div class="card">
                            <button class="btn-favorite active" onclick="event.stopPropagation(); toggleFavorite(${book.id}, 'book')">❤️</button>
                            <div class="card-image">${book.image ? `<img src="${book.image}" alt="${book.title}">` : book.icon}</div>
                            <div class="card-content">
                                <div class="card-title">${book.title}</div>
                                <div class="card-subtitle">${book.author}</div>
                                <div class="card-description">${book.description}</div>
                                <span class="card-status status-${book.status}">${book.status === 'available' ? 'Available' : 'Borrowed'}</span>
                                <div class="card-actions">
                                    ${book.status === 'available'
                ? `<button class="btn btn-primary btn-small" onclick="borrowBook(${book.id})">Borrow</button>`
                : `<button class="btn btn-secondary btn-small" disabled>Borrowed</button>`
            }
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    if (favoriteMenuItems.length > 0) {
        html += `
            <div>
                <h3 style="color: var(--primary); margin-bottom: 1.5rem; font-size: 1.5rem;">☕ Favorite Café Items (${favoriteMenuItems.length})</h3>
                <div class="cards-grid">
                    ${favoriteMenuItems.map(item => `
                        <div class="card">
                            <button class="btn-favorite active" onclick="event.stopPropagation(); toggleFavorite(${item.id}, 'menu')">❤️</button>
                            <div class="card-image">${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.icon}</div>
                            <div class="card-content">
                                <div class="card-title">${item.name}</div>
                                <div class="card-subtitle">${item.category}</div>
                                <div class="card-description">${item.description}</div>
                                <div class="card-price">${Number(item.price).toFixed(0)} AMD</div>
                                <div class="card-actions">
                                    <button class="btn btn-primary btn-small" onclick="addToCart(${item.id})">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }

    container.innerHTML = html;
}

// ============================================================
// BOOK OPERATIONS — connected to API
// ============================================================
async function borrowBook(bookId) {
    if (!currentUser) {
        showNotification('Please login to borrow books');
        openModal('loginModal');
        return;
    }

    const res = await apiFetch('/borrowings', {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser.id, bookId: bookId })
    });

    if (!res) return;

    if (!res.ok) {
        const err = await res.json();
        showNotification(err.message || 'Could not borrow book');
        return;
    }

    const borrowing = await res.json();
    const dueDate = new Date(borrowing.dueDate).toLocaleDateString();

    // Update local cache so UI reflects change immediately
    const book = bookDatabase.find(b => b.id === bookId);
    if (book) book.status = 'borrowed';

    showNotification(`"${borrowing.bookTitle}" borrowed! Due: ${dueDate}`);
    renderTrendingBooks();
    renderLibraryBooks('all');
    updateStats();
}

// ============================================================
// CART OPERATIONS (cart stays local, checkout sends to API)
// ============================================================
function addToCart(itemId) {
    const item = menuDatabase.find(m => m.id === itemId);
    if (!item) return;

    const existing = cart.find(c => c.id === itemId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartDisplay();
    showNotification(`${item.name} added to cart!`);
    saveToStorage();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    renderCartModal();
    saveToStorage();
}

function updateQuantity(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        updateCartDisplay();
        renderCartModal();
        saveToStorage();
    }
}

function updateCartDisplay() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function renderCartModal() {
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">Your cart is empty</p>';
        document.getElementById('cartTotalAmount').textContent = '0';
        return;
    }
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div style="font-weight: 600; color: var(--primary);">${item.name}</div>
                <div style="color: var(--text-light); font-size: 0.9rem;">${Number(item.price).toFixed(0)} AMD each</div>
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="margin: 0 0.5rem; font-weight: 600;">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="btn btn-secondary" style="margin-left: 1rem; padding: 0.4rem 0.8rem;" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotalAmount').textContent = total.toFixed(0);
}

async function checkout() {
    if (!currentUser) {
        showNotification('Please login to checkout');
        closeModal('cartModal');
        openModal('loginModal');
        return;
    }
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (currentUser.wallet < total) {
        showNotification('Insufficient wallet balance!');
        return;
    }

    // Create order in the database
    const res = await apiFetch('/cafeorders', {
        method: 'POST',
        body: JSON.stringify({
            userId: currentUser.id,
            orderType: 'Dine-in',
            items: cart.map(i => ({ itemId: i.id, quantity: i.quantity }))
        })
    });

    if (!res) return;

    if (!res.ok) {
        const err = await res.json();
        showNotification(err.message || 'Order failed. Please try again.');
        return;
    }

    // Deduct from local wallet display
    currentUser.wallet -= total;
    document.getElementById('walletDisplay').textContent = `${currentUser.wallet.toFixed(0)} AMD`;

    showNotification(`Order placed! Total: ${total.toFixed(0)} AMD`);
    cart = [];
    updateCartDisplay();
    closeModal('cartModal');
    saveToStorage();
}

// ============================================================
// SEAT RESERVATION (local only — no seat table in DB)
// ============================================================
function generateSeatMap() {
    const container = document.getElementById('seatMap');
    container.innerHTML = '';

    for (let i = 1; i <= 40; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.textContent = i;

        if (reservedSeats.includes(i)) {
            seat.classList.add('reserved');
        } else if (Math.random() < 0.75) {
            seat.classList.add('available');
            seat.onclick = () => toggleSeatReservation(i, seat);
        } else {
            seat.classList.add('occupied');
        }
        container.appendChild(seat);
    }
}

function toggleSeatReservation(seatNumber, seatElement) {
    if (!currentUser) {
        showNotification('Please login to reserve seats');
        openModal('loginModal');
        return;
    }
    if (reservedSeats.includes(seatNumber)) {
        reservedSeats = reservedSeats.filter(s => s !== seatNumber);
        seatElement.classList.remove('reserved');
        seatElement.classList.add('available');
        showNotification(`Seat ${seatNumber} reservation cancelled`);
    } else {
        reservedSeats.push(seatNumber);
        seatElement.classList.remove('available');
        seatElement.classList.add('reserved');
        showNotification(`Seat ${seatNumber} reserved!`);
    }
    saveToStorage();
}

// ============================================================
// PROFILE PAGE — loads history from API
// ============================================================
async function updateProfilePage() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.role;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileMemberSince').textContent = 'Member';
    document.getElementById('profileWallet').textContent = `${currentUser.wallet.toFixed(0)} AMD`;
    document.getElementById('profileFines').textContent = `0 AMD`;

    // Load borrowing history from API
    const borrowRes = await apiFetch(`/users/${currentUser.id}/borrowings`);
    const borrowingHistoryContainer = document.getElementById('borrowingHistory');
    if (borrowRes && borrowRes.ok) {
        const borrowings = await borrowRes.json();
        document.getElementById('profileBooksBorrowed').textContent = borrowings.length;
        if (borrowings.length === 0) {
            borrowingHistoryContainer.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-light);">No borrowing history</td></tr>';
        } else {
            borrowingHistoryContainer.innerHTML = borrowings.map(b => `
                <tr>
                    <td>${b.bookTitle}</td>
                    <td>${new Date(b.borrowDate).toLocaleDateString()}</td>
                    <td>${b.dueDate ? new Date(b.dueDate).toLocaleDateString() : '-'}</td>
                    <td><span class="card-status ${b.returnDate ? 'status-borrowed' : b.isOverdue ? 'status-borrowed' : 'status-available'}">
                        ${b.returnDate ? 'Returned' : b.isOverdue ? 'Overdue' : 'Active'}
                    </span></td>
                </tr>
            `).join('');
        }
    }

    // Load order history from API
    const orderRes = await apiFetch(`/users/${currentUser.id}/orders`);
    const orderHistoryContainer = document.getElementById('orderHistory');
    if (orderRes && orderRes.ok) {
        const orders = await orderRes.json();
        if (orders.length === 0) {
            orderHistoryContainer.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-light);">No order history</td></tr>';
        } else {
            orderHistoryContainer.innerHTML = orders.map(o => `
                <tr>
                    <td>${o.items.map(i => `${i.itemName} x${i.quantity}`).join(', ')}</td>
                    <td>${new Date(o.orderDate).toLocaleDateString()}</td>
                    <td>${Number(o.totalAmount).toFixed(0)} AMD</td>
                    <td><span class="card-status status-available">${o.status}</span></td>
                </tr>
            `).join('');
        }
    }
}

// ============================================================
// SEARCH — filters local cache (loaded from API on startup)
// ============================================================
async function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('searchCategory').value;

    if (!query) {
        showNotification('Please enter a search term');
        return;
    }

    if (category === 'books' || category === 'all') {
        // Search via API for more accurate results
        const res = await apiFetch(`/books?search=${encodeURIComponent(query)}`);
        if (res && res.ok) {
            const results = await res.json();
            if (results.length > 0) {
                bookDatabase = results.map(b => ({
                    id: b.id,
                    title: b.title,
                    author: b.author,
                    category: b.category,
                    status: b.isAvailable ? 'available' : 'borrowed',
                    icon: '📕',
                    image: '',
                    description: `Bookshelf: ${b.bookshelf}`
                }));
                showPage('library');
                renderLibraryBooks('all');
                showNotification(`Found ${results.length} book(s)`);
                return;
            }
        }
    }

    if (category === 'menu' || category === 'all') {
        const results = menuDatabase.filter(m => m.name.toLowerCase().includes(query));
        if (results.length > 0) {
            showPage('cafe');
            showNotification(`Found ${results.length} menu item(s)`);
        } else {
            showNotification('No results found');
        }
    }
}

// ============================================================
// FILTER FUNCTIONS
// ============================================================
function filterBooks(category) {
    renderLibraryBooks(category);
}

function filterMenu(category) {
    renderCafeMenu(category);
}

// ============================================================
// STATS UPDATE
// ============================================================
function updateStats() {
    const availableCount = bookDatabase.filter(b => b.status === 'available').length;
    document.getElementById('statBooks').textContent = availableCount;
    document.getElementById('statMembers').textContent = '1,234';
    document.getElementById('statItems').textContent = menuDatabase.length;
}

// ============================================================
// MODAL OPERATIONS
// ============================================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    if (modalId === 'cartModal') renderCartModal();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
};

// ============================================================
// NOTIFICATION
// ============================================================
function showNotification(message) {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    text.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}