// ═══════════════════════════════════════════════════════════
//  LIBRARY CAFÉ — i18n.js  (Armenian / English translations)
// ═══════════════════════════════════════════════════════════

const TRANSLATIONS = {
    hy: {
        // Auth
        signIn: 'Մուտք',
        signUp: 'Գրանցվել',
        signOut: 'Ելք',
        login: 'Մուտք',
        register: 'Գրանցվել',
        emailAddress: 'Էլ. հասցե',
        password: 'Գաղտնաբառ',
        fullName: 'Անուն Ազգանուն',
        role: 'Դեր',
        createAccount: 'Ստեղծել հաշիվ',
        authQuote: '«Գրադարանը շքեղություն չէ, այլ կյանքի անհրաժեշտություն»',
        authEyebrow: 'Խելացի Համալսարանական Կենտրոն',
        student: 'Ուսանող',
        librarian: 'Գրադարանավար',
        cafeStaff: 'Սրճարանի Աշխատակից',
        admin: 'Ադմին',

        // Nav
        home: 'Գլխավոր',
        library: 'Գրադարան',
        cafe: 'Սրճարան',
        favorites: 'Սիրելիներ',
        reservations: 'Ամրագրումներ',
        aiAssistant: 'AI Օգնական',
        profile: 'Պրոֆիլ',
        dashboard: 'Վահանակ',
        shelfMap: 'Դարակի Քարտեզ',

        // Home
        welcomeBack: 'Բարի վերադարձ',
        heroTitle: 'Ուրախ ենք <em>քեզ</em> տեսնել։',
        heroSub: 'Հայտնաբերիր բացառիկ գրքեր, արհեստագործական սուրճ և գիտելիք կարևորող համայնք։',
        searchPlaceholder: 'Որոնել հավաքածուում…',
        searchAll: 'Բոլորը',
        searchBooks: 'Գրքեր',
        searchMenu: 'Ճաշացուցակ',
        search: 'Որոնել',
        availableBooks: 'Հասանելի Գրքեր',
        activeMembers: 'Ակտիվ Անդամներ',
        cafeItems: 'Սրճարանի Ապրանքներ',
        upcomingEvents: 'Առաջիկա Միջոցառումներ',
        trendingBooks: 'Հայտնի Գրքեր',
        popularMenu: 'Հայտնի Ճաշատեսակներ',

        // Library
        libraryCatalog: 'Գրադարանի Կատալոգ',
        allBooks: 'Բոլորը',
        fiction: 'Գեղարվեստական',
        nonFiction: 'Ոչ Գեղարվեստական',
        technology: 'Տեխնոլոգիա',
        science: 'Գիտություն',
        borrow: 'Վերցնել',
        allBorrowed: 'Բոլորը Վերցված են',
        joinQueue: '📋 Հերթ',
        readPdf: '📄 Կարդալ PDF',
        copies: 'օրինակ',

        // Café
        cafeMenu: 'Սրճարանի Ճաշացուցակ',
        hotDrinks: 'Տաք Ըմպելիքներ',
        coldDrinks: 'Սառը Ըմպելիքներ',
        breakfast: 'Նախաճաշ',
        sandwiches: 'Սենդվիչներ',
        salads: 'Աղցաններ',
        desserts: 'Քաղցրավենիք',
        addToCart: 'Ավելացնել',
        amd: 'Դրամ',

        // Favorites
        myFavorites: 'Իմ Սիրելիները',

        // Reservations
        seatReservations: 'Նստատեղի Ամրագրումներ',
        reservationHint: 'Ընտրեք ժամանակահատված, ապա սեղմեք հասանելի նստատեղի վրա։',
        date: 'Ամսաթիվ',
        from: 'Սկսած',
        to: 'Մինչև',
        checkAvailability: 'Ստուգել',
        available: 'Հասանելի',
        reserved: 'Ամրագրված',
        yourReservation: 'Ձեր Ամրագրումը',
        myReservations: 'Իմ Ամրագրումները',
        seat: 'Նստատեղ',
        cancel: 'Չեղարկել',

        // Profile
        myProfile: 'Իմ Պրոֆիլը',
        email: 'Էլ. հասցե',
        walletBalance: 'Դրամապանակ',
        booksBorrowed: 'Վերցված Գրքեր',
        currentFines: 'Ընթացիկ Տուգանք',
        changePassword: 'Փոխել Գաղտնաբառը',
        currentPassword: 'Ընթացիկ գաղտնաբառ',
        newPassword: 'Նոր գաղտնաբառ (նվ. 8 նիշ)',
        confirmPassword: 'Հաստատել գաղտնաբառը',
        updatePassword: 'Թարմացնել',
        borrowingHistory: 'Վերցնելու Պատմություն',
        orderHistory: 'Պատվերների Պատմություն',
        book: 'Գիրք',
        borrowed: 'Վերցված',
        dueDate: 'Վերջնաժամկետ',
        status: 'Կարգավիճակ',
        items: 'Ապրանքներ',
        total: 'Ընդամենը',

        // Librarian Dashboard
        librarianPortal: 'Գրադարանավարի Պորտալ',
        bookManagement: 'Գրքի Կառավարում',
        libDashSub: 'Կառավարեք հավաքածուն, հետևեք վերցնելուն և վերադարձին',
        totalBooks: 'Ընդամենը Գրքեր',
        availableStat: 'Հասանելի',
        borrowedStat: 'Վերցված',
        overdueStat: 'Ժամկետանց',
        bookCatalog: 'Գրքի Կատալոգ',
        addBook: '+ Ավելացնել Գիրք',
        title: 'Վերնագիր',
        author: 'Հեղինակ',
        category: 'Կատեգորիա',
        isbn: 'ISBN',
        shelf: 'Դարակ',
        action: 'Գործողություն',
        edit: 'Խմբագրել',
        delete: 'Ջնջել',
        activeBorrowings: 'Ակտիվ Վերցնումներ',
        student: 'Ուսանող',
        returnBook: 'Վերադարձնել',

        // Café Staff Dashboard
        cafeStaffPortal: 'Սրճարանի Աշխատակցի Պորտալ',
        orderManagement: 'Պատվերների Կառավարում',
        cafeDashSub: 'Կառավարեք պատվերները, թարմացրեք կարգավիճակները',
        totalOrders: 'Ընդամենը Պատվերներ',
        pending: 'Սպասվող',
        completed: 'Ավարտված',
        todayAmd: 'Այսօր (Դրամ)',
        liveOrders: 'Ակտիվ Պատվերներ',
        all: 'Բոլորը',
        preparing: 'Պատրաստվում է',
        ready: 'Պատրաստ',
        orderNum: 'Պատվեր #',
        customer: 'Հաճախորդ',
        type: 'Տեսակ',
        update: 'Թարմացնել',
        menuItems: 'Ճաշատեսակներ',
        addItem: '+ Ավելացնել',
        price: 'Գին',

        // Admin Dashboard
        adminPortal: 'Ադմինի Պորտալ',
        systemOverview: 'Համակարգի Ակնարկ',
        adminDashSub: 'Ամբողջական հարթակի կառավարում և վերլուծություն',
        totalUsers: 'Ընդամենը Օգտատերեր',
        totalOrders2: 'Ընդամենը Պատվերներ',
        revenue: 'Եկամուտ (Դրամ)',
        allUsers: 'Բոլոր Օգտատերերը',
        name: 'Անուն',
        allBooksAdmin: 'Բոլոր Գրքերը',
        allOrders: 'Բոլոր Պատվերները',

        // AI Assistant
        poweredByAi: 'AI-ի Աջակցությամբ',
        readingAssistant: 'Ձեր <em>Ընթերցական Օգնականը</em>',
        aiSub: 'Գրքի առաջարկություններ, պատմական տեղեկություններ, սրճարանի զուգակցություններ',
        askAi: 'Հարցրու <em>AI-ին</em>',
        recommendBooks: '📚 Առաջարկել գրքեր',
        todayHistory: '📅 Այսօր պատմության մեջ',
        cafePairing: '☕ Սրճարանի զուգակցում',
        summarizeClassic: '✨ Ամփոփել դասական',
        aiWelcome: '👋 Բարև! Ես ձեր Գրադարան-Սրճարանի օգնականն եմ։ Հարցրեք ինձ գրքերի, պատմության կամ ընթերցանության մասին!',
        aiPlaceholder: 'Հարցրեք գրքերի, պատմության, առաջարկությունների մասին…',
        send: 'Ուղարկել',
        todayInHistory: 'Այսօր <em>Պատմության Մեջ</em>',
        load: 'Բեռնել',
        readingSuggestions: 'Ընթերցանության <em>Առաջարկություններ</em>',
        clickRecommend: 'Սեղմեք «Առաջարկել գրքեր»-ը անհատական ​​ընտրություններ ստանալու համար։',

        // Modals
        addNewBook: 'Ավելացնել Նոր <em>Գիրք</em>',
        editBook: 'Խմբագրել <em>Գիրքը</em>',
        bookTitle: 'Գրքի վերնագիր',
        authorName: 'Հեղինակի անուն',
        isbnPlaceholder: '978-...',
        shelfPlaceholder: 'օր.՝ A-12',
        numberOfCopies: 'Օրինակների Քանակ',
        coverImage: 'Կազմի Նկար',
        optional: 'Կամընտիր',
        pdfFile: 'PDF Ֆայլ',
        removeImage: '✕ Հեռացնել նկարը',
        remove: '✕ Հեռացնել',
        addToCollection: 'Ավելացնել Հավաքածուին',
        saveChanges: 'Պահպանել',
        saving: 'Պահպանում…',

        addMenuItem: 'Ավելացնել Ճաշատեսակ',
        itemName: 'Ապրանքի Անուն',
        itemNamePlaceholder: 'օր.՝ Կապուչինո',
        pricePlaceholder: '1200',

        yourCart: 'Ձեր Զամբյուղը',
        placeOrder: 'Կատարել Պատվեր',

        bookBorrowings: 'Գրքի <em>Վերցնումներ</em>',
        noActiveBorrowings: 'Ակտիվ վերցնումներ չկան',
        borrower: 'Վերցնող',

        // Bookshelf Map
        libraryLayout: 'Գրադարանի Դասավորություն',
        bookshelfMap: 'Դարակի <em>Քարտեզ</em>',
        shelfMapSub: 'Բոլոր դարակների և դրանց գրքերի տեսողական ակնարկ',
        section: 'Բաժին',

        // Status chips
        statusAvailable: 'Հասանելի',
        statusBorrowed: 'Վերցված',
        statusOverdue: 'Ժամկետանց',
        statusCompleted: 'Ավարտված',
        statusPending: 'Սպասվող',
        statusPreparing: 'Պատրաստվում է',
        statusReady: 'Պատրաստ',

        // Notifications
        notifyBorrowed: 'Գիրքը հաջողությամբ վերցվեց! Վերադարձի ժամկետ՝ 14 օր։',
        notifyReturned: 'Գիրքը հաջողությամբ վերադարձվեց',
        notifyBookAdded: 'ավելացվեց հավաքածուին',
        notifyBookRemoved: 'Գիրքը հեռացվեց',
        notifyPasswordUpdated: 'Գաղտնաբառը հաջողությամբ թարմացվեց!',
        notifyFillFields: 'Լրացրեք բոլոր պարտադիր դաշտերը',
        notifySignIn: 'Նախ մուտք գործեք',
        notifyQueueJoined: 'Ավելացվել եք հերթին',
        notifyQueueLeft: 'Հեռացվեց հերթից',
        notifyOrderPlaced: 'Պատվերը ուղարկված է!',

        // Password strength
        pwWeak: 'Թույլ',
        pwFair: 'Միջին',
        pwGood: 'Լավ',
        pwStrong: 'Ուժեղ',
        pwTooShort: 'Շատ կարճ',
    },

    en: {
        // Auth
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign out',
        login: 'Login',
        register: 'Sign Up',
        emailAddress: 'Email Address',
        password: 'Password',
        fullName: 'Full Name',
        role: 'Role',
        createAccount: 'Create Account',
        authQuote: '"A library is not a luxury but one of the necessities of life."',
        authEyebrow: 'Smart Campus Hub',
        student: 'Student',
        librarian: 'Librarian',
        cafeStaff: 'Café Staff',
        admin: 'Admin',

        // Nav
        home: 'Home',
        library: 'Library',
        cafe: 'Café',
        favorites: 'Favorites',
        reservations: 'Reservations',
        aiAssistant: 'AI Assistant',
        profile: 'Profile',
        dashboard: 'Dashboard',
        shelfMap: 'Shelf Map',

        // Home
        welcomeBack: 'Welcome back',
        heroTitle: 'Good to see <em>you</em> again.',
        heroSub: 'Discover exceptional books, artisan coffee, and a community that values knowledge.',
        searchPlaceholder: 'Search the collection…',
        searchAll: 'All',
        searchBooks: 'Books',
        searchMenu: 'Menu',
        search: 'Search',
        availableBooks: 'Available Books',
        activeMembers: 'Active Members',
        cafeItems: 'Café Items',
        upcomingEvents: 'Upcoming Events',
        trendingBooks: 'Trending Books',
        popularMenu: 'Popular Menu',

        // Library
        libraryCatalog: 'Library Catalog',
        allBooks: 'All',
        fiction: 'Fiction',
        nonFiction: 'Non-Fiction',
        technology: 'Technology',
        science: 'Science',
        borrow: 'Borrow',
        allBorrowed: 'All Borrowed',
        joinQueue: '📋 Join Queue',
        readPdf: '📄 Read PDF',
        copies: 'copies',

        // Café
        cafeMenu: 'Café Menu',
        hotDrinks: 'Hot Drinks',
        coldDrinks: 'Cold Drinks',
        breakfast: 'Breakfast',
        sandwiches: 'Sandwiches',
        salads: 'Salads',
        desserts: 'Desserts',
        addToCart: 'Add',
        amd: 'AMD',

        // Favorites
        myFavorites: 'My Favorites',

        // Reservations
        seatReservations: 'Seat Reservations',
        reservationHint: 'Pick a time slot, then click an available seat to reserve your study spot.',
        date: 'Date',
        from: 'From',
        to: 'To',
        checkAvailability: 'Check Availability',
        available: 'Available',
        reserved: 'Reserved',
        yourReservation: 'Your Reservation',
        myReservations: 'My Reservations',
        seat: 'Seat',
        cancel: 'Cancel',

        // Profile
        myProfile: 'My Profile',
        email: 'Email',
        walletBalance: 'Wallet Balance',
        booksBorrowed: 'Books Borrowed',
        currentFines: 'Current Fines',
        changePassword: 'Change Password',
        currentPassword: 'Current password',
        newPassword: 'New password (min 8 chars)',
        confirmPassword: 'Confirm new password',
        updatePassword: 'Update Password',
        borrowingHistory: 'Borrowing History',
        orderHistory: 'Order History',
        book: 'Book',
        borrowed: 'Borrowed',
        dueDate: 'Due Date',
        status: 'Status',
        items: 'Items',
        total: 'Total',

        // Librarian
        librarianPortal: 'Librarian Portal',
        bookManagement: 'Book Management',
        libDashSub: 'Manage the collection, track borrowings and returns',
        totalBooks: 'Total Books',
        availableStat: 'Available',
        borrowedStat: 'Borrowed',
        overdueStat: 'Overdue',
        bookCatalog: 'Book Catalog',
        addBook: '+ Add Book',
        title: 'Title',
        author: 'Author',
        category: 'Category',
        isbn: 'ISBN',
        shelf: 'Shelf',
        action: 'Action',
        edit: 'Edit',
        delete: 'Delete',
        activeBorrowings: 'Active Borrowings',
        student: 'Student',
        returnBook: 'Return',

        // Café Staff
        cafeStaffPortal: 'Café Staff Portal',
        orderManagement: 'Order Management',
        cafeDashSub: 'Manage orders, update statuses and curate the menu',
        totalOrders: 'Total Orders',
        pending: 'Pending',
        completed: 'Completed',
        todayAmd: 'Today (AMD)',
        liveOrders: 'Live Orders',
        all: 'All',
        preparing: 'Preparing',
        ready: 'Ready',
        orderNum: 'Order #',
        customer: 'Customer',
        type: 'Type',
        update: 'Update',
        menuItems: 'Menu Items',
        addItem: '+ Add Item',
        price: 'Price',

        // Admin
        adminPortal: 'Admin Portal',
        systemOverview: 'System Overview',
        adminDashSub: 'Full platform management and analytics',
        totalUsers: 'Total Users',
        totalOrders2: 'Total Orders',
        revenue: 'Revenue (AMD)',
        allUsers: 'All Users',
        name: 'Name',
        allBooksAdmin: 'All Books',
        allOrders: 'All Orders',

        // AI
        poweredByAi: 'Powered by AI',
        readingAssistant: 'Your <em>Reading Assistant</em>',
        aiSub: 'Book recommendations, historical trivia, café pairings and more',
        askAi: 'Ask <em>AI</em>',
        recommendBooks: '📚 Recommend books',
        todayHistory: '📅 Today in history',
        cafePairing: '☕ Café pairing for my book',
        summarizeClassic: '✨ Summarize a classic',
        aiWelcome: '👋 Hi! I\'m your Library Café assistant. Ask me for book recommendations, historical events, café pairings, or anything about reading culture!',
        aiPlaceholder: 'Ask anything about books, history, recommendations…',
        send: 'Send',
        todayInHistory: 'Today in <em>History</em>',
        load: 'Load',
        readingSuggestions: 'Reading <em>Suggestions</em>',
        clickRecommend: 'Click "Recommend books" to get personalised picks.',

        // Modals
        addNewBook: 'Add New <em>Book</em>',
        editBook: 'Edit <em>Book</em>',
        bookTitle: 'Book title',
        authorName: 'Author name',
        isbnPlaceholder: '978-...',
        shelfPlaceholder: 'e.g. A-12',
        numberOfCopies: 'Number of Copies',
        coverImage: 'Cover Image',
        optional: 'optional',
        pdfFile: 'PDF File',
        removeImage: '✕ Remove image',
        remove: '✕ Remove',
        addToCollection: 'Add to Collection',
        saveChanges: 'Save Changes',
        saving: 'Saving…',

        addMenuItem: 'Add Menu Item',
        itemName: 'Item Name',
        itemNamePlaceholder: 'e.g. Cappuccino',
        pricePlaceholder: '1200',

        yourCart: 'Your Cart',
        placeOrder: 'Place Order',

        bookBorrowings: 'Book <em>Borrowings</em>',
        noActiveBorrowings: 'No active borrowings for this book',
        borrower: 'Borrower',

        // Bookshelf Map
        libraryLayout: 'Library Layout',
        bookshelfMap: 'Bookshelf <em>Map</em>',
        shelfMapSub: 'Visual overview of all shelves and their books',
        section: 'Section',

        // Status chips
        statusAvailable: 'Available',
        statusBorrowed: 'Borrowed',
        statusOverdue: 'Overdue',
        statusCompleted: 'Completed',
        statusPending: 'Pending',
        statusPreparing: 'Preparing',
        statusReady: 'Ready',

        // Notifications
        notifyBorrowed: 'Book borrowed successfully! Due in 14 days.',
        notifyReturned: 'Book returned successfully',
        notifyBookAdded: 'added to collection',
        notifyBookRemoved: 'Book removed',
        notifyPasswordUpdated: 'Password updated successfully!',
        notifyFillFields: 'Please fill all required fields',
        notifySignIn: 'Please sign in first',
        notifyQueueJoined: 'Added to queue',
        notifyQueueLeft: 'Removed from queue',
        notifyOrderPlaced: 'Order placed!',

        // Password strength
        pwWeak: 'Weak',
        pwFair: 'Fair',
        pwGood: 'Good',
        pwStrong: 'Strong',
        pwTooShort: 'Too short',
    }
};

// Current language — default Armenian
let currentLang = localStorage.getItem('lc_lang') || 'hy';

function t(key) {
    return TRANSLATIONS[currentLang][key] || TRANSLATIONS['en'][key] || key;
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('lc_lang', lang);
    applyTranslations();
    // Update toggle buttons
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
    });
    // Re-render dynamic nav (built by JS, not HTML)
    if (typeof showApp === 'function' && typeof currentUser !== 'undefined' && currentUser) {
        // Rebuild nav links with new language
        const cfg = (typeof ROLES !== 'undefined') && ROLES[currentUser.role];
        if (cfg && cfg.nav) {
            const navEl = document.getElementById('navLinks');
            if (navEl) navEl.innerHTML = cfg.nav.map(n =>
                `<li><a onclick="showPage('${n.p}')">${t(n.lk)}</a></li>`
            ).join('');
        }
        // Update hero greeting
        const hn = document.getElementById('heroName');
        if (hn) {
            const first = currentUser.name ? currentUser.name.split(' ')[0] : '';
            hn.innerHTML = `${t('welcomeBack')}, <em>${first}</em>!`;
        }
        // Update hero eyebrow
        const he = document.querySelector('.hero-eyebrow');
        if (he) he.textContent = t('welcomeBack');
        // Update role pill sign out button
        const soBtn = document.querySelector('[onclick="logout()"]');
        if (soBtn) soBtn.textContent = t('signOut');
    }
}

function applyTranslations() {
    // Every element with data-i18n attribute gets its text replaced
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const val = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = val;
        } else {
            el.innerHTML = val;
        }
    });
    // data-i18n-placeholder for inputs that also have visible text
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPh);
    });
}