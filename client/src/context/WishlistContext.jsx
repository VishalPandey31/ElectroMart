import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchWishlist()
    else setWishlist([])
  }, [user])

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist')
      setWishlist(data.wishlist || [])
    } catch { /* silent */ }
  }

  const toggleWishlist = async (productId) => {
    if (!user) { toast.error('Please login to use wishlist'); return }
    try {
      const { data } = await api.post(`/wishlist/${productId}`)
      if (data.added) {
        setWishlist((prev) => [...prev, { _id: productId }])
        toast.success('Added to wishlist ❤️')
      } else {
        setWishlist((prev) => prev.filter((p) => p._id !== productId))
        toast.success('Removed from wishlist')
      }
    } catch { toast.error('Error updating wishlist') }
  }

  const isWishlisted = (productId) => wishlist.some((p) => p._id === productId || p === productId)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
