# RBAC Testing Guide

## Overview
This guide provides step-by-step instructions to test the Role-Based Access Control (RBAC) implementation in the Project Management Dashboard.

## Prerequisites
- React application is running (`npm start`)
- Backend API is accessible at `https://backend-g6r7.onrender.com/`
- Browser developer tools open for network monitoring

## Test Users Setup

**⚠️ Important:** The test users need to be created first. Follow the setup instructions below.

### Step 1: Create Test Users

#### Option A: Use the Enhanced Registration Page (Recommended)
1. **Go to registration page** (`/register`)
2. **For Admin User:**
   - Fill the form normally (public registration allows admin role)
   - Click "Create Account"
3. **For Manager/User:**
   - Click "Create Admin User" button
   - Enter admin secret: `admin123`
   - Select role (manager/user)
   - Click "Create Admin User"

#### Option B: Use the Dedicated Admin Creation Page
1. **Navigate to** `/admin-create`
2. **Enter admin secret:** `admin123`
3. **Fill the form** and select role (admin/manager/user)
4. **Click "Create Admin User"**

#### Option C: Use the Test User Workaround Script
1. **Open browser console** (F12) in your React app
2. **Copy and paste** the contents of `test_user_workaround.js` into the console
3. **Run the script:**
   ```javascript
   createTestUsers()
   ```
4. **Login with test users** for RBAC testing

#### Option D: Manual Registration
1. **Register regular users** via the frontend registration page
2. **Use these credentials** for each role:

### Admin User
- **Username**: `admin@example.com`
- **Password**: `admin123`
- **Role**: `admin` (needs manual backend update)

### Manager User
- **Username**: `manager@example.com`
- **Password**: `manager123`
- **Role**: `manager` (needs manual backend update)

### Regular User
- **Username**: `user@example.com`
- **Password**: `user123`
- **Role**: `user` (default)

### Step 2: Update User Roles (if needed)
If users are created with 'user' role, you need to manually update their roles in the backend database to test admin/manager functionality.

---

## Test Case 1: Login as Admin

### Steps:
1. **Open the application** in your browser
2. **Navigate to login page** (if not already there)
3. **Enter admin credentials**:
   - Username: `admin@example.com`
   - Password: `admin123`
4. **Click "Login"**

### Expected Results:
- ✅ Login successful
- ✅ Redirected to dashboard
- ✅ Sidebar shows "Role: admin"
- ✅ Navigation includes:
  - ✅ "Create Project" link
  - ✅ "User Management" link
  - ✅ All other navigation items

### Verification Points:
- Check browser console for successful API calls
- Verify user role is displayed in sidebar
- Confirm all navigation links are visible

---

## Test Case 2: Admin - User Management Access

### Steps:
1. **Login as admin** (from Test Case 1)
2. **Click "User Management"** in sidebar
3. **Verify page loads** without errors

### Expected Results:
- ✅ User Management page loads successfully
- ✅ "Create User" button is visible
- ✅ User list is displayed (if any users exist)

### Test User Creation:
1. **Click "Create User"** button
2. **Fill the form**:
   - Username: `testuser@example.com`
   - Password: `test123`
   - Role: Select "user" from dropdown
3. **Click "Create User"**

### Expected Results:
- ✅ User creation successful
- ✅ Success message displayed
- ✅ New user appears in user list
- ✅ Form resets for next entry

---

## Test Case 3: Admin - Project Management

### Steps:
1. **Login as admin** (from Test Case 1)
2. **Click "Projects"** in sidebar
3. **Click "Create Project"** button

### Expected Results:
- ✅ Project creation form loads
- ✅ All form fields are accessible
- ✅ Can create projects successfully

### Test Project Creation:
1. **Fill project details**:
   - Title: "Admin Test Project"
   - Description: "Testing admin project creation"
   - Due Date: Select future date
2. **Click "Create Project"**

### Expected Results:
- ✅ Project created successfully
- ✅ Redirected to project detail page
- ✅ Can add milestones and tasks
- ✅ Can assign users to tasks

---

## Test Case 4: Login as Manager

### Steps:
1. **Logout** from admin account
2. **Login with manager credentials**:
   - Username: `manager@example.com`
   - Password: `manager123`

### Expected Results:
- ✅ Login successful
- ✅ Sidebar shows "Role: manager"
- ✅ Navigation includes:
  - ✅ "Create Project" link
  - ❌ "User Management" link (should NOT be visible)

### Verification Points:
- Confirm "User Management" is NOT in sidebar
- Verify role display shows "manager"

---

## Test Case 5: Manager - Project Management (Allowed)

### Steps:
1. **Login as manager** (from Test Case 4)
2. **Click "Projects"** in sidebar
3. **Click "Create Project"** button

### Expected Results:
- ✅ Project creation form loads
- ✅ Can create projects successfully
- ✅ Can add milestones and tasks
- ✅ Can assign users to tasks

### Test Project Creation:
1. **Create a new project**:
   - Title: "Manager Test Project"
   - Description: "Testing manager project creation"
2. **Add milestones and tasks**
3. **Assign users to tasks**

### Expected Results:
- ✅ All project management features work
- ✅ Can assign users to tasks (manager permission)

---

## Test Case 6: Manager - User Management (Restricted)

### Steps:
1. **Login as manager** (from Test Case 4)
2. **Try to access user management**:
   - Option A: Type `/users` in URL bar
   - Option B: Check if "User Management" link exists in sidebar

### Expected Results:
- ❌ "User Management" link should NOT be visible in sidebar
- ❌ Direct URL access should redirect to dashboard or show error
- ✅ No user creation functionality available

---

## Test Case 7: Login as Regular User

### Steps:
1. **Logout** from manager account
2. **Login with user credentials**:
   - Username: `user@example.com`
   - Password: `user123`

### Expected Results:
- ✅ Login successful
- ✅ Sidebar shows "Role: user"
- ✅ Navigation includes:
  - ❌ "Create Project" link (should NOT be visible)
  - ❌ "User Management" link (should NOT be visible)
  - ✅ "Projects" link (for viewing assigned projects)

### Verification Points:
- Confirm restricted navigation items are NOT visible
- Verify role display shows "user"

---

## Test Case 8: User - Limited Access Verification

### Steps:
1. **Login as user** (from Test Case 7)
2. **Click "Projects"** in sidebar

### Expected Results:
- ✅ Can view projects they're assigned to
- ✅ Can view project details
- ✅ Can log time on their tasks
- ✅ Can add comments to their tasks
- ❌ Cannot create new projects
- ❌ Cannot assign users to tasks

### Test Task Interactions:
1. **Open a project detail page**
2. **Try to add a milestone** - should NOT see "Add Milestone" button
3. **Try to add a task** - should NOT see "Add Task" button
4. **Try to log time** - should be able to log time on assigned tasks
5. **Try to add comments** - should be able to add comments

### Expected Results:
- ✅ Time logging works for assigned tasks
- ✅ Comment functionality works
- ❌ Creation buttons are NOT visible
- ❌ Assignment functionality is NOT available

---

## Test Case 9: Error Handling - Unauthorized Access

### Steps:
1. **Login as regular user** (from Test Case 7)
2. **Try to access restricted routes**:
   - Type `/users` in URL bar
   - Try to access admin-only features

### Expected Results:
- ❌ Should be redirected to dashboard or show error
- ✅ Should NOT be able to access user management
- ✅ Should see appropriate error messages

### Test API Restrictions:
1. **Open browser developer tools** (F12)
2. **Go to Network tab**
3. **Try to perform restricted actions** (e.g., create user as regular user)
4. **Check for 403 Forbidden responses**

### Expected Results:
- ✅ API calls return 403 status for unauthorized actions
- ✅ Frontend shows appropriate error messages
- ✅ No sensitive data is exposed

---

## Test Case 10: Cross-Role Testing

### Steps:
1. **Login as admin** and create a project with tasks
2. **Assign tasks to different users**
3. **Logout and login as manager**
4. **Verify manager can see and manage the project**
5. **Logout and login as regular user**
6. **Verify user can only see assigned tasks**

### Expected Results:
- ✅ Admin can create and assign everything
- ✅ Manager can manage projects but not users
- ✅ User can only see assigned tasks
- ✅ Role-based restrictions work correctly

---

## Test Case 11: Form Field Restrictions

### Steps:
1. **Login as different roles** and try to create tasks
2. **Check assignee field visibility**:
   - Admin: Should see assignee field
   - Manager: Should see assignee field
   - User: Should NOT see assignee field

### Expected Results:
- ✅ Form fields are conditionally rendered based on role
- ✅ Users without assignment permissions cannot assign tasks
- ✅ UI adapts correctly to user permissions

---

## Test Case 12: Navigation Guard Testing

### Steps:
1. **Login as user**
2. **Try to access admin routes** via URL manipulation
3. **Check if guards prevent access**

### Expected Results:
- ❌ Direct URL access to restricted routes should be blocked
- ✅ Should be redirected to appropriate page
- ✅ No unauthorized access possible

---

## Troubleshooting

### Common Issues:
1. **Login fails**: Check if backend is accessible
2. **Role not displayed**: Check AuthContext implementation
3. **Navigation items missing**: Verify permission checks
4. **API errors**: Check network tab for failed requests

### Debug Steps:
1. **Open browser console** (F12)
2. **Check for JavaScript errors**
3. **Monitor network requests**
4. **Verify user role in AuthContext**
5. **Check permission calculations**

---

## Success Criteria

The RBAC implementation is working correctly if:

✅ **Admin users can**:
- Access user management
- Create users with different roles
- Manage all projects and tasks
- Assign users to tasks

✅ **Manager users can**:
- Create and manage projects
- Create milestones and tasks
- Assign users to tasks
- Cannot access user management

✅ **Regular users can**:
- View only their assigned tasks
- Log time on their tasks
- Add comments to their tasks
- Cannot create projects or assign users

✅ **Security measures**:
- Unauthorized routes are blocked
- API calls return appropriate error codes
- UI elements are properly hidden/disabled
- No sensitive data is exposed

---

## Manual Test Checklist

- [ ] Admin login works
- [ ] Manager login works
- [ ] User login works
- [ ] Role display in sidebar
- [ ] Navigation items show/hide correctly
- [ ] User management accessible to admin only
- [ ] Project creation accessible to admin/manager
- [ ] Task assignment restricted appropriately
- [ ] Form fields conditionally rendered
- [ ] Unauthorized access blocked
- [ ] Error messages displayed correctly
- [ ] API permissions enforced
- [ ] Cross-role functionality works
- [ ] Logout functionality works

---

## Notes

- Keep browser developer tools open during testing
- Monitor network requests for API calls
- Check console for any JavaScript errors
- Test with different browsers if possible
- Verify all edge cases are handled 