import React, { useState, useEffect } from 'react';
import { BookCard } from './BookCard';
import { SearchBar, SearchFilters } from './SearchBar';
import { Book } from '../types';
import { Filter, Grid, List, ArrowLeft } from 'lucide-react';

interface SearchResultsPageProps {
  initialQuery?: string;
  initialFilters?: SearchFilters;
  onBookClick?: (book: Book) => void;
  onBack?: () => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  initialQuery = '',
  initialFilters = {},
  onBookClick,
  onBack
}) => {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>(initialFilters);

  const performSearch = async (query: string, filters: SearchFilters) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Import mock data
    const { mockBooks } = await import('../data/mockData');
    
    let results = mockBooks.filter(book => {
      const matchesQuery = !query || 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.subject.toLowerCase().includes(query.toLowerCase()) ||
        book.seller.name.toLowerCase().includes(query.toLowerCase());
      
      const matchesGrade = !filters.grade || book.grade === filters.grade;
      const matchesSubject = !filters.subject || book.subject === filters.subject;
      const matchesCondition = !filters.condition || book.condition === filters.condition;
      const matchesLocation = !filters.location || 
        book.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesExchange = filters.availableForExchange === undefined || 
        book.availableForExchange === filters.availableForExchange;
      
      const matchesPrice = !filters.priceRange || 
        (book.price >= filters.priceRange.min && book.price <= filters.priceRange.max);
      
      return matchesQuery && matchesGrade && matchesSubject && matchesCondition && 
             matchesLocation && matchesExchange && matchesPrice;
    });

    // Apply sorting
    if (filters.sortBy) {
      results.sort((a, b) => {
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

    setSearchResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    performSearch(currentQuery, currentFilters);
  }, [currentQuery, currentFilters]);

  const handleSearch = (query: string, filters: SearchFilters) => {
    setCurrentQuery(query);
    setCurrentFilters(filters);
  };

  const handleExchangeClick = (book: Book) => {
    console.log('Exchange clicked for book:', book);
    // Handle exchange logic
  };

  const getActiveFilterCount = () => {
    return Object.values(currentFilters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length;
  };

  return (
    <div className="min-h-screen bg-kitenge-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-neutral-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to home</span>
          </button>
        )}

        {/* Search Header */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onResultSelect={onBookClick}
            placeholder="Search for books by grade, subject, title..."
            showFilters={true}
            className="w-full"
          />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-poppins font-bold text-primary-800">
              {currentQuery ? `Search Results for "${currentQuery}"` : 'Browse Books'}
            </h1>
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

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-primary-700">Active Filters:</h3>
              <button
                onClick={() => setCurrentFilters({})}
                className="text-sm text-accent-600 hover:text-accent-700"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentFilters.grade && (
                <span className="badge bg-accent-100 text-accent-700">
                  Grade {currentFilters.grade}
                </span>
              )}
              {currentFilters.subject && (
                <span className="badge bg-accent-100 text-accent-700">
                  {currentFilters.subject}
                </span>
              )}
              {currentFilters.condition && (
                <span className="badge bg-accent-100 text-accent-700">
                  {currentFilters.condition === 'like-new' ? 'Like New' : 
                   currentFilters.condition === 'writing-inside' ? 'Has Writing' : 
                   currentFilters.condition.charAt(0).toUpperCase() + currentFilters.condition.slice(1)}
                </span>
              )}
              {currentFilters.location && (
                <span className="badge bg-accent-100 text-accent-700">
                  📍 {currentFilters.location}
                </span>
              )}
              {currentFilters.availableForExchange && (
                <span className="badge bg-secondary-100 text-secondary-700">
                  Available for Exchange
                </span>
              )}
              {currentFilters.priceRange && (
                <span className="badge bg-accent-100 text-accent-700">
                  KES {currentFilters.priceRange.min || 0} - {currentFilters.priceRange.max || '∞'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
              <p className="text-neutral-600">Searching for books...</p>
            </div>
          </div>
        )}

        {/* Results Grid/List */}
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
                    onExchangeClick={handleExchangeClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="h-12 w-12 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-primary-700 mb-2">
                    No books found
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {currentQuery 
                      ? `We couldn't find any books matching "${currentQuery}" with your current filters.`
                      : 'Try adjusting your search filters to see more results.'
                    }
                  </p>
                  <div className="space-y-2 text-sm text-neutral-500 mb-6">
                    <p>• Try different keywords or remove some filters</p>
                    <p>• Check spelling and try broader search terms</p>
                    <p>• Browse by grade level or subject instead</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentQuery('');
                      setCurrentFilters({});
                    }}
                    className="btn-primary"
                  >
                    Browse All Books
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Load More Button */}
        {!isLoading && searchResults.length > 0 && searchResults.length >= 20 && (
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