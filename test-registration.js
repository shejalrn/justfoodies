const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:3000/api/users/register', {
      name: 'Test User',
      phone: '9876543210',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Registration successful:', response.data);
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
}

testRegistration();