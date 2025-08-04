// Test Script for Project Member Management
// Run this in browser console to test the member management features

const testMemberManagement = async () => {
  console.log('🧪 Testing Project Member Management...');
  
  try {
    // Test 1: Get available users for a project
    console.log('\n📋 Test 1: Getting available users for project...');
    const availableUsersResponse = await fetch('https://backend-g6r7.onrender.com/api/projects/1/available-users/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (availableUsersResponse.ok) {
      const availableUsers = await availableUsersResponse.json();
      console.log('✅ Available users:', availableUsers);
    } else {
      console.log('❌ Failed to get available users:', availableUsersResponse.status);
    }

    // Test 2: Get project members
    console.log('\n👥 Test 2: Getting project members...');
    const membersResponse = await fetch('https://backend-g6r7.onrender.com/api/projects/1/members/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (membersResponse.ok) {
      const members = await membersResponse.json();
      console.log('✅ Project members:', members);
    } else {
      console.log('❌ Failed to get project members:', membersResponse.status);
    }

    // Test 3: Add a user to project (if available users exist)
    console.log('\n➕ Test 3: Adding user to project...');
    const addMemberResponse = await fetch('https://backend-g6r7.onrender.com/api/projects/1/members/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: 2 // Assuming user ID 2 exists
      })
    });
    
    if (addMemberResponse.ok) {
      const addedMember = await addMemberResponse.json();
      console.log('✅ User added to project:', addedMember);
    } else {
      const error = await addMemberResponse.json();
      console.log('❌ Failed to add user:', error);
    }

    // Test 4: Remove user from project
    console.log('\n➖ Test 4: Removing user from project...');
    const removeMemberResponse = await fetch('https://backend-g6r7.onrender.com/api/projects/1/members/2/', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (removeMemberResponse.ok) {
      console.log('✅ User removed from project successfully');
    } else {
      console.log('❌ Failed to remove user:', removeMemberResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Helper function to check if user is logged in
const checkAuth = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.log('❌ No access token found. Please login first.');
    return false;
  }
  console.log('✅ Access token found');
  return true;
};

// Main test runner
const runMemberManagementTests = () => {
  console.log('🚀 Starting Project Member Management Tests...');
  
  if (!checkAuth()) {
    return;
  }
  
  testMemberManagement();
};

// Export for use
window.runMemberManagementTests = runMemberManagementTests;
window.testMemberManagement = testMemberManagement;

console.log('📝 Member Management Test Script Loaded!');
console.log('💡 Run "runMemberManagementTests()" to start testing'); 