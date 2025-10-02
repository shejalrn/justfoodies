import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Package, Users, TrendingUp, Clock, Eye, CheckCircle, XCircle, Search } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Admin = () => {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userSearch, setUserSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: dashboard } = useQuery('admin-dashboard', () =>
    api.get('/api/admin/dashboard').then(res => res.data)
  )

  const { data: ordersData } = useQuery(['admin-orders', statusFilter], () =>
    api.get(`/api/admin/orders?${statusFilter ? `status=${statusFilter}` : ''}`).then(res => res.data)
  )

  const { data: usersData } = useQuery(['admin-users', userSearch], () =>
    api.get(`/api/admin/users?${userSearch ? `search=${userSearch}` : ''}`).then(res => res.data)
  )

  const updateStatusMutation = useMutation(
    ({ orderId, status, note }) => api.patch(`/api/admin/orders/${orderId}/status`, { status, note }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-orders')
        queryClient.invalidateQueries('admin-dashboard')
        toast.success('Order status updated')
        setSelectedOrder(null)
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to update status')
      }
    }
  )

  const handleStatusUpdate = (orderId, status) => {
    updateStatusMutation.mutate({ orderId, status })
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-orange-100 text-orange-800',
      READY_FOR_DISPATCH: 'bg-purple-100 text-purple-800',
      OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const statusOptions = [
    'PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_DISPATCH', 
    'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-2 px-1 ${activeTab === 'dashboard' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 px-1 ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-1 ${activeTab === 'users' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
        >
          Users
        </button>
      </div>

      {/* Dashboard Stats */}
      {activeTab === 'dashboard' && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{dashboard?.totalOrders || 0}</p>
            </div>
            <Package className="text-primary" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold">{dashboard?.pendingOrders || 0}</p>
            </div>
            <Clock className="text-orange-500" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Today Orders</p>
              <p className="text-2xl font-bold">{dashboard?.todayOrders || 0}</p>
            </div>
            <Users className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Today Revenue</p>
              <p className="text-2xl font-bold">₹{dashboard?.todayRevenue || 0}</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>
        </div>
      )}

      {/* Orders Section */}
      {activeTab === 'orders' && (
        <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Orders</h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">All Orders</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Order #</th>
                <th className="text-left py-3">Customer</th>
                <th className="text-left py-3">Items</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Time</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordersData?.orders?.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-mono">#{order.orderNumber}</td>
                  <td className="py-3">
                    <div>
                      <p className="font-medium">{order.user?.name || order.guestName}</p>
                      <p className="text-sm text-gray-600">{order.user?.phone || order.guestPhone}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="text-sm">
                      {order.items.slice(0, 2).map(item => (
                        <div key={item.id}>{item.qty}x {item.title}</div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-gray-500">+{order.items.length - 2} more</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-semibold">₹{order.totalAmount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={16} />
                      </button>
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'ACCEPTED')}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* Users Section */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Users</h2>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                className="input pl-10"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Contact</th>
                  <th className="text-left py-3">Address</th>
                  <th className="text-left py-3">Orders</th>
                  <th className="text-left py-3">Role</th>
                  <th className="text-left py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.users?.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">ID: {user.id}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{user.phone}</p>
                        {user.email && (
                          <p className="text-sm text-gray-600">{user.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      {user.addresses?.length > 0 ? (
                        <div className="text-sm">
                          <p>{user.addresses[0].line1}</p>
                          <p className="text-gray-600">
                            {user.addresses[0].city}, {user.addresses[0].state} - {user.addresses[0].pincode}
                          </p>
                          {user.addresses.length > 1 && (
                            <p className="text-gray-500">+{user.addresses.length - 1} more</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">No address</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{user._count.orders} orders</p>
                        {user.orders?.length > 0 && (
                          <p className="text-sm text-gray-600">
                            Last: ₹{user.orders[0].totalAmount}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {usersData?.users?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found.</p>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && activeTab === 'orders' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Order #{selectedOrder.orderNumber}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Details</h4>
                  <p>{selectedOrder.user?.name || selectedOrder.guestName}</p>
                  <p>{selectedOrder.user?.phone || selectedOrder.guestPhone}</p>
                  {selectedOrder.user?.email && <p>{selectedOrder.user.email}</p>}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Delivery Address</h4>
                  <p>{selectedOrder.address?.line1}</p>
                  {selectedOrder.address?.line2 && <p>{selectedOrder.address.line2}</p>}
                  <p>{selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between py-2 border-b">
                      <span>{item.qty}x {item.title}</span>
                      <span>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold pt-2">
                    <span>Total</span>
                    <span>₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedOrder.status === status
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        disabled={updateStatusMutation.isLoading}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin