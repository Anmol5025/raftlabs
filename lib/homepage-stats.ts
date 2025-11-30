import { Dataset } from './types';

/**
 * Statistics calculated from the dataset for display on the homepage
 */
export interface HomepageStatistics {
  totalItems: number;
  totalCategories: number;
  totalTags: number;
  averageRating: number;
}

/**
 * Calculate statistics from a dataset
 * @param dataset The dataset to calculate statistics from
 * @returns Statistics object with counts and averages
 */
export function calculateHomepageStatistics(dataset: Dataset): HomepageStatistics {
  const totalItems = dataset.items.length;
  const totalCategories = dataset.categories.length;
  const totalTags = dataset.tags.length;
  
  // Calculate average rating
  const averageRating = totalItems > 0
    ? dataset.items.reduce((sum, item) => sum + item.rating, 0) / totalItems
    : 0;

  return {
    totalItems,
    totalCategories,
    totalTags,
    averageRating,
  };
}
