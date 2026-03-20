import api from './api'

// Create a new order
export const createOrder = (orderData) => api.post('/orders', orderData)

// Get my orders (user)
export const getMyOrders = () => api.get('/orders/myorders')

// Get single order by ID
export const getOrderById = (id) => api.get(`/orders/${id}`)

// Admin: get all orders
export const getAllOrders = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => { if (v) query.append(k, v) })
  return api.get(`/orders?${query.toString()}`)
}

// Admin: update order status
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status })

// Razorpay: create payment order
export const createRazorpayOrder = (amount) => api.post('/payment/razorpay/create-order', { amount })

// Razorpay: verify payment
export const verifyRazorpayPayment = (paymentData) => api.post('/payment/razorpay/verify', paymentData)

// Cash on Delivery order
export const placeCODOrder = (orderData) => api.post('/payment/cod', orderData)

// Apply coupon
export const applyCoupon = (code, orderAmount) => api.post('/coupons/apply', { code, orderAmount })

// Admin: analytics
export const getAdminAnalytics = () => api.get('/admin/analytics')
