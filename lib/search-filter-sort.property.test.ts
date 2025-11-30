import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { searchItems, filterByCategory, filterByTags, filterByMinRating, sortItems } from './search-filter-sort';
import { DatasetItem } from './types';

// Arbitrary generator for DatasetItem
const datasetItemArbitrary = (): fc.Arbitrary<DatasetItem> => {
  return fc.record({
    id: fc.string(),
    slug: fc.string(),
    name: fc.string({ minLength: 1 }),
    description: fc.string({ minLength: 1 }),
    category: fc.string({ minLength: 1 }),
    tags: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 10 }),
    rating: fc.float({ min: 0, max: 5 }),
    imageUrl: fc.option(fc.webUrl(), { nil: undefined }),
    createdAt: fc.string(),
    // Add startup-specific fields as a simple case
    founder: fc.string(),
    fundingStage: fc.constantFrom('Seed', 'Series A', 'Series B', 'Series C'),
    website: fc.webUrl(),
    location: fc.string(),
  }) as fc.Arbitrary<DatasetItem>;
};

describe('Search functionality property tests', () => {
  /**
   * Feature: content-directory-site, Property 5: Search returns only matching items
   * Validates: Requirements 3.2, 5.4
   */
  test('search returns only items matching query in name, description, or tags', () => {
    fc.assert(
      fc.property(
        fc.array(datasetItemArbitrary(), { minLength: 0, maxLength: 50 }),
        fc.string(),
        (items, query) => {
          const results = searchItems(items, query);

          // If query is empty, all items should be returned
          if (!query || query.trim() === '') {
            expect(results).toEqual(items);
            return true;
          }

          const normalizedQuery = query.toLowerCase().trim();

          // All results must match the query
          return results.every(item => {
            const nameMatch = item.name.toLowerCase().includes(normalizedQuery);
            const descriptionMatch = item.description.toLowerCase().includes(normalizedQuery);
            const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(normalizedQuery));
            
            return nameMatch || descriptionMatch || tagMatch;
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Filter functionality property tests', () => {
  /**
   * Feature: content-directory-site, Property 6: Category filter returns only category items
   * Validates: Requirements 3.3, 5.1
   */
  test('category filter returns only items belonging to that category', () => {
    fc.assert(
      fc.property(
        fc.array(datasetItemArbitrary(), { minLength: 0, maxLength: 50 }),
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), // Exclude whitespace-only strings
        (items, category) => {
          const results = filterByCategory(items, category);

          // All results must belong to the specified category (case-insensitive)
          const normalizedCategory = category.toLowerCase().trim();
          return results.every(item => item.category.toLowerCase().trim() === normalizedCategory);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: category-routing-fix, Property 3: Case-insensitive filtering equivalence
   * Validates: Requirements 1.5, 2.2
   */
  test('filtering by category is case-insensitive - different case variations return same results', () => {
    fc.assert(
      fc.property(
        fc.array(datasetItemArbitrary(), { minLength: 0, maxLength: 50 }),
        fc.string({ minLength: 1 }),
        (items, category) => {
          // Generate different case variations of the category
          const lowercase = category.toLowerCase();
          const uppercase = category.toUpperCase();
          const titlecase = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

          // Filter with each variation
          const resultsLower = filterByCategory(items, lowercase);
          const resultsUpper = filterByCategory(items, uppercase);
          const resultsTitle = filterByCategory(items, titlecase);
          const resultsOriginal = filterByCategory(items, category);

          // All variations should return the same set of items
          const sameLength = 
            resultsLower.length === resultsUpper.length &&
            resultsUpper.length === resultsTitle.length &&
            resultsTitle.length === resultsOriginal.length;

          if (!sameLength) {
            return false;
          }

          // Check that all results contain the same items (by id)
          const lowerIds = new Set(resultsLower.map(item => item.id));
          const upperIds = new Set(resultsUpper.map(item => item.id));
          const titleIds = new Set(resultsTitle.map(item => item.id));
          const originalIds = new Set(resultsOriginal.map(item => item.id));

          // All sets should be equal
          const allEqual = 
            resultsLower.every(item => upperIds.has(item.id)) &&
            resultsUpper.every(item => titleIds.has(item.id)) &&
            resultsTitle.every(item => originalIds.has(item.id)) &&
            resultsOriginal.every(item => lowerIds.has(item.id));

          return allEqual;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: content-directory-site, Property 7: Tag filter returns only tagged items
   * Validates: Requirements 3.4
   */
  test('tag filter returns only items containing at least one of the specified tags', () => {
    fc.assert(
      fc.property(
        fc.array(datasetItemArbitrary(), { minLength: 0, maxLength: 50 }),
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
        (items, tags) => {
          const results = filterByTags(items, tags);

          // All results must contain at least one of the specified tags
          return results.every(item => 
            tags.some(tag => item.tags.includes(tag))
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Sort functionality property tests', () => {
  /**
   * Feature: content-directory-site, Property 8: Sort order is correct
   * Validates: Requirements 3.5
   */
  test('sort by name ascending returns items in alphabetical order', () => {
    fc.assert(
      fc.property(
        fc.array(datasetItemArbitrary(), { minLength: 0, maxLength: 50 }),
        (items) => {
          const results = sortItems(items, 'name-asc');

          // Check that each item is less than or equal to the next
          for (let i = 0; i < results.length - 1; i++) {
            if (results[i].name.localeCompare(results[i + 1].name) > 0) {
              return false;
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('sort by name descending returns items in reverse alphabetical order', () => {
    fc.assert(
      fc.property(
        fc.array(datasetItemArbitrary(), { minLength: 0, maxLength: 50 }),
        (items) => {
          const results = sortItems(items, 'name-desc');

          // Check that each item is greater than or equal to the next
          for (let i = 0; i < results.length - 1; i++) {
            if (results[i].name.localeCompare(results[i + 1].name) < 0) {
              return false;
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('sort by rating ascending returns items in increasing rating order', () => {
    fc.assert(
      fc.property(
        fc.array(datasetItemArbitrary(), { minLength: 0, maxLength: 50 }),
        (items) => {
          const results = sortItems(items, 'rating-asc');

          // Check that each item's rating is less than or equal to the next
          for (let i = 0; i < results.length - 1; i++) {
            if (results[i].rating > results[i + 1].rating) {
              return false;
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('sort by rating descending returns items in decreasing rating order', () => {
    fc.assert(
      fc.property(
        fc.array(datasetItemArbitrary(), { minLength: 0, maxLength: 50 }),
        (items) => {
          const results = sortItems(items, 'rating-desc');

          // Check that each item's rating is greater than or equal to the next
          for (let i = 0; i < results.length - 1; i++) {
            if (results[i].rating < results[i + 1].rating) {
              return false;
            }
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
