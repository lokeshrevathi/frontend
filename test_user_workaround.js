// Test User Workaround Script
// Use this when backend admin endpoint is not available

console.log('🔧 Test User Workaround Script Loaded');

const TEST_USERS = {
  admin: {
    username: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com'
  },
  manager: {
    username: 'manager@example.com',
    password: 'manager123',
    role: 'manager',
    first_name: 'Manager',
    last_name: 'User',
    email: 'manager@example.com'
  },
  user: {
    username: 'user@example.com',
    password: 'user123',
    role: 'user',
    first_name: 'Regular',
    last_name: 'User',
    email: 'user@example.com'
  }
};

// Function to create test users via regular registration
async function createTestUsers() {
  console.log('🚀 Creating test users...\n');
  
  for (const [role, userData] of Object.entries(TEST_USERS)) {
    console.log(`📝 Creating ${role} user: ${userData.username}`);
    
    try {
      const response = await fetch('https://backend-g6r7.onrender.com/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          password: userData.password,
          password2: userData.password
        })
      });
      
      if (response.ok) {
        console.log(`✅ ${role} user created successfully`);
        
        // Store role information locally for testing
        const testUsers = JSON.parse(localStorage.getItem('testUsers') || '{}');
        testUsers[userData.username] = {
          role: userData.role,
          created: new Date().toISOString()
        };
        localStorage.setItem('testUsers', JSON.stringify(testUsers));
        
      } else {
        const error = await response.json();
        if (error.username && error.username.includes('already exists')) {
          console.log(`⚠️ ${role} user already exists`);
        } else {
          console.log(`❌ Failed to create ${role} user:`, error);
        }
      }
    } catch (error) {
      console.log(`❌ Error creating ${role} user:`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('📋 Test users setup complete!');
  console.log('💡 You can now login with any of these users for testing');
}

// Function to simulate role-based login
async function loginWithRole(username, password) {
  console.log(`🔐 Logging in as ${username}...`);
  
  try {
    const response = await fetch('https://backend-g6r7.onrender.com/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Store tokens
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      // Get user profile
      const profileResponse = await fetch('https://backend-g6r7.onrender.com/api/me/', {
        headers: {
          'Authorization': `Bearer ${data.access}`,
        }
      });
      
      if (profileResponse.ok) {
        const userData = await profileResponse.json();
        
        // Override role for testing if we have stored role info
        const testUsers = JSON.parse(localStorage.getItem('testUsers') || '{}');
        if (testUsers[username]) {
          userData.role = testUsers[username].role;
          console.log(`🎭 Overriding role to: ${userData.role} (for testing)`);
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log(`✅ Login successful! Role: ${userData.role}`);
        console.log('🔄 Refresh the page to see the updated role');
        
        return { success: true, user: userData };
      }
    } else {
      const error = await response.json();
      console.log(`❌ Login failed:`, error);
      return { success: false, error };
    }
  } catch (error) {
    console.log(`❌ Login error:`, error.message);
    return { success: false, error };
  }
}

// Function to test all roles
async function testAllRoles() {
  console.log('🧪 Testing all user roles...\n');
  
  for (const [role, userData] of Object.entries(TEST_USERS)) {
    console.log(`--- Testing ${role.toUpperCase()} role ---`);
    
    const result = await loginWithRole(userData.username, userData.password);
    
    if (result.success) {
      console.log(`✅ ${role} login successful`);
      console.log(`👤 User data:`, result.user);
    } else {
      console.log(`❌ ${role} login failed`);
    }
    
    console.log(''); // Empty line
  }
  
  console.log('🎯 Role testing complete!');
}

// Function to clear test data
function clearTestData() {
  localStorage.removeItem('testUsers');
  console.log('🗑️ Test data cleared');
}

// Function to show current test users
function showTestUsers() {
  const testUsers = JSON.parse(localStorage.getItem('testUsers') || '{}');
  console.log('📋 Current test users:');
  console.table(testUsers);
}

// Export functions
window.createTestUsers = createTestUsers;
window.loginWithRole = loginWithRole;
window.testAllRoles = testAllRoles;
window.clearTestData = clearTestData;
window.showTestUsers = showTestUsers;

console.log('📋 Available functions:');
console.log('- createTestUsers() - Create all test users');
console.log('- loginWithRole(username, password) - Login with specific user');
console.log('- testAllRoles() - Test login for all roles');
console.log('- clearTestData() - Clear test user data');
console.log('- showTestUsers() - Show current test users');

console.log('\n💡 Quick start: Run createTestUsers() to set up test users'); 