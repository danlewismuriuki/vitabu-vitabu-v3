import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, MapPin, BookOpen, Users } from 'lucide-react';
import { Book } from '../types';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onResultSelect?: (book: Book) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export interface SearchFilters {
  grade?: number;
  subject?: string;
  condition?: string;
  location?: string;
  priceRange?: { min: number; max: number };
  availableForExchange?: boolean;
  sortBy?: 'price' | 'date' | 'popularity' | 'savings';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onResultSelect,
  placeholder = "Search for books by grade, subject, title...",
  showFilters = true,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search function - in real app this would call an API
  const performSearch = async (searchQuery: string, searchFilters: SearchFilters) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Import mock data dynamically to avoid circular dependencies
    const { mockBooks } = await import('../data/mockData');
    
    let results = mockBooks.filter(book => {
      const matchesQuery = !searchQuery || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGrade = !searchFilters.grade || book.grade === searchFilters.grade;
      const matchesSubject = !searchFilters.subject || book.subject === searchFilters.subject;
      const matchesCondition = !searchFilters.condition || book.condition === searchFilters.condition;
      const matchesLocation = !searchFilters.location || 
        book.location.toLowerCase().includes(searchFilters.location.toLowerCase());
      const matchesExchange = searchFilters.availableForExchange === undefined || 
        book.availableForExchange === searchFilters.availableForExchange;
      
      const matchesPrice = !searchFilters.priceRange || 
        (book.price >= searchFilters.priceRange.min && book.price <= searchFilters.priceRange.max);
      
      return matchesQuery && matchesGrade && matchesSubject && matchesCondition && 
             matchesLocation && matchesExchange && matchesPrice;
    });

    // Apply sorting
    if (searchFilters.sortBy) {
      results.sort((a, b) => {
        switch (searchFilters.sortBy) {
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
    setShowResults(results.length > 0 || searchQuery.length > 0);
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.length > 0 || Object.keys(filters).length > 0) {
        performSearch(query, filters);
        onSearch(query, filters);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, filters, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowFilterPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length;
  };

  const getSavingsPercentage = (book: Book) => {
    return Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setShowResults(true);
          }}
          className="block w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg leading-5 bg-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-400 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-base"
          placeholder={placeholder}
        />
        
        {/* Filter Button */}
        {showFilters && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
              getActiveFilterCount() > 0 ? 'text-accent-600' : 'text-neutral-400'
            } hover:text-accent-600`}
          >
            <div className="relative">
              <Filter className="h-5 w-5" />
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-poppins font-semibold text-primary-700">Filters</h3>
            <div className="flex items-center space-x-2">
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-neutral-600 hover:text-neutral-800"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Grade Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Grade</label>
              <select
                value={filters.grade || ''}
                onChange={(e) => handleFilterChange('grade', e.target.value ? parseInt(e.target.value) : undefined)}
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
                onChange={(e) => handleFilterChange('subject', e.target.value || undefined)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Kiswahili">Kiswahili</option>
                <option value="Science">Science</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Religious Education">Religious Education</option>
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Condition</label>
              <select
                value={filters.condition || ''}
                onChange={(e) => handleFilterChange('condition', e.target.value || undefined)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">Any Condition</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="writing-inside">Has Writing</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                placeholder="Enter city or area"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Price Range (KES)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.min || ''}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    min: e.target.value ? parseInt(e.target.value) : 0
                  })}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.max || ''}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    max: e.target.value ? parseInt(e.target.value) : 10000
                  })}
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy || ''}
                onChange={(e) => handleFilterChange('sortBy', e.target.value || undefined)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">Relevance</option>
                <option value="price">Price: Low to High</option>
                <option value="date">Newest First</option>
                <option value="popularity">Most Popular</option>
                <option value="savings">Best Savings</option>
              </select>
            </div>
          </div>

          {/* Exchange Toggle */}
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.availableForExchange || false}
                onChange={(e) => handleFilterChange('availableForExchange', e.target.checked || undefined)}
                className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
              />
              <span className="text-sm font-medium text-neutral-700">Only show books available for exchange</span>
            </label>
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 max-h-96 overflow-y-auto z-40">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-500 mx-auto"></div>
              <p className="text-sm text-neutral-600 mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-3 border-b border-neutral-200">
                <p className="text-sm text-neutral-600">
                  Found {searchResults.length} book{searchResults.length !== 1 ? 's' : ''}
                  {query && ` for "${query}"`}
                </p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => {
                      onResultSelect?.(book);
                      setShowResults(false);
                      setQuery('');
                    }}
                    className="p-4 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={book.images[0]}
                        alt={book.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-primary-800 truncate">{book.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-neutral-600">
                          <span>Grade {book.grade}</span>
                          <span>•</span>
                          <span>{book.subject}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{book.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-accent-600">KES {book.price}</span>
                            <span className="text-xs text-neutral-500 line-through">KES {book.originalPrice}</span>
                            <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
                              Save {getSavingsPercentage(book)}%
                            </span>
                          </div>
                          {book.availableForExchange && (
                            <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">
                              Exchange Available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : query.length > 0 ? (
            <div className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-neutral-700 mb-2">No books found</h3>
              <p className="text-neutral-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <div className="space-y-2 text-sm text-neutral-500">
                <p>• Check spelling and try different keywords</p>
                <p>• Try searching by subject or grade level</p>
                <p>• Clear some filters to see more results</p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};