import React, { useState, useEffect } from "react";
import { Bell, BookOpen, Menu, MapPin, User } from "lucide-react";
import { SearchBar, SearchFilters } from "./SearchBar";
import AuthFlow from "./AuthFlow";
import { AuthButton } from "./AuthButton";
import { Book } from "../types";
import { updateProfile } from "firebase/auth";
import { logOut } from "../utils/firebaseAuth";
import { loginWithGoogle, loginWithFacebook } from "../utils/firebaseAuth";

import {
  logIn,
  signUp,
} from "../utils/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

interface HeaderProps {
  currentUser?: any;
  onSearch?: (query: string, filters: SearchFilters) => void;
  onBookSelect?: (book: Book) => void;
  onUserChange?: (user: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSearch,
  onBookSelect,
  onUserChange,
}) => {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(currentUser);
  const [selectedLocation, setSelectedLocation] = useState("Nairobi");

  const locations = ["Nairobi", "Mombasa", "Nakuru", "Kisumu", "Eldoret", "Thika"];

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const normalizedUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          profilePicture: firebaseUser.photoURL || null,
          role: "buyer",
        };
        setUser(normalizedUser);
        onUserChange?.(normalizedUser);
        localStorage.setItem("vitabu_user", JSON.stringify(normalizedUser));
      } else {
        setUser(null);
        onUserChange?.(null);
        localStorage.removeItem("vitabu_user");
        localStorage.removeItem("vitabu_auth_token");
        localStorage.removeItem("vitabu_token_expiry");
      }
    });

    return () => unsubscribe();
  }, [onUserChange]);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const handleSearch = (query: string, filters: SearchFilters) => {
    // Add location to filters
    const filtersWithLocation = {
      ...filters,
      location: selectedLocation
    };
    onSearch?.(query, filtersWithLocation);
  };

  const handleResultSelect = (book: Book) => {
    onBookSelect?.(book);
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      const userCredential = await logIn(email, password, rememberMe);
      setShowAuthModal(false);
    } catch (error: any) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  };

  const handleSignup = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const userCredential = await signUp(email, password);
      await updateProfile(userCredential.user, { displayName: username });
      setShowAuthModal(false);
    } catch (error: any) {
      console.error("Signup error:", error);
      alert("Signup failed: " + error.message);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      const userCredential =
        provider === "google"
          ? await loginWithGoogle()
          : await loginWithFacebook();
      setShowAuthModal(false);
    } catch (error: any) {
      console.error("Social login error:", error);
      if (error.code === 'auth/popup-blocked') {
        alert("Social login failed because your browser blocked the popup. Please enable popups for this site in your browser settings and try again.");
      } else {
        alert("Social login failed: " + error.message);
      }
    }
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
                  <p className="text-xs text-neutral-500 -mt-1">
                    Real Parents. Real Savings.
                  </p>
                </div>
              </div>
            </div>

            {/* Location Selector - Prominent */}
            <div className="hidden md:flex items-center space-x-2 bg-accent-50 px-4 py-2 rounded-lg border border-accent-200">
              <MapPin className="h-5 w-5 text-accent-600" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-primary-700 font-medium focus:outline-none"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <SearchBar
                onSearch={handleSearch}
                onResultSelect={handleResultSelect}
                placeholder="Search books by grade, subject, title..."
                showFilters={false}
                className="w-full"
              />
            </div>

            {/* Right side navigation */}
            <div className="flex items-center space-x-4">
              {/* Guest Wishlist Indicator */}
              {!user && (
                <button className="relative p-2 rounded-full text-neutral-600 hover:text-primary-700 hover:bg-neutral-100">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>
              )}

              {/* Mobile menu button */}
              <button className="md:hidden p-2 rounded-md text-neutral-600 hover:text-primary-700 hover:bg-neutral-100">
                <Menu className="h-6 w-6" />
              </button>

              {/* Notifications for logged-in users */}
              {user && (
                <button className="relative p-2 rounded-full text-neutral-600 hover:text-primary-700 hover:bg-neutral-100">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent-500"></span>
                </button>
              )}

              {/* Auth Button */}
              {!user ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAuthClick("login")}
                    className="text-neutral-600 hover:text-primary-700 font-medium px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors text-sm"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => handleAuthClick("signup")}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <AuthButton
                  currentUser={user}
                  onAuthClick={handleAuthClick}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </div>

          {/* Mobile search bar and location */}
          <div className="md:hidden pb-4 space-y-3">
            <SearchBar
              onSearch={handleSearch}
              onResultSelect={handleResultSelect}
              placeholder="Search for books..."
              showFilters={false}
              className="w-full"
            />
            
            {/* Mobile Location Selector */}
            <div className="flex items-center space-x-2 bg-accent-50 px-4 py-2 rounded-lg border border-accent-200">
              <MapPin className="h-4 w-4 text-accent-600" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-primary-700 font-medium focus:outline-none flex-1"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
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