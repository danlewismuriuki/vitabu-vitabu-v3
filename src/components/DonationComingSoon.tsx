import React, { useState } from 'react';
import { Heart, School, Users, Bell, CheckCircle, BookOpen, MapPin } from 'lucide-react';

export const DonationComingSoon: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call to save email for notifications
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');
  };

  if (isSubscribed) {
    return (
      <div className="card bg-gradient-to-br from-secondary-500 to-accent-500 text-white mb-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <CheckCircle className="h-8 w-8" />
            </div>
          </div>
          <h3 className="text-2xl font-poppins font-bold mb-2">
            🎉 You're on the list!
          </h3>
          <p className="text-lg opacity-90">
            We'll notify you as soon as book donations go live. Thank you for wanting to make a difference!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-secondary-50 to-accent-50 border-2 border-secondary-200 mb-8 relative overflow-hidden">
      {/* Coming Soon Badge */}
      <div className="absolute top-4 right-4">
        <div className="badge bg-accent-500 text-white font-bold px-4 py-2 text-sm">
          Coming Soon
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-secondary-100 rounded-full">
              <Heart className="h-8 w-8 text-secondary-600" />
            </div>
            <div>
              <h3 className="text-3xl font-poppins font-bold text-primary-800">
                📚 Donate Books to Schools
              </h3>
              <p className="text-lg text-secondary-600 font-medium">
                Direct impact. Real change.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-lg text-neutral-700 leading-relaxed">
              Soon you'll be able to support local schools directly by donating extra books. 
              Help an entire classroom, especially in remote and underserved areas — not just one parent.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <School className="h-5 w-5 text-secondary-600" />
                <div>
                  <p className="font-medium text-primary-700">Verified Schools</p>
                  <p className="text-sm text-neutral-600">Direct to classrooms</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <Users className="h-5 w-5 text-accent-600" />
                <div>
                  <p className="font-medium text-primary-700">Whole Classrooms</p>
                  <p className="text-sm text-neutral-600">Impact 30+ students</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <MapPin className="h-5 w-5 text-gold-600" />
                <div>
                  <p className="font-medium text-primary-700">📍 Remote & Underserved Focus</p>
                  <p className="text-sm text-neutral-600">Priority communities</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                <BookOpen className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium text-primary-700">No Middleman</p>
                  <p className="text-sm text-neutral-600">Direct impact</p>
                </div>
              </div>
            </div>

            {/* Notify Me Form */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-secondary-200">
              <h4 className="font-poppins font-semibold text-primary-700 mb-3">
                Be the first to know when it launches
              </h4>
              <form onSubmit={handleNotifyMe} className="space-y-3">
                <div className="flex space-x-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4" />
                        <span>Notify Me</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-neutral-500">
                  We'll send you one email when book donations go live. No spam, promise!
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative">
          <div className="bg-gradient-to-br from-secondary-100 to-accent-100 rounded-2xl p-8 text-center">
            <div className="space-y-6">
              {/* Impact Preview */}
              <div className="space-y-4">
                <h4 className="text-xl font-poppins font-bold text-primary-800">
                  Imagine the Impact
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-secondary-600">500+</div>
                    <div className="text-sm text-neutral-600">Schools Ready to Partner</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-accent-600">15,000+</div>
                    <div className="text-sm text-neutral-600">Students Who Could Benefit</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-gold-600">KES 2M+</div>
                    <div className="text-sm text-neutral-600">Potential Educational Value</div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-secondary-500">
                <p className="text-sm italic text-neutral-700 mb-2">
                  "We're building a direct donation system with schools. No middleman, just impact."
                </p>
                <p className="text-xs font-medium text-secondary-600">
                  — Vitabu Vitabu Team
                </p>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gold-200 rounded-full opacity-60 animate-bounce-subtle"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary-200 rounded-full opacity-60 animate-bounce-subtle" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="mt-8 pt-6 border-t border-secondary-200">
        <div className="text-center">
          <p className="text-lg font-medium text-primary-700 mb-2">
            🌟 Support whole classrooms, not just individuals
          </p>
          <p className="text-sm text-neutral-600">
            Your donated books will go directly to verified schools in need, especially in remote and underserved communities.
          </p>
        </div>
      </div>
    </div>
  );
};