import React, { useState } from 'react';
import { Book } from '../types';
import { MapPin, Eye, Users, Clock, AlertCircle, ArrowRightLeft, Truck } from 'lucide-react';
import { TrustBadge } from './TrustBadge';
import { LocationPrompt } from './LocationPrompt';

interface BookCardProps {
  book: Book;
  onBookClick?: (book: Book) => void;
  onExchangeClick?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onBookClick, onExchangeClick }) => {
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [userLocation, setUserLocation] = useState<{county: string; area: string; landmark?: string} | null>(null);

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

  const getDeliveryEstimate = () => {
    if (!userLocation) return null;
    
    // Simple logic to estimate delivery based on location proximity
    const isSameArea = userLocation.area.toLowerCase() === book.location.toLowerCase();
    const isSameCounty = userLocation.county.toLowerCase() === book.location.split(',')[0]?.toLowerCase();
    
    if (isSameArea) {
      return { time: 'Same day', cost: 'KES 200', color: 'text-secondary-600' };
    } else if (isSameCounty) {
      return { time: '1-2 days', cost: 'KES 350', color: 'text-accent-600' };
    } else {
      return { time: '2-3 days', cost: 'KES 500', color: 'text-neutral-600' };
    }
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userLocation) {
      setShowLocationPrompt(true);
    } else {
      onBookClick?.(book);
    }
  };

  const handleLocationSet = (location: {county: string; area: string; landmark?: string}) => {
    setUserLocation(location);
    // After setting location, proceed with the book click
    onBookClick?.(book);
  };

  const deliveryInfo = getDeliveryEstimate();

  return (
    <>
      <div 
        className="card cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        onClick={() => onBookClick?.(book)}
      >
        {/* Urgent/Featured badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
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
              <span>Exchange OK</span>
            </div>
          )}
        </div>

        {/* Savings badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="badge bg-accent-500 text-white text-sm font-bold">
            Save {savingsPercentage}%
          </div>
        </div>

        {/* Book image */}
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-neutral-100">
          <img
            src={book.images[0]}
            alt={book.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
              <span>Grade {book.grade}</span>
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
                <span className="text-lg font-bold text-accent-600">KES {book.price}</span>
                <span className="text-sm text-neutral-500 line-through">KES {book.originalPrice}</span>
              </div>
            </div>
          </div>

          {/* Delivery estimate */}
          {deliveryInfo && (
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <div className="text-sm">
                  <span className={`font-medium ${deliveryInfo.color}`}>
                    Delivery: {deliveryInfo.time}
                  </span>
                  <span className="text-neutral-600 ml-2">({deliveryInfo.cost})</span>
                </div>
              </div>
            </div>
          )}

          {/* Exchange wishlist */}
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

          {/* Seller info */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-accent-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-accent-700">
                  {book.seller.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">{book.seller.name}</p>
                <div className="flex items-center space-x-1">
                  <div className="flex items-center space-x-1">
                    {book.seller.badges.slice(0, 2).map(badge => (
                      <TrustBadge key={badge.id} badge={badge} size="sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location and stats */}
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{book.location}</span>
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

          {/* Action buttons */}
          <div className="flex space-x-2 pt-2">
            <button 
              className="flex-1 btn-primary text-sm py-2"
              onClick={handleBuyNowClick}
            >
              Buy Now
            </button>
            {book.availableForExchange && (
              <button 
                className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onExchangeClick?.(book);
                }}
              >
                <ArrowRightLeft className="h-4 w-4" />
                <span>Exchange</span>
              </button>
            )}
          </div>

          {/* Urgency indicators */}
          {book.interestedBuyers > 3 && (
            <div className="flex items-center space-x-2 p-2 bg-accent-50 rounded-lg">
              <Users className="h-4 w-4 text-accent-600" />
              <span className="text-sm text-accent-700 font-medium">
                {book.interestedBuyers} people viewing this book!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Location Prompt Modal */}
      <LocationPrompt
        isOpen={showLocationPrompt}
        onClose={() => setShowLocationPrompt(false)}
        onLocationSet={handleLocationSet}
        title="Set Your Location for Delivery"
        description="We need your location to show delivery options and costs for this book."
      />
    </>
  );
};