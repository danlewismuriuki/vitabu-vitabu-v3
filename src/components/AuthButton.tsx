import React, { useState, useEffect } from "react";
import { User, LogOut, Settings, BookOpen, Heart, Bell } from "lucide-react";

interface AuthButtonProps {
  currentUser?: any;
  onAuthClick: (mode: "login" | "signup") => void;
  onLogout: () => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  currentUser,
  onAuthClick,
  onLogout,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".auth-dropdown")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("vitabu_auth_token");
    localStorage.removeItem("vitabu_token_expiry");
    localStorage.removeItem("vitabu_user");

    setShowDropdown(false);
    onLogout();
  };

  if (!currentUser) {
    return (
      <div className="flex space-x-3">
        <button
          onClick={() => onAuthClick("login")}
          className="text-neutral-600 hover:text-primary-700 font-medium px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          Login In
        </button>
        <button
          onClick={() => onAuthClick("signup")}
          className="btn-primary text-sm px-5 py-2"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="relative auth-dropdown">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-primary-700">
            {currentUser.name}
          </p>
          <p className="text-xs text-neutral-500">
            {currentUser.role === "seller" ? "Seller" : "Buyer"}
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
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center overflow-hidden">
                {currentUser.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-accent-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-primary-700">
                  {currentUser.name}
                </p>
                <p className="text-sm text-neutral-500">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center space-x-3">
              <BookOpen className="h-4 w-4 text-neutral-600" />
              <span className="text-sm text-neutral-700">My Books</span>
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center space-x-3">
              <Heart className="h-4 w-4 text-neutral-600" />
              <span className="text-sm text-neutral-700">Wishlist</span>
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center space-x-3">
              <Bell className="h-4 w-4 text-neutral-600" />
              <span className="text-sm text-neutral-700">Notifications</span>
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center space-x-3">
              <Settings className="h-4 w-4 text-neutral-600" />
              <span className="text-sm text-neutral-700">Settings</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-neutral-200 pt-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center space-x-3 text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
