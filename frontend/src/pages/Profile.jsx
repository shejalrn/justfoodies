import { useState } from 'react'
import { useQuery } from 'react-query'
import { User, MapPin, Clock } from 'lucide-react'
import { useAuth } from '../utils/AuthContext'
import api from '../utils/api'

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useQuery(
    'user-orders',
    () => api.get('/api/orders/user/orders').then(res => res.data),
    {
      enabled: !!user,
      retry: 1
    }
  )

  const { data: addresses, isLoading: addressesLoading } = useQuery(
    'user-addresses',
    () => api.get('/api/users/addresses').then(res => res.data),
    {
      enabled: !!user,
      retry: 1
    }
  )

  // Extract orders array from response
  const orders = ordersData?.orders || []

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Please login to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'profile' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <User className="inline mr-2" size={16} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'orders' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Clock className="inline mr-2" size={16} />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'addresses' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <MapPin className="inline mr-2" size={16} />
            Addresses
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <p className="text-lg">{user.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p className="text-lg">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Member Since</label>
                <p className="text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="card text-center">
                <p>Loading orders...</p>
              </div>
            ) : ordersError ? (
              <div className="card text-center">
                <p className="text-red-500">Error loading orders: {ordersError.message}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary mt-4"
                >
                  Retry
                </button>
              </div>
            ) : orders?.length > 0 ? (
              orders.map(order => (
                <div key={order.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{order.totalAmount}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items?.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.title} × {item.qty}</span>
                        <span>₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button 
                      onClick={() => window.open(`/track/${order.orderNumber}`, '_blank')}
                      className="text-primary hover:underline text-sm"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center">
                <p className="text-gray-500">No orders found</p>
                <button 
                  onClick={() => window.location.href = '/menu'}
                  className="btn-primary mt-4"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            {addressesLoading ? (
              <div className="card text-center">
                <p>Loading addresses...</p>
              </div>
            ) : addresses?.length > 0 ? (
              addresses.map(address => (
                <div key={address.id} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{address.label}</h3>
                      <p className="text-gray-600">
                        {address.line1}
                        {address.line2 && `, ${address.line2}`}
                      </p>
                      <p className="text-gray-600">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-gray-600">Phone: {address.phone}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center">
                <p className="text-gray-500">No addresses found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile