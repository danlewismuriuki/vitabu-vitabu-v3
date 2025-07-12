import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  MapPin,
  Eye,
  Users,
  Clock,
  Star,
  TrendingUp,
  Heart,
  Bell,
  ShoppingCart,
  Bookmark,
  Zap,
  Award,
  Target,
  ArrowRightLeft,
  DollarSign,
  BookOpen,
  Sparkles,
  X,
} from "lucide-react";
import { Book, User, ActivityFeedItem } from "../types";
import { BookCard } from "./BookCard";
import { SearchBar, SearchFilters } from "./SearchBar";
import { AuthButton } from "./AuthButton";
import { mockBooks } from "../data/mockData";

interface ListingDashboardPageProps {
  currentUser: User;
  onBookClick?: (book: Book) => void;
  onListBookClick?: () => void;
  onSearch?: (query: string, filters: SearchFilters) => void;
  onUserChange?: (user: any) => void;
}

export const ListingDashboardPage: React.FC<ListingDashboardPageProps> = ({
  currentUser,
  onBookClick,
  onListBookClick,
  onSearch,
  onUserChange,
}) => {
  const [searchResults, setSearchResults] = useState<Book[]>(mockBooks);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Community stats - would come from API in real app
  const [communityStats] = useState({
    userImpact: {
      familiesHelped: 3,
      totalSaved: 2400,
      booksListed: 5,
    },
    communityImpact: {
      totalSaved: 120000,
      location: "Nairobi",
      activeBuyers: 127,
      newListings: 23,
    },
  });

  const subjects = ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'Religious Education', 'Creative Arts'];
  const conditions = [
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'writing-inside', label: 'Has Writing' }
  ];

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery]);

  const applyFilters = () => {
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      let filtered = mockBooks.filter(book => {
        const matchesQuery = !searchQuery || 
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.seller.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesGrade = !filters.grade || book.grade === filters.grade;
        const matchesSubject = !filters.subject || book.subject === filters.subject;
        const matchesCondition = !filters.condition || book.condition === filters.condition;
        const matchesLocation = !filters.location || 
          book.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesExchange = filters.availableForExchange === undefined || 
          book.availableForExchange === filters.availableForExchange;

        return matchesQuery && matchesGrade && matchesSubject && matchesCondition && matchesLocation && matchesExchange;
      });

      // Apply sorting
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          switch (filters.sortBy) {
            case 'price':
              return a.price - b.price;
            case 'date':
              return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
            case 'popularity':
              return b.views - a.views;
            case 'savings':
              return ((b.originalPrice - b.price) / b.originalPrice) - ((a.originalPrice - a.price) / a.originalPrice);
            default:
              return 0;
          }
        });
      }

      setSearchResults(filtered);
      setIsLoading(false);
    }, 200);
  };

  const handleSearch = (query: string, searchFilters: SearchFilters) => {
    setSearchQuery(query);
    setFilters(searchFilters);
    onSearch?.(query, searchFilters);
  };

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === '' ? undefined : value
    }));
  };

  const removeFilter = (filterType: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterType];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== undefined).length;
  };

  const getFilterDisplayValue = (filterType: keyof SearchFilters, value: any) => {
    switch (filterType) {
      case 'grade':
        return `Grade ${value}`;
      case 'condition':
        return conditions.find(c => c.value === value)?.label || value;
      case 'availableForExchange':
        return 'Exchange Available';
      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EBF2F7' }}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-accent-500" />
              <div className="flex flex-col">
                <h1 className="font-poppins font-bold text-primary-700 text-lg leading-tight">
                  Vitabu Vitabu
                </h1>
                <p className="text-xs text-neutral-500 -mt-1">
                  Real Parents. Real Savings.
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar
                onSearch={handleSearch}
                onResultSelect={onBookClick}
                placeholder="Search for books by grade, subject, title..."
                showFilters={false}
                className="w-full"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full text-neutral-600 hover:text-primary-700 hover:bg-neutral-100">
                <Bookmark className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              <button className="relative p-2 rounded-full text-neutral-600 hover:text-primary-700 hover:bg-neutral-100">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </button>

              <button className="relative p-2 rounded-full text-neutral-600 hover:text-primary-700 hover:bg-neutral-100">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent-500"></span>
              </button>

              {/* Auth Button with Dropdown */}
              <AuthButton
                currentUser={currentUser}
                onAuthClick={() => {}} // Not needed since user is already logged in
                onLogout={async () => {
                  try {
                    const { logOut } = await import('../utils/firebaseAuth');
                    await logOut();
                    onUserChange?.(null);
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-poppins font-bold mb-2">
                    Welcome back, {currentUser.name}! 🎉
                  </h2>
                  <p className="text-lg opacity-90">
                    You've helped {communityStats.userImpact.familiesHelped} families save money this month
                  </p>
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={onListBookClick}
                  className="bg-white text-accent-600 hover:bg-neutral-100 font-bold px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  + List a Book
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Grade Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Grade</label>
              <select
                value={filters.grade || ''}
                onChange={(e) => handleFilterChange('grade', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">All Grades</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Subject</label>
              <select
                value={filters.subject || ''}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Condition</label>
              <select
                value={filters.condition || ''}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">Any Condition</option>
                {conditions.map(condition => (
                  <option key={condition.value} value={condition.value}>{condition.label}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Enter area..."
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>

            {/* Exchange Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Exchange</label>
              <select
                value={filters.availableForExchange === undefined ? '' : filters.availableForExchange.toString()}
                onChange={(e) => handleFilterChange('availableForExchange', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">All Books</option>
                <option value="true">Exchange Available</option>
                <option value="false">Sale Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-primary-700">Active Filters ({getActiveFilterCount()})</h3>
              <button
                onClick={clearAllFilters}
                className="text-sm text-accent-600 hover:text-accent-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value === undefined) return null;
                return (
                  <div
                    key={key}
                    className="inline-flex items-center space-x-2 bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{getFilterDisplayValue(key as keyof SearchFilters, value)}</span>
                    <button
                      onClick={() => removeFilter(key as keyof SearchFilters)}
                      className="text-accent-500 hover:text-accent-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-poppins font-bold text-primary-800">
              Available Books
            </h2>
            <p className="text-neutral-600 mt-1">
              {isLoading ? 'Searching...' : `${searchResults.length} book${searchResults.length !== 1 ? 's' : ''} found`}
              {getActiveFilterCount() > 0 && ` with ${getActiveFilterCount()} filter${getActiveFilterCount() !== 1 ? 's' : ''} applied`}
            </p>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-accent-100 text-accent-600' : 'text-neutral-600 hover:bg-neutral-100'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-accent-100 text-accent-600' : 'text-neutral-600 hover:bg-neutral-100'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
              <p className="text-neutral-600">Finding books...</p>
            </div>
          </div>
        )}

        {/* Books Grid/List */}
        {!isLoading && (
          <>
            {searchResults.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {searchResults.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onBookClick={onBookClick}
                    onExchangeClick={(book) => console.log('Exchange clicked:', book)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-12 w-12 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-primary-700 mb-2">
                    No books found
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Try adjusting your filters to see more results.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="btn-primary"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Load More */}
        {!isLoading && searchResults.length > 0 && searchResults.length >= 20 && (
          <div className="text-center mt-12">
            <button className="btn-secondary">
              Load More Books
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onListBookClick}
        className="fixed bottom-6 right-6 bg-accent-500 hover:bg-accent-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 group"
      >
        <Plus className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};