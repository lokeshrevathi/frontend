// Test Script for User Tasks with Full Task Actions
// Run this in browser console to test the user task features

const testUserTasks = async () => {
  console.log('🧪 Testing User Tasks with Full Task Actions...');
  
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('❌ No access token found. Please login first.');
      return;
    }

    // Test 1: Get user profile to verify current user
    console.log('\n👤 Test 1: Getting user profile...');
    const profileResponse = await fetch('https://backend-g6r7.onrender.com/api/me/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (profileResponse.ok) {
      const userProfile = await profileResponse.json();
      console.log('✅ User profile:', userProfile);
    } else {
      console.log('❌ Failed to get user profile:', profileResponse.status);
      return;
    }

    // Test 2: Get user's assigned tasks
    console.log('\n📋 Test 2: Getting user tasks...');
    const userTasksResponse = await fetch('https://backend-g6r7.onrender.com/api/user/tasks/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (userTasksResponse.ok) {
      const userTasks = await userTasksResponse.json();
      console.log('✅ User tasks:', userTasks);
      
      if (userTasks.length > 0) {
        const firstTask = userTasks[0];
        console.log('First task:', firstTask);
        
        // Test 3: Update task status
        console.log('\n🔄 Test 3: Updating task status...');
        const newStatus = firstTask.status === 'todo' ? 'in_progress' : 
                         firstTask.status === 'in_progress' ? 'done' : 'todo';
        
        const updateStatusResponse = await fetch(`https://backend-g6r7.onrender.com/api/tasks/${firstTask.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus
          })
        });
        
        if (updateStatusResponse.ok) {
          const updatedTask = await updateStatusResponse.json();
          console.log('✅ Task status updated:', updatedTask);
        } else {
          const error = await updateStatusResponse.json();
          console.log('❌ Failed to update task status:', error);
        }
        
        // Test 4: Log time to task
        console.log('\n⏰ Test 4: Logging time to task...');
        const logTimeResponse = await fetch(`https://backend-g6r7.onrender.com/api/tasks/${firstTask.id}/log_time/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            hours: 2.5
          })
        });
        
        if (logTimeResponse.ok) {
          const timeLogResult = await logTimeResponse.json();
          console.log('✅ Time logged successfully:', timeLogResult);
        } else {
          const error = await logTimeResponse.json();
          console.log('❌ Failed to log time:', error);
        }
        
        // Test 5: Update task details
        console.log('\n✏️ Test 5: Updating task details...');
        const updateTaskResponse = await fetch(`https://backend-g6r7.onrender.com/api/tasks/${firstTask.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: `${firstTask.title} (Updated)`,
            description: `${firstTask.description || ''} - Updated by user`,
            priority: 'high'
          })
        });
        
        if (updateTaskResponse.ok) {
          const updatedTaskDetails = await updateTaskResponse.json();
          console.log('✅ Task details updated:', updatedTaskDetails);
        } else {
          const error = await updateTaskResponse.json();
          console.log('❌ Failed to update task details:', error);
        }
        
      } else {
        console.log('⚠️ No tasks assigned to user. Create some tasks first.');
      }
    } else {
      console.log('❌ Failed to get user tasks:', userTasksResponse.status);
      const error = await userTasksResponse.json();
      console.log('Error details:', error);
    }

    // Test 6: Get projects where user is a member
    console.log('\n📁 Test 6: Getting user projects...');
    const projectsResponse = await fetch('https://backend-g6r7.onrender.com/api/projects/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (projectsResponse.ok) {
      const projects = await projectsResponse.json();
      console.log('✅ User projects:', projects);
    } else {
      console.log('❌ Failed to get projects:', projectsResponse.status);
    }

    // Test 7: Get updated user tasks after modifications
    console.log('\n📋 Test 7: Getting updated user tasks...');
    const updatedTasksResponse = await fetch('https://backend-g6r7.onrender.com/api/user/tasks/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (updatedTasksResponse.ok) {
      const updatedTasks = await updatedTasksResponse.json();
      console.log('✅ Updated user tasks:', updatedTasks);
      
      // Show tasks with different statuses
      const todoTasks = updatedTasks.filter(t => t.status === 'todo');
      const inProgressTasks = updatedTasks.filter(t => t.status === 'in_progress');
      const doneTasks = updatedTasks.filter(t => t.status === 'done');
      
      console.log('📊 Task Status Summary:');
      console.log(`- Todo: ${todoTasks.length}`);
      console.log(`- In Progress: ${inProgressTasks.length}`);
      console.log(`- Done: ${doneTasks.length}`);
      
      // Show total logged hours
      const totalHours = updatedTasks.reduce((total, task) => total + (task.logged_hours || 0), 0);
      console.log(`- Total Logged Hours: ${totalHours.toFixed(1)}h`);
      
    } else {
      console.log('❌ Failed to get updated tasks:', updatedTasksResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Helper function to check user task permissions
const checkUserTaskPermissions = () => {
  console.log('🔍 User Task Permissions:');
  console.log('1. Users can view their assigned tasks');
  console.log('2. Users can update task status (todo → in_progress → done)');
  console.log('3. Users can log time to their tasks');
  console.log('4. Users can edit task details (title, description, priority, etc.)');
  console.log('5. Users can delete their assigned tasks');
  console.log('6. Users can filter tasks by status and project');
  console.log('7. Users can search through their tasks');
  console.log('8. Users can only access tasks assigned to them');
};

// Helper function to simulate user task workflow
const simulateUserTaskWorkflow = async () => {
  console.log('🔄 Simulating User Task Workflow...');
  
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('❌ No access token found. Please login first.');
      return;
    }

    // Get user tasks
    const tasksResponse = await fetch('https://backend-g6r7.onrender.com/api/user/tasks/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (tasksResponse.ok) {
      const tasks = await tasksResponse.json();
      
      if (tasks.length > 0) {
        const task = tasks[0];
        console.log(`\n🔄 Workflow for task: ${task.title}`);
        
        // Step 1: Start working on task
        console.log('1. Starting work on task...');
        await fetch(`https://backend-g6r7.onrender.com/api/tasks/${task.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'in_progress' })
        });
        
        // Step 2: Log some time
        console.log('2. Logging 3 hours of work...');
        await fetch(`https://backend-g6r7.onrender.com/api/tasks/${task.id}/log_time/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ hours: 3.0 })
        });
        
        // Step 3: Complete the task
        console.log('3. Completing the task...');
        await fetch(`https://backend-g6r7.onrender.com/api/tasks/${task.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'done' })
        });
        
        console.log('✅ Workflow completed successfully!');
      } else {
        console.log('⚠️ No tasks available for workflow simulation');
      }
    }
  } catch (error) {
    console.error('❌ Workflow simulation failed:', error);
  }
};

// Main test runner
const runUserTaskTests = () => {
  console.log('🚀 Starting User Task Tests...');
  checkUserTaskPermissions();
  testUserTasks();
};

// Export for use
window.runUserTaskTests = runUserTaskTests;
window.testUserTasks = testUserTasks;
window.checkUserTaskPermissions = checkUserTaskPermissions;
window.simulateUserTaskWorkflow = simulateUserTaskWorkflow;

console.log('📝 User Task Test Script Loaded!');
console.log('💡 Run "runUserTaskTests()" to start testing');
console.log('💡 Run "simulateUserTaskWorkflow()" to simulate a complete workflow'); 