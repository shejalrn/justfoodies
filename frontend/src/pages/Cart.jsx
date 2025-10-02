import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../utils/CartContext'
import { useAuth } from '../utils/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  })
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: ''
  })

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!address.line1 || !address.city || !address.state || !address.pincode || !address.phone) {
      toast.error('Please fill in all address fields')
      return
    }

    if (!user && (!guestInfo.name || !guestInfo.phone)) {
      toast.error('Please fill in your details')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: item.quantity,
          isVeg: item.isVeg
        })),
        address,
        paymentMethod: 'CASH'
      }

      if (!user) {
        orderData.guestName = guestInfo.name
        orderData.guestPhone = guestInfo.phone
      }

      const response = await api.post('/api/orders', orderData)
      const order = response.data

      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/track/${order.orderNumber}`)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-gray-500 mb-8">Your cart is empty</p>
          <button 
            onClick={() => navigate('/menu')}
            className="btn-primary"
          >
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="card flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹0</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>

          {/* Guest Info */}
          {!user && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Your Details</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="input"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Delivery Address */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Address Line 1"
                className="input"
                value={address.line1}
                onChange={(e) => setAddress(prev => ({ ...prev, line1: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Address Line 2 (Optional)"
                className="input"
                value={address.line2}
                onChange={(e) => setAddress(prev => ({ ...prev, line2: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="input"
                  value={address.city}
                  onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="State"
                  className="input"
                  value={address.state}
                  onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Pincode"
                  className="input"
                  value={address.pincode}
                  onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="input"
                  value={address.phone}
                  onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart