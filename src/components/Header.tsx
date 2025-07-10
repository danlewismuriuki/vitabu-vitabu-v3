import React, { useState, useEffect } from "react";
import { Bell, BookOpen, Menu } from "lucide-react";
import { SearchBar, SearchFilters } from "./SearchBar";
import AuthFlow from "./AuthFlow";
import { AuthButton } from "./AuthButton";
import { Book } from "../types";
import { updateProfile } from "firebase/auth";
import { logOut } from "../utils/firebaseAuth";
import { loginWithGoogle, loginWithFacebook } from "../utils/firebaseAuth";

import {
  getCurrentUser,
  isTokenValid,
  logIn,
  signUp,
} from "../utils/firebaseAuth";

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
    console.log("Header search query:", query, "Filters:", filters);
    onSearch?.(query, filters);
  };

  const handleResultSelect = (book: Book) => {
    console.log("Header selected book:", book);
    onBookSelect?.(book);
  };

  const handleAuthSuccess = (newUser: any) => {
    setUser(newUser);
    onUserChange?.(newUser);
    setShowAuthModal(false);
    console.log("User authenticated:", newUser);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      onUserChange?.(null);
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
      const user = userCredential.user;

      handleAuthSuccess({
        id: user.uid,
        name: user.displayName || user.email,
        email: user.email,
      });
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
      const user = userCredential.user;

      // Optionally set display name
      await updateProfile(user, { displayName: username });

      handleAuthSuccess({
        id: user.uid,
        name: username,
        email: user.email,
      });
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

      const user = userCredential.user;

      handleAuthSuccess({
        id: user.uid,
        name: user.displayName || user.email,
        email: user.email,
      });
    } catch (error: any) {
      console.error("Social login error:", error);
      alert("Social login failed: " + error.message);
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
                onAuthClick={handleAuthClick}
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
