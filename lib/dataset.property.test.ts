import { describe, test } from 'vitest';
import fc from 'fast-check';
import { normalizeCategoryForUrl, findOriginalCategory, getDataset } from './dataset';

describe('URL Normalization Property Tests', () => {
  /**
   * Feature: category-routing-fix, Property 1: URL normalization is idempotent
   * Validates: Requirements 2.1
   */
  test('Property 1: URL normalization is idempotent', () => {
    fc.assert(
      fc.property(fc.string(), (category) => {
        const normalized = normalizeCategoryForUrl(category);
        const normalizedAgain = normalizeCategoryForUrl(normalized);
        return normalized === normalizedAgain;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: category-routing-fix, Property 2: Category round-trip preservation
   * Validates: Requirements 1.5
   */
  test('Property 2: Category round-trip preservation', () => {
    const dataset = getDataset();
    const categories = dataset.categories;

    fc.assert(
      fc.property(fc.constantFrom(...categories), (category) => {
        const normalized = normalizeCategoryForUrl(category);
        const original = findOriginalCategory(normalized, categories);
        return original === category;
      }),
      { numRuns: 100 }
    );
  });
});
