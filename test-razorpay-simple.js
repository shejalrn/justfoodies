require('dotenv').config();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function testSimpleOrder() {
  try {
    console.log('Testing with credentials:');
    console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
    console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'NOT SET');
    
    const order = await razorpay.orders.create({
      amount: 50000, // 500 INR in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        order_type: 'food_order'
      }
    });
    
    console.log('✅ Order created successfully:');
    console.log('Order ID:', order.id);
    console.log('Amount:', order.amount);
    console.log('Currency:', order.currency);
    console.log('Status:', order.status);
    
  } catch (error) {
    console.log('❌ Error creating order:');
    console.error('Error code:', error.error?.code);
    console.error('Error description:', error.error?.description);
    console.error('Full error:', error);
  }
}

testSimpleOrder();