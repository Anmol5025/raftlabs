import { describe, test } from 'vitest';
import fc from 'fast-check';
import { isValidItem, isValidDataset } from './validation';
import { StartupItem } from './types';

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

describe('Item Validation Property Tests', () => {
  /**
   * Feature: content-directory-site, Property 1: Item validation accepts valid items
   * Validates: Requirements 1.3
   */
  test('Property 1: Item validation accepts valid items', () => {
    fc.assert(
      fc.property(validItemArbitrary(), (item) => {
        const result = isValidItem(item);
        return result === true;
      }),
      { numRuns: 100 }
    );
  });

  test('Item validation rejects items with missing name', () => {
    fc.assert(
      fc.property(validItemArbitrary(), (item) => {
        const { name, ...itemWithoutName } = item;
        const result = isValidItem(itemWithoutName);
        return result === false;
      }),
      { numRuns: 100 }
    );
  });

  test('Item validation rejects items with missing category', () => {
    fc.assert(
      fc.property(validItemArbitrary(), (item) => {
        const { category, ...itemWithoutCategory } = item;
        const result = isValidItem(itemWithoutCategory);
        return result === false;
      }),
      { numRuns: 100 }
    );
  });

  test('Item validation rejects items with missing tags', () => {
    fc.assert(
      fc.property(validItemArbitrary(), (item) => {
        const { tags, ...itemWithoutTags } = item;
        const result = isValidItem(itemWithoutTags);
        return result === false;
      }),
      { numRuns: 100 }
    );
  });

  test('Item validation rejects items with missing rating', () => {
    fc.assert(
      fc.property(validItemArbitrary(), (item) => {
        const { rating, ...itemWithoutRating } = item;
        const result = isValidItem(itemWithoutRating);
        return result === false;
      }),
      { numRuns: 100 }
    );
  });

  test('Item validation rejects items with missing description', () => {
    fc.assert(
      fc.property(validItemArbitrary(), (item) => {
        const { description, ...itemWithoutDescription } = item;
        const result = isValidItem(itemWithoutDescription);
        return result === false;
      }),
      { numRuns: 100 }
    );
  });

  test('Item validation rejects items with invalid rating (> 5)', () => {
    fc.assert(
      fc.property(
        validItemArbitrary(),
        fc.double({ min: 5.01, max: 100, noNaN: true }),
        (item, invalidRating) => {
          const itemWithInvalidRating = { ...item, rating: invalidRating };
          const result = isValidItem(itemWithInvalidRating);
          return result === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Item validation rejects items with invalid rating (< 0)', () => {
    fc.assert(
      fc.property(
        validItemArbitrary(),
        fc.double({ min: -100, max: -0.01, noNaN: true }),
        (item, invalidRating) => {
          const itemWithInvalidRating = { ...item, rating: invalidRating };
          const result = isValidItem(itemWithInvalidRating);
          return result === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Item validation rejects items with non-array tags', () => {
    fc.assert(
      fc.property(validItemArbitrary(), fc.string(), (item, nonArrayTags) => {
        const itemWithInvalidTags = { ...item, tags: nonArrayTags };
        const result = isValidItem(itemWithInvalidTags);
        return result === false;
      }),
      { numRuns: 100 }
    );
  });
});

describe('Dataset Validation Property Tests', () => {
  // Generate a valid dataset
  const validDatasetArbitrary = () => {
    return fc.record({
      type: fc.constantFrom('startups', 'ai-tools', 'designs', 'apis', 'movies'),
      items: fc.array(validItemArbitrary(), { minLength: 1, maxLength: 10 }),
      categories: fc.array(nonEmptyStringArbitrary(), { minLength: 1 }),
      tags: fc.array(nonEmptyStringArbitrary(), { minLength: 1 }),
    });
  };

  /**
   * Feature: content-directory-site, Property 2: Dataset validation identifies conforming items
   * Validates: Requirements 1.4
   */
  test('Property 2: Dataset validation identifies conforming items', () => {
    fc.assert(
      fc.property(validDatasetArbitrary(), (dataset) => {
        const result = isValidDataset(dataset);
        if (!result) {
          console.log('Validation failed for dataset:', JSON.stringify(dataset, null, 2));
        }
        return result === true;
      }),
      { numRuns: 10, verbose: true }
    );
  });

  test('Dataset validation rejects datasets without items array', () => {
    fc.assert(
      fc.property(validDatasetArbitrary(), (dataset) => {
        const { items, ...datasetWithoutItems } = dataset;
        const result = isValidDataset(datasetWithoutItems as any);
        return result === false;
      }),
      { numRuns: 100 }
    );
  });

  test('Dataset validation rejects datasets without type', () => {
    fc.assert(
      fc.property(validDatasetArbitrary(), (dataset) => {
        const { type, ...datasetWithoutType } = dataset;
        const result = isValidDataset(datasetWithoutType as any);
        return result === false;
      }),
      { numRuns: 100 }
    );
  });

  test('Dataset validation rejects datasets without categories', () => {
    fc.assert(
      fc.property(validDatasetArbitrary(), (dataset) => {
        const { categories, ...datasetWithoutCategories } = dataset;
        const result = isValidDataset(datasetWithoutCategories as any);
        return result === false;
      }),
      { numRuns: 100 }
    );
  });

  test('Dataset validation rejects datasets without tags', () => {
    fc.assert(
      fc.property(validDatasetArbitrary(), (dataset) => {
        const { tags, ...datasetWithoutTags } = dataset;
        const result = isValidDataset(datasetWithoutTags as any);
        return result === false;
      }),
      { numRuns: 100 }
    );
  });

  test('Dataset validation rejects datasets with invalid items', () => {
    fc.assert(
      fc.property(
        validDatasetArbitrary(),
        fc.integer({ min: 0, max: 9 }),
        (dataset, invalidIndex) => {
          // Create a copy with one invalid item (missing name field)
          const modifiedDataset = { ...dataset };
          if (modifiedDataset.items.length > invalidIndex) {
            const invalidItem = { ...modifiedDataset.items[invalidIndex] };
            delete (invalidItem as any).name;
            modifiedDataset.items = [
              ...modifiedDataset.items.slice(0, invalidIndex),
              invalidItem as any,
              ...modifiedDataset.items.slice(invalidIndex + 1),
            ];
            const result = isValidDataset(modifiedDataset);
            return result === false;
          }
          return true; // Skip if index out of bounds
        }
      ),
      { numRuns: 100 }
    );
  });
});
