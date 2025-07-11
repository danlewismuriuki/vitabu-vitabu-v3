import React, { useState } from 'react';
import { Book } from '../types';
import { ArrowLeft, MapPin, Phone, Mail, Truck, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface CheckoutPageProps {
  book: Book;
  currentUser: any;
  onBack: () => void;
  onOrderComplete: (orderDetails: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  book,
  currentUser,
  onBack,
  onOrderComplete
}) => {
  const [contactInfo, setContactInfo] = useState({
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    preferredContact: 'phone'
  });
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const deliveryCost = deliveryOption === 'delivery' ? 300 : 0;
  const totalCost = book.price + deliveryCost;

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!contactInfo.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?254[0-9]{9}$|^0[0-9]{9}$/.test(contactInfo.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
    }

    if (!contactInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (deliveryOption === 'delivery' && !deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderDetails = {
      id: `ORDER-${Date.now()}`,
      book,
      buyer: {
        name: currentUser.name,
        phone: contactInfo.phone,
        email: contactInfo.email,
        preferredContact: contactInfo.preferredContact
      },
      seller: book.seller,
      deliveryOption,
      deliveryAddress: deliveryOption === 'delivery' ? deliveryAddress : null,
      deliveryCost,
      totalCost,
      orderDate: new Date().toISOString(),
      status: 'confirmed'
    };

    onOrderComplete(orderDetails);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EBF2F7' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-neutral-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to book details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h1 className="text-2xl font-poppins font-bold text-primary-800 mb-6">
                Complete Your Purchase
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-poppins font-semibold text-primary-700 mb-4">
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          type="tel"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+254 7XX XXX XXX"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                            errors.phone ? 'border-red-500' : 'border-neutral-300'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@example.com"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                            errors.email ? 'border-red-500' : 'border-neutral-300'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="phone"
                          checked={contactInfo.preferredContact === 'phone'}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, preferredContact: e.target.value }))}
                          className="mr-2 text-accent-600 focus:ring-accent-500"
                        />
                        <span className="text-sm text-neutral-700">Phone/WhatsApp</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="email"
                          checked={contactInfo.preferredContact === 'email'}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, preferredContact: e.target.value }))}
                          className="mr-2 text-accent-600 focus:ring-accent-500"
                        />
                        <span className="text-sm text-neutral-700">Email</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Delivery Options */}
                <div>
                  <h3 className="text-lg font-poppins font-semibold text-primary-700 mb-4">
                    Delivery Options
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer">
                      <input
                        type="radio"
                        value="pickup"
                        checked={deliveryOption === 'pickup'}
                        onChange={(e) => setDeliveryOption(e.target.value as 'pickup' | 'delivery')}
                        className="mt-1 text-accent-600 focus:ring-accent-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-neutral-600" />
                          <span className="font-medium text-primary-700">Meet in Person (Recommended)</span>
                          <span className="text-sm bg-secondary-100 text-secondary-700 px-2 py-1 rounded">FREE</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          Arrange to meet the seller in a safe, public location in {book.location}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer">
                      <input
                        type="radio"
                        value="delivery"
                        checked={deliveryOption === 'delivery'}
                        onChange={(e) => setDeliveryOption(e.target.value as 'pickup' | 'delivery')}
                        className="mt-1 text-accent-600 focus:ring-accent-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-5 w-5 text-neutral-600" />
                          <span className="font-medium text-primary-700">Home Delivery</span>
                          <span className="text-sm bg-accent-100 text-accent-700 px-2 py-1 rounded">KES 300</span>
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">
                          Book will be delivered to your address within 1-3 business days
                        </p>
                      </div>
                    </label>
                  </div>

                  {deliveryOption === 'delivery' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter your full delivery address including landmarks..."
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                          errors.deliveryAddress ? 'border-red-500' : 'border-neutral-300'
                        }`}
                      />
                      {errors.deliveryAddress && (
                        <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn-primary text-lg py-4 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Confirm Purchase - KES {totalCost.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Book Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-poppins font-semibold text-primary-700 mb-4">
                Order Summary
              </h3>
              
              <div className="flex space-x-4 mb-4">
                <img
                  src={book.images[0]}
                  alt={book.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-primary-800 line-clamp-2">{book.title}</h4>
                  <p className="text-sm text-neutral-600">Grade {book.grade} • {book.subject}</p>
                  <p className="text-sm text-neutral-600">Condition: {book.condition}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Book Price:</span>
                  <span className="font-medium">KES {book.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Delivery:</span>
                  <span className="font-medium">
                    {deliveryOption === 'delivery' ? `KES ${deliveryCost}` : 'FREE'}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between">
                  <span className="font-semibold text-primary-700">Total:</span>
                  <span className="font-bold text-accent-600 text-lg">KES {totalCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
                <p className="text-sm text-secondary-700">
                  💰 <strong>You're saving KES {(book.originalPrice - book.price).toLocaleString()}</strong> compared to buying new!
                </p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-poppins font-semibold text-primary-700 mb-4">
                Seller Information
              </h3>
              
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-12 w-12 bg-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-accent-700">
                    {book.seller.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-primary-700">{book.seller.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <span>⭐ {book.seller.rating}/5.0</span>
                    <span>•</span>
                    <span>{book.seller.totalSales} sales</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-neutral-600 mb-3">
                <MapPin className="h-4 w-4" />
                <span>{book.seller.location}</span>
              </div>

              {book.seller.isVerified && (
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <Shield className="h-4 w-4" />
                  <span>Verified Seller</span>
                </div>
              )}
            </div>

            {/* Safety Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-poppins font-semibold text-blue-800 mb-3">
                🛡️ Safe Transaction Tips
              </h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p>✓ Meet in public, well-lit locations</p>
                <p>✓ Inspect the book before payment</p>
                <p>✓ Use mobile money for secure payments</p>
                <p>✓ No processing fees - keep it simple</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};