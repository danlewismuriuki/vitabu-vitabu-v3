import React, { useState } from 'react';
import { BookOpen, Facebook, Mail, MessageCircle, Heart, Users, DollarSign, School, ChevronDown, ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    setNewsletterEmail('');
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Mock live counters - in real app these would come from API
  const communityStats = {
    booksReused: 15234,
    kesSaved: 2300000,
    schoolsReached: 127
  };

  return (
    <footer className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white relative overflow-hidden">
      {/* Maasai Pattern Divider */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent-500 via-gold-500 to-secondary-500"></div>
      <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-accent-500 to-secondary-500 opacity-60"></div>
      
      {/* Woven Texture Background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent-500 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-poppins font-bold">Vitabu Vitabu</h3>
                <p className="text-sm text-neutral-300">Real Parents. Real Savings.</p>
              </div>
            </div>
            
            <p className="text-neutral-300 leading-relaxed">
              Real parents. Real savings. Real books. Built for Kenya.
            </p>
            
            <p className="text-sm text-neutral-400">
              Connecting Kenyan families to save money on school books while building stronger communities.
            </p>

            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-poppins font-semibold text-neutral-200">Connect With Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group">
                  <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors group">
                  <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" className="p-3 bg-neutral-600 hover:bg-neutral-700 rounded-lg transition-colors group">
                  <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
              <p className="text-xs text-neutral-400">
                Join thousands of Kenyan parents on Facebook
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-poppins font-semibold text-neutral-200 border-b border-neutral-600 pb-2">
              Quick Links
            </h4>
            <div className="space-y-3">
              {[
                'Browse Books',
                'Start Exchange',
                'List Your Book',
                'Track Progress',
                'Sign In'
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-neutral-300 hover:text-accent-400 transition-colors hover:translate-x-1 transform duration-200"
                >
                  {link}
                </a>
              ))}
              
              {/* Special Donate Button */}
              <a
                href="#"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Heart className="h-4 w-4" />
                <span>Donate to Schools</span>
              </a>
            </div>
          </div>

          {/* Community Impact */}
          <div className="space-y-6">
            <h4 className="text-lg font-poppins font-semibold text-neutral-200 border-b border-neutral-600 pb-2">
              Community Impact
            </h4>
            <div className="space-y-4">
              <div className="bg-primary-600/50 p-4 rounded-lg border border-primary-500">
                <div className="flex items-center space-x-3 mb-2">
                  <BookOpen className="h-5 w-5 text-accent-400" />
                  <span className="text-sm text-neutral-300">Books Reused</span>
                </div>
                <div className="text-2xl font-bold text-accent-400">
                  {communityStats.booksReused.toLocaleString()}
                </div>
              </div>

              <div className="bg-primary-600/50 p-4 rounded-lg border border-primary-500">
                <div className="flex items-center space-x-3 mb-2">
                  <DollarSign className="h-5 w-5 text-secondary-400" />
                  <span className="text-sm text-neutral-300">KES Saved</span>
                </div>
                <div className="text-2xl font-bold text-secondary-400">
                  {(communityStats.kesSaved / 1000000).toFixed(1)}M
                </div>
              </div>

              <div className="bg-primary-600/50 p-4 rounded-lg border border-primary-500">
                <div className="flex items-center space-x-3 mb-2">
                  <School className="h-5 w-5 text-gold-400" />
                  <span className="text-sm text-neutral-300">Schools Reached</span>
                </div>
                <div className="text-2xl font-bold text-gold-400">
                  {communityStats.schoolsReached}
                </div>
              </div>
            </div>
            
            <div className="text-xs text-neutral-400 italic">
              Updated live • Building stronger communities together
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-poppins font-semibold text-neutral-200 border-b border-neutral-600 pb-2">
              Stay Updated
            </h4>
            
            {isSubscribed ? (
              <div className="bg-secondary-500/20 border border-secondary-400 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-5 w-5 text-secondary-400" />
                  <span className="font-medium text-secondary-300">Thank you!</span>
                </div>
                <p className="text-sm text-neutral-300">
                  You'll get the best book deals & donation news. No spam!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-neutral-300 text-sm">
                  Get book deals & donation news. No spam, promise!
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-primary-600 border border-primary-500 rounded-lg text-white placeholder-neutral-400 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            )}

            {/* Legal Links */}
            <div className="pt-4 border-t border-primary-600">
              <h5 className="font-medium text-neutral-300 mb-3">Legal & Trust</h5>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-neutral-400 hover:text-neutral-200 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="block text-neutral-400 hover:text-neutral-200 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-neutral-400 hover:text-neutral-200 transition-colors">
                  Escrow Protection
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Logo and Mission */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-accent-500 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-poppins font-bold">Vitabu Vitabu</h3>
                <p className="text-sm text-neutral-300">Real Parents. Real Savings.</p>
              </div>
            </div>
            <p className="text-neutral-300">
              Real parents. Real savings. Real books. Built for Kenya.
            </p>
          </div>

          {/* Community Impact - Always Visible on Mobile */}
          <div className="bg-primary-600/30 p-6 rounded-xl border border-primary-500">
            <h4 className="text-lg font-poppins font-semibold text-center mb-4">Community Impact</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-accent-400">{(communityStats.booksReused / 1000).toFixed(0)}K</div>
                <div className="text-xs text-neutral-300">Books Reused</div>
              </div>
              <div>
                <div className="text-xl font-bold text-secondary-400">{(communityStats.kesSaved / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-neutral-300">KES Saved</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gold-400">{communityStats.schoolsReached}</div>
                <div className="text-xs text-neutral-300">Schools</div>
              </div>
            </div>
          </div>

          {/* Collapsible Sections */}
          {[
            {
              id: 'links',
              title: 'Quick Links',
              content: (
                <div className="grid grid-cols-2 gap-3">
                  {['Browse Books', 'Start Exchange', 'List Your Book', 'Track Progress', 'Sign In'].map((link) => (
                    <a key={link} href="#" className="text-neutral-300 hover:text-accent-400 transition-colors text-sm">
                      {link}
                    </a>
                  ))}
                  <a
                    href="#"
                    className="col-span-2 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-secondary-500 to-accent-500 text-white font-medium px-4 py-2 rounded-lg text-sm"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Donate to Schools</span>
                  </a>
                </div>
              )
            },
            {
              id: 'newsletter',
              title: 'Newsletter',
              content: isSubscribed ? (
                <div className="bg-secondary-500/20 border border-secondary-400 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="h-5 w-5 text-secondary-400" />
                    <span className="font-medium text-secondary-300">Thank you!</span>
                  </div>
                  <p className="text-sm text-neutral-300">
                    You'll get the best book deals & donation news.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <p className="text-neutral-300 text-sm">Get book deals & donation news. No spam!</p>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-primary-600 border border-primary-500 rounded-lg text-white placeholder-neutral-400 focus:ring-2 focus:ring-accent-500"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )
            }
          ].map((section) => (
            <div key={section.id} className="border border-primary-600 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 bg-primary-600/30 hover:bg-primary-600/50 transition-colors"
              >
                <span className="font-poppins font-semibold">{section.title}</span>
                {expandedSection === section.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="p-4 bg-primary-700/20">
                  {section.content}
                </div>
              )}
            </div>
          ))}

          {/* Social Media */}
          <div className="text-center space-y-4">
            <h4 className="font-poppins font-semibold">Connect With Us</h4>
            <div className="flex justify-center space-x-4">
              <a href="#" className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-neutral-600 hover:bg-neutral-700 rounded-lg transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-neutral-400">
              Join thousands of Kenyan parents on Facebook
            </p>
          </div>

          {/* Legal Links */}
          <div className="text-center space-y-2 pt-4 border-t border-primary-600">
            <div className="flex justify-center space-x-4 text-sm">
              <a href="#" className="text-neutral-400 hover:text-neutral-200">Terms</a>
              <a href="#" className="text-neutral-400 hover:text-neutral-200">Privacy</a>
              <a href="#" className="text-neutral-400 hover:text-neutral-200">Escrow</a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-600 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-neutral-400">
              © 2024 Vitabu Vitabu. Built with ❤️ for Kenyan families.
            </p>
            <div className="flex items-center space-x-4 text-xs text-neutral-500">
              <span>🇰🇪 Proudly Kenyan</span>
              <span>•</span>
              <span>Secure payments via M-Pesa</span>
              <span>•</span>
              <span>Community-driven</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};