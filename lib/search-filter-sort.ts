import { DatasetItem } from './types';

/**
 * Searches items by query string matching against name, description, and tags
 * @param items - Array of items to search
 * @param query - Search query string
 * @returns Filtered array of items matching the query
 */
export function searchItems(items: DatasetItem[], query: string): DatasetItem[] {
  // Return all items if query is empty
  if (!query || query.trim() === '') {
    return items;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return items.filter(item => {
    // Check if query matches name
    const nameMatch = item.name.toLowerCase().includes(normalizedQuery);
    
    // Check if query matches description
    const descriptionMatch = item.description.toLowerCase().includes(normalizedQuery);
    
    // Check if query matches any tag
    const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));

    return nameMatch || descriptionMatch || tagMatch;
  });
}

/**
 * Filters items by category (case-insensitive)
 * @param items - Array of items to filter
 * @param category - Category to filter by
 * @returns Filtered array of items belonging to the specified category
 */
export function filterByCategory(items: DatasetItem[], category: string): DatasetItem[] {
  // Return all items if category is empty
  if (!category || category.trim() === '') {
    return items;
  }

  const normalizedCategory = category.toLowerCase().trim();
  return items.filter(item => item.category.toLowerCase().trim() === normalizedCategory);
}

/**
 * Filters items by tags
 * @param items - Array of items to filter
 * @param tags - Array of tags to filter by
 * @returns Filtered array of items containing at least one of the specified tags
 */
export function filterByTags(items: DatasetItem[], tags: string[]): DatasetItem[] {
  // Return all items if tags array is empty
  if (!tags || tags.length === 0) {
    return items;
  }

  return items.filter(item => 
    tags.some(tag => item.tags.includes(tag))
  );
}

/**
 * Filters items by minimum rating
 * @param items - Array of items to filter
 * @param minRating - Minimum rating threshold (0-5)
 * @returns Filtered array of items with rating >= minRating
 */
export function filterByMinRating(items: DatasetItem[], minRating: number): DatasetItem[] {
  // Return all items if minRating is 0 or negative
  if (minRating <= 0) {
    return items;
  }

  return items.filter(item => item.rating >= minRating);
}

/**
 * Sorts items by the specified field and direction
 * @param items - Array of items to sort
 * @param sortBy - Sort option ('name-asc', 'name-desc', 'rating-asc', 'rating-desc')
 * @returns Sorted array of items
 */
export function sortItems(
  items: DatasetItem[], 
  sortBy: 'name-asc' | 'name-desc' | 'rating-asc' | 'rating-desc'
): DatasetItem[] {
  // Create a copy to avoid mutating the original array
  const sortedItems = [...items];

  switch (sortBy) {
    case 'name-asc':
      return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'name-desc':
      return sortedItems.sort((a, b) => b.name.localeCompare(a.name));
    
    case 'rating-asc':
      return sortedItems.sort((a, b) => a.rating - b.rating);
    
    case 'rating-desc':
      return sortedItems.sort((a, b) => b.rating - a.rating);
    
    default:
      return sortedItems;
  }
}
