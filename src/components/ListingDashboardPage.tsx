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
} from "lucide-react";
import { Book, User, ActivityFeedItem } from "../types";
import { BookCard } from "./BookCard";
import { ActivityFeed } from "./ActivityFeed";
import { SearchBar, SearchFilters } from "./SearchBar";
import { AuthButton } from "./AuthButton";
import { mockBooks, mockActivityFeed } from "../data/mockData";

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
  const [showFilters, setShowFilters] = useState(false);

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

  const handleSearch = (query: string, searchFilters: SearchFilters) => {
    setIsLoading(true);
    setFilters(searchFilters);

    // Simulate API call
    setTimeout(() => {
      let results = mockBooks.filter((book) => {
        const matchesQuery =
          !query ||
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.subject.toLowerCase().includes(query.toLowerCase());

        const matchesGrade =
          !searchFilters.grade || book.grade === searchFilters.grade;
        const matchesSubject =
          !searchFilters.subject || book.subject === searchFilters.subject;
        const matchesCondition =
          !searchFilters.condition ||
          book.condition === searchFilters.condition;
        const matchesLocation =
          !searchFilters.location ||
          book.location
            .toLowerCase()
            .includes(searchFilters.location.toLowerCase());
        const matchesExchange =
          searchFilters.availableForExchange === undefined ||
          book.availableForExchange === searchFilters.availableForExchange;

        return (
          matchesQuery &&
          matchesGrade &&
          matchesSubject &&
          matchesCondition &&
          matchesLocation &&
          matchesExchange
        );
      });

      // Apply sorting
      if (searchFilters.sortBy) {
        results.sort((a, b) => {
          switch (searchFilters.sortBy) {
            case "price":
              return a.price - b.price;
            case "date":
              return (
                new Date(b.listedDate).getTime() -
                new Date(a.listedDate).getTime()
              );
            case "popularity":
              return b.views - a.views;
            case "savings":
              return (
                (b.originalPrice - b.price) / b.originalPrice -
                (a.originalPrice - a.price) / a.originalPrice
              );
            default:
              return 0;
          }
        });
      }

      setSearchResults(results);
      setIsLoading(false);
      onSearch?.(query, searchFilters);
    }, 300);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(
      (value) => value !== undefined && value !== "" && value !== null
    ).length;
  };

  const getUrgencyBadge = (book: Book) => {
    if (book.interestedBuyers > 5)
      return { text: "Selling fast!", color: "bg-red-500" };
    if (book.views > 20) return { text: "Popular", color: "bg-orange-500" };
    if (book.isFeatured) return { text: "Featured", color: "bg-gold-500" };
    return null;
  };

  return (
    <div className="min-h-screen bg-kitenge-pattern">
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

              {/* Profile */}
              <div className="flex items-center space-x-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-primary-700">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {currentUser.role === "seller" ? "Seller" : "Buyer"}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-accent-600">
                    {(currentUser?.name || currentUser?.email || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Summary & Filters Section */}
        <div className="mb-8 space-y-6">
          {/* Personal Impact */}
          <div className="card bg-gradient-to-r from-secondary-500 to-accent-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-poppins font-bold mb-2">
                    🎉 You've helped {communityStats.userImpact.familiesHelped}{" "}
                    families this month!
                  </h2>
                  <p className="text-lg opacity-90">
                    You've saved KES{" "}
                    {communityStats.userImpact.totalSaved.toLocaleString()} and
                    listed {communityStats.userImpact.booksListed} books
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">⭐</div>
                <p className="text-sm opacity-80">Community Hero</p>
              </div>
            </div>
          </div>

          {/* Community Impact */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card bg-blue-50 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600">Community Savings</p>
                  <p className="text-xl font-bold text-blue-800">
                    KES{" "}
                    {(communityStats.communityImpact.totalSaved / 1000).toFixed(
                      0
                    )}
                    K
                  </p>
                  <p className="text-xs text-blue-600">
                    in {communityStats.communityImpact.location} this term
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-green-50 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600">Active Buyers</p>
                  <p className="text-xl font-bold text-green-800">
                    {communityStats.communityImpact.activeBuyers}
                  </p>
                  <p className="text-xs text-green-600">in your area</p>
                </div>
              </div>
            </div>

            <div className="card bg-orange-50 border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-orange-600">New Listings</p>
                  <p className="text-xl font-bold text-orange-800">
                    {communityStats.communityImpact.newListings}
                  </p>
                  <p className="text-xs text-orange-600">today</p>
                </div>
              </div>
            </div>

            <div className="card bg-purple-50 border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600">Your Progress</p>
                  <p className="text-xl font-bold text-purple-800">85%</p>
                  <p className="text-xs text-purple-600">to next badge</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-poppins font-semibold text-primary-700">
                Smart Filters
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-accent-600 hover:text-accent-700"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={filters.grade || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      grade: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    }))
                  }
                  className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">All Grades</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.subject || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      subject: e.target.value || undefined,
                    }))
                  }
                  className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Kiswahili">Kiswahili</option>
                  <option value="Science">Science</option>
                  <option value="Social Studies">Social Studies</option>
                </select>

                <select
                  value={filters.condition || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      condition: e.target.value || undefined,
                    }))
                  }
                  className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Any Condition</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="writing-inside">Has Writing</option>
                </select>

                <select
                  value={filters.sortBy || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: (e.target.value as any) || undefined,
                    }))
                  }
                  className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500"
                >
                  <option value="">Sort by Relevance</option>
                  <option value="price">Price: Low to High</option>
                  <option value="date">Recently Listed</option>
                  <option value="popularity">Most Viewed</option>
                  <option value="savings">Best Savings</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Book Listings - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary-800">
                  Available Books
                </h2>
                <p className="text-neutral-600">
                  {isLoading
                    ? "Loading..."
                    : `${searchResults.length} book${
                        searchResults.length !== 1 ? "s" : ""
                      } found`}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid"
                        ? "bg-accent-100 text-accent-600"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list"
                        ? "bg-accent-100 text-accent-600"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
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
                  <p className="text-neutral-600">
                    Finding the best books for you...
                  </p>
                </div>
              </div>
            )}

            {/* Book Grid */}
            {!isLoading && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {searchResults.map((book) => {
                  const urgencyBadge = getUrgencyBadge(book);
                  return (
                    <div key={book.id} className="relative">
                      {urgencyBadge && (
                        <div
                          className={`absolute top-2 left-2 z-10 ${urgencyBadge.color} text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse`}
                        >
                          {urgencyBadge.text}
                        </div>
                      )}
                      <BookCard
                        book={book}
                        onBookClick={onBookClick}
                        onExchangeClick={(book) =>
                          console.log("Exchange clicked:", book)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {!isLoading && searchResults.length >= 12 && (
              <div className="text-center">
                <button className="btn-secondary">Load More Books</button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-poppins font-semibold text-primary-700 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={onListBookClick}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>List a Book</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  <span>Find Exchanges</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>My Wishlist</span>
                </button>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-3">
                <Award className="h-5 w-5 text-gold-600" />
                <h4 className="font-poppins font-semibold text-primary-700">
                  Badge Progress
                </h4>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-neutral-600">Power Seller</span>
                    <span className="font-semibold text-primary-700">
                      17/20 sales
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gold-600 mt-1">
                    3 more sales to unlock!
                  </p>
                </div>
              </div>
            </div>

            {/* Community Activity Feed */}
            <ActivityFeed
              activities={mockActivityFeed.slice(0, 5)}
              title="Live Activity"
            />

            {/* Trending Books */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-accent-600" />
                <h4 className="font-poppins font-semibold text-primary-700">
                  Trending in Your Area
                </h4>
              </div>
              <div className="space-y-3">
                {[
                  "Grade 5 Mathematics",
                  "Grade 6 Science",
                  "Grade 4 English",
                ].map((book, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-primary-700">
                        {book}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {5 - index} new listings
                      </p>
                    </div>
                    <div className="text-xs text-accent-600 font-medium">
                      🔥 Hot
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
