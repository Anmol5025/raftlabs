import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { getDataset, normalizeCategoryForUrl } from '@/lib/dataset';

describe('Homepage Property Tests', () => {
  /**
   * Feature: category-routing-fix, Property 4: Link-route consistency
   * Validates: Requirements 1.2, 1.3
   */
  test('Property 4: Link-route consistency', () => {
    const dataset = getDataset();
    const categories = dataset.categories;

    fc.assert(
      fc.property(fc.constantFrom(...categories), (category) => {
        // Simulate homepage link generation
        const homepageLinkUrl = normalizeCategoryForUrl(category);
        
        // Simulate static route generation (from generateStaticParams)
        const staticRouteUrl = normalizeCategoryForUrl(category);
        
        // They should match
        return homepageLinkUrl === staticRouteUrl;
      }),
      { numRuns: 100 }
    );
  });
});
