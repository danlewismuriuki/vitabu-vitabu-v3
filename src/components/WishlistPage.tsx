import React, { useState } from 'react';
import { Heart, X, Bell, BookOpen, MapPin, Mail, User, CheckCircle } from 'lucide-react';
import { Book } from '../types';

interface WishlistItem {
  id: string;
  book: Book;
  addedDate: string;
  alertActive: boolean;
}

interface WishlistPageProps {
  onBookClick?: (book: Book) => void;
  onSetupAlert?: (book: Book) => void;
  currentUser?: any;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onBookClick,
  onSetupAlert,
  currentUser
}) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    // Mock wishlist items for demo
  ]);
  const [showEmailPrompt, setShowEmailPrompt] = useState(!currentUser);
  const [guestEmail, setGuestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSetupGuestWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestEmail) return;
    
    setIsLoading(true);
    
    // Simulate API call to save guest email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowEmailPrompt(false);
    setIsLoading(false);
    
    // Show success message
    alert('✅ Wishlist saved! We\'ll email you when books become available.');
  };

  const handleToggleAlert = (itemId: string) => {
    setWishlistItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, alertActive: !item.alertActive }
          : item
      )
    );
  };

  if (showEmailPrompt && !currentUser) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#EBF2F7' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="card text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-accent-100 rounded-full">
                <Heart className="h-12 w-12 text-accent-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-poppins font-bold text-primary-800 mb-4">
              Save Your Wishlist
            </h1>
            
            <p className="text-lg text-neutral-600 mb-8">
              Enter your email to save books you're interested in and get notified when similar books become available.
            </p>

            <form onSubmit={handleSetupGuestWishlist} className="space-y-4 max-w-md mx-auto">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-lg"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !guestEmail}
                className="w-full btn-primary py-4 text-lg disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    <span>Save My Wishlist</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                🔔 <strong>No spam promise:</strong> We'll only email you when books matching your wishlist become available.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowEmailPrompt(false)}
                className="text-neutral-600 hover:text-neutral-800 text-sm"
              >
                Skip for now (wishlist won't be saved)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EBF2F7' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-8 w-8 text-accent-600" />
            <div>
              <h1 className="text-3xl font-poppins font-bold text-primary-800">
                Your Wishlist
              </h1>
              <p className="text-lg text-neutral-600">
                {wishlistItems.length} book{wishlistItems.length !== 1 ? 's' : ''} you're interested in
              </p>
            </div>
          </div>

          {/* Guest Status */}
          {!currentUser && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Guest Wishlist Active</p>
                  <p className="text-sm text-blue-600">
                    Saved to: {guestEmail} • 
                    <button className="ml-1 text-blue-700 hover:text-blue-800 font-medium">
                      Create account to manage better
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length > 0 ? (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="card">
                <div className="flex items-start space-x-4">
                  {/* Book Image */}
                  <img
                    src={item.book.images[0]}
                    alt={item.book.title}
                    className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onBookClick?.(item.book)}
                  />

                  {/* Book Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 
                          className="font-poppins font-semibold text-primary-800 text-lg cursor-pointer hover:text-accent-600 transition-colors"
                          onClick={() => onBookClick?.(item.book)}
                        >
                          {item.book.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-neutral-600 mb-2">
                          <span>Grade {item.book.grade}</span>
                          <span>•</span>
                          <span>{item.book.subject}</span>
                          <span>•</span>
                          <span>{item.book.condition}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.book.location}</span>
                          </div>
                          <span className="text-accent-600 font-medium">2.3km away</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xl font-bold text-accent-600">
                            KES {item.book.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-neutral-500 line-through">
                            KES {item.book.originalPrice.toLocaleString()}
                          </span>
                          <span className="badge bg-secondary-100 text-secondary-700 text-xs">
                            Save {Math.round(((item.book.originalPrice - item.book.price) / item.book.originalPrice) * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleAlert(item.id)}
                          className={`p-2 rounded-full transition-colors ${
                            item.alertActive
                              ? 'bg-accent-100 text-accent-600'
                              : 'text-neutral-400 hover:bg-neutral-100'
                          }`}
                          title={item.alertActive ? 'Alert active' : 'Set up alert'}
                        >
                          <Bell className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="p-2 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 bg-accent-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-accent-700">
                            {item.book.seller.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm text-primary-700">{item.book.seller.name.split(' ')[0]} {item.book.seller.name.split(' ')[1]?.[0]}.</span>
                        <span className="text-xs text-neutral-500">⭐ {item.book.seller.rating}</span>
                      </div>
                      
                      <button
                        onClick={() => onBookClick?.(item.book)}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        Contact Seller
                      </button>
                    </div>

                    {/* Alert Status */}
                    {item.alertActive && (
                      <div className="mt-3 p-2 bg-accent-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-accent-600" />
                          <span className="text-sm text-accent-700">
                            You'll be notified when similar books are available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Wishlist */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-poppins font-semibold text-primary-700 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-neutral-600 mb-6">
                Start browsing books and add ones you're interested in to your wishlist.
              </p>
              <button
                onClick={() => window.history.back()}
                className="btn-primary"
              >
                Browse Books
              </button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 card bg-secondary-50 border border-secondary-200">
            <h3 className="font-poppins font-semibold text-secondary-700 mb-4">
              Bulk Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary text-sm">
                Set alerts for all books
              </button>
              <button className="btn-secondary text-sm">
                Contact all sellers in Nairobi
              </button>
              <button className="btn-secondary text-sm">
                Share wishlist with family
              </button>
            </div>
          </div>
        )}

        {/* Smart Suggestions */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 card">
            <h3 className="font-poppins font-semibold text-primary-700 mb-4">
              💡 You might also like
            </h3>
            <p className="text-neutral-600 mb-4">
              Based on your wishlist, other parents with these books also have:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Grade 5 Science', 'Grade 5 English', 'Grade 6 Mathematics', 'Grade 4 Kiswahili'].map((suggestion, index) => (
                <button
                  key={index}
                  className="p-3 bg-accent-50 hover:bg-accent-100 rounded-lg text-sm text-accent-700 font-medium transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};