'use client';

import { useState } from 'react';

interface FilterPanelProps {
  categories: string[];
  tags: string[];
  selectedCategories: string[];
  selectedTags: string[];
  onCategoryChange: (categories: string[]) => void;
  onTagChange: (tags: string[]) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  categories,
  tags,
  selectedCategories,
  selectedTags,
  onCategoryChange,
  onTagChange,
  onClearFilters,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label={isOpen ? 'Collapse filters' : 'Expand filters'}
            aria-expanded={isOpen}
          >
            <svg
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <form className="p-4 space-y-6" role="search" aria-label="Filter items">
          {/* Categories Section */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Categories
            </legend>
            <div className="space-y-2 max-h-48 overflow-y-auto" role="group" aria-label="Category filters">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    aria-label={`Filter by ${category} category`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Tags Section */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Tags
            </legend>
            <div className="space-y-2 max-h-64 overflow-y-auto" role="group" aria-label="Tag filters">
              {tags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    aria-label={`Filter by ${tag} tag`}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 
                       bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 
                       rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Clear all active filters"
            >
              Clear All Filters
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
