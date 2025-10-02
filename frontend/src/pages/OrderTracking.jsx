import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Clock, CheckCircle, Truck, Package } from 'lucide-react'
import api from '../utils/api'
import { io } from 'socket.io-client'

const OrderTracking = () => {
  const { orderNumber } = useParams()
  const [socket, setSocket] = useState(null)

  const { data: order, refetch } = useQuery(
    ['order', orderNumber],
    () => api.get(`/api/orders/${orderNumber}`).then(res => res.data),
    {
      enabled: !!orderNumber
    }
  )

  useEffect(() => {
    const newSocket = io(window.location.origin)
    setSocket(newSocket)

    newSocket.emit('join-order', orderNumber)

    newSocket.on('order-update', (updatedOrder) => {
      if (updatedOrder.orderNumber === orderNumber) {
        refetch()
      }
    })

    return () => {
      newSocket.emit('leave-order', orderNumber)
      newSocket.disconnect()
    }
  }, [orderNumber, refetch])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="text-yellow-500" size={24} />
      case 'ACCEPTED':
        return <CheckCircle className="text-green-500" size={24} />
      case 'PREPARING':
        return <Package className="text-blue-500" size={24} />
      case 'READY_FOR_DISPATCH':
        return <Package className="text-purple-500" size={24} />
      case 'OUT_FOR_DELIVERY':
        return <Truck className="text-orange-500" size={24} />
      case 'DELIVERED':
        return <CheckCircle className="text-green-600" size={24} />
      case 'CANCELLED':
        return <Clock className="text-red-500" size={24} />
      default:
        return <Clock className="text-gray-500" size={24} />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Order Placed'
      case 'ACCEPTED':
        return 'Order Accepted'
      case 'PREPARING':
        return 'Preparing Your Food'
      case 'READY_FOR_DISPATCH':
        return 'Ready for Dispatch'
      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery'
      case 'DELIVERED':
        return 'Delivered'
      case 'CANCELLED':
        return 'Cancelled'
      default:
        return status
    }
  }

  const statusOrder = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_DISPATCH', 'OUT_FOR_DELIVERY', 'DELIVERED']

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading order details...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

        {/* Order Info */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Order Details</h3>
              <p><strong>Order Number:</strong> {order.orderNumber}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
              <p><strong>Phone:</strong> {order.address.phone}</p>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="card mb-8">
          <h3 className="text-xl font-semibold mb-6">Order Status</h3>
          <div className="space-y-4">
            {statusOrder.map((status, index) => {
              const isCompleted = statusOrder.indexOf(order.status) >= index
              const isCurrent = order.status === status
              const statusLog = order.statusLogs?.find(log => log.status === status)

              if (order.status === 'CANCELLED' && status !== 'PENDING' && status !== 'CANCELLED') {
                return null
              }

              return (
                <div key={status} className={`flex items-center space-x-4 p-4 rounded-lg ${
                  isCurrent ? 'bg-primary/10 border-2 border-primary' : 
                  isCompleted ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className={`flex-shrink-0 ${
                    isCompleted ? 'opacity-100' : 'opacity-50'
                  }`}>
                    {getStatusIcon(status)}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      isCurrent ? 'text-primary' : 
                      isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {getStatusText(status)}
                    </h4>
                    {statusLog && (
                      <p className="text-sm text-gray-600">
                        {new Date(statusLog.createdAt).toLocaleString()}
                        {statusLog.note && ` - ${statusLog.note}`}
                      </p>
                    )}
                  </div>
                  {isCurrent && (
                    <div className="flex-shrink-0">
                      <span className="bg-primary text-white px-2 py-1 rounded-full text-xs">
                        Current
                      </span>
                    </div>
                  )}
                </div>
              )
            })}

            {order.status === 'CANCELLED' && (
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-red-50 border-2 border-red-200">
                <div className="flex-shrink-0">
                  {getStatusIcon('CANCELLED')}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-600">Order Cancelled</h4>
                  {order.statusLogs?.find(log => log.status === 'CANCELLED')?.note && (
                    <p className="text-sm text-gray-600">
                      {order.statusLogs.find(log => log.status === 'CANCELLED').note}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-6">Order Items</h3>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">₹{item.unitPrice} × {item.qty}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{item.totalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking