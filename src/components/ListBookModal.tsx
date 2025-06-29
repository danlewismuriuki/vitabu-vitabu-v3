import React, { useState, useEffect } from 'react';
import { X, Camera, Plus, MapPin, DollarSign, BookOpen, Upload, Loader2, Video, Play, RotateCcw, User, Mail, Phone, Shield, Facebook, CheckCircle } from 'lucide-react';
import { SmartBookInput } from './SmartBookInput';
import { 
  saveListingFormData, 
  getListingFormData, 
  clearListingFormData, 
  autoSaveListingForm,
  saveLastLocation,
  getLastLocation,
  saveUserPreferences,
  getUserPreferences,
  clearExpiredData
} from '../utils/localStorage';

interface ListBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookListed?: (book: any) => void;
  currentUser?: any;
  onAuthSuccess?: (user: any) => void;
}

export const ListBookModal: React.FC<ListBookModalProps> = ({ 
  isOpen, 
  onClose, 
  onBookListed,
  currentUser,
  onAuthSuccess 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);
  const [showInlineAuth, setShowInlineAuth] = useState(false);
  const [authMethod, setAuthMethod] = useState<'facebook' | 'phone' | 'email' | null>(null);
  const [authData, setAuthData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    otp: ''
  });
  const [authStep, setAuthStep] = useState<'method' | 'form' | 'verify'>('method');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [duplicateBookError, setDuplicateBookError] = useState('');
  const [bookData, setBookData] = useState({
    title: '',
    subject: '',
    grade: '',
    term: '',
    condition: '',
    originalPrice: '',
    askingPrice: '',
    description: '',
    images: [] as string[],
    flipThroughVideo: '',
    location: '',
    availableForExchange: false,
    exchangeWishlist: [] as string[]
  });

  // Load saved data on mount
  useEffect(() => {
    if (isOpen && !hasLoadedSavedData) {
      clearExpiredData();
      
      const savedData = getListingFormData();
      const lastLocation = getLastLocation();
      const userPrefs = getUserPreferences();
      
      if (Object.keys(savedData).length > 0) {
        setBookData(prev => ({
          ...prev,
          ...savedData,
          images: savedData.images || [],
          exchangeWishlist: savedData.exchangeWishlist || []
        }));
      }
      
      let locationToUse = '';
      if (currentUser?.location) {
        locationToUse = currentUser.location;
      } else if (lastLocation) {
        locationToUse = lastLocation;
      } else if (savedData.location) {
        locationToUse = savedData.location;
      }
      
      if (locationToUse) {
        setBookData(prev => ({ ...prev, location: locationToUse }));
      }
      
      if (userPrefs.exchangePreferences && userPrefs.exchangePreferences.length > 0) {
        setBookData(prev => ({ 
          ...prev, 
          exchangeWishlist: [...prev.exchangeWishlist, ...userPrefs.exchangePreferences].slice(0, 10)
        }));
      }
      
      setHasLoadedSavedData(true);
    }
  }, [isOpen, hasLoadedSavedData, currentUser]);

  // Auto-save form data
  useEffect(() => {
    if (hasLoadedSavedData && isOpen) {
      autoSaveListingForm(bookData);
      
      if (bookData.location) {
        saveLastLocation(bookData.location);
      }
      
      if (bookData.exchangeWishlist.length > 0) {
        saveUserPreferences({
          exchangePreferences: bookData.exchangeWishlist
        });
      }
    }
  }, [bookData, hasLoadedSavedData, isOpen]);

  if (!isOpen) return null;

  const subjects = [
    'Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 
    'Religious Education', 'Creative Arts', 'Physical Education'
  ];

  const conditions = [
    { value: 'like-new', label: 'Like New', description: 'Barely used, no marks' },
    { value: 'good', label: 'Good', description: 'Minor wear, fully readable' },
    { value: 'fair', label: 'Fair', description: 'Some wear but usable' },
    { value: 'writing-inside', label: 'Has Writing', description: 'Notes/writing inside' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setBookData(prev => ({ ...prev, [field]: value }));
  };

  const handleExchangeWishlistChange = (books: string[]) => {
    // Check for duplicates
    const newBooks = books.filter(book => !bookData.exchangeWishlist.includes(book));
    const duplicates = books.filter(book => bookData.exchangeWishlist.includes(book));
    
    if (duplicates.length > 0) {
      setDuplicateBookError(`You've already added "${duplicates[0]}" to your wishlist.`);
      setTimeout(() => setDuplicateBookError(''), 3000);
      return;
    }
    
    setDuplicateBookError('');
    handleInputChange('exchangeWishlist', books);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file, index) => 
        `https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?w=400&h=400&fit=crop&crop=center&auto=compress&cs=tinysrgb&${index}`
      );
      const updatedImages = [...bookData.images, ...newImages].slice(0, 5);
      handleInputChange('images', updatedImages);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('Video file must be under 20MB');
        return;
      }
      
      if (!file.type.includes('mp4') && !file.type.includes('mov')) {
        alert('Please upload an MP4 or MOV file');
        return;
      }
      
      const videoUrl = URL.createObjectURL(file);
      handleInputChange('flipThroughVideo', videoUrl);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = bookData.images.filter((_, i) => i !== index);
    handleInputChange('images', updatedImages);
  };

  const removeVideo = () => {
    handleInputChange('flipThroughVideo', '');
  };

  const calculateSuggestedPrice = () => {
    if (!bookData.originalPrice || !bookData.condition) return '';
    
    const original = parseFloat(bookData.originalPrice);
    let percentage = 0.5;
    
    switch (bookData.condition) {
      case 'like-new': percentage = 0.75; break;
      case 'good': percentage = 0.6; break;
      case 'fair': percentage = 0.4; break;
      case 'writing-inside': percentage = 0.3; break;
    }
    
    return Math.round(original * percentage).toString();
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      
      if (currentStep === 1 && !bookData.askingPrice) {
        const suggested = calculateSuggestedPrice();
        if (suggested) {
          handleInputChange('askingPrice', suggested);
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setShowInlineAuth(true);
      return;
    }

    await submitListing();
  };

  const handleFacebookAuth = async () => {
    setIsLoading(true);
    
    // Simulate Facebook OAuth flow
    setTimeout(async () => {
      const mockFacebookUser = {
        id: 'fb_123',
        name: 'Mary Wanjiku',
        email: 'mary@facebook.com',
        profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
        signupMethod: 'facebook',
        location: bookData.location,
        role: 'seller'
      };

      onAuthSuccess?.(mockFacebookUser);
      setIsLoading(false);
      setShowInlineAuth(false);
      
      // Auto-submit listing after successful auth
      setTimeout(() => {
        submitListing();
      }, 100);
    }, 2000);
  };

  const handlePhoneAuth = async () => {
    if (!authData.fullName || !authData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setAuthStep('verify');
      setIsLoading(false);
    }, 1500);
  };

  const handleOTPVerification = async () => {
    if (!authData.otp || authData.otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(async () => {
      const newUser = {
        id: Date.now().toString(),
        name: authData.fullName,
        phone: authData.phone,
        signupMethod: 'phone',
        location: bookData.location,
        role: 'seller'
      };

      onAuthSuccess?.(newUser);
      setIsLoading(false);
      setShowInlineAuth(false);
      
      // Auto-submit listing after successful auth
      setTimeout(() => {
        submitListing();
      }, 100);
    }, 1500);
  };

  const handleEmailAuth = async () => {
    if (!authData.fullName || !authData.email || !authData.password || authData.password !== authData.confirmPassword) {
      alert('Please fill in all fields correctly');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate email signup
    setTimeout(async () => {
      const newUser = {
        id: Date.now().toString(),
        name: authData.fullName,
        email: authData.email,
        signupMethod: 'email',
        location: bookData.location,
        role: 'seller'
      };

      onAuthSuccess?.(newUser);
      setIsLoading(false);
      setShowInlineAuth(false);
      
      // Auto-submit listing after successful auth
      setTimeout(() => {
        submitListing();
      }, 100);
    }, 1500);
  };

  const submitListing = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newBook = {
      id: Date.now().toString(),
      ...bookData,
      price: parseFloat(bookData.askingPrice),
      originalPrice: parseFloat(bookData.originalPrice),
      grade: parseInt(bookData.grade),
      term: parseInt(bookData.term),
      seller: currentUser || {
        id: 'current-user',
        name: authData.fullName || 'Anonymous User',
        email: authData.email,
        phone: authData.phone,
        rating: 5.0,
        totalSales: 0,
        totalExchanges: 0,
        badges: [],
        isVerified: false,
        location: bookData.location
      },
      listedDate: new Date().toISOString(),
      views: 0,
      interestedBuyers: 0,
      images: bookData.images.length > 0 ? bookData.images : ['https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg']
    };
    
    saveUserPreferences({
      location: bookData.location,
      preferredSubjects: [bookData.subject],
      commonGrades: [bookData.grade],
      exchangePreferences: bookData.exchangeWishlist
    });
    
    onBookListed?.(newBook);
    setIsLoading(false);
    
    // Show success screen
    setShowSuccessScreen(true);
    
    // Clear saved data
    clearListingFormData();
    
    // Auto-redirect after 2 seconds
    setTimeout(() => {
      onClose();
      resetForm();
      // In a real app, this would navigate to /dashboard/my-listings
      console.log('Redirecting to /dashboard/my-listings');
    }, 2000);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setHasLoadedSavedData(false);
    setShowInlineAuth(false);
    setShowSuccessScreen(false);
    setAuthMethod(null);
    setAuthStep('method');
    setDuplicateBookError('');
    setAuthData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      otp: ''
    });
    setBookData({
      title: '',
      subject: '',
      grade: '',
      term: '',
      condition: '',
      originalPrice: '',
      askingPrice: '',
      description: '',
      images: [],
      flipThroughVideo: '',
      location: '',
      availableForExchange: false,
      exchangeWishlist: []
    });
  };

  const handleClose = () => {
    if (hasLoadedSavedData && !showSuccessScreen) {
      autoSaveListingForm(bookData, 0);
    }
    onClose();
  };

  const clearSavedData = () => {
    clearListingFormData();
    resetForm();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookData.title && bookData.subject && bookData.grade && bookData.term && bookData.condition;
      case 2:
        return bookData.originalPrice && bookData.askingPrice && bookData.description;
      case 3:
        return bookData.location;
      default:
        return false;
    }
  };

  const shouldShowVideoUpload = () => {
    return bookData.condition === 'like-new' && !bookData.availableForExchange;
  };

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Success Screen
  if (showSuccessScreen) {
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
              🎉 Your book has been listed!
            </h2>
            
            <p className="text-neutral-600 mb-6">
              Redirecting you to your Dashboard...
            </p>
            
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-2">
          📚 Tell us about your book
        </h2>
        <p className="text-neutral-600">
          Basic information to help other parents find it
        </p>
        
        {hasLoadedSavedData && Object.keys(getListingFormData()).length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  We've restored your previous progress
                </span>
              </div>
              <button
                onClick={clearSavedData}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                Start fresh
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Book Title *
          </label>
          <input
            type="text"
            value={bookData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Primary Mathematics Grade 5"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Subject *
            </label>
            <select
              value={bookData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Grade *
            </label>
            <select
              value={bookData.grade}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            >
              <option value="">Select Grade</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Term *
          </label>
          <select
            value={bookData.term}
            onChange={(e) => handleInputChange('term', e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          >
            <option value="">Select Term</option>
            <option value="1">Term 1</option>
            <option value="2">Term 2</option>
            <option value="3">Term 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Condition *
          </label>
          <div className="space-y-2">
            {conditions.map(condition => (
              <label key={condition.value} className="flex items-start space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  value={condition.value}
                  checked={bookData.condition === condition.value}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="mt-1 text-accent-600 focus:ring-accent-500"
                />
                <div>
                  <div className="font-medium text-primary-700">{condition.label}</div>
                  <div className="text-sm text-neutral-600">{condition.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-2">
          💰 Pricing & Details
        </h2>
        <p className="text-neutral-600">
          Set your price and add photos to attract buyers
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Original Price (KES) *
            </label>
            <input
              type="number"
              value={bookData.originalPrice}
              onChange={(e) => handleInputChange('originalPrice', e.target.value)}
              placeholder="e.g., 1200"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Your Asking Price (KES) *
            </label>
            <div className="relative">
              <input
                type="number"
                value={bookData.askingPrice}
                onChange={(e) => handleInputChange('askingPrice', e.target.value)}
                placeholder="e.g., 650"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
              {bookData.originalPrice && bookData.askingPrice && (
                <div className="absolute -bottom-6 left-0 text-xs text-secondary-600">
                  {Math.round(((parseFloat(bookData.originalPrice) - parseFloat(bookData.askingPrice)) / parseFloat(bookData.originalPrice)) * 100)}% savings for buyer
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description *
          </label>
          <textarea
            value={bookData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the book's condition, why you're selling, any special notes..."
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Photos (Optional but recommended)
          </label>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-accent-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-600 mb-1">Click to upload photos</p>
                <p className="text-xs text-neutral-500">Up to 5 photos, JPG or PNG</p>
              </label>
            </div>

            {bookData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {bookData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Book photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {shouldShowVideoUpload() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3 mb-4">
              <Video className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-poppins font-semibold text-blue-800 mb-2">
                  Optional Flip-Through Video
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Give buyers more confidence by showing the inside pages. Just flip through your book in a short 5–10 second video.
                </p>
                
                {isMobile() && (
                  <div className="bg-blue-100 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-800 font-medium">
                      📱 Mobile tip: Record in portrait mode. Flip 3–5 pages slowly in good light.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!bookData.flipThroughVideo ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-white">
                  <input
                    type="file"
                    accept=".mp4,.mov,video/mp4,video/quicktime"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Video className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-blue-700 mb-1 font-medium">Upload Flip-Through Video</p>
                    <p className="text-xs text-blue-600">MP4 or MOV, max 20MB</p>
                  </label>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Play className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Here's how to do it</span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-32 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-blue-700">Demo: Flip-through video example</p>
                      <p className="text-xs text-blue-600">Click to see sample</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Flip-through video uploaded</span>
                  </div>
                  <button
                    onClick={removeVideo}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="bg-neutral-100 rounded-lg h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-sm text-neutral-700">Video ready for upload</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                💡 <strong>Why this helps:</strong> Books with flip-through videos get 3x more buyer interest and sell 60% faster!
              </p>
            </div>
          </div>
        )}

        <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={bookData.availableForExchange}
              onChange={(e) => handleInputChange('availableForExchange', e.target.checked)}
              className="mt-1 text-secondary-600 focus:ring-secondary-500"
            />
            <div>
              <div className="font-medium text-secondary-700">Also available for exchange</div>
              <div className="text-sm text-secondary-600">Allow other parents to propose book swaps</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-2">
          📍 Location & Exchange Preferences
        </h2>
        <p className="text-neutral-600">
          Help buyers find you and set your exchange preferences
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Your Location *
          </label>
          <input
            type="text"
            value={bookData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Kilimani, Nairobi"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
          <p className="text-xs text-neutral-500 mt-1">
            We only show your general area to other users for safety
          </p>
        </div>

        {bookData.availableForExchange && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-neutral-700">
                Books you'd like in exchange
              </label>
              <span className="text-xs text-neutral-500">
                Selected {bookData.exchangeWishlist.length} of 10 books
              </span>
            </div>
            
            {duplicateBookError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{duplicateBookError}</p>
              </div>
            )}
            
            <SmartBookInput
              value={bookData.exchangeWishlist}
              onChange={handleExchangeWishlistChange}
              placeholder="Search for CBC books you'd like to exchange for..."
              maxSelections={10}
              showQuickSuggestions={true}
            />
          </div>
        )}

        {/* Listing Summary */}
        <div className="bg-accent-50 p-6 rounded-lg border border-accent-200">
          <h3 className="font-poppins font-semibold text-accent-700 mb-4">Listing Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Book:</span>
              <span className="font-medium text-primary-700">{bookData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Grade & Subject:</span>
              <span className="font-medium text-primary-700">Grade {bookData.grade} {bookData.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Condition:</span>
              <span className="font-medium text-primary-700">
                {conditions.find(c => c.value === bookData.condition)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Price:</span>
              <span className="font-medium text-accent-600">KES {bookData.askingPrice}</span>
            </div>
            {bookData.originalPrice && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Buyer saves:</span>
                <span className="font-medium text-secondary-600">
                  KES {parseFloat(bookData.originalPrice) - parseFloat(bookData.askingPrice)} 
                  ({Math.round(((parseFloat(bookData.originalPrice) - parseFloat(bookData.askingPrice)) / parseFloat(bookData.originalPrice)) * 100)}%)
                </span>
              </div>
            )}
            {bookData.availableForExchange && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Exchange:</span>
                <span className="font-medium text-secondary-600">Available</span>
              </div>
            )}
            {bookData.exchangeWishlist.length > 0 && (
              <div className="pt-2 border-t border-accent-200">
                <span className="text-neutral-600 text-xs">Exchange wishlist:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {bookData.exchangeWishlist.map((book, index) => (
                    <span key={index} className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
                      {book}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {bookData.flipThroughVideo && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Flip-through video:</span>
                <span className="font-medium text-blue-600">✓ Included</span>
              </div>
            )}
          </div>
        </div>

        {/* Account Creation Section - Only show if not logged in */}
        {!currentUser && !showInlineAuth && (
          <div className="bg-gradient-to-br from-blue-50 to-accent-50 p-6 rounded-lg border border-blue-200">
            <div className="text-center mb-6">
              <h3 className="text-xl font-poppins font-bold text-primary-800 mb-2">
                Create an Account to List Your Book
              </h3>
              <p className="text-neutral-600">
                It takes 30 seconds. No spam — just safer exchanges and better matching.
              </p>
            </div>

            <div className="space-y-3">
              {/* Facebook Option */}
              <button
                onClick={() => {
                  setAuthMethod('facebook');
                  setShowInlineAuth(true);
                  setAuthStep('form');
                }}
                className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
                <span>Continue with Facebook</span>
                <span className="text-xs bg-blue-500 px-2 py-1 rounded">fastest</span>
              </button>

              {/* Phone Option */}
              <button
                onClick={() => {
                  setAuthMethod('phone');
                  setShowInlineAuth(true);
                  setAuthStep('form');
                }}
                className="w-full flex items-center justify-center space-x-3 bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200"
              >
                <Phone className="h-5 w-5" />
                <span>Sign Up with Phone Number</span>
                <span className="text-xs bg-secondary-500 px-2 py-1 rounded">with SMS verification</span>
              </button>

              {/* Email Option */}
              <button
                onClick={() => {
                  setAuthMethod('email');
                  setShowInlineAuth(true);
                  setAuthStep('form');
                }}
                className="w-full flex items-center justify-center space-x-3 bg-neutral-600 hover:bg-neutral-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200"
              >
                <Mail className="h-5 w-5" />
                <span>Sign Up with Email</span>
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-neutral-600">
                Already have an account? 
                <button className="text-accent-600 hover:text-accent-700 font-medium ml-1">
                  Log In instead
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Inline Auth Forms */}
        {showInlineAuth && !currentUser && (
          <div className="bg-white p-6 rounded-lg border-2 border-accent-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-poppins font-semibold text-primary-800">
                {authMethod === 'facebook' && 'Continue with Facebook'}
                {authMethod === 'phone' && 'Sign Up with Phone'}
                {authMethod === 'email' && 'Sign Up with Email'}
              </h3>
              <button
                onClick={() => setShowInlineAuth(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {authMethod === 'facebook' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Facebook className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-700">
                    We'll get your basic info from Facebook to create your account quickly.
                  </p>
                </div>
                <button
                  onClick={handleFacebookAuth}
                  disabled={isLoading}
                  className="w-full btn-primary"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    'Continue with Facebook'
                  )}
                </button>
              </div>
            )}

            {authMethod === 'phone' && (
              <div className="space-y-4">
                {authStep === 'form' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={authData.fullName}
                        onChange={(e) => setAuthData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={authData.phone}
                        onChange={(e) => setAuthData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      />
                    </div>
                    <button
                      onClick={handlePhoneAuth}
                      disabled={!authData.fullName || !authData.phone || isLoading}
                      className="w-full btn-primary disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sending Code...</span>
                        </div>
                      ) : (
                        'Send Verification Code'
                      )}
                    </button>
                  </>
                )}
                {authStep === 'verify' && (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-sm text-neutral-600">
                        We sent a verification code to {authData.phone}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Verification Code *
                      </label>
                      <input
                        type="text"
                        value={authData.otp}
                        onChange={(e) => setAuthData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        placeholder="Enter 6-digit code"
                        className="w-full px-4 py-3 text-center text-2xl font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                        maxLength={6}
                      />
                    </div>
                    <button
                      onClick={handleOTPVerification}
                      disabled={authData.otp.length !== 6 || isLoading}
                      className="w-full btn-primary disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        'Verify & Create Account'
                      )}
                    </button>
                  </>
                )}
              </div>
            )}

            {authMethod === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={authData.fullName}
                    onChange={(e) => setAuthData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={authData.email}
                    onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={authData.password}
                    onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={authData.confirmPassword}
                    onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
                <button
                  onClick={handleEmailAuth}
                  disabled={!authData.fullName || !authData.email || !authData.password || authData.password !== authData.confirmPassword || isLoading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account & List Book'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <h1 className="text-xl font-poppins font-bold text-primary-800">List Your Book</h1>
                <p className="text-sm text-neutral-600">Step {currentStep} of 3</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step <= currentStep ? 'bg-accent-500' : 'bg-neutral-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Book Info</span>
              <span>Pricing</span>
              <span>Location & Exchange</span>
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
            <button
              onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : handleClose()}
              className="btn-secondary"
            >
              {currentStep > 1 ? 'Back' : 'Cancel'}
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="btn-primary disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading}
                className="btn-primary disabled:opacity-50 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating Listing...</span>
                  </>
                ) : currentUser ? (
                  <>
                    <span>List My Book</span>
                    <DollarSign className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Create Account & List Book</span>
                    <DollarSign className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};