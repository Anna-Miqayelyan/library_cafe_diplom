const bookDatabase = [
    { id: 1, title: "The Midnight Library", author: "Matt Haig", category: "Fiction", status: "available", icon: "📕", image: "midnight.jpg" },
    { id: 2, title: "Atomic Habits", author: "James Clear", category: "Non-Fiction", status: "borrowed", icon: "📘", image: "images/books/atomic-habits.jpg" },
    { id: 3, title: "Sapiens", author: "Yuval Noah Harari", category: "Non-Fiction", status: "available", icon: "📗", image: "images/books/sapiens.jpg" },
    { id: 4, title: "Clean Code", author: "Robert C. Martin", category: "Technology", status: "available", icon: "📙", image: "images/books/clean-code.jpg" },
    { id: 5, title: "The Pragmatic Programmer", author: "David Thomas", category: "Technology", status: "available", icon: "📕", image: "images/books/pragmatic-programmer.jpg" },
    { id: 6, title: "Educated", author: "Tara Westover", category: "Non-Fiction", status: "available", icon: "📘", image: "images/books/educated.jpg" },
    { id: 7, title: "1984", author: "George Orwell", category: "Fiction", status: "available", icon: "📗", image: "images/books/1984.jpg" },
    { id: 8, title: "A Brief History of Time", author: "Stephen Hawking", category: "Science", status: "available", icon: "📙", image: "images/books/brief-history-time.jpg" }
];

const menuDatabase = [
    // Hot Beverages
    { id: 1, name: "Espresso", category: "Hot Drinks", price: 800, icon: "☕", image: "images/espresso.jpg", description: "Pure, intense shot of premium coffee beans, rich and aromatic" },
    { id: 2, name: "Americano", category: "Hot Drinks", price: 1000, icon: "☕", image: "images/americano.jpg", description: "Bold espresso diluted with hot water for a smooth, rich taste" },
    { id: 3, name: "Cappuccino", category: "Hot Drinks", price: 1200, icon: "☕", image: "images/cappuccino.jpg", description: "Rich espresso with steamed milk foam, perfectly balanced and creamy" },
    { id: 4, name: "Latte", category: "Hot Drinks", price: 1300, icon: "☕", image: "images/latte.jpg", description: "Smooth espresso with steamed milk, topped with delicate microfoam" },
    { id: 5, name: "Mocha", category: "Hot Drinks", price: 1500, icon: "☕", image: "images/mocha.jpg", description: "Rich chocolate and espresso blend with steamed milk and whipped cream" },
    { id: 6, name: "Hot Chocolate", category: "Hot Drinks", price: 1200, icon: "☕", image: "images/hotchocolate.jpg", description: "Rich, creamy hot chocolate topped with marshmallows or whipped cream" },
    { id: 7, name: "Black Tea", category: "Hot Drinks", price: 700, icon: "☕", image: "images/blacktea.jpg", description: "Premium loose leaf black tea, rich and full-bodied" },
    { id: 8, name: "Green Tea", category: "Hot Drinks", price: 800, icon: "☕", image: "images/greentea.jpg", description: "Refreshing green tea with delicate flavor and natural antioxidants" },
    { id: 9, name: "Herbal Tea", category: "Hot Drinks", price: 900, icon: "☕", image: "images/herbaltea.jpg", description: "Soothing herbal blend, caffeine-free with natural ingredients" },
    { id: 10, name: "Chai Tea", category: "Hot Drinks", price: 1000, icon: "☕", image: "images/chai.jpg", description: "Spiced Indian tea with aromatic blend of cinnamon, cardamom, and ginger" },

    // Cold Beverages
    { id: 11, name: "Iced Coffee", category: "Cold Drinks", price: 1300, icon: "🧋", image: "images/icedcoffee.jpg", description: "Refreshing cold brew coffee served over ice" },
    { id: 12, name: "Iced Latte", category: "Cold Drinks", price: 1500, icon: "🧋", image: "images/icedlatte.jpg", description: "Smooth espresso with cold milk over ice, perfectly chilled" },
    { id: 13, name: "Cold Brew", category: "Cold Drinks", price: 1500, icon: "🧋", image: "images/coldbrew.jpg", description: "Slow-steeped coffee for smooth, naturally sweet flavor" },
    { id: 14, name: "Iced Tea", category: "Cold Drinks", price: 1000, icon: "🧋", image: "images/icedtea.jpg", description: "Refreshing brewed tea served cold with ice and lemon" },
    { id: 15, name: "Berry Smoothie", category: "Cold Drinks", price: 1800, icon: "🧋", image: "images/berrysmoothie.jpg", description: "Blend of fresh berries, yogurt, and honey - naturally delicious" },
    { id: 16, name: "Tropical Smoothie", category: "Cold Drinks", price: 1900, icon: "🧋", image: "images/tropicalsmoothie.jpg", description: "Mango, pineapple, and banana smoothie with coconut milk" },
    { id: 17, name: "Green Smoothie", category: "Cold Drinks", price: 2000, icon: "🧋", image: "images/greensmoothie.jpg", description: "Healthy spinach, kale, apple, and banana smoothie packed with nutrients" },
    { id: 18, name: "Lemonade", category: "Cold Drinks", price: 1200, icon: "🧋", image: "images/lemonade.jpg", description: "Freshly squeezed lemonade, perfectly sweet and tangy" },
    { id: 19, name: "Coca Cola", category: "Cold Drinks", price: 700, icon: "🧋", image: "images/cola.jpg", description: "Classic refreshing cola soft drink" },
    { id: 20, name: "Sprite", category: "Cold Drinks", price: 700, icon: "🧋", image: "images/sprite.jpg", description: "Crisp lemon-lime flavored soda" },
    { id: 21, name: "Orange Juice", category: "Cold Drinks", price: 1000, icon: "🧋", image: "images/orangejuice.jpg", description: "Freshly squeezed orange juice, vitamin C rich" },

    // Breakfast / Brunch
    { id: 22, name: "Plain Croissant", category: "Breakfast", price: 900, icon: "🥐", image: "images/croissant.jpg", description: "Flaky, buttery French pastry, freshly baked daily" },
    { id: 23, name: "Chocolate Croissant", category: "Breakfast", price: 1100, icon: "🥐", image: "images/chococroissant.jpg", description: "Buttery croissant filled with rich dark chocolate" },
    { id: 24, name: "Almond Croissant", category: "Breakfast", price: 1200, icon: "🥐", image: "images/almondcroissant.jpg", description: "Croissant with sweet almond cream filling and sliced almonds" },
    { id: 25, name: "Bagel with Cream Cheese", category: "Breakfast", price: 1000, icon: "🥯", image: "images/bagel.jpg", description: "Fresh bagel toasted with creamy spread" },
    { id: 26, name: "Blueberry Muffin", category: "Breakfast", price: 800, icon: "🧁", image: "images/muffin.jpg", description: "Soft, moist muffin loaded with fresh blueberries" },
    { id: 27, name: "Chocolate Chip Muffin", category: "Breakfast", price: 900, icon: "🧁", image: "images/chocomuffin.jpg", description: "Sweet muffin packed with chocolate chips" },
    { id: 28, name: "Banana Muffin", category: "Breakfast", price: 1000, icon: "🧁", image: "images/bananamuffin.jpg", description: "Moist banana muffin with warm spices and walnuts" },
    { id: 29, name: "Pancakes", category: "Breakfast", price: 1500, icon: "🥞", image: "images/pancakes.jpg", description: "Fluffy buttermilk pancakes served with syrup and butter" },
    { id: 30, name: "Waffles", category: "Breakfast", price: 2000, icon: "🧇", image: "images/waffles.jpg", description: "Belgian waffles topped with fresh fruit and whipped cream" },
    { id: 31, name: "Egg & Cheese Sandwich", category: "Breakfast", price: 1500, icon: "🥪", image: "images/eggsandwich.jpg", description: "Scrambled eggs and melted cheese on toasted bread" },
    { id: 32, name: "Bacon Breakfast Sandwich", category: "Breakfast", price: 1700, icon: "🥪", image: "images/baconsandwich.jpg", description: "Crispy bacon, egg, and cheese on your choice of bread" },
    { id: 33, name: "Veggie Breakfast Sandwich", category: "Breakfast", price: 1800, icon: "🥪", image: "images/veggiesandwich.jpg", description: "Grilled vegetables, egg, and cheese - healthy start to your day" },
    { id: 34, name: "Yogurt Parfait", category: "Breakfast", price: 1500, icon: "🥗", image: "images/parfait.jpg", description: "Greek yogurt layered with granola, honey, and fresh berries" },

    // Sandwiches & Wraps
    { id: 35, name: "Turkey Sandwich", category: "Sandwiches", price: 1500, icon: "🥪", image: "images/turkeysandwich.jpg", description: "Sliced turkey breast with lettuce, tomato, and mayo" },
    { id: 36, name: "Chicken Sandwich", category: "Sandwiches", price: 1600, icon: "🥪", image: "images/chickensandwich.jpg", description: "Grilled chicken breast with fresh vegetables and sauce" },
    { id: 37, name: "Ham Sandwich", category: "Sandwiches", price: 1800, icon: "🥪", image: "images/hamsandwich.jpg", description: "Premium ham with cheese, lettuce, and mustard" },
    { id: 38, name: "Veggie Sandwich", category: "Sandwiches", price: 1200, icon: "🥪", image: "images/veggiesand.jpg", description: "Fresh vegetables with hummus on whole grain bread" },
    { id: 39, name: "Veggie Wrap", category: "Sandwiches", price: 1500, icon: "🌯", image: "images/veggiewrap.jpg", description: "Grilled vegetables wrapped in soft tortilla with sauce" },
    { id: 40, name: "Club Sandwich", category: "Sandwiches", price: 1800, icon: "🥪", image: "images/clubsandwich.jpg", description: "Triple-decker with turkey, bacon, lettuce, and tomato" },
    { id: 41, name: "Caprese Panini", category: "Sandwiches", price: 1800, icon: "🥪", image: "images/caprese.jpg", description: "Mozzarella, tomato, and basil pressed on Italian bread" },
    { id: 42, name: "Chicken Pesto Panini", category: "Sandwiches", price: 2000, icon: "🥪", image: "images/pestopanini.jpg", description: "Grilled chicken with pesto sauce and mozzarella, pressed to perfection" },

    // Salads
    { id: 43, name: "Caesar Salad", category: "Salads", price: 1800, icon: "🥗", image: "images/caesar.jpg", description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan" },
    { id: 44, name: "Greek Salad", category: "Salads", price: 1500, icon: "🥗", image: "images/greek.jpg", description: "Fresh vegetables with feta cheese, olives, and olive oil" },
    { id: 45, name: "Cobb Salad", category: "Salads", price: 2000, icon: "🥗", image: "images/cobb.jpg", description: "Mixed greens with chicken, bacon, egg, avocado, and blue cheese" },
    { id: 46, name: "Quinoa Salad", category: "Salads", price: 1500, icon: "🥗", image: "images/quinoa.jpg", description: "Protein-rich quinoa with vegetables, nuts, and light vinaigrette" },
    { id: 47, name: "Mixed Greens Salad", category: "Salads", price: 1800, icon: "🥗", image: "images/mixedgreens.jpg", description: "Fresh seasonal greens with your choice of dressing" },

    // Desserts / Pastries
    { id: 48, name: "Cheesecake", category: "Desserts", price: 1500, icon: "🍰", image: "images/cheesecake.jpg", description: "Creamy New York style cheesecake with graham cracker crust" },
    { id: 49, name: "Chocolate Cake", category: "Desserts", price: 1800, icon: "🍰", image: "images/chococake.jpg", description: "Rich, moist chocolate layer cake with chocolate frosting" },
    { id: 50, name: "Carrot Cake", category: "Desserts", price: 2000, icon: "🍰", image: "images/carrotcake.jpg", description: "Spiced carrot cake with cream cheese frosting and walnuts" },
    { id: 51, name: "Chocolate Chip Cookie", category: "Desserts", price: 500, icon: "🍪", image: "images/cookie.jpg", description: "Classic homemade cookie with melted chocolate chips, warm and chewy" },
    { id: 52, name: "Oatmeal Cookie", category: "Desserts", price: 600, icon: "🍪", image: "images/oatmealcookie.jpg", description: "Healthy oatmeal cookie with raisins and cinnamon" },
    { id: 53, name: "Biscotti", category: "Desserts", price: 800, icon: "🍪", image: "images/biscotti.jpg", description: "Crunchy Italian almond biscotti, perfect for dipping in coffee" },
    { id: 54, name: "Brownie", category: "Desserts", price: 700, icon: "🍫", image: "images/brownie.jpg", description: "Rich, fudgy chocolate brownie with a crispy top and gooey center" },
    { id: 55, name: "Blondie", category: "Desserts", price: 1000, icon: "🍫", image: "images/blondie.jpg", description: "Buttery vanilla brownie with white chocolate chips" },
    { id: 56, name: "Fruit Tart", category: "Desserts", price: 1200, icon: "🥧", image: "images/tart.jpg", description: "Buttery pastry shell filled with custard and fresh seasonal fruit" },
    { id: 57, name: "Apple Pie", category: "Desserts", price: 1500, icon: "🥧", image: "images/applepie.jpg", description: "Classic apple pie with cinnamon and flaky crust, served warm" }
];

let currentUser = null;
let cart = [];
let borrowedBooks = [];
let reservedSeats = [];
let orderHistory = [];
let favorites = [];

// INITIALIZE APP
window.onload = function () {
    loadFromStorage();
    updateStats();
    renderTrendingBooks();
    renderPopularMenu();
    renderLibraryBooks('all');
    renderCafeMenu('all');
    generateSeatMap();

    // Set up initial active tab for library
    const firstLibraryTab = document.querySelector('#library .tab');
    if (firstLibraryTab) {
        firstLibraryTab.classList.add('active');
    }
};

// LOCAL STORAGE
function saveToStorage() {
    const data = {
        currentUser,
        cart,
        borrowedBooks,
        reservedSeats,
        orderHistory,
        favorites
    };
    localStorage.setItem('npuaLibraryCafe', JSON.stringify(data));
}

function loadFromStorage() {
    const saved = localStorage.getItem('npuaLibraryCafe');
    if (saved) {
        const data = JSON.parse(saved);
        currentUser = data.currentUser;
        cart = data.cart || [];
        borrowedBooks = data.borrowedBooks || [];
        reservedSeats = data.reservedSeats || [];
        orderHistory = data.orderHistory || [];
        favorites = data.favorites || [];

        if (currentUser) {
            updateUIForLoggedInUser();
        }
        updateCartDisplay();
    }
}

// PAGE NAVIGATION
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    if (pageId === 'profile') {
        if (!currentUser) {
            showNotification('Please login to view your profile');
            showPage('home');
            openModal('loginModal');
            return;
        }
        updateProfilePage();
    }

    if (pageId === 'favorites') {
        renderFavorites();
    }

    if (pageId === 'library') {
        renderLibraryBooks('all');
    }

    if (pageId === 'cafe') {
        renderCafeMenu('all');
    }
}

// AUTHENTICATION
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    currentUser = {
        name: email.split('@')[0],
        email: email,
        role: 'Student',
        memberSince: new Date().toLocaleDateString(),
        wallet: 20000,
        booksBorrowed: borrowedBooks.length,
        fines: 0
    };

    updateUIForLoggedInUser();
    closeModal('loginModal');
    showNotification('Login successful! Welcome back!');
    saveToStorage();
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const role = document.getElementById('regRole').value;

    currentUser = {
        name: name,
        email: email,
        role: role,
        memberSince: new Date().toLocaleDateString(),
        wallet: 50.00,
        booksBorrowed: 0,
        fines: 0
    };

    updateUIForLoggedInUser();
    closeModal('registerModal');
    showNotification('Registration successful! Welcome to NPUA Library Café!');
    saveToStorage();
}

function logout() {
    currentUser = null;
    document.getElementById('userInfo').classList.remove('active');
    document.getElementById('authButtons').style.display = 'flex';
    showNotification('Logged out successfully');
    saveToStorage();
    showPage('home');
}

function updateUIForLoggedInUser() {
    document.getElementById('userInfo').classList.add('active');
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('walletDisplay').textContent = `${currentUser.wallet.toFixed(0)} AMD`;
}

// RENDER FUNCTIONS
function renderTrendingBooks() {
    const container = document.getElementById('trendingBooks');
    const trending = bookDatabase.slice(0, 4);

    container.innerHTML = trending.map(book => `
                <div class="card">
                    <button class="btn-favorite ${
                        .some(f => f.id === book.id && f.type === 'book') ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite(${book.id}, 'book')">
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
                            ${book.status === 'available' ?
            `<button class="btn btn-primary btn-small" onclick="borrowBook(${book.id})">Borrow</button>` :
            `<button class="btn btn-secondary btn-small" onclick="reserveBook(${book.id})">Reserve</button>`
        }
                        </div>
                    </div>
                </div>
            `).join('');
}

function renderPopularMenu() {
    const container = document.getElementById('popularMenu');
    const popular = menuDatabase.slice(0, 4);

    container.innerHTML = popular.map(item => `
                <div class="card">
                    <button class="btn-favorite ${favorites.some(f => f.id === item.id && f.type === 'menu') ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite(${item.id}, 'menu')">
                        ${favorites.some(f => f.id === item.id && f.type === 'menu') ? '❤️' : '🤍'}
                    </button>
                    <div class="card-image">
                        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.icon}
                    </div>
                    <div class="card-content">
                        <div class="card-title">${item.name}</div>
                        <div class="card-subtitle">${item.category}</div>
                        <div class="card-description">${item.description}</div>
                        <div class="card-price">${item.price.toFixed(0)} AMD</div>
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

    container.innerHTML = filtered.map(book => `
                <div class="card">
                    <div class="card-image">
                        ${book.image ? `<img src="${book.image}" alt="${book.title}">` : book.icon}
                    </div>
                    <div class="card-content">
                        <div class="card-title">${book.title}</div>
                        <div class="card-subtitle">${book.author}</div>
                        <div class="card-subtitle" style="margin-top: 0.5rem;">Category: ${book.category}</div>
                        <span class="card-status status-${book.status}">${book.status === 'available' ? 'Available' : 'Borrowed'}</span>
                        <div class="card-actions">
                            ${book.status === 'available' ?
            `<button class="btn btn-primary btn-small" onclick="borrowBook(${book.id})">Borrow</button>` :
            `<button class="btn btn-secondary btn-small" onclick="reserveBook(${book.id})">Reserve</button>`
        }
                        </div>
                    </div>
                </div>
            `).join('');

    document.querySelectorAll('#library .tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
}

function renderCafeMenu(category) {
    const container = document.getElementById('cafeMenu');
    const filtered = category === 'all' ? menuDatabase : menuDatabase.filter(m => m.category === category);

    container.innerHTML = filtered.map(item => `
                <div class="card">
                    <button class="btn-favorite ${favorites.some(f => f.id === item.id && f.type === 'menu') ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite(${item.id}, 'menu')">
                        ${favorites.some(f => f.id === item.id && f.type === 'menu') ? '❤️' : '🤍'}
                    </button>
                    <div class="card-image">
                        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.icon}
                    </div>
                    <div class="card-content">
                        <div class="card-title">${item.name}</div>
                        <div class="card-subtitle">${item.category}</div>
                        <div class="card-description">${item.description}</div>
                        <div class="card-price">${item.price.toFixed(0)} AMD</div>
                        <div class="card-actions">
                            <button class="btn btn-primary btn-small" onclick="addToCart(${item.id})">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `).join('');

    document.querySelectorAll('#cafe .tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
}

// FAVORITES FUNCTIONS
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

    // Re-render all pages to update heart buttons
    renderTrendingBooks();
    renderPopularMenu();

    // Re-render library with current filter
    const activeLibraryTab = document.querySelector('#library .tab.active');
    if (activeLibraryTab) {
        const tabText = activeLibraryTab.textContent.trim();
        if (tabText === 'All Books') renderLibraryBooks('all');
        else if (tabText === 'Fiction') renderLibraryBooks('Fiction');
        else if (tabText === 'Non-Fiction') renderLibraryBooks('Non-Fiction');
        else if (tabText === 'Technology') renderLibraryBooks('Technology');
        else if (tabText === 'Science') renderLibraryBooks('Science');
    }

    // Re-render cafe with current filter
    const activeCafeTab = document.querySelector('#cafe .tab.active');
    if (activeCafeTab) {
        const tabText = activeCafeTab.textContent.trim();
        if (tabText === 'All Items') renderCafeMenu('all');
        else if (tabText === 'Hot Drinks') renderCafeMenu('Hot Drinks');
        else if (tabText === 'Cold Drinks') renderCafeMenu('Cold Drinks');
        else if (tabText === 'Breakfast') renderCafeMenu('Breakfast');
        else if (tabText === 'Sandwiches') renderCafeMenu('Sandwiches');
        else if (tabText === 'Salads') renderCafeMenu('Salads');
        else if (tabText === 'Desserts') renderCafeMenu('Desserts');
    }

    // Update favorites page if currently viewing
    if (document.getElementById('favorites').classList.contains('active')) {
        renderFavorites();
    }
}

function renderFavorites() {
    const container = document.getElementById('favoritesContent');

    if (favorites.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">No favorites yet. Start adding items you love!</p>';
        return;
    }

    const favoriteBooks = favorites.filter(f => f.type === 'book').map(fav =>
        bookDatabase.find(b => b.id === fav.id)
    ).filter(item => item !== undefined);

    const favoriteMenuItems = favorites.filter(f => f.type === 'menu').map(fav =>
        menuDatabase.find(m => m.id === fav.id)
    ).filter(item => item !== undefined);

    let html = '';

    // Books Section
    if (favoriteBooks.length > 0) {
        html += `
                    <div style="margin-bottom: 3rem;">
                        <h3 style="color: var(--primary); margin-bottom: 1.5rem; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                             Favorite Books (${favoriteBooks.length})
                        </h3>
                        <div class="cards-grid">
                            ${favoriteBooks.map(book => `
                                <div class="card">
                                    <button class="btn-favorite active" onclick="event.stopPropagation(); toggleFavorite(${book.id}, 'book')">
                                        ❤️
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
                                            ${book.status === 'available' ?
                `<button class="btn btn-primary btn-small" onclick="borrowBook(${book.id})">Borrow</button>` :
                `<button class="btn btn-secondary btn-small" onclick="reserveBook(${book.id})">Reserve</button>`
            }
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
    }

    // Café Items Section
    if (favoriteMenuItems.length > 0) {
        html += `
                    <div>
                        <h3 style="color: var(--primary); margin-bottom: 1.5rem; font-size: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                             Favorite Café Items (${favoriteMenuItems.length})
                        </h3>
                        <div class="cards-grid">
                            ${favoriteMenuItems.map(item => `
                                <div class="card">
                                    <button class="btn-favorite active" onclick="event.stopPropagation(); toggleFavorite(${item.id}, 'menu')">
                                        ❤️
                                    </button>
                                    <div class="card-image">
                                        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : item.icon}
                                    </div>
                                    <div class="card-content">
                                        <div class="card-title">${item.name}</div>
                                        <div class="card-subtitle">${item.category}</div>
                                        <div class="card-description">${item.description}</div>
                                        <div class="card-price">${item.price.toFixed(0)} AMD</div>
                                        <div class="card-actions">
                                            <button class="btn btn-primary btn-small" onclick="addToCart(${item.id})">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
    }

    container.innerHTML = html;
}

// BOOK OPERATIONS
function borrowBook(bookId) {
    if (!currentUser) {
        showNotification('Please login to borrow books');
        openModal('loginModal');
        return;
    }

    const book = bookDatabase.find(b => b.id === bookId);
    if (book && book.status === 'available') {
        book.status = 'borrowed';
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        borrowedBooks.push({
            bookId: book.id,
            title: book.title,
            borrowDate: new Date().toLocaleDateString(),
            dueDate: dueDate.toLocaleDateString(),
            status: 'active'
        });

        currentUser.booksBorrowed++;
        showNotification(`"${book.title}" borrowed successfully! Due date: ${dueDate.toLocaleDateString()}`);
        saveToStorage();
        renderTrendingBooks();
        renderLibraryBooks('all');
    }
}

function reserveBook(bookId) {
    if (!currentUser) {
        showNotification('Please login to reserve books');
        openModal('loginModal');
        return;
    }
    const book = bookDatabase.find(b => b.id === bookId);
    showNotification(`"${book.title}" reserved! We'll notify you when it's available.`);
}

// CART OPERATIONS
function addToCart(itemId) {
    const item = menuDatabase.find(m => m.id === itemId);
    if (item) {
        const existingItem = cart.find(c => c.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCartDisplay();
        showNotification(`${item.name} added to cart!`);
        saveToStorage();
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    renderCartModal();
    saveToStorage();
}

function updateQuantity(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartDisplay();
            renderCartModal();
            saveToStorage();
        }
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
        document.getElementById('cartTotalAmount').textContent = '0.00';
        return;
    }

    container.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div style="font-weight: 600; color: var(--primary);">${item.name}</div>
                        <div style="color: var(--text-light); font-size: 0.9rem;">${item.price.toFixed(0)} AMD each</div>
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

function checkout() {
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

    currentUser.wallet -= total;
    document.getElementById('walletDisplay').textContent = `${currentUser.wallet.toFixed(0)} AMD`;

    orderHistory.push({
        items: cart.map(item => `${item.name} x${item.quantity}`).join(', '),
        date: new Date().toLocaleDateString(),
        total: total,
        status: 'Completed'
    });

    showNotification(`Order placed successfully! Total: ${total.toFixed(0)} AMD`);
    cart = [];
    updateCartDisplay();
    closeModal('cartModal');
    saveToStorage();
}

// SEAT RESERVATION
function generateSeatMap() {
    const container = document.getElementById('seatMap');
    container.innerHTML = '';

    for (let i = 1; i <= 40; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.textContent = i;

        const random = Math.random();
        if (reservedSeats.includes(i)) {
            seat.classList.add('reserved');
        } else if (random < 0.75) {
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
        showNotification(`Seat ${seatNumber} reserved successfully!`);
    }
    saveToStorage();
}

// PROFILE PAGE
function updateProfilePage() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.role;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileMemberSince').textContent = currentUser.memberSince;
    document.getElementById('profileWallet').textContent = `${currentUser.wallet.toFixed(0)} AMD`;
    document.getElementById('profileBooksBorrowed').textContent = borrowedBooks.length;
    document.getElementById('profileFines').textContent = `${currentUser.fines.toFixed(0)} AMD`;

    const borrowingHistoryContainer = document.getElementById('borrowingHistory');
    if (borrowedBooks.length === 0) {
        borrowingHistoryContainer.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-light);">No borrowing history</td></tr>';
    } else {
        borrowingHistoryContainer.innerHTML = borrowedBooks.map(b => `
                    <tr>
                        <td>${b.title}</td>
                        <td>${b.borrowDate}</td>
                        <td>${b.dueDate}</td>
                        <td><span class="card-status status-available">${b.status === 'active' ? 'Active' : 'Returned'}</span></td>
                    </tr>
                `).join('');
    }

    const orderHistoryContainer = document.getElementById('orderHistory');
    if (orderHistory.length === 0) {
        orderHistoryContainer.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-light);">No order history</td></tr>';
    } else {
        orderHistoryContainer.innerHTML = orderHistory.map(o => `
                    <tr>
                        <td>${o.items}</td>
                        <td>${o.date}</td>
                        <td>${o.total.toFixed(0)} AMD</td>
                        <td><span class="card-status status-available">${o.status}</span></td>
                    </tr>
                `).join('');
    }
}

// SEARCH
function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('searchCategory').value;

    if (!query) {
        showNotification('Please enter a search term');
        return;
    }

    if (category === 'books' || category === 'all') {
        const results = bookDatabase.filter(b =>
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query)
        );
        if (results.length > 0) {
            showPage('library');
            showNotification(`Found ${results.length} book(s)`);
        }
    }

    if (category === 'menu' || category === 'all') {
        const results = menuDatabase.filter(m =>
            m.name.toLowerCase().includes(query)
        );
        if (results.length > 0) {
            showPage('cafe');
            showNotification(`Found ${results.length} menu item(s)`);
        }
    }
}

// FILTER FUNCTIONS
function filterBooks(category) {
    renderLibraryBooks(category);
}

function filterMenu(category) {
    renderCafeMenu(category);
}

// STATS UPDATE
function updateStats() {
    document.getElementById('statBooks').textContent = bookDatabase.filter(b => b.status === 'available').length;
    document.getElementById('statMembers').textContent = '1,234';
    document.getElementById('statItems').textContent = menuDatabase.length;
}

// MODAL OPERATIONS
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    if (modalId === 'cartModal') {
        renderCartModal();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// NOTIFICATION
function showNotification(message) {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    text.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}