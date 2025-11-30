import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDataset } from '@/lib/dataset';
import { DatasetItem, StartupItem } from '@/lib/types';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import type { Metadata } from 'next';

// Generate static params for all items
export async function generateStaticParams() {
  const dataset = getDataset();
  return dataset.items.map((item) => ({
    slug: item.slug,
  }));
}

// Disable dynamic params to prevent 404s from being caught by this route
export const dynamicParams = false;

// Generate metadata for each item
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = getItemBySlug(params.slug);
  
  if (!item) {
    return {
      title: 'Item Not Found',
    };
  }

  return {
    title: `${item.name} - Content Directory`,
    description: item.description,
    openGraph: {
      title: item.name,
      description: item.description,
      type: 'article',
      images: item.imageUrl ? [{ url: item.imageUrl, alt: item.name }] : [],
    },
  };
}

// Get item by slug
function getItemBySlug(slug: string): DatasetItem | undefined {
  const dataset = getDataset();
  return dataset.items.find((item) => item.slug === slug);
}

// Get related items (same category, excluding current item)
function getRelatedItems(item: DatasetItem, limit: number = 3): DatasetItem[] {
  const dataset = getDataset();
  return dataset.items
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, limit);
}

export default function ItemDetailPage({ params }: { params: { slug: string } }) {
  const item = getItemBySlug(params.slug);

  if (!item) {
    notFound();
  }

  const relatedItems = getRelatedItems(item);

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-5 h-5 fill-gray-300 dark:fill-gray-600" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="ml-2 text-lg text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Render dataset-specific fields
  const renderDatasetSpecificFields = (item: DatasetItem) => {
    // Type guard for StartupItem
    if ('founder' in item && 'fundingStage' in item && 'website' in item && 'location' in item) {
      const startupItem = item as StartupItem;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Founder</h3>
            <p className="text-gray-900 dark:text-white">{startupItem.founder}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Funding Stage</h3>
            <p className="text-gray-900 dark:text-white">{startupItem.fundingStage}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</h3>
            <p className="text-gray-900 dark:text-white">{startupItem.location}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Website</h3>
            <a
              href={startupItem.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {startupItem.website}
            </a>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/browse" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Browse
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 dark:text-white font-medium" aria-current="page">
              {item.name}
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/browse"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Browse
          </Link>
        </div>

        {/* Main Content */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Hero Image */}
          {item.imageUrl && (
            <div className="relative w-full h-96 overflow-hidden">
              <ImageWithFallback
                src={item.imageUrl}
                alt={`${item.name} featured image`}
                width={1200}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="inline-block px-4 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {item.category}
                    </span>
                    {renderStars(item.rating)}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Dataset-Specific Fields */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Details
              </h2>
              {renderDatasetSpecificFields(item)}
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Added on
              </h3>
              <p className="text-gray-900 dark:text-white">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </article>

        {/* Related Items Section */}
        {relatedItems.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Items in {item.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  href={`/${relatedItem.slug}`}
                  className="block group"
                >
                  <article className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                        {relatedItem.name}
                      </h3>
                      <div className="mb-3">
                        {renderStars(relatedItem.rating)}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        {relatedItem.description}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
