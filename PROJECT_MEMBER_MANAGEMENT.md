# Project Member Management Feature

## Overview
The Project Member Management feature allows admins and managers to add and remove users from projects, with built-in constraints to ensure proper project organization and user workload management.

## Features Implemented

### ✅ **API Integration**
- **Get Project Members**: `GET /api/projects/{project_id}/members/`
- **Add User to Project**: `POST /api/projects/{project_id}/members/`
- **Remove User from Project**: `DELETE /api/projects/{project_id}/members/{user_id}/`
- **Get Available Users**: `GET /api/projects/{project_id}/available-users/`

### ✅ **UI Components**
- **ProjectMemberManagement Component**: Complete member management interface
- **Members Tab**: New tab in ProjectDetailPage for member management
- **Member Count Display**: Shows member count in project stats
- **Role-Based Access Control**: Only admins/managers can manage members

### ✅ **Constraints Implemented**
1. **User Role Only**: Only users with 'user' role can be added to projects
2. **Maximum 2 Projects**: Users can be assigned to maximum 2 projects only
3. **Project Owner Exclusion**: Project owner cannot be added as a member
4. **Duplicate Prevention**: Users already in the project cannot be added again

## How to Use

### For Admins and Managers:

1. **Navigate to a Project**
   - Go to `/projects` and click on any project
   - Or directly navigate to `/projects/{id}`

2. **Access Member Management**
   - Click on the "Members" tab in the project detail page
   - You'll see the member management interface

3. **Add Members**
   - Select a user from the dropdown (only available users are shown)
   - Click "Add Member" button
   - User will be added to the project

4. **Remove Members**
   - Click the remove icon (UserMinus) next to any member
   - Member will be removed from the project

### For Regular Users:
- Can view project members but cannot add/remove them
- See appropriate message about permissions

## API Endpoints

### Get Project Members
```bash
GET /api/projects/{project_id}/members/
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "user": {
      "id": 2,
      "username": "john_doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user"
    },
    "project": 1,
    "joined_at": "2024-01-15T10:30:00Z"
  }
]
```

### Add User to Project
```bash
POST /api/projects/{project_id}/members/
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": 2
}
```

### Remove User from Project
```bash
DELETE /api/projects/{project_id}/members/{user_id}/
Authorization: Bearer <token>
```

### Get Available Users
```bash
GET /api/projects/{project_id}/available-users/
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 3,
    "username": "jane_smith",
    "email": "jane@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "role": "user"
  }
]
```

## Constraints and Business Rules

### 1. User Role Restriction
- **Only 'user' role**: Only users with 'user' role can be added to projects
- **Admin/Manager exclusion**: Admins and managers cannot be project members
- **Purpose**: Ensures proper role hierarchy and project management

### 2. Project Limit
- **Maximum 2 projects**: Users can be assigned to maximum 2 projects
- **Automatic filtering**: Available users endpoint excludes users at limit
- **Purpose**: Prevents user overload and ensures quality work

### 3. Project Owner Protection
- **Owner exclusion**: Project owner cannot be added as a member
- **Automatic filtering**: Available users endpoint excludes project owner
- **Purpose**: Maintains clear project ownership

### 4. Duplicate Prevention
- **Already members**: Users already in project cannot be added again
- **Automatic filtering**: Available users endpoint excludes current members
- **Purpose**: Prevents duplicate assignments

## Error Handling

### Common Error Scenarios:
1. **User not found**: 404 when trying to add non-existent user
2. **User at limit**: 400 when user already has 2 projects
3. **User already member**: 400 when user is already in project
4. **Insufficient permissions**: 403 when non-admin/manager tries to manage members
5. **Invalid user role**: 400 when trying to add admin/manager as member

### User-Friendly Messages:
- Clear error messages displayed via toast notifications
- Helpful information about constraints
- Visual indicators for loading states

## Testing

### Manual Testing:
1. **Login as admin/manager**
2. **Navigate to project detail page**
3. **Click "Members" tab**
4. **Test adding/removing members**
5. **Verify constraints work correctly**

### Automated Testing:
```javascript
// Run in browser console
runMemberManagementTests();
```

### Test Scenarios:
1. ✅ Add user to project
2. ✅ Remove user from project
3. ✅ Try to add user at 2-project limit
4. ✅ Try to add admin/manager as member
5. ✅ Try to add user already in project
6. ✅ Verify only 'user' role users are available

## Files Modified/Created

### New Files:
- `src/components/ProjectMemberManagement.js` - Main component
- `test_member_management.js` - Test script
- `PROJECT_MEMBER_MANAGEMENT.md` - This documentation

### Modified Files:
- `src/services/api.js` - Added member management endpoints
- `src/pages/ProjectDetailPage.js` - Added Members tab and member count

## Future Enhancements

### Potential Improvements:
1. **Bulk Operations**: Add/remove multiple users at once
2. **Member Roles**: Different roles within projects (lead, developer, etc.)
3. **Member Permissions**: Granular permissions within projects
4. **Activity Log**: Track member addition/removal history
5. **Notifications**: Notify users when added/removed from projects
6. **Member Search**: Search functionality for large user lists
7. **Member Statistics**: Show member workload and project distribution

## Security Considerations

### Implemented Security:
- **JWT Authentication**: All endpoints require valid tokens
- **Role-Based Access**: Only admins/managers can manage members
- **Input Validation**: Server-side validation of all inputs
- **Constraint Enforcement**: Business rules enforced at API level

### Best Practices:
- **Principle of Least Privilege**: Users only see what they need
- **Audit Trail**: Member changes are logged
- **Data Validation**: All inputs validated before processing
- **Error Handling**: Secure error messages without data leakage 