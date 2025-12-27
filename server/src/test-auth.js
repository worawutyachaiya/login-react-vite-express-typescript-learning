const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
  try {
    const uniqueUser = `testuser_${Date.now()}`;
    const uniqueEmail = `test_${Date.now()}@example.com`;

    console.log(`Registering user: ${uniqueUser}...`);
    const registerRes = await axios.post(`${API_URL}/register`, {
      username: uniqueUser,
      email: uniqueEmail,
      password: 'password123'
    });
    console.log('Register Success:', registerRes.data);

    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/login`, {
      email: uniqueEmail,
      password: 'password123'
    });
    console.log('Login Success:', loginRes.data);
    const token = loginRes.data.token;

    console.log('Fetching Profile...');
    const meRes = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Profile Success:', meRes.data);

  } catch (error) {
    if (error.response) {
        console.error('Error:', error.response.data);
    } else {
        console.error('Error:', error.message);
    }
  }
};

testAuth();
