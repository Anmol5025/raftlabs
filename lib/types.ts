// Base item interface - all dataset types extend this
export interface BaseItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  rating: number; // 0-5
  imageUrl?: string;
  createdAt: string;
}

// Dataset-specific extensions
export interface StartupItem extends BaseItem {
  founder: string;
  fundingStage: string;
  website: string;
  location: string;
}

export interface AIToolItem extends BaseItem {
  pricing: 'free' | 'freemium' | 'paid';
  website: string;
  features: string[];
}

export interface DesignItem extends BaseItem {
  designer: string;
  year: number;
  colors: string[];
  website: string;
}

export interface APIItem extends BaseItem {
  endpoint: string;
  authentication: string;
  pricing: 'free' | 'freemium' | 'paid';
  documentation: string;
}

export interface MovieItem extends BaseItem {
  director: string;
  year: number;
  duration: number;
  genre: string;
  imdbRating: number;
}

// Union type for all item types
export type DatasetItem = StartupItem | AIToolItem | DesignItem | APIItem | MovieItem;

// Dataset structure
export interface Dataset {
  type: 'startups' | 'ai-tools' | 'designs' | 'apis' | 'movies';
  items: DatasetItem[];
  categories: string[];
  tags: string[];
}

// Filter state
export interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedTags: string[];
  minRating: number;
  sortBy: 'name-asc' | 'name-desc' | 'rating-asc' | 'rating-desc';
}
