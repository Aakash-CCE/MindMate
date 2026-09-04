import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompanionProvider } from './context/CompanionContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicOnlyRoute } from './components/PublicOnlyRoute';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MoodPage } from './pages/MoodPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { MusicPage } from './pages/MusicPage';
import { VoicePage } from './pages/VoicePage';

function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fbfbf9] text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 transition-colors duration-300">
      {/* Left Navigation Sidebar: Only shown when logged in ("whe login that time onl show") */}
      {user && <Sidebar />}

      {/* Main Content Area: Fills space to the right of the Left Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 pb-16 md:pb-0 overflow-y-auto">
          <Routes>
            {/* First Page: Register & Login (Public Only - No Sidebar, No Top Bar) */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/" element={<AuthPage initialTab="register" />} />
              <Route path="/register" element={<AuthPage initialTab="register" />} />
              <Route path="/login" element={<AuthPage initialTab="login" />} />
              <Route path="/landing" element={<LandingPage />} />
            </Route>

            {/* Protected Application Routes (With Left Sidebar) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/voice" element={<VoicePage />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/mood" element={<MoodPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:sessionId" element={<ChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompanionProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </CompanionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

