import React, { useState } from "react";
import {
  DollarSign,
  BookOpen,
  Plus,
  Star,
  ArrowRightLeft,
  Users,
  Heart,
  CheckCircle,
  Facebook,
  Shield,
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import { BookCard } from "./BookCard";
import { ActivityFeed } from "./ActivityFeed";
import { ProgressTracker } from "./ProgressTracker";
import { ExchangeBanner } from "./ExchangeBanner";
import { ExchangeMatchCard } from "./ExchangeMatchCard";
import { RoleBasedDashboard } from "./RoleBasedDashboard";
import { DonationComingSoon } from "./DonationComingSoon";
import { HowItWorks } from "./HowItWorks";
import { SignInPrompt } from "./SignInPrompt";
import { ListBookModal } from "./ListBookModal";
import AuthFlow from "./AuthFlow";
import { SearchBar, SearchFilters } from "./SearchBar";
import {
  mockBooks,
  mockActivityFeed,
  mockUserStats,
  mockExchangeMatches,
} from "../data/mockData";
import { Book } from "../types";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

interface HomePageProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  onBookClick?: (book: Book) => void;
  currentUser?: any;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  onBookClick,
  currentUser,
}) => {
  const [showListBookModal, setShowListBookModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const featuredBooks = mockBooks
    .filter((book) => book.isFeatured || book.isUrgent)
    .slice(0, 4);
  const pendingExchanges = mockExchangeMatches.filter(
    (match) => match.status === "pending"
  );

  const handleSearch = (query: string, filters: SearchFilters) => {
    onSearch?.(query, filters);
  };

  const handleBookClick = (book: Book) => {
    onBookClick?.(book);
  };

  const handleExchangeClick = (book: Book) => {
    console.log("Exchange clicked for book:", book.title);
  };

  const handleAcceptExchange = (matchId: string) => {
    console.log("Accept exchange:", matchId);
  };

  const handleDeclineExchange = (matchId: string) => {
    console.log("Decline exchange:", matchId);
  };

  const handleSignInClick = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (user: any) => {
    console.log("User authenticated:", user);
    setShowAuthModal(false);
    // The parent component will handle updating the current user
  };

  const handleListBookClick = () => {
    setShowListBookModal(true);
  };

  const handleBrowseBooksClick = () => {
    // Trigger search with empty query to show all books
    onSearch?.("", {});
  };

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );

    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCred.user);
    setShowAuthModal(false); // Close modal after login
  };

  // const handleSignup = async (
  //   username: string,
  //   email: string,
  //   password: string
  // ) => {
  //   try {
  //     const userCred = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     await updateProfile(userCred.user, { displayName: username });
  //     console.log("User signed up:", userCred.user);
  //     setShowAuthModal(false); // Close modal after signup
  //   } catch (error: any) {
  //     if (error.code === "auth/email-already-in-use") {
  //       alert("🚫 This email is already registered. Try logging in instead.");
  //     } else {
  //       console.error("Signup failed:", error);
  //       alert("❌ Signup failed. Please try again.");
  //     }
  //   }
  // };

  const handleSignup = async (
    username: string,
    email: string,
    password: string
  ) => {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCred.user, { displayName: username });
    console.log("User signed up:", userCred.user);
    setShowAuthModal(false); // Close modal after signup
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    const selectedProvider =
      provider === "google"
        ? new GoogleAuthProvider()
        : new FacebookAuthProvider();

    await signInWithPopup(auth, selectedProvider);
    console.log("User signed in with social provider");
    setShowAuthModal(false);
  };

  const handleBookListed = (newBook: any) => {
    console.log("New book listed:", newBook);
    // In a real app, this would update the books list
    // For now, we'll just show a success message
    alert(
      "🎉 Your book has been listed successfully! Other parents can now find and contact you."
    );
  };

  return (
    <>
      <div className="min-h-screen bg-kitenge-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold text-primary-800 mb-6 leading-tight">
              Real Parents. Real Savings. Real Books.
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Exchange, buy, or donate school books with parents in your area.
              Save money while building stronger communities across Kenya.
            </p>

            {/* Hero Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <SearchBar
                onSearch={handleSearch}
                onResultSelect={handleBookClick}
                placeholder="Search by grade, subject, or title..."
                showFilters={true}
                className="w-full"
              />
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <button
                onClick={handleListBookClick}
                className="btn-primary flex items-center space-x-2 text-lg px-10 py-5 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-6 w-6" />
                <span>List Your First Book</span>
              </button>
              <button
                className="btn-secondary text-lg px-10 py-5 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={handleBrowseBooksClick}
              >
                Browse Books
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-neutral-600">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-secondary-600" />
                <span>8,000+ happy parents</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gold-600" />
                <span>KES 2.3M+ saved</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-accent-600" />
                <span>100% secure transactions</span>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <HowItWorks
            onListBookClick={handleListBookClick}
            onBrowseBooksClick={handleBrowseBooksClick}
          />

          {/* Featured Books Section - Limited to 4 Cards */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-poppins font-bold text-primary-800 mb-4">
                Featured Books
              </h2>
              <p className="text-lg text-neutral-600">
                Hand-picked deals from trusted parents in your community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBookClick={handleBookClick}
                  onExchangeClick={handleExchangeClick}
                />
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleBrowseBooksClick}
                className="btn-secondary text-lg px-8 py-3"
              >
                View More Books →
              </button>
            </div>
          </section>

          {/* Impact Metrics Section */}
          <section className="mb-16">
            <div className="card bg-gradient-to-br from-secondary-500 to-accent-500 text-white">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-poppins font-bold mb-4">
                  Community Impact
                </h2>
                <p className="text-xl opacity-90">
                  Together, we're transforming how Kenyan families access
                  education
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">KES 2.3M+</div>
                  <div className="text-xl opacity-90">Total Saved</div>
                  <div className="text-sm opacity-75 mt-1">
                    by families like yours
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">15,000+</div>
                  <div className="text-xl opacity-90">Books Reused</div>
                  <div className="text-sm opacity-75 mt-1">
                    keeping education affordable
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">8,000+</div>
                  <div className="text-xl opacity-90">Happy Parents</div>
                  <div className="text-sm opacity-75 mt-1">
                    building stronger communities
                  </div>
                </div>
              </div>

              {/* Testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 p-6 rounded-xl">
                  <p className="italic mb-4">
                    "I've saved over KES 15,000 this year alone! My children get
                    the books they need, and I've made friends with other
                    parents in our area."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-bold">MW</span>
                    </div>
                    <div>
                      <div className="font-semibold">Mary Wanjiku</div>
                      <div className="text-sm opacity-75">
                        Nairobi • Mother of 3
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 p-6 rounded-xl">
                  <p className="italic mb-4">
                    "The exchange system is brilliant! My son gets new books for
                    each grade, and I help other families too. It's a win-win."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-bold">SA</span>
                    </div>
                    <div>
                      <div className="font-semibold">Susan Achieng</div>
                      <div className="text-sm opacity-75">
                        Nakuru • Mother of 2
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Layout with Sidebar for Logged-in Users */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Sign In Prompt for Non-Users */}
              {!currentUser && (
                <SignInPrompt onSignInClick={handleSignInClick} />
              )}
            </div>

            {/* Sidebar - Only for signed-in users */}
            {currentUser && (
              <div className="space-y-6">
                {/* Role-Based Dashboard */}
                <RoleBasedDashboard
                  user={currentUser}
                  onBrowseBooks={handleBrowseBooksClick}
                  onListBook={handleListBookClick}
                  onFindExchanges={() => console.log("Find exchanges clicked")}
                />

                {/* Pending Exchanges - Only for signed-in users */}
                {pendingExchanges.length > 0 && (
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-poppins font-semibold text-primary-700 flex items-center space-x-2">
                        <ArrowRightLeft className="h-5 w-5 text-accent-600" />
                        <span>Pending Exchanges</span>
                      </h3>
                      <button className="text-accent-600 hover:text-accent-700 text-sm font-medium">
                        View all →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {pendingExchanges.slice(0, 2).map((exchangeMatch) => (
                        <div
                          key={exchangeMatch.id}
                          className="p-3 bg-accent-50 rounded-lg border border-accent-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-accent-700">
                              Exchange with {exchangeMatch.userB.name}
                            </span>
                            <span className="text-xs text-accent-600 bg-accent-100 px-2 py-1 rounded">
                              Pending
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 mb-2">
                            {exchangeMatch.userABook.title} ↔{" "}
                            {exchangeMatch.userBBook.title}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleAcceptExchange(exchangeMatch.id)
                              }
                              className="text-xs bg-secondary-500 text-white px-3 py-1 rounded hover:bg-secondary-600"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleDeclineExchange(exchangeMatch.id)
                              }
                              className="text-xs bg-neutral-300 text-neutral-700 px-3 py-1 rounded hover:bg-neutral-400"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity Feed */}
                <ActivityFeed activities={mockActivityFeed} />

                {/* Progress Trackers */}
                <ProgressTracker
                  title="Exchange Master Progress"
                  current={8}
                  target={15}
                  unit="exchanges"
                  color="secondary"
                  reward="Free delivery on all exchanges"
                />
              </div>
            )}
          </div>

          {/* Trust Section */}
          <section className="mt-16 mb-16">
            <div className="card bg-gradient-to-r from-neutral-50 to-white border-2 border-neutral-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-4">
                  🇰🇪 Built in Kenya, for Kenyan Families
                </h2>
                <p className="text-lg text-neutral-600">
                  Trusted by thousands of parents across the country
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Facebook Community */}
                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-blue-500 rounded-full">
                      <Facebook className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-poppins font-semibold text-primary-800 mb-2">
                    Join 5,000+ Parents on Facebook
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Connect with other parents, share tips, and get the latest
                    book deals
                  </p>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Join Community
                  </button>
                </div>

                {/* M-Pesa Security */}
                <div className="text-center p-6 bg-secondary-50 rounded-xl border border-secondary-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-secondary-500 rounded-full">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-poppins font-semibold text-primary-800 mb-2">
                    M-Pesa Secure Payments
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Safe, familiar payments using the system you already trust
                  </p>
                  <div className="text-xs text-secondary-600 font-medium">
                    ✓ Escrow Protection ✓ Verified Sellers
                  </div>
                </div>

                {/* Community Trust */}
                <div className="text-center p-6 bg-gold-50 rounded-xl border border-gold-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gold-500 rounded-full">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-poppins font-semibold text-primary-800 mb-2">
                    Community-Driven
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Real parents helping real parents. No corporate middlemen.
                  </p>
                  <div className="text-xs text-gold-600 font-medium">
                    ✓ Parent Reviews ✓ Local Meetups
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Donation Coming Soon Section - Positioned at Bottom */}
          <DonationComingSoon />
        </div>
      </div>

      {/* List Book Modal */}
      <ListBookModal
        isOpen={showListBookModal}
        onClose={() => setShowListBookModal(false)}
        onBookListed={handleBookListed}
      />

      {showAuthModal && (
        <AuthFlow
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onSocialLogin={handleSocialLogin}
        />
      )}
    </>
  );
};
