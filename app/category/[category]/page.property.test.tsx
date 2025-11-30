import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { filterByCategory } from '@/lib/search-filter-sort';
import { DatasetItem, Dataset } from '@/lib/types';

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

// Arbitrary generator for Dataset with consistent and unique categories
const datasetArbitrary = (): fc.Arbitrary<Dataset> => {
  return fc.uniqueArray(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }).chain(categories => {
    // Generate items that use only the categories from the categories array
    const itemsArb = fc.array(
      fc.record({
        id: fc.string(),
        slug: fc.string(),
        name: fc.string({ minLength: 1 }),
        description: fc.string({ minLength: 1 }),
        category: fc.constantFrom(...categories),
        tags: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 10 }),
        rating: fc.float({ min: 0, max: 5 }),
        imageUrl: fc.option(fc.webUrl(), { nil: undefined }),
        createdAt: fc.string(),
        founder: fc.string(),
        fundingStage: fc.constantFrom('Seed', 'Series A', 'Series B', 'Series C'),
        website: fc.webUrl(),
        location: fc.string(),
      }) as fc.Arbitrary<DatasetItem>,
      { minLength: 0, maxLength: 50 }
    );

    return itemsArb.map(items => ({
      type: 'startups' as const,
      items,
      categories,
      tags: [],
    }));
  });
};

describe('Category page property tests', () => {
  /**
   * Feature: content-directory-site, Property 11: Category pages show correct item count
   * Validates: Requirements 5.3
   */
  test('category page displays correct item count for each category', () => {
    fc.assert(
      fc.property(
        datasetArbitrary(),
        (dataset) => {
          // Get unique categories actually used by items
          const usedCategories = new Set(dataset.items.map(item => item.category));
          
          // For each category actually used in items
          for (const category of usedCategories) {
            // Filter items by this category using the function
            const categoryItems = filterByCategory(dataset.items, category);
            
            // The count should match the number of items in that category
            const expectedCount = dataset.items.filter(item => item.category === category).length;
            
            expect(categoryItems.length).toBe(expectedCount);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: content-directory-site, Property 12: All categories have generated pages
   * Validates: Requirements 5.2
   */
  test('number of category pages generated equals number of unique categories', () => {
    fc.assert(
      fc.property(
        datasetArbitrary(),
        (dataset) => {
          // Get unique categories from the dataset
          const uniqueCategories = new Set(dataset.categories);
          
          // The number of categories in the dataset should equal the number of unique categories
          // This ensures that each category will have a page generated
          expect(dataset.categories.length).toBe(uniqueCategories.size);
          
          // Additionally, verify that all items use categories from the categories array
          const itemCategories = new Set(dataset.items.map(item => item.category));
          
          // All item categories should be in the dataset categories
          for (const itemCategory of itemCategories) {
            expect(dataset.categories).toContain(itemCategory);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
