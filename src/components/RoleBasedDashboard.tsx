import React from 'react';
import { User } from '../types';
import { ShoppingBag, Store, Plus, TrendingUp, BookOpen, Users, Star, ArrowRightLeft } from 'lucide-react';

interface RoleBasedDashboardProps {
  user: User & {
    role?: 'buyer' | 'seller';
    preferences?: any;
    sellerData?: any;
  };
  onBrowseBooks?: () => void;
  onListBook?: () => void;
  onFindExchanges?: () => void;
}

export const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ 
  user, 
  onBrowseBooks,
  onListBook,
  onFindExchanges 
}) => {
  if (user.role === 'buyer') {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-accent-100 rounded-lg">
            <ShoppingBag className="h-5 w-5 text-accent-600" />
          </div>
          <div>
            <h3 className="font-poppins font-semibold text-primary-700">Buyer Dashboard</h3>
            <p className="text-sm text-neutral-600">Find your next great book deal</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-secondary-700">KES 3,200</div>
              <div className="text-xs text-secondary-600">Total Saved</div>
            </div>
            <div className="bg-accent-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-accent-700">12</div>
              <div className="text-xs text-accent-600">Books Bought</div>
            </div>
          </div>

          {/* Personalized Recommendations */}
          {user.preferences?.childGrades && user.preferences.childGrades.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">📚 For You</h4>
              <p className="text-sm text-blue-700">
                New Grade {user.preferences.childGrades[0]} books available in {user.location}
              </p>
              <button 
                onClick={onBrowseBooks}
                className="text-xs text-blue-600 hover:text-blue-700 mt-1"
              >
                View recommendations →
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-2">
            <button 
              onClick={onBrowseBooks}
              className="w-full btn-primary text-sm py-2"
            >
              Browse Books
            </button>
            <button 
              onClick={onFindExchanges}
              className="w-full btn-secondary text-sm py-2 flex items-center justify-center space-x-2"
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span>Find Exchange Matches</span>
            </button>
          </div>

          {/* Wishlist Reminder */}
          <div className="p-3 bg-gold-50 rounded-lg border border-gold-200">
            <p className="text-sm text-gold-700">
              💡 <strong>Tip:</strong> Add books to your wishlist to get notified when they become available!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'seller') {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <Store className="h-5 w-5 text-secondary-600" />
          </div>
          <div>
            <h3 className="font-poppins font-semibold text-primary-700">Seller Dashboard</h3>
            <p className="text-sm text-neutral-600">Manage your book listings</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Seller Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gold-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-gold-700">KES 8,500</div>
              <div className="text-xs text-gold-600">Total Earned</div>
            </div>
            <div className="bg-secondary-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-secondary-700">15</div>
              <div className="text-xs text-secondary-600">Books Sold</div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Great Performance!</span>
            </div>
            <p className="text-sm text-green-700">
              Your books sell 40% faster than average in {user.location}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button 
              onClick={onListBook}
              className="w-full btn-primary text-sm py-2 flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>List a New Book</span>
            </button>
            <button className="w-full btn-secondary text-sm py-2">
              View My Listings
            </button>
          </div>

          {/* Progress to Next Badge */}
          <div className="p-3 bg-accent-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-accent-700">Power Seller Progress</span>
              <span className="text-xs text-accent-600">15/20 sales</span>
            </div>
            <div className="w-full bg-accent-200 rounded-full h-2">
              <div className="bg-accent-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-accent-600 mt-1">5 more sales to unlock featured listings!</p>
          </div>

          {/* Seller Tips */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              📸 <strong>Pro tip:</strong> Books with multiple photos sell 60% faster!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default dashboard for users without a specific role
  return (
    <div className="card">
      <h3 className="font-poppins font-semibold text-primary-700 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button 
          onClick={onListBook}
          className="w-full btn-primary"
        >
          List a Book
        </button>
        <button 
          onClick={onFindExchanges}
          className="w-full btn-secondary flex items-center justify-center space-x-2"
        >
          <ArrowRightLeft className="h-4 w-4" />
          <span>Find Exchange Matches</span>
        </button>
        <button 
          onClick={onBrowseBooks}
          className="w-full btn-secondary"
        >
          Browse Books
        </button>
      </div>
    </div>
  );
};