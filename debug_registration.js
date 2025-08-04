// Debug Registration Script
// Use this to test registration endpoints and identify issues

console.log('🔧 Debug Registration Script Loaded');

// Test data for registration
const testUser = {
  username: 'testuser@example.com',
  email: 'testuser@example.com',
  first_name: 'Test',
  last_name: 'User',
  password: 'test123',
  password2: 'test123',
  role: 'admin'
};

// Function to test public registration endpoint
async function testPublicRegistration() {
  console.log('🧪 Testing Public Registration...');
  
  try {
    const response = await fetch('https://backend-g6r7.onrender.com/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Registration successful:', data);
      return { success: true, data };
    } else {
      const error = await response.json();
      console.log('❌ Registration failed:', error);
      return { success: false, error };
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return { success: false, error: error.message };
  }
}

// Function to test admin user creation endpoint
async function testAdminUserCreation() {
  console.log('🧪 Testing Admin User Creation...');
  
  try {
    const response = await fetch('https://backend-g6r7.onrender.com/api/users/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...testUser,
        username: 'adminuser@example.com',
        email: 'adminuser@example.com'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Admin user creation successful:', data);
      return { success: true, data };
    } else {
      const error = await response.json();
      console.log('❌ Admin user creation failed:', error);
      return { success: false, error };
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    return { success: false, error: error.message };
  }
}

// Function to test backend connectivity
async function testBackendConnectivity() {
  console.log('🧪 Testing Backend Connectivity...');
  
  try {
    const response = await fetch('https://backend-g6r7.onrender.com/health/');
    console.log('Health check status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is healthy:', data);
      return true;
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Backend connectivity error:', error.message);
    return false;
  }
}

// Function to run all tests
async function runAllTests() {
  console.log('🚀 Running all registration tests...\n');
  
  // Test 1: Backend connectivity
  const backendOk = await testBackendConnectivity();
  console.log('');
  
  if (!backendOk) {
    console.log('❌ Backend is not accessible. Cannot proceed with registration tests.');
    return;
  }
  
  // Test 2: Public registration
  const publicResult = await testPublicRegistration();
  console.log('');
  
  // Test 3: Admin user creation
  const adminResult = await testAdminUserCreation();
  console.log('');
  
  // Summary
  console.log('📋 Test Summary:');
  console.log('- Backend connectivity:', backendOk ? '✅ OK' : '❌ FAILED');
  console.log('- Public registration:', publicResult.success ? '✅ OK' : '❌ FAILED');
  console.log('- Admin user creation:', adminResult.success ? '✅ OK' : '❌ FAILED');
  
  if (!publicResult.success) {
    console.log('\n🔍 Public Registration Error Details:');
    console.log(JSON.stringify(publicResult.error, null, 2));
  }
  
  if (!adminResult.success) {
    console.log('\n🔍 Admin User Creation Error Details:');
    console.log(JSON.stringify(adminResult.error, null, 2));
  }
}

// Function to check current user data
function checkCurrentUser() {
  console.log('👤 Current User Data:');
  const user = localStorage.getItem('user');
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  console.log('- User:', user ? JSON.parse(user) : 'Not logged in');
  console.log('- Access Token:', accessToken ? 'Present' : 'Missing');
  console.log('- Refresh Token:', refreshToken ? 'Present' : 'Missing');
}

// Export functions
window.testPublicRegistration = testPublicRegistration;
window.testAdminUserCreation = testAdminUserCreation;
window.testBackendConnectivity = testBackendConnectivity;
window.runAllTests = runAllTests;
window.checkCurrentUser = checkCurrentUser;

console.log('📋 Available functions:');
console.log('- testPublicRegistration() - Test public registration');
console.log('- testAdminUserCreation() - Test admin user creation');
console.log('- testBackendConnectivity() - Test backend connectivity');
console.log('- runAllTests() - Run all tests');
console.log('- checkCurrentUser() - Check current user data');

console.log('\n💡 Quick start: Run runAllTests() to diagnose registration issues'); 