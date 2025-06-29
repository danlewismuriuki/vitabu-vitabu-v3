import React from 'react';
import { Camera, ArrowRightLeft, Heart, Users, DollarSign, CheckCircle } from 'lucide-react';

interface HowItWorksProps {
  onListBookClick?: () => void;
  onBrowseBooksClick?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onListBookClick, onBrowseBooksClick }) => {
  const steps = [
    {
      id: 1,
      icon: Camera,
      title: 'List your old books',
      description: 'Take photos and add details about books your child has outgrown',
      details: ['Quick 2-minute listing', 'Auto-suggest pricing', 'Multiple photos supported'],
      color: 'accent'
    },
    {
      id: 2,
      icon: ArrowRightLeft,
      title: 'Exchange with parents nearby',
      description: 'Connect with other parents in your area for book swaps or sales',
      details: ['Smart matching system', 'Safe meetup locations', 'In-app messaging'],
      color: 'secondary'
    },
    {
      id: 3,
      icon: Heart,
      title: 'Save money & help community',
      description: 'Get the books you need while helping other families save too',
      details: ['Save up to 70%', 'Build local connections', 'Reduce waste together'],
      color: 'gold'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'accent':
        return {
          bg: 'bg-accent-100',
          text: 'text-accent-600',
          border: 'border-accent-200',
          gradient: 'from-accent-500 to-accent-600'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-100',
          text: 'text-secondary-600',
          border: 'border-secondary-200',
          gradient: 'from-secondary-500 to-secondary-600'
        };
      case 'gold':
        return {
          bg: 'bg-gold-100',
          text: 'text-gold-600',
          border: 'border-gold-200',
          gradient: 'from-gold-500 to-gold-600'
        };
      default:
        return {
          bg: 'bg-neutral-100',
          text: 'text-neutral-600',
          border: 'border-neutral-200',
          gradient: 'from-neutral-500 to-neutral-600'
        };
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-primary-800 mb-4">
            How Vitabu Vitabu Works
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Join thousands of Kenyan parents who are already saving money and building stronger communities through book sharing
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const colors = getColorClasses(step.color);
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="relative">
                {/* Connection Line (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-neutral-300 to-transparent z-0 transform translate-x-4"></div>
                )}

                {/* Step Card */}
                <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-accent-200 group">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colors.gradient} text-white flex items-center justify-center font-bold text-sm shadow-lg`}>
                      {step.id}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-8 w-8 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-poppins font-bold text-primary-800">
                      {step.title}
                    </h3>
                    
                    <p className="text-neutral-600 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Feature List */}
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center space-x-2">
                          <CheckCircle className={`h-4 w-4 ${colors.text} flex-shrink-0`} />
                          <span className="text-sm text-neutral-600">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-accent-500 to-secondary-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-poppins font-bold mb-4">
              Ready to Start Saving?
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Join over 8,000 Kenyan parents who have already saved more than KES 2.3M on school books
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={onListBookClick}
                className="bg-white text-accent-600 hover:bg-neutral-100 font-bold px-8 py-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                List Your First Book
              </button>
              <button 
                onClick={onBrowseBooksClick}
                className="border-2 border-white text-white hover:bg-white hover:text-accent-600 font-bold px-8 py-4 rounded-lg transition-all duration-200"
              >
                Browse Available Books
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 mt-6 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>8,000+ happy parents</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>KES 2.3M+ saved</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>100% secure transactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};