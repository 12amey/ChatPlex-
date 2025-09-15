import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlatformProvider } from './contexts/PlatformContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';
import SDKPage from './pages/SDKPage';
import DemoPage from './pages/DemoPage';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <RealtimeProvider>
        <PlatformProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-100 dark:from-slate-900 dark:via-emerald-950 dark:to-cyan-950 transition-all duration-500">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat/:agentId" element={<ChatPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/sdk" element={<SDKPage />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
            </div>
          </BrowserRouter>
        </PlatformProvider>
      </RealtimeProvider>
    </ThemeProvider>
  );
}

export default App;