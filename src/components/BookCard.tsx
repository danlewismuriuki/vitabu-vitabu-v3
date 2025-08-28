import React, { useState } from 'react';
import { Book } from '../types';
import { MapPin, Eye, Users, Clock, AlertCircle, ArrowRightLeft, Heart, Star, Shield } from 'lucide-react';
import { TrustBadge } from './TrustBadge';

interface BookCardProps {
  book: Book;
  onBookClick?: (book: Book) => void;
  onExchangeClick?: (book: Book) => void;
  showDistance?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onBookClick, 
  onExchangeClick,
  showDistance = true 
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

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
  
  // Mock distance calculation
  const getDistance = () => {
    const distances = ['1.2km', '2.5km', '3.8km', '5.1km', '7.3km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInWishlist(!isInWishlist);
    // In real app, this would save to wishlist
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // This would trigger login prompt if not logged in
    onBookClick?.(book);
  };

  return (
    <div 
      className="card cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
      onClick={() => onBookClick?.(book)}
    >
      {/* Wishlist Button - Always Visible */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
          isInWishlist 
            ? 'bg-red-100 text-red-600 shadow-md' 
            : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-red-600'
        }`}
      >
        <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
      </button>

      {/* Status badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
        {book.isFeatured && (
          <div className="badge bg-gold-500 text-white text-xs">
            ⭐ Featured
          </div>
        )}
        {book.isUrgent && (
          <div className="badge bg-red-500 text-white text-xs flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Urgent</span>
          </div>
        )}
        {book.availableForExchange && (
          <div className="badge bg-secondary-500 text-white text-xs flex items-center space-x-1">
            <ArrowRightLeft className="h-3 w-3" />
            <span>Exchange</span>
          </div>
        )}
      </div>

      {/* Savings badge */}
      <div className="absolute top-3 right-14 z-10">
        <div className="badge bg-accent-500 text-white text-sm font-bold">
          Save {savingsPercentage}%
        </div>
      </div>

      {/* Book image */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-neutral-100">
        <img
          src={book.images[0]}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Book details */}
      <div className="space-y-3">
        <div>
          <h3 className="font-poppins font-semibold text-primary-800 text-lg line-clamp-2 mb-1">
            {book.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-neutral-600">
            <span className="font-medium">Grade {book.grade}</span>
            <span>•</span>
            <span>Term {book.term}</span>
            <span>•</span>
            <span>{book.subject}</span>
          </div>
        </div>

        {/* Condition and price */}
        <div className="flex items-center justify-between">
          <div className={`badge text-xs ${getConditionColor(book.condition)}`}>
            {getConditionText(book.condition)}
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-accent-600">KES {book.price.toLocaleString()}</span>
              <span className="text-sm text-neutral-500 line-through">KES {book.originalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Exchange wishlist preview */}
        {book.availableForExchange && book.exchangeWishlist && book.exchangeWishlist.length > 0 && (
          <div className="p-2 bg-secondary-50 rounded-lg">
            <p className="text-xs text-secondary-600 mb-1">Looking to exchange for:</p>
            <div className="flex flex-wrap gap-1">
              {book.exchangeWishlist.slice(0, 2).map((item, index) => (
                <span key={index} className="text-xs bg-secondary-200 text-secondary-700 px-2 py-1 rounded">
                  {item}
                </span>
              ))}
              {book.exchangeWishlist.length > 2 && (
                <span className="text-xs text-secondary-600">
                  +{book.exchangeWishlist.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Seller info with trust indicators */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-accent-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-accent-700">
                {book.seller.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <p className="text-sm font-medium text-primary-700">{book.seller.name.split(' ')[0]} {book.seller.name.split(' ')[1]?.[0]}.</p>
                {book.seller.isVerified && (
                  <Shield className="h-3 w-3 text-secondary-600" />
                )}
              </div>
              <div className="flex items-center space-x-1 text-xs text-neutral-600">
                <Star className="h-3 w-3 text-gold-500" />
                <span>{book.seller.rating}</span>
                <span>•</span>
                <span>{book.seller.totalSales} sales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location and distance */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{book.location}</span>
            {showDistance && (
              <>
                <span>•</span>
                <span className="text-accent-600 font-medium">{getDistance()} away</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{book.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{book.interestedBuyers} interested</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button 
          className="w-full btn-primary text-sm py-3 mt-3"
          onClick={handleContactClick}
        >
          Contact {book.seller.name.split(' ')[0]}
        </button>

        {/* Interest indicator for popular books */}
        {book.interestedBuyers > 3 && (
          <div className="flex items-center space-x-2 p-2 bg-accent-50 rounded-lg mt-2">
            <Users className="h-4 w-4 text-accent-600" />
            <span className="text-sm text-accent-700 font-medium">
              {book.interestedBuyers} parents interested in this book!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};