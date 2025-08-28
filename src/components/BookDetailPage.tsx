import React, { useState } from 'react';
import { Book } from '../types';
import { 
  ArrowLeft, MapPin, Eye, Users, Clock, Star, Shield, ArrowRightLeft, 
  Heart, Share2, MessageCircle, Phone, Mail, CheckCircle, AlertTriangle,
  Navigation, Bus, Car
} from 'lucide-react';
import { TrustBadge } from './TrustBadge';
import { ContactSellerModal } from './ContactSellerModal';

interface BookDetailPageProps {
  book: Book;
  onBack: () => void;
  onExchangeClick?: (book: Book) => void;
  onBuyNow?: (book: Book) => void;
  onAddToCart?: (book: Book) => void;
  onAddToWishlist?: (book: Book) => void;
  currentUser?: any;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({ 
  book, 
  onBack, 
  onExchangeClick,
  onBuyNow,
  onAddToCart,
  onAddToWishlist,
  currentUser
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'like-new': return 'bg-secondary-100 text-secondary-700';
      case 'good': return 'bg-accent-100 text-accent-700';
      case 'fair': return 'bg-neutral-100 text-neutral-700';
      case 'writing-inside': return 'bg-gold-100 text-gold-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'like-new': return 'Like New';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      case 'writing-inside': return 'Has Writing';
      default: return condition;
    }
  };

  const savingsPercentage = Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
  const daysListed = Math.floor((Date.now() - new Date(book.listedDate).getTime()) / (1000 * 60 * 60 * 24));

  const handleContactSeller = () => {
    if (!currentUser) {
      setShowContactModal(true);
    } else {
      // Direct to messaging
      console.log('Opening chat with seller');
    }
  };

  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
    onAddToWishlist?.(book);
  };

  const getTransportOptions = () => {
    return [
      { type: 'Matatu', description: 'Easy matatu access from CBD', icon: Bus },
      { type: 'Boda', description: 'Boda-friendly location', icon: Navigation },
      { type: 'Car', description: 'Parking available nearby', icon: Car }
    ];
  };

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: '#EBF2F7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-neutral-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to books</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src={book.images[selectedImageIndex]}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {book.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {book.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-accent-500' : 'border-neutral-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${book.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              {/* Title and Basic Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-poppins font-bold text-primary-800 leading-tight mb-2">
                      {book.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-neutral-600 mb-3">
                      <span className="font-medium">Grade {book.grade}</span>
                      <span>•</span>
                      <span>Term {book.term}</span>
                      <span>•</span>
                      <span>{book.subject}</span>
                    </div>
                    <div className="text-sm text-neutral-500">
                      Listed {daysListed} day{daysListed !== 1 ? 's' : ''} ago
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      className={`p-2 rounded-full transition-colors ${
                        isInWishlist 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'hover:bg-neutral-100 text-neutral-600'
                      }`}
                      onClick={handleAddToWishlist}
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-neutral-100">
                      <Share2 className="h-5 w-5 text-neutral-600" />
                    </button>
                  </div>
                </div>

                {/* Condition and Exchange Status */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className={`badge ${getConditionColor(book.condition)}`}>
                    {getConditionText(book.condition)}
                  </div>
                  {book.availableForExchange && (
                    <div className="badge bg-secondary-100 text-secondary-700">
                      <ArrowRightLeft className="h-3 w-3 mr-1" />
                      Available for Exchange
                    </div>
                  )}
                  {book.isFeatured && (
                    <div className="badge bg-gold-100 text-gold-700">
                      ⭐ Featured
                    </div>
                  )}
                </div>
              </div>

              {/* Price and Savings */}
              <div className="card bg-accent-50 border border-accent-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-3xl font-bold text-accent-600">KES {book.price.toLocaleString()}</span>
                      <span className="text-lg text-neutral-500 line-through">KES {book.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="badge bg-secondary-500 text-white font-bold">
                        Save {savingsPercentage}% (KES {(book.originalPrice - book.price).toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-accent-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="h-4 w-4 text-neutral-600" />
                    </div>
                    <div className="font-semibold text-primary-800">{book.views}</div>
                    <div className="text-xs text-neutral-600">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-neutral-600" />
                    </div>
                    <div className="font-semibold text-primary-800">{book.interestedBuyers}</div>
                    <div className="text-xs text-neutral-600">Interested</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-neutral-600" />
                    </div>
                    <div className="font-semibold text-primary-800">{daysListed}d</div>
                    <div className="text-xs text-neutral-600">Listed</div>
                  </div>
                </div>
              </div>

              {/* Exchange Wishlist */}
              {book.availableForExchange && book.exchangeWishlist && book.exchangeWishlist.length > 0 && (
                <div className="card bg-secondary-50 border border-secondary-200">
                  <h3 className="font-poppins font-semibold text-secondary-700 mb-3 flex items-center space-x-2">
                    <ArrowRightLeft className="h-5 w-5" />
                    <span>Available for Exchange</span>
                  </h3>
                  <p className="text-sm text-secondary-600 mb-3">
                    {book.seller.name.split(' ')[0]} is looking to exchange for:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {book.exchangeWishlist.map((item, index) => (
                      <span key={index} className="badge bg-secondary-200 text-secondary-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="card">
                <h3 className="font-poppins font-semibold text-primary-700 mb-3">About This Book</h3>
                <p className="text-neutral-700 leading-relaxed">{book.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleContactSeller}
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Contact {book.seller.name.split(' ')[0]}</span>
                </button>
                
                {book.availableForExchange && (
                  <button 
                    onClick={() => onExchangeClick?.(book)}
                    className="w-full btn-secondary text-lg py-4 flex items-center justify-center space-x-2"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                    <span>Propose Exchange</span>
                  </button>
                )}

                {/* Guest Wishlist */}
                {!currentUser && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 mb-2">
                      💡 <strong>Not ready to contact yet?</strong> Add to your wishlist and we'll notify you of similar books.
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Add to Wishlist (No registration needed) →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="mt-12">
            <div className="card">
              <h2 className="text-xl font-poppins font-bold text-primary-800 mb-6">About the Seller</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Seller Profile */}
                <div>
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="h-16 w-16 bg-accent-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold text-accent-700">
                        {book.seller.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-primary-700">{book.seller.name}</h3>
                        {book.seller.isVerified && (
                          <div className="flex items-center space-x-1 bg-secondary-100 px-2 py-1 rounded-full">
                            <Shield className="h-4 w-4 text-secondary-600" />
                            <span className="text-xs text-secondary-700 font-medium">Verified Parent</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-gold-500" />
                          <span className="font-medium">{book.seller.rating}/5.0</span>
                        </div>
                        <span>•</span>
                        <span>{book.seller.totalSales} successful exchanges</span>
                        <span>•</span>
                        <span className="text-secondary-600 font-medium">Usually responds in 2hrs</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-neutral-600 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{book.seller.location}</span>
                        <span>•</span>
                        <span className="text-accent-600 font-medium">2.3km away</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {book.seller.badges.slice(0, 3).map(badge => (
                          <TrustBadge key={badge.id} badge={badge} size="sm" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-sm text-neutral-600">
                      <strong>Member since:</strong> {new Date(book.seller.joinedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">
                      <strong>Last active:</strong> Active yesterday
                    </p>
                  </div>
                </div>

                {/* Transportation & Meeting Info */}
                <div className="space-y-4">
                  <h4 className="font-poppins font-semibold text-primary-700">Transportation & Meeting</h4>
                  
                  <div className="space-y-3">
                    {getTransportOptions().map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800">{option.type}</p>
                            <p className="text-sm text-blue-600">{option.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Safe Meeting Tips */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-2">🛡️ Safe Meeting Tips</h5>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>✓ Meet at Westgate Mall food court (suggested)</p>
                      <p>✓ Daytime meetings preferred</p>
                      <p>✓ Inspect book before payment</p>
                      <p>✓ Use M-Pesa for secure payment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interest Indicators */}
          {book.interestedBuyers > 3 && (
            <div className="mt-8">
              <div className="card bg-accent-50 border border-accent-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-accent-600" />
                  <div>
                    <p className="font-medium text-accent-700">
                      High Interest Book!
                    </p>
                    <p className="text-sm text-accent-600">
                      {book.interestedBuyers} parents are interested in this book. Contact {book.seller.name.split(' ')[0]} soon!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Similar Books */}
          <div className="mt-12">
            <h2 className="text-xl font-poppins font-bold text-primary-800 mb-6">
              Other Grade {book.grade} {book.subject} Books in {book.location}
            </h2>
            <div className="text-center py-8 text-neutral-500">
              <p>Similar books will be shown here based on grade, subject, and location.</p>
              <button className="btn-secondary mt-4">
                Browse All Grade {book.grade} Books
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      <ContactSellerModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        book={book}
        onAuthSuccess={(user) => {
          console.log('User authenticated:', user);
          setShowContactModal(false);
          // Proceed with contact
        }}
      />
    </>
  );
};