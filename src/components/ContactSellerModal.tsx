import React, { useState } from 'react';
import { X, MessageCircle, BookOpen, Mail, Phone, Facebook, Chrome, Loader2, CheckCircle } from 'lucide-react';
import { Book } from '../types';

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  onAuthSuccess: (user: any) => void;
}

export const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  isOpen,
  onClose,
  book,
  onAuthSuccess
}) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'social' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleQuickAuth = async (method: 'facebook' | 'google') => {
    setIsLoading(true);
    
    // Simulate social auth
    setTimeout(() => {
      const mockUser = {
        id: Date.now().toString(),
        name: method === 'facebook' ? 'Mary Wanjiku' : 'Paul Mwangi',
        email: method === 'facebook' ? 'mary@facebook.com' : 'paul@gmail.com',
        authMethod: method
      };
      
      onAuthSuccess(mockUser);
      setIsLoading(false);
      setShowSuccess(true);
      
      // Auto-close and proceed to messaging
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 2000);
    }, 1500);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert('Please fill in required fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        authMethod: authMethod
      };
      
      onAuthSuccess(newUser);
      setIsLoading(false);
      setShowSuccess(true);
      
      // Auto-close and proceed to messaging
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-secondary-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-secondary-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-4">
              Welcome to Vitabu Vitabu! 🎉
            </h2>
            
            <p className="text-neutral-600 mb-4">
              Opening chat with {book.seller.name.split(' ')[0]}...
            </p>
            
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <h2 className="text-xl font-poppins font-bold text-primary-800">
                  Contact {book.seller.name.split(' ')[0]}
                </h2>
                <p className="text-sm text-neutral-600">
                  Quick registration to start messaging
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Book Preview */}
          <div className="bg-neutral-50 p-4 rounded-lg mb-6">
            <div className="flex items-center space-x-3">
              <img
                src={book.images[0]}
                alt={book.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-medium text-primary-800 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-neutral-600">Grade {book.grade} • {book.subject}</p>
                <p className="text-lg font-bold text-accent-600">KES {book.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {!authMethod ? (
            /* Method Selection */
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-poppins font-semibold text-primary-800 mb-2">
                  Choose how to register
                </h3>
                <p className="text-neutral-600">
                  Join 8,000+ Kenyan parents saving money on school books
                </p>
              </div>

              {/* Social Options */}
              <button
                onClick={() => handleQuickAuth('facebook')}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Facebook className="h-5 w-5" />
                )}
                <span>Continue with Facebook</span>
                <span className="text-xs bg-blue-500 px-2 py-1 rounded">Fastest</span>
              </button>

              <button
                onClick={() => handleQuickAuth('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700 font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Chrome className="h-5 w-5" />
                )}
                <span>Continue with Google</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">or register with</span>
                </div>
              </div>

              {/* Manual Registration Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAuthMethod('email')}
                  className="flex items-center justify-center space-x-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => setAuthMethod('phone')}
                  className="flex items-center justify-center space-x-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 text-center">
                  🛡️ <strong>Safe & Secure:</strong> We never share your contact details until you choose to exchange
                </p>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-poppins font-semibold text-primary-800">
                  {authMethod === 'email' ? 'Register with Email' : 'Register with Phone'}
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Mary Wanjiku"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  required
                />
              </div>

              {authMethod === 'email' ? (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Create Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-4 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-5 w-5" />
                    <span>Register & Contact {book.seller.name.split(' ')[0]}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod(null)}
                className="w-full text-neutral-600 hover:text-neutral-800 text-sm"
              >
                ← Choose different method
              </button>
            </form>
          )}

          {/* Benefits */}
          <div className="mt-6 bg-secondary-50 p-4 rounded-lg">
            <h4 className="font-medium text-secondary-700 mb-2">Why register?</h4>
            <div className="space-y-1 text-sm text-secondary-600">
              <p>✓ Direct messaging with {book.seller.name.split(' ')[0]}</p>
              <p>✓ Get notified of new books in your area</p>
              <p>✓ Build your reputation as a trusted parent</p>
              <p>✓ Access to exclusive exchange opportunities</p>
            </div>
          </div>

          {/* Terms */}
          <div className="text-center text-xs text-neutral-500 mt-4">
            By registering, you agree to our{" "}
            <a href="#" className="text-accent-600 hover:text-accent-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-accent-600 hover:text-accent-700">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};