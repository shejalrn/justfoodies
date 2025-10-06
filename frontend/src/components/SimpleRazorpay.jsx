import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const SimpleRazorpay = ({ order, onSuccess, onError, autoOpen = false }) => {
  const [loading, setLoading] = useState(false)
  const [autoOpened, setAutoOpened] = useState(false)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        existingScript.onload = () => resolve(true)
        existingScript.onerror = () => resolve(false)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      console.log('Starting payment for order:', order.orderNumber, 'Amount:', order.totalAmount)
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script')
      }

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
        handler: async function (response) {
          try {
            console.log('Payment response received:', response)
            
            // Verify payment on backend
            await api.post('/api/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderNumber: order.orderNumber
            })
            
            toast.success('Payment successful!')
            onSuccess(response)
          } catch (error) {
            console.error('Payment verification failed:', error)
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
      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        toast.error(`Payment failed: ${response.error.description}`)
        onError(response.error)
      })
      
      rzp.open()
      
    } catch (error) {
      console.error('Payment initiation error:', error)
      toast.error(`Payment failed: ${error.message}`)
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoOpen && !autoOpened && !loading) {
      setAutoOpened(true)
      handlePayment()
    }
  }, [autoOpen, autoOpened, loading])

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50"
    >
      {loading ? 'Processing...' : `Pay ₹${order.totalAmount}`}
    </button>
  )
}

export default SimpleRazorpay