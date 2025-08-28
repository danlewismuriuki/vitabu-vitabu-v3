import React, { useState } from 'react';
import { CheckCircle, Star, Share2, BookOpen, Users, DollarSign, ArrowRight, Heart, Home } from 'lucide-react';
import { Book, User } from '../types';

interface ExchangeConfirmationPageProps {
  exchangedBook: Book;
  exchangePartner: User;
  currentUser: User;
  onBackToHome: () => void;
  onBrowseMore: () => void;
  onListBooks: () => void;
}

export const ExchangeConfirmationPage: React.FC<ExchangeConfirmationPageProps> = ({
  exchangedBook,
  exchangePartner,
  currentUser,
  onBackToHome,
  onBrowseMore,
  onListBooks
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hasLeftReview, setHasLeftReview] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const savings = exchangedBook.originalPrice - exchangedBook.price;
  const exchangeId = `EX-${Date.now()}`;

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setHasLeftReview(true);
    console.log('Review submitted:', { rating, review, exchangePartner: exchangePartner.id });
  };

  const handleShare = (platform: string) => {
    const shareText = `I just saved KES ${savings.toLocaleString()} on school books with Vitabu Vitabu! 📚💰 Real parents helping real parents. #VitabuVitabu #SaveMoney`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}&quote=${encodeURIComponent(shareText)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(shareText);
        alert('Copied to clipboard!');
        break;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EBF2F7' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-6 bg-secondary-100 rounded-full animate-bounce-subtle">
              <CheckCircle className="h-16 w-16 text-secondary-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-poppins font-bold text-primary-800 mb-4">
            🎉 Exchange Successful!
          </h1>
          
          <p className="text-xl text-neutral-600 mb-2">
            You saved approximately <span className="font-bold text-secondary-600">KES {savings.toLocaleString()}</span> on this book
          </p>
          
          <p className="text-lg text-neutral-600">
            Exchange completed with {exchangePartner.name}
          </p>
        </div>

        {/* Exchange Summary */}
        <div className="card mb-8">
          <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-6">
            Exchange Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-accent-50 rounded-lg">
                <img
                  src={exchangedBook.images[0]}
                  alt={exchangedBook.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-primary-800">{exchangedBook.title}</h3>
                  <p className="text-sm text-neutral-600">Grade {exchangedBook.grade} • {exchangedBook.subject}</p>
                  <p className="text-sm text-neutral-600">Condition: {exchangedBook.condition}</p>
                  <p className="text-lg font-bold text-accent-600">Worth KES {exchangedBook.originalPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Exchange ID:</span>
                  <span className="font-mono text-primary-700">{exchangeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Location:</span>
                  <span>{exchangedBook.location}</span>
                </div>
              </div>
            </div>

            {/* Exchange Partner */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg">
                <div className="h-16 w-16 bg-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-accent-700">
                    {exchangePartner.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800">{exchangePartner.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <span>⭐ {exchangePartner.rating}/5.0</span>
                    <span>•</span>
                    <span>{exchangePartner.totalExchanges} exchanges</span>
                  </div>
                  <p className="text-sm text-secondary-600 font-medium">Verified Parent</p>
                </div>
              </div>

              {/* Leave Review */}
              {!hasLeftReview ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-primary-700">Rate your experience with {exchangePartner.name.split(' ')[0]}</h4>
                  
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 ${star <= rating ? 'text-gold-500' : 'text-neutral-300'}`}
                      >
                        <Star className={`h-6 w-6 ${star <= rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience (optional)"
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500"
                  />

                  <button
                    onClick={handleSubmitReview}
                    disabled={rating === 0}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    Submit Review
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 font-medium">Thank you for your review!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Community Impact */}
        <div className="card bg-gradient-to-r from-secondary-500 to-accent-500 text-white mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-poppins font-bold mb-4">
              🌟 You're Making a Difference!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-3xl font-bold mb-2">KES {savings.toLocaleString()}</div>
                <div className="text-lg opacity-90">You Saved</div>
                <div className="text-sm opacity-75">vs buying new</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">8,248</div>
                <div className="text-lg opacity-90">Parents Helped</div>
                <div className="text-sm opacity-75">in your community</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">KES 2.3M+</div>
                <div className="text-lg opacity-90">Total Saved</div>
                <div className="text-sm opacity-75">by families like yours</div>
              </div>
            </div>

            <p className="text-lg opacity-90">
              You're now part of a community of parents building stronger, more affordable education for all Kenyan children.
            </p>
          </div>
        </div>

        {/* Share Your Success */}
        <div className="card mb-8">
          <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-4">
            Share Your Success
          </h2>
          
          <p className="text-neutral-600 mb-6">
            Help other parents discover how they can save money on school books too!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <span>📱</span>
              <span>Share on WhatsApp</span>
            </button>
            
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <span>📘</span>
              <span>Share on Facebook</span>
            </button>
            
            <button
              onClick={() => handleShare('copy')}
              className="flex items-center justify-center space-x-2 bg-neutral-600 hover:bg-neutral-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-poppins font-semibold text-primary-700 mb-4">
              What's Next?
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={onBrowseMore}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <BookOpen className="h-5 w-5" />
                <span>Browse More Books</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button
                onClick={onListBooks}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>List Books You Don't Need</span>
              </button>
              
              <button
                onClick={onBackToHome}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Home className="h-5 w-5" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>

          <div className="card bg-gold-50 border border-gold-200">
            <h3 className="text-lg font-poppins font-semibold text-gold-700 mb-4">
              🏆 Keep Building Your Reputation
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gold-600">Exchanges completed:</span>
                <span className="font-bold text-gold-700">{(currentUser.totalExchanges || 0) + 1}</span>
              </div>
              
              <div className="w-full bg-gold-200 rounded-full h-2">
                <div 
                  className="bg-gold-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(((currentUser.totalExchanges || 0) + 1) / 10 * 100, 100)}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gold-600">
                {10 - ((currentUser.totalExchanges || 0) + 1)} more exchanges to earn "Exchange Master" badge
              </p>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm text-gold-700">
                💡 <strong>Tip:</strong> List books your child has outgrown to help more families and earn trust badges!
              </p>
            </div>
          </div>
        </div>

        {/* Community Stats Update */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md">
            <Users className="h-5 w-5 text-secondary-600" />
            <span className="text-secondary-700 font-medium">
              You're now one of 8,248 parents building stronger communities
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};