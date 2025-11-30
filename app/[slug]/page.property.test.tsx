import { describe, test, vi, beforeEach } from 'vitest';
import fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import ItemDetailPage from './page';
import { StartupItem } from '@/lib/types';
import * as datasetModule from '@/lib/dataset';

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

// Generate a slug-safe string
const slugArbitrary = () => {
  return fc.string({ minLength: 1, maxLength: 30 })
    .map(s => s.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'test-slug');
};

// Generate a valid startup item with all required fields
const validStartupItemArbitrary = (): fc.Arbitrary<StartupItem> => {
  return fc.record({
    id: nonEmptyStringArbitrary(),
    slug: slugArbitrary(),
    name: nonEmptyStringArbitrary(),
    description: nonEmptyStringArbitrary(),
    category: nonEmptyStringArbitrary(),
    tags: fc.array(nonEmptyStringArbitrary(), { minLength: 1, maxLength: 5 }),
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

// Mock the dataset module to return our test data
const mockDataset = (item: StartupItem) => {
  const dataset = {
    type: 'startups' as const,
    items: [item],
    categories: [item.category],
    tags: item.tags,
  };

  // Mock the getDataset function
  vi.spyOn(datasetModule, 'getDataset').mockReturnValue(dataset);
};

describe('Item Detail Page Property Tests', () => {
  /**
   * Feature: content-directory-site, Property 9: Item detail page contains all fields
   * Validates: Requirements 4.2
   */
  test('Property 9: Item detail page contains all fields', () => {
    fc.assert(
      fc.property(validStartupItemArbitrary(), (item) => {
        // Clear mocks before each property test iteration
        vi.clearAllMocks();
        
        // Mock the dataset to include this item
        mockDataset(item);

        // Render the page
        const { container, unmount } = render(<ItemDetailPage params={{ slug: item.slug }} />);
        const pageText = container.textContent || '';

        // Check that all base fields are present in the rendered output
        const hasName = pageText.includes(item.name);
        const hasDescription = pageText.includes(item.description);
        const hasCategory = pageText.includes(item.category);
        const hasRating = pageText.includes(item.rating.toFixed(1));
        
        // Check that all tags are present
        const hasTags = item.tags.every(tag => pageText.includes(tag));

        // Check that dataset-specific fields are present (for StartupItem)
        const hasFounder = pageText.includes(item.founder);
        const hasFundingStage = pageText.includes(item.fundingStage);
        const hasWebsite = pageText.includes(item.website);
        const hasLocation = pageText.includes(item.location);

        // Check that the created date is present (formatted)
        const date = new Date(item.createdAt);
        const hasDate = pageText.includes(date.getFullYear().toString());

        // Clean up
        unmount();

        return (
          hasName &&
          hasDescription &&
          hasCategory &&
          hasRating &&
          hasTags &&
          hasFounder &&
          hasFundingStage &&
          hasWebsite &&
          hasLocation &&
          hasDate
        );
      }),
      { numRuns: 100 }
    );
  });
});
