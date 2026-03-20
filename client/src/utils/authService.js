import api from './api'

export const loginUser = (email, password) => api.post('/auth/login', { email, password })

export const registerUser = (formData) => api.post('/auth/register', formData)

export const logoutUser = () => api.post('/auth/logout')

export const getMe = () => api.get('/auth/me')

export const forgotPassword = (email) => api.post('/auth/forgot-password', { email })

export const resetPassword = (token, password) => api.post(`/auth/reset-password/${token}`, { password })

export const updateProfile = (data) => api.put('/auth/update-profile', data)

export const changePassword = (data) => api.put('/auth/change-password', data)

// Wishlist
export const getWishlist = () => api.get('/wishlist')
export const addToWishlist = (productId) => api.post('/wishlist', { productId })
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`)

// Addresses
export const getAddresses = () => api.get('/auth/addresses')
export const addAddress = (data) => api.post('/auth/addresses', data)
export const updateAddress = (id, data) => api.put(`/auth/addresses/${id}`, data)
export const deleteAddress = (id) => api.delete(`/auth/addresses/${id}`)
