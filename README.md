# 🚢 Import Export Hub

**Import Export Hub** is a modern, high-performance web platform designed to streamline global trade management. It allows users to browse international products, manage their exports, and seamlessly import goods into their personal inventory with one-click functionality.

### 🔗 [Live Application URL](https://import-export-hub.vercel.app)

---

## 🚀 Key Features

- **One-Click Imports:** Seamlessly import any global product into your personal "My Imports" section with real-time inventory reduction and quantity validation.
- **Dynamic Trade Dashboard:** A comprehensive user dashboard featuring real-time analytics using **Recharts**, profile management, and role-based navigation.
- **Advanced Product Filtering:** Robust search, multi-field filtering (category, price, rating), and sorting capabilities to find the exact products you need.
- **Full Export Management:** Complete CRUD functionality for exporters to add, update, and manage their global export listings.
- **Secure Authentication:** Integrated **Firebase Authentication** providing secure Email/Password and one-click Google Social Login.
- **Adaptive UI/UX:** A fully responsive, high-contrast interface with **Dark & Light Mode** support, built with **Tailwind CSS 4** and smooth **Framer Motion** animations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4, Lucide React Icons
- **State & Auth:** Firebase SDK, Context API
- **Animations:** Framer Motion
- **Charts:** Recharts (Data Visualization)
- **Notifications:** React Hot Toast

### Backend
- **Server:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Error Handling:** Centralized Global Error Handler
- **Security:** CORS, Dotenv, JWT-ready structure

---

## 📂 Project Structure

```plaintext
├── client/              # React (Vite) Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── features/    # Business logic & complex components
│   │   ├── layouts/     # Main & Dashboard layouts
│   │   ├── pages/       # Route-level components
│   │   ├── hooks/       # Custom React hooks (Auth, Theme)
│   │   └── routes/      # Public & Private route definitions
├── server/              # Node.js/Express Backend
│   ├── models/          # Mongoose Schema definitions
│   ├── routes/          # API route handlers
│   └── utils/           # Helper functions & Error handlers
└── .agent/              # AI Agent configuration (Antigravity Kit)
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Firebase Project

### 2. Backend Setup (`server/`)
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file and add the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_URL=http://localhost:5173
   ```
4. Start the server: `npm run dev`

### 3. Frontend Setup (`client/`)
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your Firebase and API configurations:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
4. Start the development server: `npm run dev`

---

## 🛡️ Admin Access
The platform includes a dedicated Admin panel located at `/admin/login`. 
- **Admin Features:** User moderation, global product management, and platform-wide statistics.
- **Demo Credentials:** Can be found in `credentials.md`.

---

## 📄 License
This project is licensed under the MIT License.

---

*Built with ❤️ by the Import Export Hub Team.*
