import React, { useState } from 'react';
import { Bell, User, BookOpen, Menu } from 'lucide-react';
import { SearchBar, SearchFilters } from './SearchBar';
import { AuthModal } from './AuthModal';
import { Book } from '../types';

interface HeaderProps {
  currentUser?: any;
  onSearch?: (query: string, filters: SearchFilters) => void;
  onBookSelect?: (book: Book) => void;
  onAuthSuccess?: (user: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onSearch, 
  onBookSelect,
  onAuthSuccess 
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSearch = (query: string, filters: SearchFilters) => {
    console.log('Header search query:', query, 'Filters:', filters);
    onSearch?.(query, filters);
  };

  const handleResultSelect = (book: Book) => {
    console.log('Header selected book:', book);
    onBookSelect?.(book);
  };

  const handleAuthSuccess = (newUser: any) => {
    onAuthSuccess?.(newUser);
    setShowAuthModal(false);
    console.log('User authenticated:', newUser);
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
              {currentUser && (
                <button className="relative p-2 rounded-full text-neutral-600 hover:text-primary-700 hover:bg-neutral-100">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent-500"></span>
                </button>
              )}

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                {currentUser ? (
                  <div className="flex items-center space-x-2">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-primary-700">{currentUser.name}</p>
                      <p className="text-xs text-neutral-500">
                        {currentUser.role === 'seller' ? 'Seller' : currentUser.role === 'buyer' ? 'Buyer' : 'Member'}
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center overflow-hidden">
                      {currentUser.profilePicture ? (
                        <img 
                          src={currentUser.profilePicture} 
                          alt={currentUser.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-accent-600" />
                      )}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="btn-primary text-sm"
                  >
                    Sign In
                  </button>
                )}
              </div>
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};