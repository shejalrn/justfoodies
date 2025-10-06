import { useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const RazorpayDebug = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, { message, type, timestamp }])
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`)
  }

  const testRazorpayScript = async () => {
    addLog('Testing Razorpay script loading...')
    
    try {
      // Check if already loaded
      if (window.Razorpay) {
        addLog('✅ Razorpay already loaded', 'success')
        return true
      }

      // Load script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      
      const loaded = await new Promise((resolve) => {
        script.onload = () => {
          addLog('✅ Razorpay script loaded successfully', 'success')
          resolve(true)
        }
        script.onerror = () => {
          addLog('❌ Failed to load Razorpay script', 'error')
          resolve(false)
        }
        document.body.appendChild(script)
      })

      return loaded
    } catch (error) {
      addLog(`❌ Script loading error: ${error.message}`, 'error')
      return false
    }
  }

  const testBackendConnection = async () => {
    addLog('Testing backend connection...')
    
    try {
      const response = await api.get('/health')
      addLog(`✅ Backend connected: ${response.data.status}`, 'success')
      return true
    } catch (error) {
      addLog(`❌ Backend connection failed: ${error.message}`, 'error')
      return false
    }
  }

  const testRazorpayOrder = async () => {
    addLog('Testing Razorpay order creation...')
    
    try {
      const response = await api.post('/api/orders/create-payment', {
        amount: 100,
        orderNumber: `TEST_${Date.now()}`
      })
      
      addLog(`✅ Razorpay order created: ${response.data.id}`, 'success')
      addLog(`Key: ${response.data.key}`, 'info')
      addLog(`Amount: ${response.data.amount}`, 'info')
      return response.data
    } catch (error) {
      addLog(`❌ Order creation failed: ${error.message}`, 'error')
      if (error.response?.data) {
        addLog(`Error details: ${JSON.stringify(error.response.data)}`, 'error')
      }
      return null
    }
  }

  const testFullPaymentFlow = async () => {
    setLoading(true)
    setLogs([])
    
    try {
      // Step 1: Test backend
      const backendOk = await testBackendConnection()
      if (!backendOk) return

      // Step 2: Test script loading
      const scriptOk = await testRazorpayScript()
      if (!scriptOk) return

      // Step 3: Test order creation
      const orderData = await testRazorpayOrder()
      if (!orderData) return

      // Step 4: Test Razorpay initialization
      addLog('Testing Razorpay initialization...')
      
      if (!window.Razorpay) {
        addLog('❌ Razorpay not available after script load', 'error')
        return
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'JustFoodies Debug Test',
        description: 'Debug Payment Test',
        order_id: orderData.id,
        handler: function (response) {
          addLog(`✅ Payment successful: ${response.razorpay_payment_id}`, 'success')
          toast.success('Payment test successful!')
        },
        prefill: {
          name: 'Test User',
          email: 'test@justfoodie.com',
          contact: '9999999999'
        },
        theme: {
          color: '#4BA3A8'
        },
        modal: {
          ondismiss: function() {
            addLog('Payment modal dismissed', 'warning')
          }
        }
      }

      addLog('Opening Razorpay checkout...', 'info')
      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', function (response) {
        addLog(`❌ Payment failed: ${response.error.description}`, 'error')
      })
      
      rzp.open()
      addLog('✅ Razorpay checkout opened successfully', 'success')
      
    } catch (error) {
      addLog(`❌ Test failed: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Razorpay Debug Console</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testFullPaymentFlow}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Run Full Payment Test'}
        </button>
        
        <button
          onClick={clearLogs}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded ml-4"
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500">No logs yet. Click "Run Full Payment Test" to start debugging.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`mb-1 ${
              log.type === 'error' ? 'text-red-400' : 
              log.type === 'success' ? 'text-green-400' : 
              log.type === 'warning' ? 'text-yellow-400' : 
              'text-blue-400'
            }`}>
              [{log.timestamp}] {log.message}
            </div>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Environment Info:</h3>
        <div className="text-sm space-y-1">
          <div>Mode: {import.meta.env.MODE}</div>
          <div>Prod: {import.meta.env.PROD ? 'Yes' : 'No'}</div>
          <div>Base URL: {import.meta.env.PROD ? 'Production' : 'http://localhost:3000'}</div>
          <div>Razorpay Available: {window.Razorpay ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  )
}

export default RazorpayDebug