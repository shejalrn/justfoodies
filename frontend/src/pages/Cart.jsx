import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../utils/CartContext'
import { useAuth } from '../utils/AuthContext'
import { useQuery } from 'react-query'
import api from '../utils/api'
import toast from 'react-hot-toast'
import SimpleRazorpay from '../components/SimpleRazorpay'

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Get suggested products (popular items not in cart)
  const { data: suggestedProducts } = useQuery(
    ['suggested-products', items.map(item => item.id)],
    () => api.get('/api/sanity/menu-items?limit=6').then(res => {
      const allItems = res.data.items || []
      const cartItemIds = items.map(item => item.id)
      return allItems.filter(item => !cartItemIds.includes(item._id)).slice(0, 4)
    }),
    { enabled: true }
  )

  const handleAddSuggested = (item) => {
    addItem({
      id: item._id,
      title: item.title,
      price: item.price,
      image: item.image,
      isVeg: item.isVeg
    })
    toast.success(`${item.title} added to cart`)
  }
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
  const [paymentMethod, setPaymentMethod] = useState('ONLINE')
  const [currentOrder, setCurrentOrder] = useState(null)

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
        paymentMethod: 'ONLINE'
      }

      if (!user) {
        orderData.guestName = guestInfo.name
        orderData.guestPhone = guestInfo.phone
      }

      console.log('Sending order data:', orderData)
      const response = await api.post('/api/orders', orderData)
      const order = response.data
      console.log('Order created response:', order)

      console.log('Setting current order for payment:', order)
      setCurrentOrder(order)
      toast.success('Order created! Proceeding to payment...')
    } catch (error) {
      console.error('Order placement error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      const errorMessage = error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || error.message || 'Failed to place order'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
          <p className="text-gray-500 mb-8">Your cart is empty</p>
          <button 
            onClick={() => navigate('/menu')}
            className="btn-primary"
          >
            Browse Menu
          </button>
        </div>
        
        {/* Suggested Products for Empty Cart */}
        {suggestedProducts && suggestedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Popular Items</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map(item => {
                const itemSlug = item.slug?.current || item.slug || item._id
                return (
                  <div key={item._id} className="card">
                    <Link to={`/product/${itemSlug}`}>
                      <div className="h-32 bg-gray-200 rounded-lg mb-3">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            🍽️
                          </div>
                        )}
                      </div>
                    </Link>
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary">₹{item.price}</span>
                      <button
                        onClick={() => handleAddSuggested(item)}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-3">
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-white border rounded-lg p-4 flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      🍽️
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-gray-500 text-sm">₹{item.price}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-primary text-white hover:bg-primary/80 flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-sm">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 mt-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add More Items Section */}
          {suggestedProducts && suggestedProducts.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Add more items</h2>
                <button 
                  onClick={() => navigate('/menu')}
                  className="text-primary text-sm hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {suggestedProducts.map(item => {
                  const itemSlug = item.slug?.current || item.slug || item._id
                  return (
                    <div key={item._id} className="bg-white border rounded-lg p-3">
                      <div className="h-24 bg-gray-100 rounded-lg mb-2">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            🍽️
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-xs mb-1 line-clamp-2">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-primary">₹{item.price}</span>
                        <button
                          onClick={() => handleAddSuggested(item)}
                          className="bg-primary text-white px-2 py-1 rounded text-xs font-medium hover:bg-primary/80"
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary & Checkout - Sticky Sidebar */}
        <div className="lg:sticky lg:top-24 lg:h-fit space-y-4">
          {/* Order Summary */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Bill Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Item total</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Delivery fee</span>
                <span>FREE</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Grand Total</span>
                <span>₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>

          {/* Guest Info */}
          {!user && (
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Your Details</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Delivery Address */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Delivery Address</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Address Line 1"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={address.line1}
                onChange={(e) => setAddress(prev => ({ ...prev, line1: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Address Line 2 (Optional)"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={address.line2}
                onChange={(e) => setAddress(prev => ({ ...prev, line2: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={address.city}
                  onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="State"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={address.state}
                  onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Pincode"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={address.pincode}
                  onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  value={address.phone}
                  onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Payment</h3>
            <div className="bg-primary/5 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={true}
                  readOnly
                  className="text-primary"
                />
                <span className="text-sm font-medium">Pay Online</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Secure payment via Razorpay</p>
            </div>
          </div>



          {currentOrder ? (
            <SimpleRazorpay
              order={currentOrder}
              onSuccess={(response) => {
                toast.success('Payment completed successfully')
                clearCart()
                navigate(`/track/${currentOrder.orderNumber}`)
              }}
              onError={(error) => {
                toast.error(`Payment failed: ${error.message || 'Unknown error'}`)
                setCurrentOrder(null)
              }}
              autoOpen={true}
            />
          ) : (
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Creating Order...' : `Pay ₹${getTotalPrice()}`}
            </button>
          )}
        </div>
      </div>


    </div>
  )
}

export default Cart