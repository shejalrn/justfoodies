import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const RazorpayPayment = ({ order, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false)

  console.log('RazorpayPayment component rendered with order:', order)

  useEffect(() => {
    console.log('RazorpayPayment useEffect triggered, order:', order)
    // Don't auto-trigger, let user click the button
  }, [order])

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true)
        return
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        existingScript.onload = () => resolve(true)
        existingScript.onerror = () => resolve(false)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        console.log('Razorpay script loaded successfully')
        resolve(true)
      }
      script.onerror = () => {
        console.error('Failed to load Razorpay script')
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)
    console.log('Starting payment for order:', order)
    
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway')
        onError(new Error('Script loading failed'))
        return
      }

      if (!window.Razorpay) {
        toast.error('Payment gateway not available')
        onError(new Error('Razorpay not available'))
        return
      }

      console.log('Creating Razorpay order...')
      // Create Razorpay order
      const { data } = await api.post('/api/orders/create-payment', {
        amount: order.totalAmount,
        orderNumber: order.orderNumber
      })
      console.log('Razorpay order created:', data)

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'JustFoodies',
        description: `Order #${order.orderNumber}`,
        order_id: data.id,
        handler: async (response) => {
          try {
            console.log('Payment response:', response)
            // Verify payment
            await api.post('/api/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderNumber: order.orderNumber
            })
            
            toast.success('Payment successful!')
            onSuccess(response)
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed')
            onError(error)
          }
        },
        prefill: {
          name: order.user?.name || order.guestName || 'Customer',
          email: order.user?.email || 'customer@justfoodie.com',
          contact: order.user?.phone || order.guestPhone || '9999999999'
        },
        theme: {
          color: '#4BA3A8'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed')
            toast.error('Payment cancelled')
            onError(new Error('Payment cancelled'))
          }
        }
      }

      console.log('Opening Razorpay with options:', options)
      const razorpay = new window.Razorpay(options)
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        toast.error(`Payment failed: ${response.error.description}`)
        onError(response.error)
      })
      
      razorpay.open()
      
    } catch (error) {
      console.error('Payment initiation error:', error)
      toast.error(`Failed to initiate payment: ${error.message}`)
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">Payment Gateway Ready</p>
        <p className="text-xs text-blue-600">Order: {order?.orderNumber}, Amount: ₹{order?.totalAmount}</p>
        <p className="text-xs text-gray-500">Razorpay Script: {window.Razorpay ? 'Loaded' : 'Will load on click'}</p>
      </div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? 'Loading Payment Gateway...' : `Pay ₹${order.totalAmount} with Razorpay`}
      </button>
    </div>
  )
}

export default RazorpayPayment