import React, { useState, useRef, useEffect } from 'react';
import { Search, X, BookOpen, ChevronDown } from 'lucide-react';
import { CBCBook, searchCBCBooks, mostRequestedBooks, cbcBookCatalog } from '../data/cbcBookCatalog';

interface SmartBookInputProps {
  value: string[];
  onChange: (books: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  showQuickSuggestions?: boolean;
}

export const SmartBookInput: React.FC<SmartBookInputProps> = ({
  value = [],
  onChange,
  placeholder = "Search for CBC books...",
  maxSelections = 5,
  showQuickSuggestions = true
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<CBCBook[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showQuickPicks, setShowQuickPicks] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowQuickPicks(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (inputValue.length >= 2) {
      const results = searchCBCBooks(inputValue, 8);
      setSuggestions(results);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectBook(suggestions[selectedIndex].title);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectBook = (bookTitle: string) => {
    // Check for duplicates
    if (value.includes(bookTitle)) {
      return; // Don't add duplicates - parent component will handle error display
    }
    
    if (value.length >= maxSelections) {
      return; // Max selections reached
    }

    onChange([...value, bookTitle]);
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const removeBook = (bookTitle: string) => {
    onChange(value.filter(book => book !== bookTitle));
  };

  const groupSuggestionsBySubject = (books: CBCBook[]) => {
    const grouped: { [key: string]: CBCBook[] } = {};
    books.forEach(book => {
      if (!grouped[book.subject]) {
        grouped[book.subject] = [];
      }
      grouped[book.subject].push(book);
    });
    return grouped;
  };

  const getQuickSuggestions = () => {
    return mostRequestedBooks
      .filter(book => !value.includes(book))
      .slice(0, 6);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Selected Books (Chips) */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((book, index) => (
            <div
              key={index}
              className="inline-flex items-center space-x-2 bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm"
            >
              <span>{book}</span>
              <button
                onClick={() => removeBook(book)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.length >= 2) {
              setShowSuggestions(true);
            }
          }}
          placeholder={value.length >= maxSelections ? `Maximum ${maxSelections} books selected` : placeholder}
          disabled={value.length >= maxSelections}
          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 disabled:bg-neutral-100 disabled:text-neutral-500"
        />
        
        {/* Quick Suggestions Toggle */}
        {showQuickSuggestions && value.length < maxSelections && (
          <button
            onClick={() => setShowQuickPicks(!showQuickPicks)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showQuickPicks ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-neutral-200 max-h-80 overflow-y-auto z-50">
          <div className="p-3 border-b border-neutral-200">
            <p className="text-sm text-neutral-600">
              Found {suggestions.length} CBC book{suggestions.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Group by Subject */}
          {Object.entries(groupSuggestionsBySubject(suggestions)).map(([subject, books]) => (
            <div key={subject} className="border-b border-neutral-100 last:border-b-0">
              <div className="px-3 py-2 bg-neutral-50 text-xs font-medium text-neutral-600 uppercase tracking-wide">
                {subject}
              </div>
              {books.map((book, index) => {
                const globalIndex = suggestions.findIndex(s => s.code === book.code);
                const isAlreadySelected = value.includes(book.title);
                return (
                  <button
                    key={book.code}
                    onClick={() => selectBook(book.title)}
                    disabled={isAlreadySelected}
                    className={`w-full text-left px-4 py-3 hover:bg-accent-50 border-b border-neutral-100 last:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedIndex === globalIndex ? 'bg-accent-50 border-accent-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-medium ${isAlreadySelected ? 'text-neutral-500' : 'text-primary-800'}`}>
                          {book.title}
                          {isAlreadySelected && <span className="ml-2 text-xs">(Already selected)</span>}
                        </div>
                        <div className="text-sm text-neutral-600">
                          Grade {book.grade} • {book.term}
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {book.code}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showSuggestions && inputValue.length >= 2 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-neutral-200 p-6 text-center z-50">
          <BookOpen className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm text-neutral-600 mb-1">No CBC books found</p>
          <p className="text-xs text-neutral-500">
            Try searching by grade (e.g., "Grade 5") or subject (e.g., "Mathematics")
          </p>
        </div>
      )}

      {/* Quick Suggestions */}
      {showQuickPicks && showQuickSuggestions && value.length < maxSelections && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-neutral-200 z-50">
          <div className="p-3 border-b border-neutral-200">
            <p className="text-sm font-medium text-neutral-700">Most Requested Books</p>
            <p className="text-xs text-neutral-500">Quick-select popular exchanges</p>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-1 gap-2">
              {getQuickSuggestions().map((book) => {
                const isAlreadySelected = value.includes(book);
                return (
                  <button
                    key={book}
                    onClick={() => selectBook(book)}
                    disabled={isAlreadySelected}
                    className={`text-left p-2 rounded-lg border border-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isAlreadySelected ? 'bg-neutral-100' : 'hover:bg-accent-50 hover:border-accent-300'
                    }`}
                  >
                    <div className={`font-medium text-sm ${isAlreadySelected ? 'text-neutral-500' : 'text-primary-800'}`}>
                      {book}
                      {isAlreadySelected && <span className="ml-2 text-xs">(Selected)</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-2 text-xs text-neutral-500">
        <p>
          💡 <strong>Tip:</strong> Search by grade (e.g., "Grade 5") or subject (e.g., "Mathematics") to find CBC books
        </p>
        {value.length > 0 && (
          <p className="mt-1">
            Selected {value.length} of {maxSelections} books
          </p>
        )}
      </div>
    </div>
  );
};