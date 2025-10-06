require('dotenv').config();
const Razorpay = require('razorpay');

console.log('Testing Razorpay Configuration...');
console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'NOT SET');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function testRazorpay() {
  try {
    const order = await razorpay.orders.create({
      amount: 100, // 1 rupee in paise
      currency: 'INR',
      receipt: 'test_receipt_123'
    });
    
    console.log('✅ Razorpay test successful!');
    console.log('Order created:', order);
  } catch (error) {
    console.log('❌ Razorpay test failed!');
    console.error('Error:', error.message);
    console.error('Error details:', error);
  }
}

testRazorpay();