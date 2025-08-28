import React, { useState } from "react";
import {
  DollarSign,
  BookOpen,
  Plus,
  Star,
  ArrowRightLeft,
  Users,
  Heart,
  CheckCircle,
  Facebook,
  Shield,
  MapPin,
  Filter,
  Search,
} from "lucide-react";
import { BookCard } from "./BookCard";
import { SearchBar, SearchFilters } from "./SearchBar";
import { Book } from "../types";
import { mockBooks } from "../data/mockData";

interface HomePageProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  onBookClick?: (book: Book) => void;
  currentUser?: any;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  onBookClick,
  currentUser,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("Nairobi");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(mockBooks.slice(0, 8));

  const grades = ["PP1", "PP2", "Gr1", "Gr2", "Gr3", "Gr4", "Gr5", "Gr6", "Gr7", "Gr8", "Gr9"];
  const subjects = ["Mathematics", "English", "Kiswahili", "Science", "Social Studies"];
  const locations = ["Nairobi", "Mombasa", "Nakuru", "Kisumu", "Eldoret", "Thika"];

  const handleQuickFilter = (type: 'grade' | 'subject', value: string) => {
    if (type === 'grade') {
      setSelectedGrade(selectedGrade === value ? "" : value);
    } else {
      setSelectedSubject(selectedSubject === value ? "" : value);
    }
    
    // Apply filters immediately
    let filtered = mockBooks;
    const gradeToFilter = type === 'grade' ? (selectedGrade === value ? "" : value) : selectedGrade;
    const subjectToFilter = type === 'subject' ? (selectedSubject === value ? "" : value) : selectedSubject;
    
    if (gradeToFilter) {
      const gradeNum = gradeToFilter.replace(/[^0-9]/g, '');
      if (gradeNum) {
        filtered = filtered.filter(book => book.grade.toString() === gradeNum);
      }
    }
    
    if (subjectToFilter) {
      filtered = filtered.filter(book => book.subject === subjectToFilter);
    }
    
    setFilteredBooks(filtered.slice(0, 8));
  };

  const handleSearch = (query: string, filters: SearchFilters) => {
    onSearch?.(query, filters);
  };

  const handleBookClick = (book: Book) => {
    onBookClick?.(book);
  };

  const handleBrowseAll = () => {
    onSearch?.("", {});
  };

  return (
    <div className="min-h-screen bg-kitenge-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section - Above the Fold */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-poppins font-bold text-primary-800 mb-4 leading-tight">
            Find CBC School Books
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-6 max-w-3xl mx-auto">
            Browse thousands of books from Kenyan parents. No registration needed to explore.
          </p>

          {/* Location Selector */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <MapPin className="h-5 w-5 text-accent-600" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-lg font-medium text-primary-700 bg-white border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent-500"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar
              onSearch={handleSearch}
              onResultSelect={handleBookClick}
              placeholder="Search by grade, subject, or title..."
              showFilters={false}
              className="w-full"
            />
          </div>

          {/* Quick Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-neutral-600 mb-8">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-accent-600" />
              <span className="font-medium">8,247 books available</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-secondary-600" />
              <span className="font-medium">2,156 active parents</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gold-600" />
              <span className="font-medium">KES 2.3M+ saved</span>
            </div>
          </div>
        </div>

        {/* CBC Grade Filter Pills */}
        <div className="mb-6">
          <h3 className="text-lg font-poppins font-semibold text-primary-700 mb-3 text-center">
            Browse by Grade Level
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => handleQuickFilter('grade', grade)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedGrade === grade
                    ? 'bg-accent-500 text-white shadow-lg'
                    : 'bg-white text-primary-700 border border-neutral-300 hover:border-accent-400 hover:bg-accent-50'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="mb-8">
          <h3 className="text-lg font-poppins font-semibold text-primary-700 mb-3 text-center">
            Browse by Subject
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleQuickFilter('subject', subject)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedSubject === subject
                    ? 'bg-secondary-500 text-white shadow-lg'
                    : 'bg-white text-primary-700 border border-neutral-300 hover:border-secondary-400 hover:bg-secondary-50'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Books Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-primary-800">
                {selectedGrade || selectedSubject ? 'Filtered Books' : 'Available Books'}
              </h2>
              <p className="text-neutral-600">
                {selectedGrade && selectedSubject 
                  ? `${selectedSubject} books for ${selectedGrade} in ${selectedLocation}`
                  : selectedGrade 
                    ? `${selectedGrade} books in ${selectedLocation}`
                    : selectedSubject
                      ? `${selectedSubject} books in ${selectedLocation}`
                      : `Fresh listings from parents in ${selectedLocation}`
                }
              </p>
            </div>
            
            {(selectedGrade || selectedSubject) && (
              <button
                onClick={() => {
                  setSelectedGrade("");
                  setSelectedSubject("");
                  setFilteredBooks(mockBooks.slice(0, 8));
                }}
                className="text-accent-600 hover:text-accent-700 font-medium text-sm"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onBookClick={handleBookClick}
                onExchangeClick={(book) => console.log('Exchange clicked:', book)}
              />
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleBrowseAll}
              className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Browse All 2,847 Books →
            </button>
          </div>
        </section>

        {/* How It Works - Simplified */}
        <section className="mb-12">
          <div className="card bg-gradient-to-br from-neutral-50 to-white border-2 border-neutral-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-4">
                How Vitabu Vitabu Works
              </h2>
              <p className="text-lg text-neutral-600">
                Simple book exchanges between Kenyan parents
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-accent-600" />
                </div>
                <h3 className="font-poppins font-semibold text-primary-800 mb-2">
                  1. Browse Books
                </h3>
                <p className="text-neutral-600">
                  Find books by grade, subject, or location. No account needed to explore.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="h-8 w-8 text-secondary-600" />
                </div>
                <h3 className="font-poppins font-semibold text-primary-800 mb-2">
                  2. Contact Parents
                </h3>
                <p className="text-neutral-600">
                  Message book owners directly. Quick registration when you're ready.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-gold-600" />
                </div>
                <h3 className="font-poppins font-semibold text-primary-800 mb-2">
                  3. Meet & Exchange
                </h3>
                <p className="text-neutral-600">
                  Safe meetups in public places. Save money, help families.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Community Section */}
        <section className="mb-12">
          <div className="card bg-gradient-to-r from-secondary-50 to-accent-50 border-2 border-secondary-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-4">
                🇰🇪 Trusted by Kenyan Families
              </h2>
              <p className="text-lg text-neutral-600">
                Real parents helping real parents across Kenya
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Community Stats */}
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-secondary-600 mb-2">8,000+</div>
                <div className="text-neutral-600">Happy Parents</div>
                <div className="text-sm text-neutral-500 mt-1">across all 47 counties</div>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-gold-600 mb-2">KES 2.3M+</div>
                <div className="text-neutral-600">Total Saved</div>
                <div className="text-sm text-neutral-500 mt-1">by families like yours</div>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-accent-600 mb-2">15,000+</div>
                <div className="text-neutral-600">Books Reused</div>
                <div className="text-sm text-neutral-500 mt-1">keeping education affordable</div>
              </div>
            </div>

            {/* Parent Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="italic text-neutral-700 mb-4">
                  "I've saved over KES 15,000 this year! My children get the books they need, 
                  and I've made friends with other parents in Westlands."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-accent-700">MW</span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary-700">Mary Wanjiku</div>
                    <div className="text-sm text-neutral-500">Nairobi • Mother of 3</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="italic text-neutral-700 mb-4">
                  "The exchange system is brilliant! My son gets new books for each grade, 
                  and I help other families too. It's a win-win."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-secondary-700">SA</span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary-700">Susan Achieng</div>
                    <div className="text-sm text-neutral-500">Nakuru • Mother of 2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* M-Pesa Security */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-secondary-200">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-secondary-100 rounded-full">
                  <Shield className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
              <h3 className="font-poppins font-semibold text-primary-800 mb-2">
                Safe Transactions
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Meet in public places, use M-Pesa for secure payments
              </p>
              <div className="text-xs text-secondary-600 font-medium">
                ✓ Verified Parents ✓ Public Meetups
              </div>
            </div>

            {/* Facebook Community */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-blue-200">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Facebook className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-poppins font-semibold text-primary-800 mb-2">
                Join 5,000+ Parents
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Connect on Facebook for tips and deals
              </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Join Community
              </button>
            </div>

            {/* Local Focus */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gold-200">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gold-100 rounded-full">
                  <Heart className="h-6 w-6 text-gold-600" />
                </div>
              </div>
              <h3 className="font-poppins font-semibold text-primary-800 mb-2">
                Built for Kenya
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                CBC curriculum focus, local locations, Kenyan families
              </p>
              <div className="text-xs text-gold-600 font-medium">
                🇰🇪 Proudly Kenyan
              </div>
            </div>
          </div>
        </section>

        {/* Guest Wishlist Prompt */}
        {!currentUser && (
          <section className="mb-12">
            <div className="card bg-gradient-to-r from-accent-50 to-secondary-50 border-2 border-accent-200">
              <div className="text-center">
                <h3 className="text-xl font-poppins font-bold text-primary-800 mb-2">
                  💡 Can't find what you need?
                </h3>
                <p className="text-neutral-600 mb-4">
                  Add books to your wishlist and we'll notify you when they become available
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button className="btn-primary flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Create Free Wishlist</span>
                  </button>
                  <p className="text-sm text-neutral-500">
                    No registration required • Get notified instantly
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action for Sellers */}
        <section className="text-center">
          <div className="card bg-gradient-to-r from-accent-500 to-secondary-500 text-white">
            <h2 className="text-2xl font-poppins font-bold mb-4">
              Have Books Your Child Has Outgrown?
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Help other parents save money while earning some cash for yourself
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <button className="bg-white text-accent-600 hover:bg-neutral-100 font-bold px-8 py-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                List Your Books
              </button>
              <div className="text-sm opacity-80">
                📱 Takes 2 minutes • 📸 Just add photos • 💰 Set your price
              </div>
            </div>

            {/* Success Stories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm opacity-90">
              <div>
                <div className="font-bold">Mary W.</div>
                <div>Earned KES 8,500 last month</div>
              </div>
              <div>
                <div className="font-bold">Paul M.</div>
                <div>Helped 15 families save money</div>
              </div>
              <div>
                <div className="font-bold">Susan A.</div>
                <div>5-star seller rating</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};