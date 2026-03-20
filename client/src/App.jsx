import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Contact from './pages/Contact'
import SmartRecommender from './pages/SmartRecommender'

// User Dashboard
import UserDashboard from './pages/dashboard/UserDashboard'
import MyOrders from './pages/dashboard/MyOrders'
import OrderDetail from './pages/dashboard/OrderDetail'
import Profile from './pages/dashboard/Profile'
import Addresses from './pages/dashboard/Addresses'
import Wishlist from './pages/dashboard/Wishlist'

// Admin
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCategories from './pages/admin/AdminCategories'
import AdminVendors from './pages/admin/AdminVendors'

// Guards
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Public layout wrapper (renders Navbar + page content + Footer)
const PublicLayout = () => (
  <>
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 64px)' }}>
      <Outlet />
    </main>
    <Footer />
  </>
)

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#ffffff',
                  color: '#212121',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: { iconTheme: { primary: '#388e3c', secondary: '#ffffff' } },
                error:   { iconTheme: { primary: '#c62828', secondary: '#ffffff' } },
              }}
            />
            <Routes>
              {/* Public routes with Navbar + Footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/smart-recommender" element={<SmartRecommender />} />

                {/* Protected user routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:id" element={<OrderSuccess />} />
                  <Route path="/dashboard" element={<UserDashboard />}>
                    <Route index element={<MyOrders />} />
                    <Route path="orders" element={<MyOrders />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="addresses" element={<Addresses />} />
                    <Route path="wishlist" element={<Wishlist />} />
                  </Route>
                </Route>
              </Route>

              {/* Admin routes — no public navbar */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="vendors" element={<AdminVendors />} />
                </Route>
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
