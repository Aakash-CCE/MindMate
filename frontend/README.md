# MindMate Frontend

React 19 + TypeScript + Vite + Tailwind CSS frontend for the MindMate Emotional Wellness Application.

## Folder Structure
- `src/`: React source code
  - `components/`: UI components (Animal Companion, Avatars, Navigation Sidebar, etc.)
  - `context/`: React context providers (AuthContext, CompanionContext, ThemeContext)
  - `pages/`: Page views (DashboardPage, ChatPage, MoodPage, VoicePage, MusicPage, ProfilePage, AuthPage)
  - `services/`: API client services communicating with `/api` endpoints
  - `types/`: Global TypeScript interfaces and definitions
  - `utils/`: Utility functions and helpers
  - `App.tsx`: App root layout and route definitions
  - `main.tsx`: React DOM mount entry point
- `public/`: Static web assets and soundscapes
- `index.html`: Web application HTML shell
- `Dockerfile`: Production Docker build container
- `nginx.conf`: Nginx reverse proxy configuration
