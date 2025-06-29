import React, { useState } from 'react';
import { Book } from '../types';
import { ArrowLeft, MapPin, Eye, Users, Clock, Star, Shield, ArrowRightLeft, Heart, Share2, MessageCircle } from 'lucide-react';
import { TrustBadge } from './TrustBadge';

interface BookDetailPageProps {
  book: Book;
  onBack: () => void;
  onExchangeClick?: (book: Book) => void;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({ 
  book, 
  onBack, 
  onExchangeClick 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);

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

  return (
    <div className="min-h-screen bg-kitenge-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-neutral-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to search</span>
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
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-poppins font-bold text-primary-800 leading-tight">
                  {book.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-full hover:bg-neutral-100">
                    <Heart className="h-5 w-5 text-neutral-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-neutral-100">
                    <Share2 className="h-5 w-5 text-neutral-600" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-neutral-600 mb-4">
                <span className="font-medium">Grade {book.grade}</span>
                <span>•</span>
                <span>Term {book.term}</span>
                <span>•</span>
                <span>{book.subject}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className={`badge ${getConditionColor(book.condition)}`}>
                  {getConditionText(book.condition)}
                </div>
                {book.isFeatured && (
                  <div className="badge bg-gold-100 text-gold-700">
                    ⭐ Featured
                  </div>
                )}
                {book.availableForExchange && (
                  <div className="badge bg-secondary-100 text-secondary-700">
                    <ArrowRightLeft className="h-3 w-3 mr-1" />
                    Available for Exchange
                  </div>
                )}
              </div>
            </div>

            {/* Price and Savings */}
            <div className="card bg-accent-50 border border-accent-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-accent-600">KES {book.price}</span>
                    <span className="text-lg text-neutral-500 line-through">KES {book.originalPrice}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="badge bg-secondary-500 text-white font-bold">
                      Save {savingsPercentage}% (KES {book.originalPrice - book.price})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Wishlist */}
            {book.availableForExchange && book.exchangeWishlist && book.exchangeWishlist.length > 0 && (
              <div className="card bg-secondary-50 border border-secondary-200">
                <h3 className="font-poppins font-semibold text-secondary-700 mb-3">
                  Owner is looking to exchange for:
                </h3>
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
              <h3 className="font-poppins font-semibold text-primary-700 mb-3">Description</h3>
              <p className="text-neutral-700 leading-relaxed">{book.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-center mb-1">
                  <Eye className="h-4 w-4 text-neutral-600" />
                </div>
                <div className="font-semibold text-primary-800">{book.views}</div>
                <div className="text-xs text-neutral-600">Views</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 text-neutral-600" />
                </div>
                <div className="font-semibold text-primary-800">{book.interestedBuyers}</div>
                <div className="text-xs text-neutral-600">Interested</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 text-neutral-600" />
                </div>
                <div className="font-semibold text-primary-800">
                  {Math.floor((Date.now() - new Date(book.listedDate).getTime()) / (1000 * 60 * 60 * 24))}d
                </div>
                <div className="text-xs text-neutral-600">Listed</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowContactInfo(true)}
                  className="flex-1 btn-primary text-lg py-4"
                >
                  Buy Now - KES {book.price}
                </button>
                {book.availableForExchange && (
                  <button 
                    onClick={() => onExchangeClick?.(book)}
                    className="flex-1 btn-secondary text-lg py-4 flex items-center justify-center space-x-2"
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                    <span>Propose Exchange</span>
                  </button>
                )}
              </div>
              
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Message Seller</span>
              </button>
            </div>

            {/* Contact Info Modal */}
            {showContactInfo && (
              <div className="card bg-secondary-50 border border-secondary-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-poppins font-semibold text-secondary-700">Contact Information</h3>
                  <button 
                    onClick={() => setShowContactInfo(false)}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Phone:</strong> +254 7XX XXX XXX</p>
                  <p><strong>Location:</strong> {book.location}</p>
                  <p className="text-secondary-600">
                    💡 <strong>Tip:</strong> Meet in a safe, public place for the exchange
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seller Information */}
        <div className="mt-12">
          <div className="card">
            <h2 className="text-xl font-poppins font-bold text-primary-800 mb-6">About the Seller</h2>
            
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-accent-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-accent-700">
                  {book.seller.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-primary-700">{book.seller.name}</h3>
                  {book.seller.isVerified && (
                    <Shield className="h-5 w-5 text-secondary-600" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-gold-500" />
                    <span>{book.seller.rating}/5.0</span>
                  </div>
                  <span>•</span>
                  <span>{book.seller.totalSales} sales</span>
                  <span>•</span>
                  <span>{book.seller.totalExchanges} exchanges</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{book.seller.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.seller.badges.map(badge => (
                    <TrustBadge key={badge.id} badge={badge} size="sm" />
                  ))}
                </div>
                
                <p className="text-sm text-neutral-600">
                  Member since {new Date(book.seller.joinedDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Books */}
        <div className="mt-12">
          <h2 className="text-xl font-poppins font-bold text-primary-800 mb-6">Similar Books</h2>
          <div className="text-center py-8 text-neutral-500">
            <p>Similar books will be shown here based on grade, subject, and location.</p>
          </div>
        </div>
      </div>
    </div>
  );
};