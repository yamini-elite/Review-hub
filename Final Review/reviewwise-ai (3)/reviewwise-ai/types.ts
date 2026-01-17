
export enum Category {
  TRAVEL = 'Travel',
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  RESTAURANTS = 'Restaurants',
  BOOKS = 'Books',
  PRODUCT = 'Product',
  FOOD = 'Food',
  OTHER = 'Other'
}

export interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  category: Category;
  author: string;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  interests: Category[];
  searchHistory: string[];
  preferredRatingMin: number;
}
