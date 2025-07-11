import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { SearchResultsPage } from "./components/SearchResultsPage";
import { BookDetailPage } from "./components/BookDetailPage";
import { BooksPage } from "./components/BooksPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { OrderSuccessPage } from "./components/OrderSuccessPage";
import { ListingDashboardPage } from "./components/ListingDashboardPage";
import { Footer } from "./components/Footer";
import { SearchFilters } from "./components/SearchBar";
import { Book } from "./types";

export function App() {
  const [currentView, setCurrentView] = useState<
    "home" | "search" | "books" | "bookDetail" | "checkout" | "orderSuccess" | "dashboard"
  >("home");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
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
        };
        setCurrentUser(normalizedUser);
        setCurrentView("dashboard");
      } else {
        setCurrentUser(null);
        setCurrentView("home");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    // Navigate to books page for browsing
    setCurrentView("books");
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setCurrentView("bookDetail");
  };

  const handleBuyNow = (book: Book) => {
    if (!currentUser) {
      // Redirect to login - in real app this would open auth modal
      alert('Please log in to purchase books');
      return;
    }
    setSelectedBook(book);
    setCurrentView("checkout");
  };

  const handleOrderComplete = (details: any) => {
    setOrderDetails(details);
    setCurrentView("orderSuccess");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedBook(null);
    setOrderDetails(null);
    setSearchQuery("");
    setSearchFilters({});
  };

  const handleBackToBooks = () => {
    setCurrentView("books");
    setSelectedBook(null);
  };

  const handleBackToBookDetail = () => {
    setCurrentView("bookDetail");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedBook(null);
  };


  const handleUserChange = (user: any) => {
    setCurrentUser(user);
    if (!user) {
      // User logged out, go back to home
      setCurrentView("home");
    }
  };

  const handleListBookClick = () => {
    // This would open the ListBookModal
    console.log("List book clicked");
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
            onBack={
              currentUser
                ? handleBackToDashboard
                : handleBackToBooks
            }
            onBuyNow={handleBuyNow}
            onAddToCart={(book) => console.log('Added to cart:', book)}
            onAddToWishlist={(book) => console.log('Added to wishlist:', book)}
            onExchangeClick={(book) =>
              console.log("Swap clicked for book:", book)
            }
            currentUser={currentUser}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Render checkout page
  if (currentView === "checkout" && selectedBook && currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onBookSelect={handleBookClick}
          onUserChange={handleUserChange}
        />
        <main className="flex-1">
          <CheckoutPage
            book={selectedBook}
            currentUser={currentUser}
            onBack={handleBackToBookDetail}
            onOrderComplete={handleOrderComplete}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Render order success page
  if (currentView === "orderSuccess" && orderDetails) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onBookSelect={handleBookClick}
          onUserChange={handleUserChange}
        />
        <main className="flex-1">
          <OrderSuccessPage
            orderDetails={orderDetails}
            onBackToHome={handleBackToHome}
            onViewBooks={() => setCurrentView("books")}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Render search results page
  if (currentView === "search") {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header
          currentUser={currentUser}
          onSearch={handleSearch}
          onBookSelect={handleBookClick}
          onUserChange={handleUserChange}
        />
        <main className="flex-1">
          <SearchResultsPage
            initialQuery={searchQuery}
            initialFilters={searchFilters}
            onBookClick={handleBookClick}
            onBack={currentUser ? handleBackToDashboard : handleBackToBooks}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Render dashboard page for logged-in users
  if (currentView === "dashboard" && currentUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <main className="flex-1">
          <ListingDashboardPage
            currentUser={currentUser}
            onBookClick={handleBookClick}
            onListBookClick={handleListBookClick}
            onSearch={handleSearch}
            onUserChange={handleUserChange}
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
