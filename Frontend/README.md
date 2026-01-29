ՊԻՏԻ ՆԱՅԵՆՔ ՀԼԸԸԸԸԸԸԸԸ






# NPUA Library Café - Frontend

A modern, responsive web application for managing a library café with features for browsing books, ordering food, seat reservations, and user profiles.

## 📁 Project Structure

```
npua_frontend/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   └── app.js          # All JavaScript logic
├── images/             # Folder for images (create this)
└── README.md           # This file
```

## ✨ Features

- **📚 Library System**: Browse and borrow books with categories
- **☕ Café Menu**: Order food and drinks with cart functionality  
- **❤️ Favorites**: Save your favorite books and menu items
- **🪑 Seat Reservation**: Reserve study spaces
- **👤 User Profiles**: Track borrowing history and orders
- **💰 Digital Wallet**: Built-in wallet system (AMD currency)
- **🔍 Search**: Search across books and menu items
- **📱 Responsive**: Works on desktop, tablet, and mobile

## 🚀 How to Run

### Method 1: Simple (Just open the file)
1. Double-click `index.html` to open it in your browser
2. Start browsing!

### Method 2: Using Live Server (Recommended for Development)
1. Install VS Code if you haven't already
2. Install the "Live Server" extension
3. Right-click on `index.html` → "Open with Live Server"
4. Your browser will open automatically with live reload

### Method 3: Using Python HTTP Server
```bash
# Navigate to the project folder
cd npua_frontend

# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

## 🎨 Customization

### Colors
All colors are defined in CSS variables in `styles.css`:
```css
:root {
    --primary: #3d4a3a;
    --olive: #7d8f69;
    --cream: #f5f3ed;
    /* ... etc */
}
```
Change these to customize the color scheme!

### Data
All books and menu items are in `js/app.js`:
- `bookDatabase` array - modify to add/remove books
- `menuDatabase` array - modify to add/remove menu items

## 📝 Usage

### For Students
1. Sign up with your email
2. Browse books and café menu
3. Add favorites
4. Borrow books (14-day period)
5. Order from the café
6. Reserve seats for studying

### For Librarians
1. Sign up with "Librarian" role
2. Same features as students
3. (Backend needed for admin features)

### For Café Staff
1. Sign up with "Café Staff" role  
2. Same features as students
3. (Backend needed for staff features)

## 💾 Data Storage

The app uses **localStorage** to save:
- User account information
- Shopping cart
- Borrowed books
- Seat reservations
- Order history
- Favorites

**Note**: Data is saved in your browser. Clear browser data = lose all progress!

## 🖼️ Adding Images

1. Create an `images` folder in the project root
2. Add your book/food images
3. Update the image paths in `app.js`:

```javascript
// Example:
{ 
    id: 1, 
    name: "Espresso", 
    image: "images/espresso.jpg"  // <- your image path
}
```

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

## ⚠️ Limitations (Frontend Only)

Since this is frontend-only:
- No real database (uses localStorage)
- No real authentication (simulated)
- No server-side validation
- Data doesn't persist across devices
- No payment processing

**To add these features, you'll need a backend!**

## 🔧 Tech Stack

- **HTML5**: Structure
- **CSS3**: Styling with CSS Grid, Flexbox, Animations
- **Vanilla JavaScript**: No frameworks, pure JS
- **localStorage API**: Client-side data storage

## 📱 Responsive Breakpoints

- Desktop: > 768px
- Tablet/Mobile: ≤ 768px

## 🎯 Future Enhancements

When you add a backend:
- Real user authentication
- Database storage
- Email notifications
- Payment gateway
- Admin dashboard
- Real-time seat availability
- Book recommendations
- Reviews and ratings

## 📄 License

Free to use for educational purposes!

## 👨‍💻 Development

Made for NPUA students by students! 

Feel free to customize and improve the code.

---

**Happy Coding! ☕📚**