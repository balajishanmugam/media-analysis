// Local store: Updated imports - removed old compliance checkers, added MediaChecker
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MediaChecker from './views/MediaChecker';
import AgentDiscovery from './views/AgentDiscovery';
import FAQ from './views/FAQ';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 min-h-[calc(100vh-73px)]">
              {/* Local store: Updated routes - single MediaChecker route */}
              <Routes>
                <Route path="/" element={<Navigate to="/media-checker" replace />} />
                <Route path="/media-checker" element={<MediaChecker />} />
                <Route path="/agent-discovery" element={<AgentDiscovery />} />
                <Route path="/faq" element={<FAQ />} />
                {/* Local store: Legacy routes redirected to new MediaChecker */}
                <Route path="/video-checker" element={<Navigate to="/media-checker" replace />} />
                <Route path="/policy-checker" element={<Navigate to="/media-checker" replace />} />
                <Route path="/news-checker" element={<Navigate to="/media-checker" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
