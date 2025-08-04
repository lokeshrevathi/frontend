# Admin User Creation Guide

## Overview
This guide provides multiple methods to create admin users via the UI for testing the RBAC implementation.

## 🔐 Admin Secret
**Secret:** `admin123`

## Methods to Create Admin Users

### Method 1: Enhanced Registration Page (Recommended)

#### For Admin Users:
1. **Navigate to:** `http://localhost:3000/register`
2. **Fill the form normally:**
   - Username: `admin@example.com`
   - Email: `admin@example.com`
   - First Name: `Admin`
   - Last Name: `User`
   - Password: `admin123`
   - Confirm Password: `admin123`
3. **Click:** "Create Account" (public registration allows admin role)

#### For Manager/User Accounts:
1. **Navigate to:** `http://localhost:3000/register`
2. **Click:** "Create Admin User" button
3. **Enter secret:** `admin123`
4. **Fill the form:**
   - Username: `manager@example.com`
   - Email: `manager@example.com`
   - First Name: `Manager`
   - Last Name: `User`
   - Password: `manager123`
   - Confirm Password: `manager123`
   - Role: Select "Manager" or "User" from dropdown
5. **Click:** "Create Admin User"

### Method 2: Dedicated Admin Creation Page

1. **Navigate to:** `http://localhost:3000/admin-create`
2. **Enter secret:** `admin123`
3. **Fill the form** with user details
4. **Role:** Admin only (pre-selected and disabled)
5. **Click:** "Create Admin User"

### Method 3: Browser Console Script

1. **Open browser console** (F12)
2. **Copy and paste** the contents of `create_admin_user.js`
3. **Run:** `createAdminUser()`
4. **Follow the prompts**

### Method 4: Manual Registration + Backend Update

1. **Register regular user** via `/register`
2. **Manually update role** in backend database
3. **Login with updated user**

## Test User Credentials

### Admin User
- **Username:** `admin@example.com`
- **Password:** `admin123`
- **Role:** `admin`

### Manager User
- **Username:** `manager@example.com`
- **Password:** `manager123`
- **Role:** `manager`

### Regular User
- **Username:** `user@example.com`
- **Password:** `user123`
- **Role:** `user`

## Features

### Enhanced Registration Page (`/register`)
- ✅ Public registration for admin users (no authentication required)
- ✅ Admin mode for creating manager/user accounts (requires secret)
- ✅ Role selection dropdown in admin mode
- ✅ Visual indicators for admin mode
- ✅ Clear information about registration restrictions

### Dedicated Admin Page (`/admin-create`)
- ✅ Secure authentication with secret
- ✅ Admin role only (pre-selected and disabled)
- ✅ Clean, focused interface
- ✅ Role permission explanations
- ✅ Uses public registration endpoint

### Security Features
- ✅ Admin secret protection
- ✅ Visual warnings for admin creation
- ✅ Role-based form validation
- ✅ Secure API endpoints

## Testing Workflow

1. **Create Admin User** using any method above
2. **Login as Admin** with created credentials
3. **Verify Admin Access:**
   - Should see "Role: admin" in sidebar
   - Should see "User Management" link
   - Should see "Create Project" link
4. **Test Admin Functions:**
   - Create other users with different roles
   - Access all project management features
   - Assign users to tasks

## Troubleshooting

### Common Issues:
1. **"Invalid admin secret"** - Make sure you're using `admin123`
2. **"Registration failed"** - Check if backend is accessible
3. **"User already exists"** - Try different username/email
4. **"403 Forbidden"** - Backend may not support admin creation

### Debug Steps:
1. **Check browser console** for errors
2. **Verify backend connectivity**
3. **Check network tab** for API responses
4. **Try different user credentials**

## API Endpoints Used

- **Public Registration:** `POST /api/register/` (admin role only)
- **Admin User Creation:** `POST /api/users/create/` (all roles, admin only)
- **User Login:** `POST /api/login/`
- **User Profile:** `GET /api/me/`

## Notes

- The admin secret (`admin123`) is for demo purposes only
- In production, use a more secure secret
- Admin creation bypasses regular registration restrictions
- Created users can immediately login and access their role permissions 