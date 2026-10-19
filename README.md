# 📚 BookNest

**BookNest** is a full-stack book discovery and personal library application that allows users to explore books, search by genre, read and submit reviews, and manage their own reading collection.

Built with **Next.js, React, Node.js, Express, and MongoDB**, BookNest provides a complete frontend and backend experience with user authentication and protected features.

---

## ✨ Features

* 📚 **Browse Books** — Explore the available book collection.
* 🔍 **Search** — Search for books by keyword.
* 🏷️ **Genre Browsing** — Discover books based on different genres.
* 📖 **Book Details** — View book information including title, author, description, genres, cover, and publication year.
* 👤 **User Authentication** — Signup and login using JWT authentication.
* ⭐ **Reviews & Ratings** — Read reviews and submit your own rating and comment.
* 📚 **Personal Library** — Add books to your personal collection.
* 📌 **Reading Status** — Organize books as **Want to Read, Reading, or Completed**.
* 🔄 **Library Management** — Update reading status or remove books from your library.
* 🛒 **Shopping Cart** — Add books, update quantities, and remove cart items.
* 💲 **Pricing and Stock** — Display book prices and available inventory; cart quantities cannot exceed stock.
* 📦 **Checkout and Orders** — Collect delivery and payment preferences, then save placed orders with item and price snapshots in MongoDB.
* 🔐 **Protected Actions** — Reviews, library, and cart features are available to authenticated users.

Each MongoDB `Book` document needs a non-negative `price` and a whole-number `quantity`. Populate these values for existing books before adding them to the cart.
Order placement uses MongoDB transactions to save the order, update stock, and clear the cart together; use MongoDB Atlas or a replica-set deployment.

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* Bootstrap
* CSS Modules
* Custom CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* CORS

---

## 🖼️ Screenshots

### 🏠 Home Page

<!-- Add your Home Page screenshot here -->

![BookNest Home Page](./screenshots/home.jpeg)

### 📖 Book Details

<!-- Add your Book Details screenshot here -->

![Book Details](./screenshots/book-details.jpeg)

### 📚 Personal Library

<!-- Add your Library screenshot here -->

![Personal Library](./screenshots/library.jpeg)

### 🔐 Signup

<!-- Add your Login screenshot here -->

![Login](./screenshots/signup.jpeg)

---

## 📂 Project Structure

```text
BookNest/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
└── readsphere/
    ├── app/
    ├── Components/
    ├── context/
    ├── lib/
    ├── public/
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB (local MongoDB or MongoDB Atlas)

---

## 🔐 Environment Variables

Create a `.env` file inside the `Backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
STRIPE_CURRENCY=pkr
FRONTEND_URL=http://localhost:3000
```

> Keep your `.env` file private and do not commit it to GitHub.

For local Stripe testing, forward Stripe events to the backend webhook:

```bash
stripe listen --forward-to localhost:5000/api/orders/stripe/webhook
```

Set `STRIPE_WEBHOOK_SECRET` to the signing secret printed by Stripe CLI. For a deployed app, configure the Stripe webhook endpoint at `/api/orders/stripe/webhook` and subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `checkout.session.expired`.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd BookNest
```

### 2. Install frontend dependencies

```bash
cd readsphere
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd Backend
npm install
```

### 4. Start the backend

```bash
node index.js
```

The backend will run on:

```text
http://localhost:5000
```

For development with automatic restarts:

```bash
npx nodemon index.js
```

### 5. Start the frontend

In another terminal:

```bash
cd readsphere
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

---

## 🔮 Future Improvements

* 🤖 Personalized book recommendations
* 🛠️ Admin dashboard
* ❤️ Wishlist functionality
* 👤 Profile customization
* 📊 Reading statistics
* 🔎 Advanced filtering and sorting

---
