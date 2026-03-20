import api from './api'

// Get products with filters
export const getProducts = (params = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => { if (v) query.append(k, v) })
  return api.get(`/products?${query.toString()}`)
}

// Get single product by slug
export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`)

// Get featured products
export const getFeaturedProducts = () => api.get('/products/featured')

// Get product suggestions / related
export const getSuggestions = (keyword) => api.get(`/products/suggestions?q=${keyword}`)

// Admin: create product
export const createProduct = (productData) => api.post('/products', productData)

// Admin: update product
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData)

// Admin: delete product
export const deleteProduct = (id) => api.delete(`/products/${id}`)

// Reviews
export const addReview = (productId, reviewData) => api.post(`/reviews/${productId}`, reviewData)

// Categories
export const getCategories = (tree = false) => api.get(`/categories${tree ? '?tree=true' : ''}`)
export const createCategory = (data) => api.post('/categories', data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

// Coupons
export const applyCoupon = (code, orderAmount) => api.post('/coupons/apply', { code, orderAmount })
