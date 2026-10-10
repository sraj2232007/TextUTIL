import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  PenTool,
  Code2,
  BarChart3,
  Grid,
  Info,
  Sun,
  Moon,
  Search,
  Keyboard,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({
  mode,
  toggleMode,
  openCommandPalette,
  openShortcutsModal,
}) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Workspace', icon: FileText },
    { path: '/ai-studio', label: 'Writing Assistant', icon: PenTool },
    { path: '/intelligence', label: 'Intelligence', icon: BarChart3 },
    { path: '/developer', label: 'Developer', icon: Code2 },
    { path: '/tools', label: 'Directory', icon: Grid },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="brand-section">
          <div className="brand-icon">
            <FileText size={14} />
          </div>
          <span>TextUtil</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links" aria-label="Main Navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Quick Search */}
          <button
            type="button"
            className="search-trigger-btn"
            onClick={openCommandPalette}
            title="Search tools (Ctrl+K)"
          >
            <Search size={13} />
            <span className="d-none d-md-inline">Search</span>
            <span className="kbd-shortcut">⌘K</span>
          </button>

          {/* Shortcuts Reference */}
          <button
            type="button"
            className="icon-btn"
            onClick={openShortcutsModal}
            title="Keyboard Shortcuts"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard size={14} />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className="icon-btn"
            onClick={toggleMode}
            title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Dark/Light Mode"
          >
            {mode === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="icon-btn d-md-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="d-md-none border-top px-3 py-2" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="d-flex flex-column gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`nav-link-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
