import React from 'react';
import { CheckCircle, Phone, Mail, MapPin, Calendar, ArrowRight, Home } from 'lucide-react';

interface OrderSuccessPageProps {
  orderDetails: any;
  onBackToHome: () => void;
  onViewBooks: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  orderDetails,
  onBackToHome,
  onViewBooks
}) => {
  const { book, buyer, seller, deliveryOption, deliveryAddress, totalCost, id } = orderDetails;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EBF2F7' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-secondary-100 rounded-full">
              <CheckCircle className="h-16 w-16 text-secondary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-poppins font-bold text-primary-800 mb-2">
            🎉 Order Confirmed!
          </h1>
          <p className="text-lg text-neutral-600">
            Your order has been successfully placed. The seller will contact you soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-4">
                Order Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <Calendar className="h-4 w-4" />
                  <span>Order ID: {id}</span>
                </div>

                <div className="flex space-x-4 p-4 bg-neutral-50 rounded-lg">
                  <img
                    src={book.images[0]}
                    alt={book.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-800">{book.title}</h3>
                    <p className="text-sm text-neutral-600">Grade {book.grade} • {book.subject}</p>
                    <p className="text-sm text-neutral-600">Condition: {book.condition}</p>
                    <p className="text-lg font-bold text-accent-600 mt-1">KES {totalCost.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Book Price:</span>
                    <span>KES {book.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Delivery:</span>
                    <span>{deliveryOption === 'delivery' ? `KES ${totalCost - book.price}` : 'FREE'}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-2 flex justify-between font-semibold">
                    <span>Total Paid:</span>
                    <span className="text-accent-600">KES {totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-4">
                {deliveryOption === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
              </h2>
              
              {deliveryOption === 'delivery' ? (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-neutral-600 mt-1" />
                    <div>
                      <p className="font-medium text-primary-700">Delivery Address:</p>
                      <p className="text-neutral-600">{deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      📦 <strong>Expected Delivery:</strong> 1-3 business days<br/>
                      The seller will arrange delivery and contact you with tracking details.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-secondary-50 rounded-lg">
                    <p className="text-sm text-secondary-700">
                      🤝 <strong>Pickup Arrangement:</strong><br/>
                      The seller will contact you to arrange a safe meetup location in {book.location}.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Safety Tips:</strong><br/>
                      • Meet in public, well-lit places<br/>
                      • Bring a friend if possible<br/>
                      • Inspect the book before payment
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-4">
                Seller Contact
              </h2>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 bg-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-accent-700">
                    {seller.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-700">{seller.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <span>⭐ {seller.rating}/5.0</span>
                    <span>•</span>
                    <span>{seller.totalSales} sales</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-neutral-600 mb-3">
                  The seller will contact you using your preferred method:
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <Phone className="h-5 w-5 text-neutral-600" />
                    <div>
                      <p className="font-medium text-primary-700">Phone/WhatsApp</p>
                      <p className="text-sm text-neutral-600">{buyer.phone}</p>
                    </div>
                    {buyer.preferredContact === 'phone' && (
                      <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Preferred</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <Mail className="h-5 w-5 text-neutral-600" />
                    <div>
                      <p className="font-medium text-primary-700">Email</p>
                      <p className="text-sm text-neutral-600">{buyer.email}</p>
                    </div>
                    {buyer.preferredContact === 'email' && (
                      <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Preferred</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-4">
                What Happens Next?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-primary-700">Seller Notification</p>
                    <p className="text-sm text-neutral-600">The seller has been notified and will contact you within 24 hours.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-primary-700">Arrange Meeting/Delivery</p>
                    <p className="text-sm text-neutral-600">
                      {deliveryOption === 'delivery' 
                        ? 'Coordinate delivery details and timeline.'
                        : 'Agree on a safe, public meetup location and time.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-primary-700">Complete Transaction</p>
                    <p className="text-sm text-neutral-600">Inspect the book and complete payment using mobile money.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onViewBooks}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <span>Browse More Books</span>
                <ArrowRight className="h-5 w-5" />
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
        </div>

        {/* Confirmation Notice */}
        <div className="mt-8 bg-secondary-50 border border-secondary-200 rounded-xl p-6">
          <h3 className="text-lg font-poppins font-semibold text-secondary-800 mb-3">
            📧 Confirmation Sent
          </h3>
          <p className="text-secondary-700">
            Order confirmation has been sent to <strong>{buyer.email}</strong>
            {buyer.preferredContact === 'phone' && (
              <span> and via WhatsApp to <strong>{buyer.phone}</strong></span>
            )}. 
            Keep this information for your records.
          </p>
        </div>
      </div>
    </div>
  );
};