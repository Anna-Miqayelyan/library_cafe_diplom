// ═══════════════════════════════════════════════════════════
//  LIBRARY CAFÉ — i18n.js  (Armenian / English translations)
// ═══════════════════════════════════════════════════════════

const TRANSLATIONS = {
    hy: {
        // TRANSLATIONS.hy-ում
        serverUnreachable: 'Սերվերը հասանելի չէ: Արդյոք backend-ը աշխատում է?',
        notifyPhoneRequired: 'Խնդրում ենք մուտքագրել հեռախոսահամարը',
        notifyPhoneInvalid: 'Խնդրում ենք մուտքագրել վավեր հեռախոսահամար',
        remindersOn: 'Հիշեցումներ Միացված',
        remindersOff: 'Հիշեցումներ Անջատված',

        // TRANSLATIONS.en-ում
        serverUnreachable: 'Cannot reach server. Is the backend running?',
        notifyPhoneRequired: 'Please enter your phone number',
        notifyPhoneInvalid: 'Please enter a valid phone number',
        remindersOn: 'Reminders On',
        remindersOff: 'Reminders Off',
        section: 'Բաժին',
        shelfLabel: 'Դարակ',
        statusAvailable: 'Հասանելի',
        statusBorrowed: 'Վերցված է',
        notifySelectDate: 'Խնդրում ենք ընտրել ամսաթիվ',
        notifyInvalidTime: 'Ավարտի ժամը պետք է լինի սկզբի ժամից հետո',
        notifyReserveFailed: 'Չհաջողվեց ամրագրել նստատեղը',
        notifyCancelFailed: 'Չհաջողվեց չեղարկել ամրագրումը',
        notifyReservationMade: 'Սեղան {seat} ամրագրված {from}–{to}',
        notifyReservationCancelled: 'Սեղան {seat} ամրագրումը չեղարկվեց',
        loadingSeats: 'Բեռնում եմ նստատեղերը…',
        yourBooking: 'Ձեր ամրագրումը',
        unavailable: 'Անհասանելի',
        available: 'Հասանելի',
        cancel: 'Չեղարկել',
        reserve: 'Ամրագրել',
        // TRANSLATIONS.hy-ում ավելացնել
        hotDrinks: 'Տաք Ըմպելիքներ',
        coldDrinks: 'Սառը Ըմպելիքներ',
        breakfast: 'Նախաճաշ',
        sandwiches: 'Սենդվիչներ',
        salads: 'Աղցաններ',
        desserts: 'Քաղցրավենիք',
        amd: 'Դրամ',
        // TRANSLATIONS.hy-ում ավելացնել
        shelf: 'Գրադարակ',
        noShelf: 'Գրադարակ չկա',
        fiction: 'Գեղարվեստական',
        nonFiction: 'Ոչ գեղարվեստական',
        technology: 'Տեխնոլոգիական',
        science: 'Գիտական',

        // Status-ներ borrow requests-ի համար
        statusPending: 'Սպասում է',
        statusApproved: 'Հաստատված է',
        statusQueued: 'Հերթում է',
        aiTrendingBooks: 'Ամենաշատ պահանջված գրքերը',
        // Կոճակներ
        approve: 'Հաստատել',
        reject: 'Մերժել',
        markAsTaken: 'Նշել՝ վերցված',
        waitingForCopy: '⏳ Սպասում է օրինակի',

        // Notifications for approve/reject
        notifyApproveFailed: 'Չհաջողվեց հաստատել',
        notifyRequestApproved: '✅ Հայտը հաստատվեց — օգտատերը կարող է վերցնել գիրքը',
        confirmRejectRequest: 'Մերժե՞լ այս հայտը',
        notifyRejectFailed: 'Չհաջողվեց մերժել',
        notifyRequestRejected: 'Հայտը մերժվեց',
        notifyMarkTakenFailed: 'Չհաջողվեց նշել որպես վերցված',
        notifyMarkedAsBorrowed: '📚 Գիրքը նշվեց որպես վերցված',

        // Time ago
        justNow: 'Հենց նոր',
        secondsAgo: 'վայրկյաններ առաջ',
        minutesAgo: 'րոպե առաջ',
        hoursAgo: 'ժամ առաջ',

        // Notifications panel
        noNotifications: 'Դեռևս ծանուցումներ չկան',
        noBooksYet: 'Դեռևս գրքեր չեն բեռնվել',
        // TRANSLATIONS.hy-ում ավելացնել
        reservationReminder: 'Ամրագրում 15 րոպեից',
        gotIt: 'Հասկացա!',
        cancelReservation: 'Չեղարկել ամրագրումը',
        remindersOn: 'Հիշեցումը միացված',
        remindersOff: 'Հիշեցումը անջատված',
        remindersEnabled: 'Հիշեցումը միացված են! Դուք կտեղեկացվեք ամրագրումից 15 րոպե առաջ:',
        permissionDenied: 'Մերժված թույլտվություն',
        bookRequest: 'Գրքի հայտ',
        alreadyInQueue: 'Դուք արդեն հերթում եք "{title}" գրքի համար',
        at: 'ժամը',
        table: 'Սեղան',
        cancel: 'Չեղարկել',
        reserve: 'Ամրագրել',
        unavailable: 'Անհասանելի',
        yourBooking: 'Ձեր ամրագրումը',
        availableSeat: 'Ազատ — սեղմեք ամրագրելու համար',
        // TRANSLATIONS.hy-ում ավելացնել
        notifications: 'Ծանուցումներ',
        clearAll: 'Մաքրել բոլորը',
        availableLegend: 'Հասանելի (սեղմեք ամրագրելու համար)',
        reservedByOthers: 'Ամրագրված ուրիշների կողմից',
        yourBooking: 'Ձեր ամրագրումը',
        selectDateTimeHint: 'Ընտրեք ամսաթիվ և ժամ, ապա սեղմեք Ստուգել',
        remind: '🔔 Հիշեցում',
        check: 'Ստուգել',
        durationDays: 'Տևողություն (օր)',
        confirmBorrow: '📤 Հաստատել փոխառությունը',
        pdfViewer: 'Գիրք <em>PDF</em>',
        phone: '📞 Հեռախոս',
        save: 'Պահպանել',
        loading: 'Բեռնում…',
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
        authEyebrow: 'Գիրք, սուրճ,հանգիստ',
        student: 'Օգտատեր',
        librarian: 'Գրադարանավար',
        cafeStaff: 'Սրճարանի աշխատակից',
        admin: 'Ադմին',


        Name: 'Անուն Ազգանուն',

        // Verify
        verifyCode: 'Հաստատման կոդ',
        verifyAccount: 'Հաստատել և ստեղծել հաշիվ',
        back: '← ելք',
        codeSent: 'Մենք 6-անիշ կոդ ենք ուղարկել',
        didNotReceiveCode: 'Չե՞ք ստացել կոդը 2 րոպեի ընթացքում: Էլ.փոստը կարող է գոյություն չունենալ:',
        tryDifferentEmail: 'Փորձեք այլ էլ.փոստ',

        // Nav
        home: 'Գլխավոր',
        library: 'Գրադարան',
        cafe: 'Սրճարան',
        favorites: 'Նախընտրելիներ',
        reservations: 'Ամրագրումներ',
        aiAssistant: 'AI Օգնական',
        profile: 'Անձնական էջ',
        dashboard: 'Վահանակ',
        shelfMap: 'Գրքերի դասավորություն',

        // Home
        welcomeBack: 'Բարի վերադարձ',
        heroTitle: 'Ուրախ ենք <em>քեզ</em> տեսնել։',
        heroSub: 'Այնտեղ, որտեղ հանդիպում են գրքերը, սուրճն ու գիտելիքը։',
        searchPlaceholder: 'Որոնել …',
        searchAll: 'Բոլորը',
        searchBooks: 'Գրքեր',
        searchMenu: 'Ճաշացանկ',
        search: 'Որոնել',
        availableBooks: 'Հասանելի Գրքեր',
        activeMembers: 'Ակտիվ Անդամներ',
        cafeItems: 'Սրճարանի Ապրանքներ',
        upcomingEvents: 'Առաջիկա Միջոցառումներ',
        trendingBooks: 'Հայտնի Գրքեր',
        popularMenu: 'Հայտնի Ճաշատեսակներ',

        // Library
        libraryCatalog: 'Գրադարանի ցուցակ',
        allBooks: 'Բոլորը',
        fiction: 'Գեղարվեստական',
        nonFiction: 'Ոչ Գեղարվեստական',
        technology: 'Տեխնոլոգիա',
        science: 'Գիտություն',
        borrow: 'Վերցնել',
        allBorrowed: 'Բոլորը վերցված են',
        joinQueue: '📋 Միանալ հերթին',
        leaveQueue: 'Դուրս գալ հերթից',
        readPdf: '📄 Կարդալ PDF',
        copies: 'օրինակ',

        // Café
        cafeMenu: 'Սրճարանի ճաշացանկ',
        hotDrinks: 'Տաք ըմպելիքներ',
        coldDrinks: 'Սառը ըմպելիքներ',
        breakfast: 'Նախաճաշ',
        sandwiches: 'Սենդվիչներ',
        salads: 'Աղցաններ',
        desserts: 'Քաղցրավենիք',
        addToCart: 'Ավելացնել',
        amd: 'Դրամ',
        amdPerItem: '1 հատը',
        orderNotification: 'Պատվեր',
        // Cart
        yourCart: 'Ձեր զամբյուղը',
        cartEmpty: 'Զամբյուղը դատարկ է',
        total: 'Ընդամենը',
        placeOrderCash: 'Կատարել պատվեր (Կանխիկ)',
        paymentCashAtCounter: 'Վճարումը կատարվում է կանխիկով՝ դրամարկղում',
        remove: 'Հեռացնել',

        // Order status
        orderPreparing: 'Ձեր պատվերը պատրաստվում է ☕',
        orderReady: 'Ձեր պատվերը ՊԱՏՐԱՍՏ Է վերցնելու համար! 🔔',
        orderCompleted: 'Պատվերն ավարտված է: Բարի ախորժակ! ✅',
        orderCancelled: 'Ձեր պատվերը չեղարկվել է ❌',

        // Borrow requests
        bookAvailable: '📚 "{title}" գիրքն այժմ հասանելի է: Գրադարանավարը կկապնվի Ձեզ հետ:',
        requestApproved: '✅ "{title}" գրքի հայտը ՀԱՍՏԱՏՎԵԼ Է: Եկեք վերցրեք այն 📚',
        requestRejected: '❌ "{title}" գրքի հայտը մերժվել է:',
        bookTaken: '📚 Հաճույքով կարդացեք "{title}"-ը: Վերադարձրեք սահմանված ժամկետում:',
        borrowRequestSent: '📋 "{title}" գրքի հայտն ուղարկված է: Գրադարանավարը կքննարկի այն շուտով:',
        table1: 'Սեղան 1',
        table2: 'Սեղան 2',
        table3: 'Սեղան 3',
        table4: 'Սեղան 4',
        table5: 'Սեղան 5',
        table6: 'Սեղան 6',
        table7: 'Սեղան 7',
        // Seats/reservations
        seatReservations: 'Սեղանի ամրագրում',
        reservationHint: 'Ընտրեք ժամանակահատված, ապա սեղմեք հասանելի նստատեղի վրա։',
        date: 'Ամսաթիվ',
        from: 'Սկսած',
        to: 'Մինչև',
        checkAvailability: 'Ստուգել',
        available: 'Հասանելի',
        reserved: 'Ամրագրված',
        yourReservation: 'Ձեր ամրագրումը',
        myReservations: 'Իմ ամրագրումները',
        seat: 'Նստատեղ',
        cancel: 'Չեղարկել',
        table: 'Սեղան',
        yourBooking: 'Ձեր ամրագրումը',
        unavailable: 'Անհասանելի',
        availableSeat: 'Հասանելի — սեղմեք ամրագրելու համար',
        reservedByOthers: 'Ամրագրված ուրիշների կողմից',
        loadingSeats: 'Բեռնում եմ նստատեղերը…',
        selectDateTime: 'Ընտրեք ամսաթիվ և ժամ, ապա սեղմեք Ստուգել',
        check: 'Ստուգել',
        remind: '🔔 Հիշեցում',
        reserve: 'Ամրագրել',
        reserveSlot: 'Ամրագրել {from}–{to}',
        cancelConfirm: 'Չեղարկե՞լ ամրագրումը',

        // Profile
        myProfile: 'Անձնական էջ',
        email: 'Էլ. հասցե',
        walletBalance: 'Դրամապանակ',
        booksBorrowed: 'Վերցված գրքեր',
        currentFines: 'Ընթացիկ տուգանք',
        changePassword: 'Փոխել գաղտնաբառը',
        currentPassword: 'Ընթացիկ գաղտնաբառ',
        newPassword: 'Նոր գաղտնաբառ (նվազ. 8 նիշ)',
        confirmPassword: 'Հաստատել գաղտնաբառը',
        updatePassword: 'Թարմացնել',
        borrowingHistory: 'Վերցված գրքերի պատմություն',
        orderHistory: 'Պատվերների պատմություն',
        book: 'Գիրք',
        borrowed: 'Վերցված',
        dueDate: 'Վերջնաժամկետ',
        status: 'Կարգավիճակ',
        items: 'Ապրանքներ',
        phone: '📞 Հեռախոս',
        save: 'Պահպանել',
        type: 'Տեսակ',
        // Librarian Dashboard
        librarianPortal: 'Գրադարանավարի էջ',
        bookManagement: 'Գրքի կառավարում',
        libDashSub: 'Կառավարեք հավաքածուն, հետևեք վերցնելուն և վերադարձին',
        totalBooks: 'Ընդհանուր գրքեր',
        availableStat: 'Հասանելի',
        borrowedStat: 'Վերցված',
        overdueStat: 'Ժամկետանց',
        bookCatalog: 'Գրքերի ցուցակ',
        addBook: '+ Ավելացնել գիրք',
        title: 'Վերնագիր',
        author: 'Հեղինակ',
        category: 'Տեսակ',
        isbn: 'ISBN',
        shelf: 'Դարակ',
        action: 'Գործողություն',
        edit: 'Խմբագրել',
        delete: 'Ջնջել',
        activeBorrowings: 'Չվերադարձված գրքեր',
        returnBook: 'Վերադարձնել',
        copy: 'օրինակ',
        borrowRequests: '📋 Գրքերի <em>Հայտեր</em>',
        approve: '✅ Հաստատել',
        reject: '✕ Մերժել',
        markTaken: '📚 Նշել Վերցված',
        waitingForCopy: '⏳ Սպասում է օրինակի',
        noRequests: 'Սպասող հայտեր չկան',
        requestedOn: 'Հայտի ա/թ',
        duration: 'Տևողություն',
        days: 'օր',

        // Café Staff Dashboard
        cafeStaffPortal: 'Սրճարանի աշխատակցի էջ',
        orderManagement: 'Պատվերների կառավարում',
        cafeDashSub: 'Կառավարեք պատվերները, թարմացրեք կարգավիճակները',
        totalOrders: 'Ընդհանուր պատվերներ',
        pending: 'Սպասվող',
        completed: 'Ավարտված',
        todayAmd: 'Այսօր (Դրամ)',
        liveOrders: 'Ակտիվ պատվերներ',
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
        request: 'Հայտ', 
        // Admin Dashboard
        adminPortal: 'Ադմինի էջ',
        systemOverview: 'Համակարգի կառավարում',
        adminDashSub: 'Ամբողջական հարթակի կառավարում և վերլուծություն',
        totalUsers: 'Ընդհանուր օգտատերեր',
        totalOrders2: 'Ընդհանուր պատվերներ  ',
        revenue: 'Եկամուտ (Դրամ)',
        allUsers: 'Բոլոր օգտատերերը',
        name: 'Անուն',
        allBooksAdmin: 'Բոլոր գրքերը',
        allOrders: 'Բոլոր պատվերները',
        // TRANSLATIONS.hy-ում
        tableNames: ['Սեղան 1', 'Սեղան 2', 'Սեղան 3', 'Սեղան 4', 'Սեղան 5', 'Սեղան 6', 'Սեղան 7'],

        // TRANSLATIONS.en-ում
        // Favorites
        myFavorites: 'Իմ նախընտրելիները',

        // AI Assistant
        poweredByAi: 'AI-ի աջակցությամբ',
        readingAssistant: 'Ձեր <em>Ընթերցանության օգնականը</em>',
        aiSub: 'Գրքի առաջարկություններ, պատմական տեղեկություններ, սրճարանի զուգակցություններ',
        askAi: 'Հարցրու <em>AI-ին</em>',
        recommendBooks: '📚 Առաջարկել գրքեր',
        todayHistory: '📅 Այսօր պատմության մեջ',
        cafePairing: '☕ Սրճարանի զուգակցում',
        summarizeClassic: '✨ Դասական գրքեր',
        aiWelcome: '👋 Բարև! Ես ձեր Գրադարան-Սրճարանի օգնականն եմ։ Հարցրեք ինձ գրքերի, պատմության կամ ընթերցանության մասին!',
        aiPlaceholder: 'Հարցրեք գրքերի, պատմության,սուրճի մասին…',
        send: 'Ուղարկել',
        todayInHistory: 'Այսօր <em>Պատմության Մեջ</em>',
        load: 'Բեռնել',
        readingSuggestions: 'Ընթերցանության <em>Առաջարկություններ</em>',
        clickRecommend: 'Սեղմեք «Առաջարկել գրքեր»-ը անհատական ընտրություններ ստանալու համար։',
        aiRateLimit: 'Չափազանց շատ հարցումներ — AI-ն սահմանափակում ունի: Խնդրում ենք սպասել 30 վայրկյան և նորից փորձել:',
        aiNotConfigured: 'AI-ն միացված չէ: Խնդրեք ադմինիստրատորին ավելացնել Gemini:ApiKey-ը appsettings.json ֆայլում:',
        aiConnectionError: 'Կապի սխալ: Համոզվեք, որ սերվերը աշխատում է:',
        aiHistoryFallback: 'Գրքերը գոյություն ունեն ավելի քան 5000 տարի — առաջին գրավոր արձանագրությունները թվագրվում են Հին Միջագետքով:',

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
        removeFile: '✕ Հեռացնել',
        addToCollection: 'Ավելացնել Հավաքածուին',
        saveChanges: 'Պահպանել',
        saving: 'Պահպանում…',
        pdfUploaded: 'PDF արդեն վերբեռնված է',

        addMenuItem: 'Ավելացնել Ճաշատեսակ',
        editMenuItem: 'Խմբագրել Ճաշատեսակը',
        itemName: 'Ապրանքի Անուն',
        itemNamePlaceholder: 'օր.՝ Կապուչինո',
        pricePlaceholder: '1200',

        bookBorrowings: 'Գրքի <em>Վերցնումներ</em>',
        noActiveBorrowings: 'Չվերադարձված գրքեր չկան',
        borrower: 'Վերցնող',

        // Bookshelf Map
        libraryLayout: 'Գրադարանի Դասավորություն',
        bookshelfMap: 'Գրադարակի <em>Քարտեզ</em>',
        shelfMapSub: 'Գրքերի մասին տեսողական նկարագրություն',
        section: 'Բաժին',
        shelfLabel: 'Դարակ {shelf}',

        // Status chips
        statusAvailable: 'Հասանելի',
        statusBorrowed: 'Վերցված',
        statusOverdue: 'Ժամկետանց',
        statusCompleted: 'Ավարտված է',
        statusPending: 'Սպասում է',
        statusPreparing: 'Պատրաստվում է',
        statusReady: 'Պատրաստ է',
        statusCancelled: 'Չեղարկված',

        // Notifications
        notifyBorrowed: 'Գիրքը հաջողությամբ վերցվեց! Վերադարձի ժամկետ՝ 14 օր։',
        notifyReturned: 'Գիրքը հաջողությամբ վերադարձվեց',
        notifyBookAdded: '"{title}" գիրքը ավելացվեց հավաքածուին',
        notifyBookUpdated: '"{title}" գիրքը թարմացվեց',
        notifyBookRemoved: 'Գիրքը հեռացվեց',
        notifyPasswordUpdated: 'Գաղտնաբառը հաջողությամբ թարմացվեց!',
        notifyFillFields: 'Լրացրեք բոլոր պարտադիր դաշտերը',
        notifySignIn: 'Խնդրում ենք նախ մուտք գործել',
        notifyQueueJoined: '📋 "{title}" գրքի հերթին միացաք: Մենք Ձեզ կտեղեկացնենք, երբ հասանելի լինի:',
        notifyQueueLeft: 'Հեռացվեց "{title}" գրքի հերթից',
        notifyOrderPlaced: '✅ Պատվերը տեղադրված է! Ընդհանուր {total} AMD — մենք Ձեզ կտեղեկացնենք, երբ պատրաստ լինի:',
        notifyCartAdded: '🛒 {name} ավելացվեց զամբյուղում: Սեղմեք զամբյուղը պատվիրելու համար:',
        notifyFavAdded: 'Ավելացվեց նախընտրելիներում',
        notifyFavRemoved: 'Հեռացվեց նախընտրելիներից',
        notifyReservationMade: 'Սեղան {seat} ամրագրված {from}–{to}',
        notifyReservationCancelled: 'Սեղան {seat} ամրագրումը չեղարկվեց',
        notifySaveFailed: 'Չհաջողվեց պահպանել',
        notifySaveError: 'Պահպանելիս սխալ',
        notifyDeleteFailed: 'Չհաջողվեց ջնջել',
        notifyMenuItemUpdated: '"{name}" ճաշատեսակը թարմացվեց',
        notifyMenuItemAdded: '"{name}" ճաշատեսակը ավելացվեց',
        notifyMenuItemRemoved: 'Ճաշատեսակը հեռացվեց',

        // Confirm dialogs
        confirmDeleteBook: 'Ջնջե՞լ այս գիրքը հավաքածուից',
        confirmDeleteMenuItem: 'Ջնջե՞լ այս ճաշատեսակը ճաշացուցակից',
        confirmDeleteUser: 'Ջնջե՞լ այս օգտատիրոջ հաշիվը',

        // Search
        searchResultsBooks: 'Գտնվեց {count} գիրք',
        searchResultsMenu: 'Գտնվեց {count} ապրանք',
        searchNoResults: '"{query}"-ով որոնումը արդյունք չտվեց',
        notifyEnterSearchTerm: 'Մուտքագրեք որոնման բառ',

        // Password strength
        pwWeak: 'Թույլ',
        pwFair: 'Միջին',
        pwGood: 'Լավ',
        pwStrong: 'Ուժեղ',
        pwTooShort: 'Շատ կարճ',

        // Misc
        allRightsReserved: 'Բոլոր իրավունքները պաշտպանված են'
    },

    en: {
        section: 'Section',
        shelfLabel: 'Shelf',
        statusAvailable: 'Available',
        statusBorrowed: 'Borrowed',
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

        // Verify
        verifyCode: 'Verification Code',
        verifyAccount: 'Verify & Create Account',
        back: '← Back',
        codeSent: 'We sent a 6-digit code to',
        didNotReceiveCode: 'Didn\'t receive a code within 2 minutes? The email may not exist.',
        tryDifferentEmail: 'Try a different email',

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
        tableNames: ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7'],

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
        leaveQueue: '✕ Leave Queue',
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
        amdPerItem: 'AMD each',

        // Cart
        yourCart: 'Your Cart',
        cartEmpty: 'Your cart is empty',
        total: 'Total',
        placeOrderCash: 'Place Order (Cash)',
        paymentCashAtCounter: 'Payment is made in cash at the counter',
        remove: 'Remove',

        // Order status
        orderPreparing: 'Your order is being prepared ☕',
        orderReady: 'Your order is READY for pickup! 🔔',
        orderCompleted: 'Order completed. Enjoy! ✅',
        orderCancelled: 'Your order was cancelled ❌',

        // Borrow requests
        bookAvailable: '📚 "{title}" is now available! The librarian will reach out to you.',
        requestApproved: '✅ Your request for "{title}" was APPROVED! Come pick it up 📚',
        requestRejected: '❌ Your request for "{title}" was declined.',
        bookTaken: '📚 Enjoy reading "{title}"! Return by the due date.',
        borrowRequestSent: '📋 Borrow request sent for "{title}". The librarian will review it shortly.',

        // Seats/reservations
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
        table: 'Table',
        yourBooking: 'Your booking',
        unavailable: 'Unavailable',
        availableSeat: 'Available — click to reserve',
        reservedByOthers: 'Reserved by others',
        loadingSeats: 'Loading seats…',
        selectDateTime: 'Select a date and time, then click Check',
        check: 'Check',
        remind: '🔔 Reminder',
        reserve: 'Reserve',
        reserveSlot: 'Reserve {from}–{to}',
        cancelConfirm: 'Cancel reservation?',

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
        phone: 'Phone',
        save: 'Save',

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
        returnBook: 'Return',
        copy: 'copy',
        borrowRequests: '📋 Borrow Requests',
        approve: '✅ Approve',
        reject: '✕ Reject',
        markTaken: '📚 Mark as Taken',
        waitingForCopy: '⏳ Waiting for a copy',
        noRequests: 'No pending requests',
        requestedOn: 'Requested',
        duration: 'Duration',
        days: 'days',

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

        // Favorites
        myFavorites: 'My Favorites',

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
        aiRateLimit: 'Too many requests — the AI is rate limited. Please wait 30 seconds and try again.',
        aiNotConfigured: 'AI is not configured. Ask your admin to add the Gemini:ApiKey to appsettings.json.',
        aiConnectionError: 'Connection error. Please make sure the backend is running.',
        aiHistoryFallback: 'Books have existed for over 5,000 years — the first written records date to ancient Mesopotamia.',

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
        removeFile: '✕ Remove',
        addToCollection: 'Add to Collection',
        saveChanges: 'Save Changes',
        saving: 'Saving…',
        pdfUploaded: 'PDF already uploaded',

        addMenuItem: 'Add Menu Item',
        editMenuItem: 'Edit Menu Item',
        itemName: 'Item Name',
        itemNamePlaceholder: 'e.g. Cappuccino',
        pricePlaceholder: '1200',

        bookBorrowings: 'Book <em>Borrowings</em>',
        noActiveBorrowings: 'No active borrowings for this book',
        borrower: 'Borrower',

        // Bookshelf Map
        libraryLayout: 'Library Layout',
        bookshelfMap: 'Bookshelf <em>Map</em>',
        shelfMapSub: 'Visual overview of all shelves and their books',
        section: 'Section',
        shelfLabel: 'Shelf {shelf}',

        // Status chips
        statusAvailable: 'Available',
        statusBorrowed: 'Borrowed',
        statusOverdue: 'Overdue',
        statusCompleted: 'Completed',
        statusPending: 'Pending',
        statusPreparing: 'Preparing',
        statusReady: 'Ready',
        statusCancelled: 'Cancelled',

        // Notifications
        notifyBorrowed: 'Book borrowed successfully! Due in 14 days.',
        notifyReturned: 'Book returned successfully',
        notifyBookAdded: '"{title}" added to collection',
        notifyBookUpdated: '"{title}" updated',
        notifyBookRemoved: 'Book removed',
        notifyPasswordUpdated: 'Password updated successfully!',
        notifyFillFields: 'Please fill all required fields',
        notifySignIn: 'Please sign in first',
        notifyQueueJoined: '📋 You joined the queue for "{title}". We\'ll notify you when it\'s available!',
        notifyQueueLeft: 'Removed from queue for "{title}"',
        notifyOrderPlaced: '✅ Order placed! Total: {total} AMD — we will notify you when it is ready!',
        notifyCartAdded: '🛒 {name} added to cart! Tap the cart to order.',
        notifyFavAdded: 'Added to favorites',
        notifyFavRemoved: 'Removed from favorites',
        notifyReservationMade: 'Table {seat} reserved {from}–{to}',
        notifyReservationCancelled: 'Table {seat} reservation cancelled',
        notifySaveFailed: 'Failed to save',
        notifySaveError: 'Error saving',
        notifyDeleteFailed: 'Cannot delete',
        notifyMenuItemUpdated: '"{name}" menu item updated',
        notifyMenuItemAdded: '"{name}" menu item added',
        notifyMenuItemRemoved: 'Menu item removed',

        // Confirm dialogs
        confirmDeleteBook: 'Delete this book from the collection?',
        confirmDeleteMenuItem: 'Remove this item from the menu?',
        confirmDeleteUser: 'Delete this user account?',

        // Search
        searchResultsBooks: 'Found {count} book',
        searchResultsMenu: 'Found {count} item',
        searchNoResults: 'No results found for "{query}"',
        notifyEnterSearchTerm: 'Enter a search term',

        // Password strength
        pwWeak: 'Weak',
        pwFair: 'Fair',
        pwGood: 'Good',
        pwStrong: 'Strong',
        pwTooShort: 'Too short',

        // Misc
        allRightsReserved: 'All rights reserved'
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
        const cfg = (typeof ROLES !== 'undefined') && ROLES[currentUser.role];
        if (cfg && cfg.nav) {
            const navEl = document.getElementById('navLinks');
            if (navEl) navEl.innerHTML = cfg.nav.map(n =>
                `<li><a onclick="showPage('${n.p}')">${t(n.lk)}</a></li>`
            ).join('');
        }
        const hn = document.getElementById('heroName');
        if (hn) {
            const first = currentUser.name ? currentUser.name.split(' ')[0] : '';
            hn.innerHTML = `${t('welcomeBack')}, <em>${first}</em>!`;
        }
        const he = document.querySelector('.hero-eyebrow');
        if (he) he.textContent = t('welcomeBack');
        const soBtn = document.querySelector('[onclick="logout()"]');
        if (soBtn) soBtn.textContent = t('signOut');
    }
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const val = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = val;
        } else {
            el.innerHTML = val;
        }
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPh);
    });
}