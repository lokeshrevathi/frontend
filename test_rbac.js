// RBAC Test Script
// Run this in browser console to test RBAC functionality

console.log('🔐 RBAC Test Script Started');

// Test data
const testUsers = {
  admin: { username: 'admin@example.com', password: 'admin123', role: 'admin' },
  manager: { username: 'manager@example.com', password: 'manager123', role: 'manager' },
  user: { username: 'user@example.com', password: 'user123', role: 'user' }
};

// Test functions
const RBACTests = {
  // Check if user is logged in and get role
  checkCurrentUser: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('🔍 Current User Check:');
    console.log('- Token exists:', !!token);
    console.log('- User role:', user.role || 'Not logged in');
    console.log('- User data:', user);
    
    return { token, user };
  },

  // Check navigation visibility based on role
  checkNavigation: () => {
    console.log('🧭 Navigation Check:');
    
    // Check for Create Project link
    const createProjectLink = document.querySelector('a[href="/projects/create"]') || 
                             document.querySelector('a:contains("Create Project")');
    console.log('- Create Project visible:', !!createProjectLink);
    
    // Check for User Management link
    const userManagementLink = document.querySelector('a[href="/users"]') || 
                              document.querySelector('a:contains("User Management")');
    console.log('- User Management visible:', !!userManagementLink);
    
    // Check role display
    const roleDisplay = document.querySelector('*:contains("Role:")');
    console.log('- Role display visible:', !!roleDisplay);
    
    return { createProjectLink, userManagementLink, roleDisplay };
  },

  // Check form field visibility
  checkFormFields: () => {
    console.log('📝 Form Fields Check:');
    
    // Check assignee field in task creation form
    const assigneeField = document.querySelector('input[name="assignee"]') || 
                         document.querySelector('#assignee');
    console.log('- Assignee field visible:', !!assigneeField);
    
    // Check if assignee field is in a conditional render
    const conditionalRender = document.querySelector('[data-testid="conditional-render"]') ||
                             document.querySelector('.conditional-render');
    console.log('- Conditional render wrapper:', !!conditionalRender);
    
    return { assigneeField, conditionalRender };
  },

  // Test API permissions (simulate)
  testAPIPermissions: () => {
    console.log('🌐 API Permissions Check:');
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('- No token found, cannot test API permissions');
      return;
    }
    
    // Test user creation endpoint (admin only)
    fetch('https://backend-g6r7.onrender.com/api/users/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'test@example.com',
        password: 'test123',
        role: 'user'
      })
    })
    .then(response => {
      console.log('- User creation API response:', response.status);
      if (response.status === 403) {
        console.log('✅ Correctly blocked - user creation requires admin role');
      } else if (response.status === 201) {
        console.log('✅ User creation successful - user has admin role');
      } else {
        console.log('❓ Unexpected response:', response.status);
      }
    })
    .catch(error => {
      console.log('- API test error:', error.message);
    });
  },

  // Check for error handling
  checkErrorHandling: () => {
    console.log('⚠️ Error Handling Check:');
    
    // Check for error messages
    const errorMessages = document.querySelectorAll('.error, .alert-error, .toast-error');
    console.log('- Error messages found:', errorMessages.length);
    
    // Check for permission denied messages
    const permissionDenied = document.querySelector('*:contains("permission")') ||
                            document.querySelector('*:contains("access denied")');
    console.log('- Permission denied message:', !!permissionDenied);
    
    return { errorMessages, permissionDenied };
  },

  // Run all tests
  runAllTests: () => {
    console.log('🚀 Running All RBAC Tests...\n');
    
    RBACTests.checkCurrentUser();
    console.log('');
    
    RBACTests.checkNavigation();
    console.log('');
    
    RBACTests.checkFormFields();
    console.log('');
    
    RBACTests.testAPIPermissions();
    console.log('');
    
    RBACTests.checkErrorHandling();
    console.log('');
    
    console.log('✅ RBAC Test Script Completed');
  }
};

// Make tests available globally
window.RBACTests = RBACTests;

console.log('📋 Available test functions:');
console.log('- RBACTests.checkCurrentUser()');
console.log('- RBACTests.checkNavigation()');
console.log('- RBACTests.checkFormFields()');
console.log('- RBACTests.testAPIPermissions()');
console.log('- RBACTests.checkErrorHandling()');
console.log('- RBACTests.runAllTests()');

console.log('\n💡 Usage: Run RBACTests.runAllTests() to test everything'); 