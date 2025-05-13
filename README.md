# FocusFlow Kanban Board

A full-stack productivity-focused Kanban board application that combines task management with focus tools and spiritual guidance.

## Features

- 📋 **Kanban Board:** Drag-and-drop task management with customizable columns
- 🔐 **Authentication:** Secure user authentication system with login, registration, and password reset
- 🤖 **AI Integration:** Smart AI chatbox for task suggestions and assistance
- ⏲️ **Focus Timer:** Built-in timer for productivity management
- 📖 **Quran Player:** Integrated Quran player for spiritual guidance
- 📱 **Responsive Design:** Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui component library

### Backend
- Node.js API
- Supabase for database and authentication
- Rate limiting middleware for API protection

## Database Structure & Implementation

We're using **Supabase** as our database solution, which is built on top of PostgreSQL. Here's a simple breakdown of our database structure:

### Tables

1. **users**
   - User authentication and profile information
   - Managed by Supabase Auth

2. **tasks**
   - `id`: Unique identifier
   - `title`: Task title
   - `description`: Task details
   - `status`: Current column (e.g., "TODO", "IN_PROGRESS", "DONE")
   - `user_id`: Reference to users table
   - `created_at`: Timestamp
   - `updated_at`: Timestamp

3. **activity_logs**
   - Tracks all user actions
   - Used for the activity feed feature

### Key Implementation Details

1. **Authentication Flow:**
   - Built using Supabase Auth
   - Email/password authentication
   - Reset password functionality
   - Session management

2. **Real-time Updates:**
   - Using Supabase's real-time subscriptions
   - Live updates when tasks are moved or modified
   - Instant reflection of changes across all users

3. **Data Security:**
   - Row Level Security (RLS) policies
   - Users can only access their own data
   - API rate limiting to prevent abuse

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and configure your environment variables

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
├── api/                  # Backend API routes
│   ├── auth/            # Authentication endpoints
│   ├── tasks/           # Task management endpoints
│   └── ai/              # AI integration endpoints
├── src/
│   ├── components/      # React components
│   │   ├── ai/         # AI chat components
│   │   ├── auth/       # Authentication forms
│   │   ├── kanban/     # Kanban board components
│   │   ├── quran/      # Quran player components
│   │   └── ui/         # Reusable UI components
│   ├── services/       # API service integrations
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Application pages/routes
│   └── types/          # TypeScript type definitions
└── supabase/           # Supabase configuration
```

## Key Features

### Kanban Board
- Create, edit, and delete tasks
- Drag and drop tasks between columns
- Customizable columns and workflows
- Real-time updates across all users

### Authentication
- Secure user registration and login
- Password reset functionality
- Session management
- Protected routes and API endpoints

### AI Integration
- Smart task suggestions
- Natural language processing for task creation
- AI-powered productivity insights

### Focus Timer
- Customizable work/break intervals
- Session tracking
- Productivity statistics

### Quran Player
- Audio playback of Quranic recitations
- Surah selection and navigation
- Integrated with the task management system

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.
