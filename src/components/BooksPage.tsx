import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { BookCard } from './BookCard';
import { Filter, X, Grid, List, MapPin, BookOpen } from 'lucide-react';
import { mockBooks } from '../data/mockData';

interface BooksPageProps {
  onBookClick?: (book: Book) => void;
  currentUser?: any;
}

interface ActiveFilters {
  grade?: number;
  subject?: string;
  condition?: string;
  location?: string;
  exchangeOK?: boolean;
}

export const BooksPage: React.FC<BooksPageProps> = ({ onBookClick, currentUser }) => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(mockBooks);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  const subjects = ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'Religious Education', 'Creative Arts'];
  const conditions = [
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'writing-inside', label: 'Has Writing' }
  ];

  useEffect(() => {
    applyFilters();
  }, [activeFilters, books]);

  const applyFilters = () => {
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      let filtered = books.filter(book => {
        const matchesGrade = !activeFilters.grade || book.grade === activeFilters.grade;
        const matchesSubject = !activeFilters.subject || book.subject === activeFilters.subject;
        const matchesCondition = !activeFilters.condition || book.condition === activeFilters.condition;
        const matchesLocation = !activeFilters.location || 
          book.location.toLowerCase().includes(activeFilters.location.toLowerCase());
        const matchesExchange = activeFilters.exchangeOK === undefined || 
          book.availableForExchange === activeFilters.exchangeOK;

        return matchesGrade && matchesSubject && matchesCondition && matchesLocation && matchesExchange;
      });

      setFilteredBooks(filtered);
      setIsLoading(false);
    }, 200);
  };

  const handleFilterChange = (filterType: keyof ActiveFilters, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value === '' ? undefined : value
    }));
  };

  const removeFilter = (filterType: keyof ActiveFilters) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterType];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== undefined).length;
  };

  const getFilterDisplayValue = (filterType: keyof ActiveFilters, value: any) => {
    switch (filterType) {
      case 'grade':
        return `Grade ${value}`;
      case 'condition':
        return conditions.find(c => c.value === value)?.label || value;
      case 'exchangeOK':
        return 'Exchange Available';
      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EBF2F7' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-primary-800 mb-2">
            Browse Books
          </h1>
          <p className="text-lg text-neutral-600">
            Find the perfect books for your child's education
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Grade Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Grade</label>
              <select
                value={activeFilters.grade || ''}
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
                value={activeFilters.subject || ''}
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
                value={activeFilters.condition || ''}
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
                value={activeFilters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Enter area..."
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>

            {/* Exchange Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Exchange</label>
              <select
                value={activeFilters.exchangeOK === undefined ? '' : activeFilters.exchangeOK.toString()}
                onChange={(e) => handleFilterChange('exchangeOK', e.target.value === '' ? undefined : e.target.value === 'true')}
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
              {Object.entries(activeFilters).map(([key, value]) => {
                if (value === undefined) return null;
                return (
                  <div
                    key={key}
                    className="inline-flex items-center space-x-2 bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{getFilterDisplayValue(key as keyof ActiveFilters, value)}</span>
                    <button
                      onClick={() => removeFilter(key as keyof ActiveFilters)}
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
            <h2 className="text-xl font-poppins font-semibold text-primary-800">
              {isLoading ? 'Searching...' : `${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''} found`}
            </h2>
            {getActiveFilterCount() > 0 && (
              <p className="text-sm text-neutral-600 mt-1">
                Filtered by {getActiveFilterCount()} criteria
              </p>
            )}
          </div>

          {/* View Toggle */}
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
            {filteredBooks.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredBooks.map((book) => (
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
        {!isLoading && filteredBooks.length > 0 && filteredBooks.length >= 20 && (
          <div className="text-center mt-12">
            <button className="btn-secondary">
              Load More Books
            </button>
          </div>
        )}
      </div>
    </div>
  );
};