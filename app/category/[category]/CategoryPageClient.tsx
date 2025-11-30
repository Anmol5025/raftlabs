'use client';

import { useState, useMemo } from 'react';
import { getDataset, findOriginalCategory } from '@/lib/dataset';
import { searchItems, filterByCategory, sortItems } from '@/lib/search-filter-sort';
import { SearchBar } from '@/components/SearchBar';
import { SortDropdown } from '@/components/SortDropdown';
import { ItemCard } from '@/components/ItemCard';
import Link from 'next/link';

interface CategoryPageClientProps {
  category: string;
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  // Load dataset
  const dataset = getDataset();
  
  // Resolve normalized category parameter to original category name
  const originalCategory = findOriginalCategory(category, dataset.categories);
  
  // Handle invalid category
  if (!originalCategory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The category &quot;{category}&quot; does not exist.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
            >
              Browse All Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State for search and sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'rating-asc' | 'rating-desc'>('name-asc');

  // Filter items by category and apply search/sort
  const filteredItems = useMemo(() => {
    // First filter by category using the original category name
    let items = filterByCategory(dataset.items, originalCategory);

    // Apply search if query exists
    if (searchQuery) {
      items = searchItems(items, searchQuery);
    }

    // Apply sorting
    items = sortItems(items, sortBy);

    return items;
  }, [dataset.items, originalCategory, searchQuery, sortBy]);

  // Get the total count of items in this category (before search)
  const categoryItemCount = useMemo(() => {
    return filterByCategory(dataset.items, originalCategory).length;
  }, [dataset.items, originalCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/" 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-600" aria-hidden="true">/</li>
            <li>
              <Link 
                href="/browse" 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Browse
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-600" aria-hidden="true">/</li>
            <li className="text-gray-900 dark:text-white font-medium" aria-current="page">
              {originalCategory}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {originalCategory}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {categoryItemCount} {categoryItemCount === 1 ? 'item' : 'items'} in this category
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search in ${originalCategory}...`}
          />
        </div>

        {/* Results Header with Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredItems.length}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{categoryItemCount}</span> items
            {searchQuery && (
              <span className="ml-2">
                matching &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {filteredItems.map((item) => (
              <div key={item.id} role="listitem">
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" role="status">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No items found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? `No items in ${originalCategory} match your search "${searchQuery}"`
                : `No items found in ${originalCategory}`
              }
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
                aria-label="Clear search query"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Back to Browse Link */}
        <div className="mt-8">
          <Link
            href="/browse"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to all items
          </Link>
        </div>
      </div>
    </div>
  );
}
