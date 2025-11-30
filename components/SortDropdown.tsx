'use client';

interface SortDropdownProps {
  value: 'name-asc' | 'name-desc' | 'rating-asc' | 'rating-desc';
  onChange: (value: 'name-asc' | 'name-desc' | 'rating-asc' | 'rating-desc') => void;
}

const sortOptions = [
  { value: 'name-asc' as const, label: 'Name (A-Z)' },
  { value: 'name-desc' as const, label: 'Name (Z-A)' },
  { value: 'rating-desc' as const, label: 'Rating (High to Low)' },
  { value: 'rating-asc' as const, label: 'Rating (Low to High)' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-3" role="group" aria-label="Sort options">
      <label 
        htmlFor="sort-select" 
        className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
        id="sort-label"
      >
        Sort by:
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as typeof value)}
          className="appearance-none block w-full pl-4 pr-10 py-2.5 
                   border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-white 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-colors duration-200
                   cursor-pointer"
          aria-labelledby="sort-label"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
