import { User, Book, ActivityFeedItem, Badge, UserStats, ExchangeMatch } from '../types';

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Verified Seller',
    description: 'Phone number and ID verified',
    icon: 'shield-check',
    color: 'text-secondary-600'
  },
  {
    id: '2',
    name: 'Fast Responder',
    description: 'Responds within 2 hours',
    icon: 'zap',
    color: 'text-accent-600'
  },
  {
    id: '3',
    name: 'Power Seller',
    description: 'Sold 20+ books',
    icon: 'crown',
    color: 'text-gold-600'
  },
  {
    id: '4',
    name: 'Community Helper',
    description: 'Helped 50+ parents save money',
    icon: 'heart',
    color: 'text-primary-600'
  },
  {
    id: '5',
    name: 'Book Buddy',
    description: 'Completed 10+ book exchanges',
    icon: 'star',
    color: 'text-secondary-600'
  },
  {
    id: '6',
    name: 'Exchange Master',
    description: 'Top exchanger in your area',
    icon: 'award',
    color: 'text-gold-600'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Mary Wanjiku',
    email: 'mary@example.com',
    location: 'Nairobi',
    rating: 4.8,
    totalSales: 45,
    totalExchanges: 12,
    joinedDate: '2023-01-15',
    badges: [mockBadges[0], mockBadges[1], mockBadges[2], mockBadges[4]],
    isVerified: true
  },
  {
    id: '2',
    name: 'Paul Mwangi',
    email: 'paul@example.com',
    location: 'Embu',
    rating: 4.9,
    totalSales: 32,
    totalExchanges: 8,
    joinedDate: '2023-03-20',
    badges: [mockBadges[0], mockBadges[3]],
    isVerified: true
  },
  {
    id: '3',
    name: 'Susan Achieng',
    email: 'susan@example.com',
    location: 'Nakuru',
    rating: 4.7,
    totalSales: 28,
    totalExchanges: 15,
    joinedDate: '2023-02-10',
    badges: [mockBadges[1], mockBadges[3], mockBadges[5]],
    isVerified: true
  },
  {
    id: '4',
    name: 'Faith Wanjiru',
    email: 'faith@example.com',
    location: 'Ngong',
    rating: 4.6,
    totalSales: 18,
    totalExchanges: 22,
    joinedDate: '2023-04-05',
    badges: [mockBadges[4], mockBadges[5]],
    isVerified: true
  }
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Primary Mathematics Grade 5',
    subject: 'Mathematics',
    grade: 5,
    term: 1,
    condition: 'like-new',
    price: 650,
    originalPrice: 1200,
    images: ['https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg'],
    description: 'Excellent condition, barely used. My child switched schools.',
    sellerId: '1',
    seller: mockUsers[0],
    location: 'Nairobi',
    listedDate: '2024-01-15',
    views: 24,
    interestedBuyers: 3,
    isFeatured: true,
    availableForExchange: true,
    exchangeWishlist: ['Grade 6 Science', 'Grade 6 English']
  },
  {
    id: '2',
    title: 'Kiswahili Grade 4 Textbook',
    subject: 'Kiswahili',
    grade: 4,
    term: 2,
    condition: 'good',
    price: 480,
    originalPrice: 800,
    images: ['https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg'],
    description: 'Good condition, some pencil marks but readable.',
    sellerId: '2',
    seller: mockUsers[1],
    location: 'Embu',
    listedDate: '2024-01-16',
    views: 18,
    interestedBuyers: 5,
    isUrgent: true
  },
  {
    id: '3',
    title: 'English Grade 6 Reader',
    subject: 'English',
    grade: 6,
    term: 1,
    condition: 'writing-inside',
    price: 320,
    originalPrice: 650,
    images: ['https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg'],
    description: 'Has some writing inside but still very usable.',
    sellerId: '3',
    seller: mockUsers[2],
    location: 'Nakuru',
    listedDate: '2024-01-14',
    views: 12,
    interestedBuyers: 2,
    availableForExchange: true,
    exchangeWishlist: ['Grade 6 Mathematics', 'Grade 6 Science']
  },
  {
    id: '4',
    title: 'Science Grade 6 Textbook',
    subject: 'Science',
    grade: 6,
    term: 1,
    condition: 'like-new',
    price: 720,
    originalPrice: 1100,
    images: ['https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg'],
    description: 'Perfect condition, used for one term only.',
    sellerId: '4',
    seller: mockUsers[3],
    location: 'Ngong',
    listedDate: '2024-01-17',
    views: 31,
    interestedBuyers: 7,
    availableForExchange: true,
    exchangeWishlist: ['Grade 5 Mathematics', 'Grade 5 English']
  }
];

export const mockExchangeMatches: ExchangeMatch[] = [
  {
    id: '1',
    userABook: mockBooks[0], // Grade 5 Math
    userBBook: mockBooks[3], // Grade 6 Science
    userA: mockUsers[0],
    userB: mockUsers[3],
    status: 'pending',
    createdDate: '2024-01-18'
  },
  {
    id: '2',
    userABook: mockBooks[2], // Grade 6 English
    userBBook: mockBooks[0], // Grade 5 Math (different match)
    userA: mockUsers[2],
    userB: mockUsers[0],
    status: 'completed',
    createdDate: '2024-01-10',
    completedDate: '2024-01-15'
  }
];

export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: '1',
    type: 'sale',
    user: mockUsers[1],
    message: 'sold Grade 4 Science textbook',
    timestamp: '2 hours ago',
    location: 'Embu',
    book: mockBooks[1]
  },
  {
    id: '2',
    type: 'exchange',
    user: mockUsers[2],
    message: 'completed a book exchange',
    timestamp: '3 hours ago',
    location: 'Nakuru',
    exchangeMatch: mockExchangeMatches[1]
  },
  {
    id: '3',
    type: 'listing',
    user: mockUsers[0],
    message: 'listed Grade 5 Mathematics',
    timestamp: '4 hours ago',
    location: 'Nairobi',
    book: mockBooks[0]
  },
  {
    id: '4',
    type: 'badge',
    user: mockUsers[3],
    message: 'earned Book Buddy badge',
    timestamp: '5 hours ago',
    location: 'Ngong'
  },
  {
    id: '5',
    type: 'exchange',
    user: mockUsers[0],
    message: 'found a new exchange match',
    timestamp: '6 hours ago',
    location: 'Nairobi',
    exchangeMatch: mockExchangeMatches[0]
  },
  {
    id: '6',
    type: 'sale',
    user: mockUsers[0],
    message: 'sold Grade 3 English workbook',
    timestamp: '1 day ago',
    location: 'Nairobi'
  }
];

export const mockUserStats: UserStats = {
  totalSavings: 3200,
  booksReused: 15,
  co2Saved: 2.4,
  totalEarnings: 8500,
  activeListings: 3,
  completedSales: 12,
  completedExchanges: 8,
  exchangeSavings: 2400
};