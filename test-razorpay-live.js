require('dotenv').config();
const Razorpay = require('razorpay');

console.log('Testing Live Razorpay Keys...');
console.log('Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'NOT SET');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function testLiveKeys() {
  try {
    // Test 1: Create a small order
    console.log('\n1. Testing order creation...');
    const order = await razorpay.orders.create({
      amount: 100, // 1 rupee in paise
      currency: 'INR',
      receipt: `test_${Date.now()}`,
      notes: {
        test: 'live_key_test'
      }
    });
    
    console.log('✅ Order created successfully:');
    console.log('- Order ID:', order.id);
    console.log('- Amount:', order.amount);
    console.log('- Status:', order.status);
    
    // Test 2: Fetch the order
    console.log('\n2. Testing order fetch...');
    const fetchedOrder = await razorpay.orders.fetch(order.id);
    console.log('✅ Order fetched successfully:');
    console.log('- Status:', fetchedOrder.status);
    console.log('- Created at:', new Date(fetchedOrder.created_at * 1000));
    
    // Test 3: List recent orders
    console.log('\n3. Testing orders list...');
    const orders = await razorpay.orders.all({ count: 5 });
    console.log('✅ Orders list retrieved:');
    console.log('- Total orders found:', orders.items.length);
    
    console.log('\n🎉 All tests passed! Live keys are working correctly.');
    
  } catch (error) {
    console.log('\n❌ Test failed!');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.error) {
      console.error('Razorpay error details:');
      console.error('- Code:', error.error.code);
      console.error('- Description:', error.error.description);
      console.error('- Source:', error.error.source);
      console.error('- Step:', error.error.step);
      console.error('- Reason:', error.error.reason);
    }
    
    // Common error scenarios
    if (error.message.includes('authentication')) {
      console.log('\n💡 Suggestion: Check if your Razorpay keys are correct');
    } else if (error.message.includes('network')) {
      console.log('\n💡 Suggestion: Check your internet connection');
    } else if (error.message.includes('unauthorized')) {
      console.log('\n💡 Suggestion: Your account might not be activated or keys might be invalid');
    }
  }
}

testLiveKeys();