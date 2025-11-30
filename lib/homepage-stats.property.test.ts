import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { calculateHomepageStatistics } from './homepage-stats';
import { Dataset, StartupItem } from './types';

/**
 * Custom arbitraries for generating test data
 */

// Generate a valid rating (0-5)
const ratingArbitrary = () => fc.double({ min: 0, max: 5, noNaN: true });

// Generate a valid ISO date string
const isoDateArbitrary = () => {
  return fc.integer({ min: 2000, max: 2030 }).chain(year =>
    fc.integer({ min: 1, max: 12 }).chain(month =>
      fc.integer({ min: 1, max: 28 }).map(day =>
        `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      )
    )
  );
};

// Generate a non-empty string with actual content (not just whitespace)
const nonEmptyStringArbitrary = () => {
  return fc.string({ minLength: 1, maxLength: 50 }).map(s => s.trim() || 'a');
};

// Generate a valid item with all required fields
const validItemArbitrary = (): fc.Arbitrary<StartupItem> => {
  return fc.record({
    id: nonEmptyStringArbitrary(),
    slug: nonEmptyStringArbitrary(),
    name: nonEmptyStringArbitrary(),
    description: nonEmptyStringArbitrary(),
    category: nonEmptyStringArbitrary(),
    tags: fc.array(nonEmptyStringArbitrary(), { minLength: 1 }),
    rating: ratingArbitrary(),
    imageUrl: fc.option(fc.webUrl(), { nil: undefined }),
    createdAt: isoDateArbitrary(),
    // Startup-specific fields
    founder: nonEmptyStringArbitrary(),
    fundingStage: fc.constantFrom('Seed', 'Series A', 'Series B', 'Series C'),
    website: fc.webUrl(),
    location: nonEmptyStringArbitrary(),
  });
};

// Generate a valid dataset
const validDatasetArbitrary = (): fc.Arbitrary<Dataset> => {
  return fc.record({
    type: fc.constantFrom('startups', 'ai-tools', 'designs', 'apis', 'movies'),
    items: fc.array(validItemArbitrary(), { minLength: 1, maxLength: 50 }),
    categories: fc.array(nonEmptyStringArbitrary(), { minLength: 1, maxLength: 10 }),
    tags: fc.array(nonEmptyStringArbitrary(), { minLength: 1, maxLength: 20 }),
  });
};

describe('Homepage Statistics Property Tests', () => {
  /**
   * Feature: content-directory-site, Property 3: Homepage statistics match dataset
   * Validates: Requirements 2.3
   */
  test('Property 3: Homepage statistics match dataset', () => {
    fc.assert(
      fc.property(validDatasetArbitrary(), (dataset) => {
        const stats = calculateHomepageStatistics(dataset);
        
        // Total items should match the length of items array
        const totalItemsMatch = stats.totalItems === dataset.items.length;
        
        // Total categories should match the length of categories array
        const totalCategoriesMatch = stats.totalCategories === dataset.categories.length;
        
        // Total tags should match the length of tags array
        const totalTagsMatch = stats.totalTags === dataset.tags.length;
        
        // Average rating should be calculated correctly
        const expectedAverage = dataset.items.length > 0
          ? dataset.items.reduce((sum, item) => sum + item.rating, 0) / dataset.items.length
          : 0;
        
        // Allow for small floating point differences
        const averageRatingMatch = Math.abs(stats.averageRating - expectedAverage) < 0.0001;
        
        return totalItemsMatch && totalCategoriesMatch && totalTagsMatch && averageRatingMatch;
      }),
      { numRuns: 100 }
    );
  });

  test('Statistics for empty dataset should have zero items', () => {
    const emptyDataset: Dataset = {
      type: 'startups',
      items: [],
      categories: ['Category1'],
      tags: ['tag1'],
    };
    
    const stats = calculateHomepageStatistics(emptyDataset);
    
    expect(stats.totalItems).toBe(0);
    expect(stats.averageRating).toBe(0);
  });

  test('Statistics should handle single item correctly', () => {
    fc.assert(
      fc.property(validItemArbitrary(), (item) => {
        const dataset: Dataset = {
          type: 'startups',
          items: [item],
          categories: ['Category1'],
          tags: ['tag1'],
        };
        
        const stats = calculateHomepageStatistics(dataset);
        
        return (
          stats.totalItems === 1 &&
          Math.abs(stats.averageRating - item.rating) < 0.0001
        );
      }),
      { numRuns: 100 }
    );
  });

  test('Average rating should be within valid range (0-5)', () => {
    fc.assert(
      fc.property(validDatasetArbitrary(), (dataset) => {
        const stats = calculateHomepageStatistics(dataset);
        
        return stats.averageRating >= 0 && stats.averageRating <= 5;
      }),
      { numRuns: 100 }
    );
  });

  test('Total items should never be negative', () => {
    fc.assert(
      fc.property(validDatasetArbitrary(), (dataset) => {
        const stats = calculateHomepageStatistics(dataset);
        
        return stats.totalItems >= 0;
      }),
      { numRuns: 100 }
    );
  });

  test('Total categories should never be negative', () => {
    fc.assert(
      fc.property(validDatasetArbitrary(), (dataset) => {
        const stats = calculateHomepageStatistics(dataset);
        
        return stats.totalCategories >= 0;
      }),
      { numRuns: 100 }
    );
  });

  test('Total tags should never be negative', () => {
    fc.assert(
      fc.property(validDatasetArbitrary(), (dataset) => {
        const stats = calculateHomepageStatistics(dataset);
        
        return stats.totalTags >= 0;
      }),
      { numRuns: 100 }
    );
  });
});
