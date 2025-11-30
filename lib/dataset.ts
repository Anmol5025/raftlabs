import { Dataset } from './types';
import datasetJson from '../data/dataset.json';

/**
 * Loads and parses the dataset from the JSON file
 * @returns The parsed and typed dataset
 * @throws Error if the dataset file is missing or contains invalid JSON
 */
export function loadDataset(): Dataset {
  try {
    // The dataset is already parsed by Next.js/TypeScript import
    if (!datasetJson) {
      const errorMsg = 'Dataset file is missing or empty. Please ensure data/dataset.json exists and contains valid data.';
      console.error('Dataset loading error:', errorMsg);
      throw new Error(errorMsg);
    }

    // Validate that the parsed data has the expected structure
    if (typeof datasetJson !== 'object') {
      const errorMsg = 'Dataset must be a valid JSON object';
      console.error('Dataset validation error:', errorMsg);
      throw new Error(errorMsg);
    }

    // Validate required fields
    const dataset = datasetJson as Dataset;
    
    if (!dataset.type) {
      const errorMsg = 'Dataset must have a "type" field';
      console.error('Dataset validation error:', errorMsg);
      throw new Error(errorMsg);
    }

    if (!Array.isArray(dataset.items)) {
      const errorMsg = 'Dataset must have an "items" array';
      console.error('Dataset validation error:', errorMsg);
      throw new Error(errorMsg);
    }

    if (!Array.isArray(dataset.categories)) {
      const errorMsg = 'Dataset must have a "categories" array';
      console.error('Dataset validation error:', errorMsg);
      throw new Error(errorMsg);
    }

    if (!Array.isArray(dataset.tags)) {
      const errorMsg = 'Dataset must have a "tags" array';
      console.error('Dataset validation error:', errorMsg);
      throw new Error(errorMsg);
    }

    console.log(`Dataset loaded successfully: ${dataset.items.length} items, ${dataset.categories.length} categories`);
    return dataset;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to load dataset:', error.message);
      throw new Error(`Dataset loading failed: ${error.message}`);
    }
    console.error('Failed to load dataset: Unknown error');
    throw new Error('Dataset loading failed: Unknown error');
  }
}

// Export a cached version of the dataset for reuse
let cachedDataset: Dataset | null = null;

/**
 * Gets the dataset, using a cached version if available
 * @returns The dataset
 */
export function getDataset(): Dataset {
  if (!cachedDataset) {
    cachedDataset = loadDataset();
  }
  return cachedDataset;
}

/**
 * Normalizes a category name to a URL-safe format
 * @param category - The category name to normalize
 * @returns Lowercase, URL-safe category identifier
 */
export function normalizeCategoryForUrl(category: string): string {
  return category.toLowerCase().trim();
}

/**
 * Finds the original category name from a normalized URL parameter
 * @param normalizedCategory - The normalized category from URL
 * @param categories - Array of valid category names
 * @returns The original category name or null if not found
 */
export function findOriginalCategory(
  normalizedCategory: string,
  categories: string[]
): string | null {
  const normalized = normalizedCategory.toLowerCase().trim();
  const found = categories.find(
    (cat) => cat.toLowerCase().trim() === normalized
  );
  return found || null;
}
