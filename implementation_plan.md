# Electronics eCommerce Platform — Implementation Plan

A production-ready, full-stack eCommerce platform for selling electronics components (Arduino, sensors, modules, robotics kits). Built with React + Vite + Tailwind CSS on the frontend and Node.js + Express + MongoDB on the backend.

## User Review Required

> [!IMPORTANT]
> **Payment Gateway**: This plan includes **Razorpay** (India-first, supports UPI/Cards/Net Banking/COD). Stripe code will also be scaffolded but Razorpay is primary. You will need your own Razorpay API keys in `.env`.

> [!IMPORTANT]
> **Image Storage**: Using **Cloudinary** for product images. You will need a free Cloudinary account and add credentials to `.env`.

> [!IMPORTANT]
> **MongoDB**: Uses MongoDB Atlas (cloud). You'll need a connection string added to `.env`. A local MongoDB URI can also be used.

> [!NOTE]
> **Vendor & AI features**: Multi-vendor support and AI recommendations will be scaffolded with the backend structure ready, but the AI integration will use a simple rule-based recommendation engine (no paid API needed). Full vendor portal will be included.

---

## Proposed Changes

### Project Root Structure

```
Shopfiy1/
├── server/               # Node.js + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   └── server.js
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
└── README.md
```

---

### Backend (server/)

#### [NEW] server/server.js
Entry point: Express app, CORS, cookie-parser, routes mount, MongoDB connect.

#### [NEW] server/config/db.js
Mongoose connection setup.

#### [NEW] server/config/cloudinary.js
Cloudinary SDK configuration.

#### Models

#### [NEW] server/models/User.js
Fields: name, email, password (hashed), phone, role (user/admin/vendor), addresses[], wishlist[], createdAt.

#### [NEW] server/models/Product.js
Fields: name, slug, SKU, description, category (ref), brand, price, discountPrice, stock, images[], specs (Map/JSON), datasheet, ratings, numReviews, vendor (ref), featured, tags[].

#### [NEW] server/models/Category.js
Fields: name, slug, parent (ref, for tree), image, description.

#### [NEW] server/models/Order.js
Fields: user (ref), orderItems[], shippingAddress, paymentMethod, paymentResult, itemsPrice, shippingPrice, taxPrice, totalPrice, isPaid, isDelivered, status, trackingNumber.

#### [NEW] server/models/Cart.js
Fields: user (ref), items[{product, quantity, price}].

#### [NEW] server/models/Review.js
Fields: user (ref), product (ref), rating, comment, images[].

#### [NEW] server/models/Coupon.js
Fields: code, discountType (percent/fixed), discountValue, minOrderAmount, maxUses, usedCount, expiresAt, isActive.

#### [NEW] server/models/Vendor.js
Fields: user (ref), storeName, logo, status (pending/approved/rejected), commission, products[].

#### Auth Routes & Controllers

#### [NEW] server/routes/authRoutes.js
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/forgot-password
- POST /api/auth/reset-password/:token
- GET /api/auth/me

#### [NEW] server/controllers/authController.js
JWT generation, bcrypt hashing, cookie setting, password reset via token.

#### [NEW] server/middleware/authMiddleware.js
`protect` (JWT cookie verify), `admin` (role check), `vendor` (role check).

#### Product Routes & Controllers

#### [NEW] server/routes/productRoutes.js
- GET /api/products (with filters, search, pagination)
- GET /api/products/:slug
- POST /api/products (admin/vendor)
- PUT /api/products/:id (admin/vendor)
- DELETE /api/products/:id (admin)
- GET /api/products/featured
- GET /api/products/search?q=

#### [NEW] server/controllers/productController.js
Full CRUD + advanced filtering by category, price, rating, stock + text search.

#### Category, Cart, Order, Review, Coupon Routes

#### [NEW] server/routes/categoryRoutes.js
CRUD for categories with parent-child tree.

#### [NEW] server/routes/cartRoutes.js
Add/update/remove cart items (user-specific or guest via session).

#### [NEW] server/routes/orderRoutes.js
Create order, get user orders, get all orders (admin), update status.

#### [NEW] server/routes/reviewRoutes.js
Add/edit/delete reviews with product rating recalculation.

#### [NEW] server/routes/couponRoutes.js
Apply coupon, admin CRUD.

#### Payment

#### [NEW] server/routes/paymentRoutes.js
- POST /api/payment/razorpay/create-order
- POST /api/payment/razorpay/verify
- POST /api/payment/cod

#### [NEW] server/controllers/paymentController.js
Razorpay order creation + HMAC signature verification.

#### [NEW] server/utils/sendEmail.js
Nodemailer utility for welcome, order confirmation, password reset emails.

#### Admin Routes

#### [NEW] server/routes/adminRoutes.js
Analytics: revenue, top products, recent orders, user count.

---

### Frontend (client/)

#### Setup

#### [NEW] client/vite.config.js + tailwind.config.js
Vite + Tailwind CSS + PostCSS config.

#### [NEW] client/src/index.css
Global CSS: dark theme variables, custom scrollbar, animations, Tailwind directives.

#### [NEW] client/src/App.jsx
React Router v6 routes for all pages + Protected routes.

#### State Management

#### [NEW] client/src/context/AuthContext.jsx
User auth state, login/logout/register functions.

#### [NEW] client/src/context/CartContext.jsx
Cart state: add/remove/update quantity, total calculation.

#### [NEW] client/src/context/WishlistContext.jsx
Wishlist state with localStorage persistence.

#### Layout Components

#### [NEW] client/src/components/layout/Navbar.jsx
Dark navbar: logo, search bar with suggestions, categories dropdown, cart icon with badge, user menu.

#### [NEW] client/src/components/layout/Footer.jsx
Multi-column footer: links, social icons, newsletter signup.

#### [NEW] client/src/components/ui/ProductCard.jsx
Product card: image, name, price, rating stars, add-to-cart, wishlist heart.

#### [NEW] client/src/components/ui/Loader.jsx + SkeletonCard.jsx
Spinner and skeleton loaders.

#### [NEW] client/src/components/ui/Toast.jsx
Toast notification system (success/error/info).

#### [NEW] client/src/components/ui/Pagination.jsx
Page navigation component.

#### Pages

#### [NEW] client/src/pages/Home.jsx
Hero slider, featured products grid, category cards with icons, trending section.

#### [NEW] client/src/pages/Products.jsx
Left sidebar filters (category tree, price range slider, ratings, brand), product grid, sort dropdown, pagination.

#### [NEW] client/src/pages/ProductDetail.jsx
Image gallery with zoom, specs table, datasheet link, reviews section, add-to-cart, related products.

#### [NEW] client/src/pages/Cart.jsx
Cart items with quantity controls, price summary, coupon field.

#### [NEW] client/src/pages/Checkout.jsx
Multi-step: address form → payment method selection → order summary → Razorpay payment.

#### [NEW] client/src/pages/OrderSuccess.jsx
Order confirmation with details.

#### Auth Pages

#### [NEW] client/src/pages/Login.jsx + Signup.jsx + ForgotPassword.jsx
Clean forms with validation, error display, loading states.

#### User Dashboard

#### [NEW] client/src/pages/dashboard/UserDashboard.jsx
Left sidebar nav: Orders, Profile, Addresses, Wishlist.

#### [NEW] client/src/pages/dashboard/Orders.jsx
Order history table with status badges and detail view.

#### [NEW] client/src/pages/dashboard/Profile.jsx
Edit name/email/phone/password.

#### [NEW] client/src/pages/dashboard/Addresses.jsx
Address book CRUD.

#### [NEW] client/src/pages/dashboard/Wishlist.jsx

#### Admin Dashboard

#### [NEW] client/src/pages/admin/AdminLayout.jsx
Sidebar with nav links.

#### [NEW] client/src/pages/admin/AdminDashboard.jsx
Analytics cards: revenue, orders, users, products. Recharts bar/line charts.

#### [NEW] client/src/pages/admin/AdminProducts.jsx
Table with search, add/edit/delete product modal.

#### [NEW] client/src/pages/admin/AdminOrders.jsx
Order list with status update.

#### [NEW] client/src/pages/admin/AdminUsers.jsx
User list with role management.

#### [NEW] client/src/pages/admin/AdminCategories.jsx
Category tree management.

#### [NEW] client/src/pages/admin/AdminVendors.jsx
Vendor approval dashboard.

#### API Service Layer

#### [NEW] client/src/utils/api.js
Axios instance with base URL, interceptors for auth token.

#### [NEW] client/src/utils/productService.js + authService.js + orderService.js + cartService.js
All API call functions.

---

## Verification Plan

### Automated Tests
No existing test framework. Manual browser verification will be used.

### Manual Verification (Browser Flow)

After starting both servers, the browser subagent will:

1. **Open** `http://localhost:5173` — verify homepage loads with hero section
2. **Navigate** to `/products` — verify product listing with filter sidebar
3. **Click** a product — verify product detail page with specs
4. **Register** a new user at `/signup` — verify success and redirect
5. **Add to cart** — verify cart badge updates
6. **Open cart** — verify items display correctly
7. **Admin login** — verify admin dashboard loads at `/admin`

### Start Commands
```bash
# Backend
cd server && npm run dev   # runs on port 5000

# Frontend
cd client && npm run dev   # runs on port 5173
```
