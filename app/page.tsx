import Link from 'next/link';
import { getDataset, normalizeCategoryForUrl } from '@/lib/dataset';
import { ItemCard } from '@/components/ItemCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Directory - Discover Innovative Startups',
  description: 'Explore our curated directory of cutting-edge startups across fintech, healthtech, edtech, and more. Find the next big thing in innovation.',
  openGraph: {
    title: 'Content Directory - Discover Innovative Startups',
    description: 'Explore our curated directory of cutting-edge startups',
    type: 'website',
  },
};

export default function Home() {
  const dataset = getDataset();
  
  // Calculate statistics
  const totalItems = dataset.items.length;
  const totalCategories = dataset.categories.length;
  const totalTags = dataset.tags.length;
  
  // Get featured items (top-rated items, limit to 3)
  const featuredItems = [...dataset.items]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  
  // Calculate average rating
  const averageRating = (
    dataset.items.reduce((sum, item) => sum + item.rating, 0) / totalItems
  ).toFixed(1);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-12 sm:py-16 md:py-20 px-4" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto text-center">
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Discover Innovative Startups
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto px-4">
            Explore our curated directory of cutting-edge startups across fintech, healthtech, edtech, and more. 
            Find the next big thing in innovation.
          </p>
          <Link
            href="/browse"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 dark:bg-blue-100 dark:text-blue-900 dark:hover:bg-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
          >
            Browse All Startups
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50 dark:bg-gray-800" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="stats-heading" className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white">
            Directory Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" role="list">
            {/* Total Items Card */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-600" role="listitem">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2" aria-label={`${totalItems} total startups`}>
                {totalItems}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                Total Startups
              </div>
            </div>

            {/* Total Categories Card */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-600" role="listitem">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2" aria-label={`${totalCategories} categories`}>
                {totalCategories}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                Categories
              </div>
            </div>

            {/* Total Tags Card */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-600" role="listitem">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2" aria-label={`${totalTags} technology tags`}>
                {totalTags}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                Technology Tags
              </div>
            </div>

            {/* Average Rating Card */}
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 sm:p-6 text-center border border-gray-200 dark:border-gray-600" role="listitem">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2" aria-label={`${averageRating} average rating out of 5`}>
                {averageRating}
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-white dark:bg-gray-900" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8 sm:mb-12">
            <h2 id="featured-heading" className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
              Featured Startups
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4">
              Check out our top-rated startups making waves in their industries
            </p>
          </header>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/browse"
              className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
            >
              View All Startups
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Preview Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50 dark:bg-gray-800" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="categories-heading" className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white">
            Explore by Category
          </h2>
          <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4" aria-label="Category navigation">
            {dataset.categories.map((category) => {
              const categoryCount = dataset.items.filter(
                item => item.category === category
              ).length;
              
              return (
                <Link
                  key={category}
                  href={`/category/${normalizeCategoryForUrl(category)}`}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl p-4 sm:p-6 text-center transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 group focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500"
                  aria-label={`View ${categoryCount} ${categoryCount === 1 ? 'startup' : 'startups'} in ${category}`}
                >
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1 sm:mb-2">
                    {category}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {categoryCount} {categoryCount === 1 ? 'startup' : 'startups'}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </section>
    </>
  );
}
