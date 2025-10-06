const axios = require('axios');

async function testPayment() {
  try {
    console.log('Testing payment creation...');
    
    const response = await axios.post('http://localhost:3000/api/orders/create-payment', {
      amount: 100,
      orderNumber: 'TEST123'
    });
    
    console.log('Payment creation successful:', response.data);
  } catch (error) {
    console.error('Payment creation failed:', error.response?.data || error.message);
  }
}

testPayment();