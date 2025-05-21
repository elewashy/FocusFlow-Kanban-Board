# FocusFlow Kanban Board

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4.1-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-2.49.4-3ECF8E?style=flat&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.11-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<div align="center">
  <img src="https://placehold.co/800x450/1a1a1a/FFFFFF?text=FocusFlow+Kanban+Board" alt="FocusFlow Kanban Board Screenshot" width="800" />
</div>

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technologies Used](#-technologies-used)
- [Database Structure](#-database-structure)
- [Detailed Project Features](#-detailed-project-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 📋 Overview

FocusFlow is a comprehensive Kanban board application that combines task management with focus tools and spiritual guidance. It helps users organize their tasks and increase productivity while providing unique features like a Quran player and AI assistant.

## ✨ Key Features

- 📋 **Kanban Board:** Drag-and-drop task management with customizable columns
- 🔐 **Authentication:** Secure user login, registration, and password reset
- 🤖 **AI Integration:** Smart assistant for task suggestions and help
- ⏲️ **Focus Timer:** Built-in timer for productivity management and time tracking
- 📖 **Quran Player:** Integrated Quran player for spiritual guidance
- 📱 **Responsive Design:** Works seamlessly on desktop and mobile devices

## 🛠️ Technologies Used

### Frontend
- **React with TypeScript:** For building the user interface
- **Vite:** For fast build tooling
- **Tailwind CSS:** For styling
- **shadcn/ui:** UI component library
- **Framer Motion:** For animations
- **React Router:** For page navigation
- **React Query:** For data state management

### Backend
- **Node.js API:** For backend services
- **Supabase:** For database and authentication
- **Express:** For creating the API
- **OpenRouter API:** For AI integration

## 🗄️ Database Structure

We use **Supabase** as our database solution, which is built on PostgreSQL. Here's a simple breakdown of our database structure:

### Tables

1. **users**
   - User authentication and profile information
   - Managed by Supabase Auth

2. **tasks**
   - `id`: Unique identifier
   - `title`: Task title
   - `description`: Task details
   - `status`: Current column (e.g., "TODO", "DOING", "DONE")
   - `user_id`: Reference to users table
   - `created_at`: Creation timestamp
   - `updated_at`: Update timestamp
   - `priority`: Task priority
   - `time_spent`: Time spent on the task

3. **activity_logs**
   - Tracks all user actions
   - Used for the activity feed feature

## 🚀 Detailed Project Features

### Kanban Board
- Create, edit, and delete tasks
- Drag and drop tasks between columns
- Customizable columns and flexible workflow
- Real-time updates across all users
- Restrictions on the "In Progress" column to focus on only one task

### Authentication
- Secure user registration and login
- Password reset functionality
- Session management
- Protected routes and API endpoints

### AI Integration
- Smart task suggestions
- Natural language processing for task creation
- AI-powered productivity insights
- Personal project management assistant

### Focus Timer
- Customizable work/break intervals
- Session tracking
- Productivity statistics
- Integration with task management system

### Quran Player
- Audio playback of Quranic recitations
- Surah selection and navigation
- Variety of reciters
- Integration with task management system

## 📁 Project Structure

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

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/elewashy/FocusFlow-Kanban-Board.git
cd FocusFlow-Kanban-Board
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env.local` and configure your environment variables:
```bash
cp .env.example .env.local
```

4. Configure environment variables:
```
# Supabase credentials
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-SERVICE-key

# OpenRouter API key
OPENROUTER_API_KEY=your-openrouter-api-key

# Server port
PORT=3001
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser at `http://localhost:8080`

## 🔧 Deployment

The project can be deployed on Vercel or any other hosting platform that supports React and Node.js applications.

### Deploying on Vercel

1. Create an account on [Vercel](https://vercel.com)
2. Link your GitHub repository
3. Configure environment variables in the Vercel dashboard
4. Deploy the application

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
