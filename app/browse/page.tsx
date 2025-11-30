'use client';

import { useState, useMemo } from 'react';
import { getDataset } from '@/lib/dataset';
import { searchItems, filterByTags, sortItems } from '@/lib/search-filter-sort';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { SortDropdown } from '@/components/SortDropdown';
import { ItemCard } from '@/components/ItemCard';
import { DatasetItem } from '@/lib/types';

// Note: Metadata export not supported in client components
// Metadata is handled by parent layout

export default function BrowsePage() {
  // Load dataset
  const dataset = getDataset();

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'rating-asc' | 'rating-desc'>('name-asc');

  // Apply filters and search
  const filteredItems = useMemo(() => {
    let items: DatasetItem[] = dataset.items;

    // Apply search
    if (searchQuery) {
      items = searchItems(items, searchQuery);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      items = items.filter(item => selectedCategories.includes(item.category));
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      items = filterByTags(items, selectedTags);
    }

    // Apply sorting
    items = sortItems(items, sortBy);

    return items;
  }, [dataset.items, searchQuery, selectedCategories, selectedTags, sortBy]);

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  // Count active filters
  const activeFilterCount = selectedCategories.length + selectedTags.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Browse All Items
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Explore our collection of {dataset.items.length} items
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, description, or tags..."
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel - Sidebar */}
          <aside className="lg:col-span-1" aria-label="Filters">
            <FilterPanel
              categories={dataset.categories}
              tags={dataset.tags}
              selectedCategories={selectedCategories}
              selectedTags={selectedTags}
              onCategoryChange={setSelectedCategories}
              onTagChange={setSelectedTags}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Items Grid - Main Content */}
          <section className="lg:col-span-3" aria-label="Browse results">
            {/* Results Header with Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredItems.length}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{dataset.items.length}</span> items
                {activeFilterCount > 0 && (
                  <span className="ml-2">
                    ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)
                  </span>
                )}
              </div>
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* Items Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" role="list">
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
                  Try adjusting your search or filters
                </p>
                {(searchQuery || activeFilterCount > 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      handleClearFilters();
                    }}
                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
                    aria-label="Clear all search and filter criteria"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
