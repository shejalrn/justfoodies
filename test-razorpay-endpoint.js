const axios = require('axios');

async function testRazorpay() {
  try {
    console.log('Testing Razorpay endpoint...');
    
    const response = await axios.get('http://localhost:3000/api/orders/test-razorpay');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testRazorpay();