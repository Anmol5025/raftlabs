import { BaseItem, Dataset, DatasetItem } from './types';

/**
 * Validates that an item has all required fields
 * @param item The item to validate
 * @returns true if the item is valid, false otherwise
 */
export function isValidItem(item: any): item is DatasetItem {
  // Check if item is an object
  if (!item || typeof item !== 'object') {
    console.error('Validation failed: Item is not an object');
    return false;
  }

  // Check required fields exist and have correct types
  const requiredFields = {
    name: 'string',
    category: 'string',
    tags: 'array',
    rating: 'number',
    description: 'string',
  };

  for (const [field, expectedType] of Object.entries(requiredFields)) {
    if (!(field in item)) {
      console.error(`Validation failed: Missing required field "${field}"`);
      return false;
    }

    const value = item[field];
    
    if (expectedType === 'array') {
      if (!Array.isArray(value)) {
        console.error(`Validation failed: Field "${field}" must be an array`);
        return false;
      }
      // Validate that tags array contains only strings
      if (field === 'tags' && !value.every((tag: any) => typeof tag === 'string')) {
        console.error(`Validation failed: Field "${field}" must contain only strings`);
        return false;
      }
    } else if (typeof value !== expectedType) {
      console.error(`Validation failed: Field "${field}" must be of type ${expectedType}`);
      return false;
    }
  }

  // Validate rating is within valid range (0-5)
  if (item.rating < 0 || item.rating > 5) {
    console.error(`Validation failed: Rating must be between 0 and 5, got ${item.rating}`);
    return false;
  }

  return true;
}

/**
 * Validates that all items in a dataset conform to the schema
 * @param dataset The dataset to validate
 * @returns true if all items are valid, false if any item is invalid
 */
export function isValidDataset(dataset: any): dataset is Dataset {
  // Check if dataset is an object
  if (!dataset || typeof dataset !== 'object') {
    console.error('Validation failed: Dataset is not an object');
    return false;
  }

  // Check that dataset has required properties
  if (!('items' in dataset) || !Array.isArray(dataset.items)) {
    console.error('Validation failed: Dataset must have an "items" array');
    return false;
  }

  if (!('type' in dataset) || typeof dataset.type !== 'string') {
    console.error('Validation failed: Dataset must have a "type" string');
    return false;
  }

  if (!('categories' in dataset) || !Array.isArray(dataset.categories)) {
    console.error('Validation failed: Dataset must have a "categories" array');
    return false;
  }

  if (!('tags' in dataset) || !Array.isArray(dataset.tags)) {
    console.error('Validation failed: Dataset must have a "tags" array');
    return false;
  }

  // Validate each item in the dataset
  const invalidItems: number[] = [];
  dataset.items.forEach((item: any, index: number) => {
    if (!isValidItem(item)) {
      invalidItems.push(index);
    }
  });

  if (invalidItems.length > 0) {
    console.error(`Validation failed: ${invalidItems.length} invalid item(s) at indices: ${invalidItems.join(', ')}`);
    return false;
  }

  return true;
}
