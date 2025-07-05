import React, { useState, useEffect } from 'react';
import { Bell, BookOpen, Menu } from 'lucide-react';
import { SearchBar, SearchFilters } from './SearchBar';
import { AuthFlow } from './AuthFlow';
import { AuthButton } from './AuthButton';
import { Book } from '../types';
import { getCurrentUser, isTokenValid } from '../utils/auth';

interface HeaderProps {
  currentUser?: any;
  onSearch?: (query: string, filters: SearchFilters) => void;
  onBookSelect?: (book: Book) => void;
  onAuthSuccess?: (user: any) => void;
  onUserChange?: (user: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onSearch, 
  onBookSelect,
  onAuthSuccess,
  onUserChange
}) => {
  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const [user, setUser] = useState(currentUser);

  // Check for existing auth on mount
  useEffect(() => {
    if (!user && isTokenValid()) {
      const existingUser = getCurrentUser();
      if (existingUser) {
        setUser(existingUser);
        onUserChange?.(existingUser);
      }
    }
  }, [user, onUserChange]);

  // Update user when prop changes
  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const handleSearch = (query: string, filters: SearchFilters) => {
    console.log('Header search query:', query, 'Filters:', filters);
    onSearch?.(query, filters);
  };

  const handleResultSelect = (book: Book) => {
    console.log('Header selected book:', book);
    onBookSelect?.(book);
  };

  const handleAuthSuccess = (newUser: any) => {
    setUser(newUser);
    onAuthSuccess?.(newUser);
    onUserChange?.(newUser);
    setShowAuthFlow(false);
    console.log('User authenticated:', newUser);
  };

  const handleLogout = () => {
    setUser(null);
    onUserChange?.(null);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-accent-500" />
                <div className="flex flex-col">
                  <h1 className="font-poppins font-bold text-primary-700 text-lg leading-tight">
                    Vitabu Vitabu
                  </h1>
                  <p className="text-xs text-neutral-500 -mt-1">Real Parents. Real Savings.</p>
                </div>
              </div>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <SearchBar
                onSearch={handleSearch}
                onResultSelect={handleResultSelect}
                placeholder="Search for books by grade, subject, title..."
                showFilters={true}
                className="w-full"
              />
            </div>

            {/* Right side navigation */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button className="md:hidden p-2 rounded-md text-neutral-600 hover:text-primary-700 hover:bg-neutral-100">
                <Menu className="h-6 w-6" />
              </button>

              {/* Notifications */}
              {user && (
                <button className="relative p-2 rounded-full text-neutral-600 hover:text-primary-700 hover:bg-neutral-100">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent-500"></span>
                </button>
              )}

              {/* Auth Button */}
              <AuthButton
                currentUser={user}
                onAuthClick={() => setShowAuthFlow(true)}
                onLogout={handleLogout}
              />
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden pb-4">
            <SearchBar
              onSearch={handleSearch}
              onResultSelect={handleResultSelect}
              placeholder="Search for books..."
              showFilters={true}
              className="w-full"
            />
          </div>
        </div>
      </header>

      {/* Auth Flow Modal */}
      <AuthFlow
        isOpen={showAuthFlow}
        onClose={() => setShowAuthFlow(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};