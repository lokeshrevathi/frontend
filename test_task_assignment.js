// Test Script for Task Assignment with Project Members
// Run this in browser console to test the task assignment features

const testTaskAssignment = async () => {
  console.log('🧪 Testing Task Assignment with Project Members...');
  
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('❌ No access token found. Please login first.');
      return;
    }

    // Test 1: Get project members
    console.log('\n👥 Test 1: Getting project members...');
    const membersResponse = await fetch('https://backend-g6r7.onrender.com/api/projects/1/members/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (membersResponse.ok) {
      const members = await membersResponse.json();
      console.log('✅ Project members:', members);
    } else {
      console.log('❌ Failed to get project members:', membersResponse.status);
    }

    // Test 2: Get available users for project
    console.log('\n📋 Test 2: Getting available users...');
    const availableResponse = await fetch('https://backend-g6r7.onrender.com/api/projects/1/available-users/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (availableResponse.ok) {
      const availableUsers = await availableResponse.json();
      console.log('✅ Available users:', availableUsers);
    } else {
      console.log('❌ Failed to get available users:', availableResponse.status);
    }

    // Test 3: Get milestones for task creation
    console.log('\n🎯 Test 3: Getting milestones...');
    const milestonesResponse = await fetch('https://backend-g6r7.onrender.com/api/milestones/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (milestonesResponse.ok) {
      const milestones = await milestonesResponse.json();
      console.log('✅ Milestones:', milestones);
      
      if (milestones.length > 0) {
        const firstMilestone = milestones[0];
        
        // Test 4: Create task with project member assignment
        console.log('\n✅ Test 4: Creating task with member assignment...');
        const taskData = {
          title: 'Test Task with Member Assignment',
          description: 'This task is assigned to a project member',
          milestone: firstMilestone.id,
          priority: 'medium',
          status: 'todo'
        };
        
        // If we have project members, assign to the first one
        if (membersResponse.ok) {
          const members = await membersResponse.json();
          if (members.length > 0) {
            taskData.assignee = members[0].user.id;
            console.log('Assigning to member:', members[0].user);
          }
        }
        
        const createTaskResponse = await fetch('https://backend-g6r7.onrender.com/api/tasks/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(taskData)
        });
        
        if (createTaskResponse.ok) {
          const createdTask = await createTaskResponse.json();
          console.log('✅ Task created successfully:', createdTask);
        } else {
          const error = await createTaskResponse.json();
          console.log('❌ Failed to create task:', error);
        }
      } else {
        console.log('⚠️ No milestones found. Create a milestone first.');
      }
    } else {
      console.log('❌ Failed to get milestones:', milestonesResponse.status);
    }

    // Test 5: Get all tasks to see assignments
    console.log('\n📋 Test 5: Getting all tasks...');
    const tasksResponse = await fetch('https://backend-g6r7.onrender.com/api/tasks/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (tasksResponse.ok) {
      const tasks = await tasksResponse.json();
      console.log('✅ All tasks:', tasks);
      
      // Show tasks with assignments
      const assignedTasks = tasks.filter(task => task.assignee);
      if (assignedTasks.length > 0) {
        console.log('📋 Tasks with assignments:', assignedTasks);
      } else {
        console.log('⚠️ No tasks with assignments found');
      }
    } else {
      console.log('❌ Failed to get tasks:', tasksResponse.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Helper function to check task assignment constraints
const checkTaskAssignmentConstraints = () => {
  console.log('🔍 Task Assignment Constraints:');
  console.log('1. Tasks can be assigned to project members');
  console.log('2. Tasks can be assigned to available users (not yet in project)');
  console.log('3. Only users with appropriate permissions can assign tasks');
  console.log('4. Assignment is optional (can be unassigned)');
};

// Main test runner
const runTaskAssignmentTests = () => {
  console.log('🚀 Starting Task Assignment Tests...');
  checkTaskAssignmentConstraints();
  testTaskAssignment();
};

// Export for use
window.runTaskAssignmentTests = runTaskAssignmentTests;
window.testTaskAssignment = testTaskAssignment;
window.checkTaskAssignmentConstraints = checkTaskAssignmentConstraints;

console.log('📝 Task Assignment Test Script Loaded!');
console.log('💡 Run "runTaskAssignmentTests()" to start testing'); 