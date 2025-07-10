export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  avatar?: string;
  rating: number;
  totalSales: number;
  totalExchanges: number;
  joinedDate: string;
  badges: Badge[];
  isVerified: boolean;
  role?: 'seller' | 'buyer';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedDate?: string;
}

export interface Book {
  id: string;
  title: string;
  subject: string;
  grade: number;
  term: number;
  condition: 'like-new' | 'good' | 'fair' | 'writing-inside';
  price: number;
  originalPrice: number;
  images: string[];
  description: string;
  sellerId: string;
  seller: User;
  location: string;
  listedDate: string;
  views: number;
  interestedBuyers: number;
  isFeatured?: boolean;
  isUrgent?: boolean;
  availableForExchange?: boolean;
  exchangeWishlist?: string[];
}

export interface ExchangeMatch {
  id: string;
  userABook: Book;
  userBBook: Book;
  userA: User;
  userB: User;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdDate: string;
  completedDate?: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'sale' | 'listing' | 'review' | 'badge' | 'exchange';
  user: User;
  message: string;
  timestamp: string;
  location: string;
  book?: Book;
  exchangeMatch?: ExchangeMatch;
}

export interface UserStats {
  totalSavings: number;
  booksReused: number;
  co2Saved: number;
  totalEarnings: number;
  activeListings: number;
  completedSales: number;
  completedExchanges: number;
  exchangeSavings: number;
}