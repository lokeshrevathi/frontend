// Test Script for API Connectivity
// Run this in browser console to test API connectivity

const testAPIConnectivity = async () => {
  console.log('🔍 Testing API Connectivity...');
  
  try {
    // Test 1: Health Check
    console.log('\n🏥 Test 1: Health Check');
    const healthResponse = await fetch('https://backend-g6r7.onrender.com/health/');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check successful:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }

    // Test 2: Check if user is authenticated
    console.log('\n🔐 Test 2: Authentication Check');
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('❌ No access token found. Please login first.');
      return;
    }
    console.log('✅ Access token found');

    // Test 3: Get user profile
    console.log('\n👤 Test 3: User Profile');
    const profileResponse = await fetch('https://backend-g6r7.onrender.com/api/me/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ User profile:', profileData);
    } else {
      console.log('❌ Failed to get user profile:', profileResponse.status);
      const errorData = await profileResponse.json();
      console.log('Error details:', errorData);
    }

    // Test 4: Get projects
    console.log('\n📋 Test 4: Get Projects');
    const projectsResponse = await fetch('https://backend-g6r7.onrender.com/api/projects/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json();
      console.log('✅ Projects loaded:', projectsData);
      
      if (projectsData.length > 0) {
        const firstProject = projectsData[0];
        console.log('First project:', firstProject);
        
        // Test 5: Get specific project details
        console.log('\n📄 Test 5: Get Project Details');
        const projectDetailResponse = await fetch(`https://backend-g6r7.onrender.com/api/projects/${firstProject.id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (projectDetailResponse.ok) {
          const projectDetail = await projectDetailResponse.json();
          console.log('✅ Project details:', projectDetail);
        } else {
          console.log('❌ Failed to get project details:', projectDetailResponse.status);
          const errorData = await projectDetailResponse.json();
          console.log('Error details:', errorData);
        }
      } else {
        console.log('⚠️ No projects found. Create a project first.');
      }
    } else {
      console.log('❌ Failed to get projects:', projectsResponse.status);
      const errorData = await projectsResponse.json();
      console.log('Error details:', errorData);
    }

    // Test 6: Get milestones
    console.log('\n🎯 Test 6: Get Milestones');
    const milestonesResponse = await fetch('https://backend-g6r7.onrender.com/api/milestones/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (milestonesResponse.ok) {
      const milestonesData = await milestonesResponse.json();
      console.log('✅ Milestones loaded:', milestonesData);
    } else {
      console.log('❌ Failed to get milestones:', milestonesResponse.status);
    }

    // Test 7: Get tasks
    console.log('\n✅ Test 7: Get Tasks');
    const tasksResponse = await fetch('https://backend-g6r7.onrender.com/api/tasks/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      console.log('✅ Tasks loaded:', tasksData);
    } else {
      console.log('❌ Failed to get tasks:', tasksResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Helper function to check environment
const checkEnvironment = () => {
  console.log('🔧 Environment Check:');
  console.log('API URL:', process.env.REACT_APP_API_URL || 'https://backend-g6r7.onrender.com/');
  console.log('Access Token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');
  console.log('Refresh Token:', localStorage.getItem('refresh_token') ? 'Present' : 'Missing');
};

// Main test runner
const runAPITests = () => {
  console.log('🚀 Starting API Connectivity Tests...');
  checkEnvironment();
  testAPIConnectivity();
};

// Export for use
window.runAPITests = runAPITests;
window.testAPIConnectivity = testAPIConnectivity;
window.checkEnvironment = checkEnvironment;

console.log('📝 API Connectivity Test Script Loaded!');
console.log('💡 Run "runAPITests()" to start testing'); 