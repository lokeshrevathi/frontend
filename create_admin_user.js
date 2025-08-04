// Script to create admin user
// Run this in browser console or Node.js

const API_BASE_URL = 'https://backend-g6r7.onrender.com';

// Step 1: Register a regular user first
async function registerUser() {
  const userData = {
    username: 'admin@example.com',
    email: 'admin@example.com',
    password: 'admin123',
    password2: 'admin123',
    first_name: 'Admin',
    last_name: 'User'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      console.log('✅ User registered successfully');
      return await response.json();
    } else {
      const error = await response.json();
      console.log('❌ Registration failed:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Network error:', error);
    return null;
  }
}

// Step 2: Login to get token
async function loginUser() {
  const loginData = {
    username: 'admin@example.com',
    password: 'admin123'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful');
      return data.access;
    } else {
      const error = await response.json();
      console.log('❌ Login failed:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Network error:', error);
    return null;
  }
}

// Step 3: Check current user role
async function checkUserRole(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/me/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const userData = await response.json();
      console.log('👤 Current user data:', userData);
      return userData;
    } else {
      console.log('❌ Failed to get user data');
      return null;
    }
  } catch (error) {
    console.log('❌ Network error:', error);
    return null;
  }
}

// Main function to create admin user
async function createAdminUser() {
  console.log('🚀 Starting admin user creation process...\n');

  // Step 1: Register user
  console.log('📝 Step 1: Registering user...');
  const registration = await registerUser();
  if (!registration) {
    console.log('❌ Registration failed, stopping process');
    return;
  }

  // Step 2: Login
  console.log('\n🔐 Step 2: Logging in...');
  const token = await loginUser();
  if (!token) {
    console.log('❌ Login failed, stopping process');
    return;
  }

  // Step 3: Check current role
  console.log('\n👤 Step 3: Checking current user role...');
  const userData = await checkUserRole(token);
  if (!userData) {
    console.log('❌ Failed to get user data');
    return;
  }

  console.log('\n📋 Summary:');
  console.log('- User registered:', !!registration);
  console.log('- Login successful:', !!token);
  console.log('- Current role:', userData.role);
  console.log('- User ID:', userData.id);

  if (userData.role === 'admin') {
    console.log('✅ User is already an admin!');
  } else {
    console.log('⚠️ User is not an admin. You need to manually update the role in the backend database.');
    console.log('💡 Contact your backend administrator to change the role from "user" to "admin"');
  }

  // Store token for testing
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  
  console.log('\n🔑 Token stored in localStorage for testing');
  console.log('💡 You can now test the application with this user');
}

// Alternative: Create admin user via admin endpoint (requires existing admin)
async function createAdminViaAdminEndpoint(adminToken) {
  const adminUserData = {
    username: 'admin@example.com',
    email: 'admin@example.com',
    password: 'admin123',
    password2: 'admin123',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/create/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminUserData)
    });

    if (response.ok) {
      console.log('✅ Admin user created successfully');
      return await response.json();
    } else {
      const error = await response.json();
      console.log('❌ Admin creation failed:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Network error:', error);
    return null;
  }
}

// Export functions for use
window.createAdminUser = createAdminUser;
window.createAdminViaAdminEndpoint = createAdminViaAdminEndpoint;

console.log('🔧 Admin User Creation Script Loaded');
console.log('📋 Available functions:');
console.log('- createAdminUser() - Register and login as regular user');
console.log('- createAdminViaAdminEndpoint(token) - Create admin user (requires existing admin token)');
console.log('\n💡 Run createAdminUser() to start the process'); 