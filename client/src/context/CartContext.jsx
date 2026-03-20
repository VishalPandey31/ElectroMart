import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchCart()
    else setCart({ items: [] })
  }, [user])

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart')
      setCart(data.cart || { items: [] })
    } catch { /* silent */ }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add to cart'); return false }
    setLoading(true)
    try {
      const { data } = await api.post('/cart/add', { productId, quantity })
      setCart(data.cart)
      toast.success('Added to cart!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
      return false
    } finally { setLoading(false) }
  }

  const updateItem = async (productId, quantity) => {
    try {
      const { data } = await api.put('/cart/update', { productId, quantity })
      setCart(data.cart)
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const removeItem = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/item/${productId}`)
      setCart(data.cart)
      toast.success('Item removed')
    } catch (err) { toast.error('Error removing item') }
  }

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear')
      setCart({ items: [] })
    } catch { /* silent */ }
  }

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0
  const cartTotal = cart.items?.reduce((sum, i) => sum + (i.price * i.quantity), 0) || 0

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, clearCart, fetchCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
