import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { BooksPage } from "./components/BooksPage";
import { BookDetailPage } from "./components/BookDetailPage";
import { WishlistPage } from "./components/WishlistPage";
import { MessagingInterface } from "./components/MessagingInterface";
import { ExchangeConfirmationPage } from "./components/ExchangeConfirmationPage";
import { Footer } from "./components/Footer";
import { SearchFilters } from "./components/SearchBar";
import { Book } from "./types";

export function App() {
  const [currentView, setCurrentView] = useState<
    "home" | "books" | "bookDetail" | "wishlist" | "messaging" | "exchangeSuccess"
  >("home");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const normalizedUser = {
          id: user.uid,
          name: user.displayName || user.email,
          email: user.email,
          profilePicture: user.photoURL || null,
          role: "buyer",
          totalExchanges: 5, // Mock data
        };
        setCurrentUser(normalizedUser);
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    setCurrentView("books");
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setCurrentView("bookDetail");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedBook(null);
    setSearchQuery("");
    setSearchFilters({});
  };

  const handleBackToBooks = () => {
    setCurrentView("books");
    setSelectedBook(null);
  };

  const handleUserChange = (user: any) => {
    setCurrentUser(user);
  };

  const handleContactSeller = (book: Book) => {
    setSelectedBook(book);
    setCurrentView("messaging");
  };

  const handleExchangeComplete = () => {
    setCurrentView("exchangeSuccess");
  };

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render books page
  if (currentView === "books") {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onBookSelect={handleBookClick}
          onUserChange={handleUserChange}
        />
        <main className="flex-1">
          <BooksPage
            onBookClick={handleBookClick}
            currentUser={currentUser}
            initialQuery={searchQuery}
            initialFilters={searchFilters}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Render book detail page
  if (currentView === "bookDetail" && selectedBook) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onBookSelect={handleBookClick}
          onUserChange={handleUserChange}
        />
        <main className="flex-1">
          <BookDetailPage
            book={selectedBook}
            onBack={handleBackToBooks}
            onBuyNow={handleContactSeller}
            onAddToCart={(book) => console.log('Added to cart:', book)}
            onAddToWishlist={(book) => console.log('Added to wishlist:', book)}
            onExchangeClick={(book) => console.log("Exchange clicked for book:", book)}
            currentUser={currentUser}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Render wishlist page
  if (currentView === "wishlist") {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onBookSelect={handleBookClick}
          onUserChange={handleUserChange}
        />
        <main className="flex-1">
          <WishlistPage
            onBookClick={handleBookClick}
            onSetupAlert={(book) => console.log('Setup alert for:', book)}
            currentUser={currentUser}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Render messaging interface
  if (currentView === "messaging" && selectedBook && currentUser) {
    return (
      <MessagingInterface
        book={selectedBook}
        seller={selectedBook.seller}
        currentUser={currentUser}
        onBack={handleBackToBooks}
        onExchangeConfirmed={handleExchangeComplete}
      />
    );
  }

  // Render exchange success page
  if (currentView === "exchangeSuccess" && selectedBook && currentUser) {
    return (
      <ExchangeConfirmationPage
        exchangedBook={selectedBook}
        exchangePartner={selectedBook.seller}
        currentUser={currentUser}
        onBackToHome={handleBackToHome}
        onBrowseMore={() => setCurrentView("books")}
        onListBooks={() => console.log('List books clicked')}
      />
    );
  }

  // Render home page
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header
        currentUser={currentUser}
        onSearch={handleSearch}
        onBookSelect={handleBookClick}
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