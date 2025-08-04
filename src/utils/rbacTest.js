// RBAC Test Utility
// This file contains test data and helper functions for testing RBAC implementation

export const TEST_USERS = {
  admin: {
    username: 'admin_user',
    password: 'adminpass123',
    role: 'admin',
    expectedPermissions: {
      canCreateUsers: true,
      canCreateProjects: true,
      canCreateMilestones: true,
      canCreateTasks: true,
      canAssignUsers: true,
      canAccessAllData: true,
      canManageUsers: true,
    }
  },
  manager: {
    username: 'manager_user',
    password: 'managerpass123',
    role: 'manager',
    expectedPermissions: {
      canCreateUsers: false,
      canCreateProjects: true,
      canCreateMilestones: true,
      canCreateTasks: true,
      canAssignUsers: true,
      canAccessAllData: true,
      canManageUsers: false,
    }
  },
  user: {
    username: 'regular_user',
    password: 'userpass123',
    role: 'user',
    expectedPermissions: {
      canCreateUsers: false,
      canCreateProjects: true,
      canCreateMilestones: true,
      canCreateTasks: true,
      canAssignUsers: false,
      canAccessAllData: false,
      canManageUsers: false,
    }
  }
};

export const RBAC_TEST_CASES = [
  {
    name: 'Admin User Tests',
    role: 'admin',
    tests: [
      {
        description: 'Can access User Management page',
        route: '/users',
        shouldAccess: true
      },
      {
        description: 'Can see Create Project button',
        element: 'create-project-btn',
        shouldShow: true
      },
      {
        description: 'Can see User Management in navigation',
        element: 'user-management-nav',
        shouldShow: true
      },
      {
        description: 'Can assign users to tasks',
        permission: 'canAssignUsers',
        shouldHave: true
      }
    ]
  },
  {
    name: 'Manager User Tests',
    role: 'manager',
    tests: [
      {
        description: 'Cannot access User Management page',
        route: '/users',
        shouldAccess: false
      },
      {
        description: 'Can see Create Project button',
        element: 'create-project-btn',
        shouldShow: true
      },
      {
        description: 'Cannot see User Management in navigation',
        element: 'user-management-nav',
        shouldShow: false
      },
      {
        description: 'Can assign users to tasks',
        permission: 'canAssignUsers',
        shouldHave: true
      }
    ]
  },
  {
    name: 'Regular User Tests',
    role: 'user',
    tests: [
      {
        description: 'Cannot access User Management page',
        route: '/users',
        shouldAccess: false
      },
      {
        description: 'Can see Create Project button',
        element: 'create-project-btn',
        shouldShow: true
      },
      {
        description: 'Cannot see User Management in navigation',
        element: 'user-management-nav',
        shouldShow: false
      },
      {
        description: 'Cannot assign users to tasks',
        permission: 'canAssignUsers',
        shouldHave: false
      }
    ]
  }
];

export const PERMISSION_MATRIX = {
  admin: {
    canCreateUsers: true,
    canCreateProjects: true,
    canCreateMilestones: true,
    canCreateTasks: true,
    canAssignUsers: true,
    canAccessAllData: true,
    canManageUsers: true,
  },
  manager: {
    canCreateUsers: false,
    canCreateProjects: true,
    canCreateMilestones: true,
    canCreateTasks: true,
    canAssignUsers: true,
    canAccessAllData: true,
    canManageUsers: false,
  },
  user: {
    canCreateUsers: false,
    canCreateProjects: true,
    canCreateMilestones: true,
    canCreateTasks: true,
    canAssignUsers: false,
    canAccessAllData: false,
    canManageUsers: false,
  },
};

// Helper function to validate permissions
export const validatePermissions = (userRole, permissions) => {
  const expectedPermissions = PERMISSION_MATRIX[userRole];
  const validationResults = {};

  Object.keys(expectedPermissions).forEach(permission => {
    validationResults[permission] = {
      expected: expectedPermissions[permission],
      actual: permissions[permission],
      valid: expectedPermissions[permission] === permissions[permission]
    };
  });

  return validationResults;
};

// Helper function to check if all permissions are valid
export const arePermissionsValid = (validationResults) => {
  return Object.values(validationResults).every(result => result.valid);
};

// Test scenarios for manual testing
export const MANUAL_TEST_SCENARIOS = [
  {
    scenario: 'Admin Login and Navigation',
    steps: [
      '1. Navigate to /login',
      '2. Login with admin credentials',
      '3. Verify role is displayed in sidebar',
      '4. Check that User Management link is visible',
      '5. Verify Create Project link is visible',
      '6. Access User Management page',
      '7. Create a new user with manager role'
    ],
    expectedOutcome: 'All admin features should be accessible'
  },
  {
    scenario: 'Manager Login and Limitations',
    steps: [
      '1. Login with manager credentials',
      '2. Verify User Management link is NOT visible',
      '3. Verify Create Project link is visible',
      '4. Try to access /users directly',
      '5. Verify access denied message appears',
      '6. Create a new project',
      '7. Verify can assign users to tasks'
    ],
    expectedOutcome: 'Manager should have project management access but no user management'
  },
  {
    scenario: 'Regular User Access',
    steps: [
      '1. Login with regular user credentials',
      '2. Verify User Management link is NOT visible',
      '3. Verify Create Project link is visible',
      '4. Try to access /users directly',
      '5. Verify access denied message appears',
      '6. Create a new project',
      '7. Verify cannot assign users to tasks'
    ],
    expectedOutcome: 'Regular user should have limited access to project creation only'
  },
  {
    scenario: 'Permission Denied Handling',
    steps: [
      '1. Login as regular user',
      '2. Try to access admin-only features',
      '3. Verify friendly error messages appear',
      '4. Check that UI elements are properly hidden',
      '5. Verify toast notifications for permission errors'
    ],
    expectedOutcome: 'Graceful error handling for unauthorized access'
  }
];

export default {
  TEST_USERS,
  RBAC_TEST_CASES,
  PERMISSION_MATRIX,
  validatePermissions,
  arePermissionsValid,
  MANUAL_TEST_SCENARIOS
}; 