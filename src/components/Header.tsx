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

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const normalizedUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          profilePicture: firebaseUser.photoURL || null,
          role: "buyer", // default role
        };
        setUser(normalizedUser);
        onUserChange?.(normalizedUser);
        
        // Persist to localStorage for consistency
        localStorage.setItem("vitabu_user", JSON.stringify(normalizedUser));
      } else {
        // User is signed out
        setUser(null);
        onUserChange?.(null);
        
        // Clear localStorage
        localStorage.removeItem("vitabu_user");
        localStorage.removeItem("vitabu_auth_token");
        localStorage.removeItem("vitabu_token_expiry");
      }
    });

    return () => unsubscribe();
  }, [onUserChange]);

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

  const handleAuthSuccess = (firebaseUser: any) => {
    const normalizedUser = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email,
      email: firebaseUser.email,
      profilePicture: firebaseUser.photoURL || null,
      role: "buyer", // optional: default role
    };

    setUser(normalizedUser);
    onUserChange?.(normalizedUser);
    setShowAuthModal(false);

    // Persist to localStorage for page reload
    localStorage.setItem("vitabu_user", JSON.stringify(normalizedUser));
  };

  const handleLogout = async () => {
    try {
      await logOut();
      // Firebase auth state change will handle the rest
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

      // Firebase auth state change will handle the rest
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
      const user = userCredential.user;

      // Optionally set display name
      await updateProfile(user, { displayName: username });

      // Firebase auth state change will handle the rest
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

      const user = userCredential.user;

      // Firebase auth state change will handle the rest
      setShowAuthModal(false);
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
