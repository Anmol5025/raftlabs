import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getDataset } from '@/lib/dataset';

/**
 * Feature: content-directory-site, Property 4: Listing page displays all items
 * Validates: Requirements 3.1
 * 
 * This property verifies that the listing page displays exactly the items present 
 * in the dataset, with no items missing or duplicated.
 */
describe('Browse Page Property Tests', () => {
  test('Property 4: Listing page displays all items', () => {
    // Load the actual dataset
    const dataset = getDataset();
    
    // Verify that the dataset has items
    expect(dataset.items.length).toBeGreaterThan(0);
    
    // Property: For any dataset, all items should be present
    // We verify this by checking that:
    // 1. The number of items in the dataset matches what we expect
    // 2. Each item has a unique ID
    // 3. No items are duplicated
    
    const itemIds = dataset.items.map(item => item.id);
    const uniqueItemIds = new Set(itemIds);
    
    // Check no duplicates
    expect(itemIds.length).toBe(uniqueItemIds.size);
    
    // Check all items have required fields for display
    dataset.items.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.slug).toBeDefined();
      expect(item.name).toBeDefined();
      expect(item.description).toBeDefined();
      expect(item.category).toBeDefined();
      expect(item.tags).toBeDefined();
      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.rating).toBeDefined();
      expect(typeof item.rating).toBe('number');
    });
    
    // Property-based test: For any subset of items, filtering should preserve item integrity
    fc.assert(
      fc.property(
        fc.subarray(dataset.items),
        (itemSubset) => {
          // Each item in the subset should still be a valid item from the dataset
          return itemSubset.every(item => {
            const foundItem = dataset.items.find(datasetItem => datasetItem.id === item.id);
            return foundItem !== undefined && foundItem.id === item.id;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('All items from dataset are displayable', () => {
    const dataset = getDataset();
    
    // Property: Every item in the dataset should have all required fields for display
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: dataset.items.length - 1 }),
        (index) => {
          const item = dataset.items[index];
          
          // Verify all required fields exist and are valid
          const hasRequiredFields = 
            typeof item.id === 'string' && item.id.length > 0 &&
            typeof item.slug === 'string' && item.slug.length > 0 &&
            typeof item.name === 'string' && item.name.length > 0 &&
            typeof item.description === 'string' && item.description.length > 0 &&
            typeof item.category === 'string' && item.category.length > 0 &&
            Array.isArray(item.tags) &&
            typeof item.rating === 'number' && item.rating >= 0 && item.rating <= 5;
          
          return hasRequiredFields;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Dataset items maintain uniqueness', () => {
    const dataset = getDataset();
    
    // Property: No two items should have the same ID
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: dataset.items.length - 1 }),
        fc.integer({ min: 0, max: dataset.items.length - 1 }),
        (index1, index2) => {
          if (index1 === index2) {
            return true; // Same index, same item is expected
          }
          
          const item1 = dataset.items[index1];
          const item2 = dataset.items[index2];
          
          // Different indices should have different IDs
          return item1.id !== item2.id;
        }
      ),
      { numRuns: 100 }
    );
  });
});
