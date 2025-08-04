# Project Management Dashboard

A modern, full-stack project management application built with React frontend and Django REST API backend. This application provides comprehensive project tracking, task management, team collaboration, and time tracking capabilities.

## Features

### 🎯 Core Features
- **Project Management**: Create, view, and manage projects with timelines
- **Task Management**: Assign tasks to team members with priorities and status tracking
- **Milestone Tracking**: Break down projects into manageable milestones
- **Time Tracking**: Log hours spent on tasks and projects
- **Team Collaboration**: Comments and file attachments for better communication
- **Progress Visualization**: Charts and progress indicators for project overview

### 🔐 Authentication & User Management
- JWT-based authentication
- User registration and login
- Profile management
- Secure token refresh

### 📊 Dashboard & Analytics
- Project overview with statistics
- Progress charts using Recharts
- Task status distribution
- Time tracking analytics

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean, dashboard-like interface
- Mobile-friendly layout
- Toast notifications for user feedback

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Recharts** - Chart library for data visualization
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend (API)
- **Django REST Framework** - REST API framework
- **PostgreSQL** - Database
- **JWT Authentication** - Token-based auth

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Django backend running (see API documentation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

### Backend Setup
Make sure your Django backend is running on `http://localhost:8000` with all the required endpoints as documented in `API_DOCUMENTATION.md`.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout with sidebar
│   ├── MilestoneCreateForm.js
│   ├── TaskCreateForm.js
│   ├── TimeLogForm.js
│   ├── CommentSection.js
│   └── AttachmentUploader.js
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── Dashboard.js
│   ├── ProjectListPage.js
│   ├── ProjectCreatePage.js
│   ├── ProjectDetailPage.js
│   └── ProfilePage.js
├── services/           # API services
│   └── api.js         # Axios configuration and API calls
├── App.js             # Main app component with routing
└── index.js           # Application entry point
```

## API Integration

The frontend integrates with the Django REST API using the following endpoints:

### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `GET /api/me/` - Get user profile

### Projects
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create new project
- `GET /api/projects/{id}/` - Get project details
- `GET /api/projects/{id}/progress/` - Get project progress
- `GET /api/projects/{id}/total_hours/` - Get total hours

### Milestones
- `GET /api/milestones/` - List milestones
- `POST /api/milestones/` - Create milestone

### Tasks
- `GET /api/tasks/` - List tasks
- `POST /api/tasks/` - Create task
- `POST /api/tasks/{id}/log_time/` - Log time

### Comments & Attachments
- `GET /api/comments/` - List comments
- `POST /api/comments/` - Create comment
- `GET /api/attachments/` - List attachments
- `POST /api/attachments/` - Upload file

## Key Features Explained

### 1. Authentication Flow
- JWT tokens stored in localStorage
- Automatic token refresh on 401 errors
- Protected routes with authentication checks

### 2. Project Management
- Create projects with start/end dates
- View project progress and statistics
- Manage project details and timeline

### 3. Task Management
- Create tasks with priorities and assignments
- Track task status (todo, in_progress, done)
- Log time spent on tasks
- Filter and search tasks

### 4. Team Collaboration
- Add comments to projects and tasks
- Upload and manage file attachments
- Real-time notifications for actions

### 5. Dashboard Analytics
- Project progress visualization
- Task status distribution charts
- Time tracking analytics
- Recent activity overview

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by:
- Modifying `tailwind.config.js` for theme changes
- Updating `src/index.css` for custom styles
- Using the predefined component classes (`.btn-primary`, `.card`, etc.)

### API Configuration
Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
REACT_APP_API_URL=https://your-api-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the API documentation or create an issue in the repository. 