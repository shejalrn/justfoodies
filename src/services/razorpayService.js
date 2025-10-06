const Razorpay = require('razorpay')
const crypto = require('crypto')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const createOrder = async (amount, currency = 'INR', receipt) => {
  try {
    console.log('Creating Razorpay order with:', { amount, currency, receipt })
    console.log('Razorpay instance configured with:', {
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'NOT SET'
    })
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
    }
    
    console.log('Order options:', options)
    const order = await razorpay.orders.create(options)
    console.log('Razorpay order created successfully:', order)
    return order
  } catch (error) {
    console.error('Razorpay order creation failed:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.error?.code,
      description: error.error?.description,
      source: error.error?.source,
      step: error.error?.step,
      reason: error.error?.reason
    })
    throw error
  }
}

const verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const body = razorpayOrderId + '|' + razorpayPaymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex')
  
  return expectedSignature === razorpaySignature
}

module.exports = {
  createOrder,
  verifyPayment,
}