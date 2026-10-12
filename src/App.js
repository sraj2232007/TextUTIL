import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import Navbar from './Components/Navbar';
import TextForm from './Components/TextForm';
import AIWritingStudio from './Components/AIWritingStudio';
import DeveloperTools from './Components/DeveloperTools';
import TextIntelligenceLab from './Components/TextIntelligenceLab';
import ToolsLibrary from './Components/ToolsLibrary';
import About from './Components/About';
import Toast from './Components/Toast';
import CommandPalette from './Components/CommandPalette';
import KeyboardShortcutsModal from './Components/KeyboardShortcutsModal';
import PrivacyModal from './Components/PrivacyModal';
import './App.css';

function MainApp() {
  const navigate = useNavigate();

  // Theme State: default to light mode
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem('textutil_theme');
      return saved ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    try {
      localStorage.setItem('textutil_theme', mode);
    } catch {}
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const showAlert = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const handleDismissToast = id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K, Escape)
  useEffect(() => {
    const handleGlobalKeyDown = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsModalOpen(false);
        setIsPrivacyModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Command palette registry
  const commands = [
    { id: 'home', title: 'Open Workspace Editor', category: 'Navigation', shortcut: 'Home', action: () => navigate('/') },
    { id: 'ai', title: 'Open Writing Assistant', category: 'Writing', shortcut: 'Write', action: () => navigate('/ai-studio') },
    { id: 'intel', title: 'Open Intelligence Lab', category: 'Analysis', shortcut: 'Lab', action: () => navigate('/intelligence') },
    { id: 'dev', title: 'Open Developer Tools', category: 'Developer', shortcut: 'Dev', action: () => navigate('/developer') },
    { id: 'tools', title: 'Browse All Tools Directory', category: 'Navigation', shortcut: 'All', action: () => navigate('/tools') },
    { id: 'about', title: 'About TextUtil', category: 'Navigation', action: () => navigate('/about') },
    { id: 'theme', title: `Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`, category: 'Appearance', action: toggleMode },
    { id: 'shortcuts', title: 'View Keyboard Shortcuts', category: 'Help', action: () => setIsShortcutsModalOpen(true) },
    { id: 'privacy', title: 'View Privacy Architecture & Policy', category: 'Security', action: () => setIsPrivacyModalOpen(true) },
  ];

  return (
    <div className="app-container">
      <Navbar
        mode={mode}
        toggleMode={toggleMode}
        openCommandPalette={() => setIsCommandPaletteOpen(true)}
        openShortcutsModal={() => setIsShortcutsModalOpen(true)}
        showPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<TextForm showAlert={showAlert} />} />
          <Route path="/tools" element={<ToolsLibrary />} />
          <Route path="/ai-studio" element={<AIWritingStudio showAlert={showAlert} />} />
          <Route path="/developer" element={<DeveloperTools showAlert={showAlert} />} />
          <Route path="/intelligence" element={<TextIntelligenceLab showAlert={showAlert} />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<TextForm showAlert={showAlert} />} />
        </Routes>
      </main>

      {/* Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}
