import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { BookDetailPage } from './components/BookDetailPage';
import { Footer } from './components/Footer';
import { SearchFilters } from './components/SearchBar';
import { Book } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'bookDetail'>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    if (query.trim() || Object.keys(filters).length > 0) {
      setCurrentView('search');
    } else {
      setCurrentView('home');
    }
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

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
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
        />
        <main className="flex-1">
          <BookDetailPage 
            book={selectedBook}
            onBack={searchQuery || Object.keys(searchFilters).length > 0 ? handleBackToSearch : handleBackToHome}
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
        />
        <main className="flex-1">
          <SearchResultsPage 
            initialQuery={searchQuery}
            initialFilters={searchFilters}
            onBookClick={handleBookClick}
            onBack={handleBackToHome}
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