import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { BookDetailPage } from './components/BookDetailPage';
import { ListingDashboardPage } from './components/ListingDashboardPage';
import { Footer } from './components/Footer';
import { SearchFilters } from './components/SearchBar';
import { Book } from './types';
import { getCurrentUser, isTokenValid, refreshTokenIfNeeded } from './utils/auth';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'bookDetail' | 'dashboard'>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check for existing authentication on app load
  useEffect(() => {
    if (isTokenValid()) {
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);
        refreshTokenIfNeeded();
      }
    }
  }, []);

  // Auto-refresh token periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser && isTokenValid()) {
        refreshTokenIfNeeded();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [currentUser]);

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    // Always navigate to search view when search is triggered
    setCurrentView('search');
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('bookDetail');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedBook(null);
    setSearchQuery('');
    setSearchFilters({});
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedBook(null);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedBook(null);
  };

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    // Navigate to dashboard after successful login/registration
    setCurrentView('dashboard');
  };

  const handleUserChange = (user: any) => {
    setCurrentUser(user);
    if (!user) {
      // User logged out, go back to home
      setCurrentView('home');
    }
  };

  const handleListBookClick = () => {
    // This would open the ListBookModal
    console.log('List book clicked');
  };

  // Render book detail page
  if (currentView === 'bookDetail' && selectedBook) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header 
          currentUser={currentUser} 
          onSearch={handleSearch}
          onBookSelect={handleBookClick}
          onAuthSuccess={handleAuthSuccess}
          onUserChange={handleUserChange}
        />
        <main className="flex-1">
          <BookDetailPage 
            book={selectedBook}
            onBack={currentUser ? handleBackToDashboard : (searchQuery || Object.keys(searchFilters).length > 0 ? handleBackToSearch : handleBackToHome)}
            onSwapClick={(book) => console.log('Swap clicked for book:', book)}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Render search results page
  if (currentView === 'search') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header 
          currentUser={currentUser} 
          onSearch={handleSearch}
          onBookSelect={handleBookClick}
          onAuthSuccess={handleAuthSuccess}
          onUserChange={handleUserChange}
        />
        <main className="flex-1">
          <SearchResultsPage 
            initialQuery={searchQuery}
            initialFilters={searchFilters}
            onBookClick={handleBookClick}
            onBack={currentUser ? handleBackToDashboard : handleBackToHome}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Render dashboard page for logged-in users
  if (currentView === 'dashboard' && currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <main className="flex-1">
          <ListingDashboardPage
            currentUser={currentUser}
            onBookClick={handleBookClick}
            onListBookClick={handleListBookClick}
            onSearch={handleSearch}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Render home page
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header 
        currentUser={currentUser} 
        onSearch={handleSearch}
        onBookSelect={handleBookClick}
        onAuthSuccess={handleAuthSuccess}
        onUserChange={handleUserChange}
      />
      <main className="flex-1">
        <HomePage 
          onSearch={handleSearch}
          onBookClick={handleBookClick}
          currentUser={currentUser}
        />
      </main>
      <Footer />
    </div>
  );
}