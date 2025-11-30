import Link from 'next/link';
import { DatasetItem } from '@/lib/types';
import { ImageWithFallback } from './ImageWithFallback';

interface ItemCardProps {
  item: DatasetItem;
}

export function ItemCard({ item }: ItemCardProps) {
  // Truncate description to 120 characters
  const shortDescription = item.description.length > 120 
    ? item.description.substring(0, 120) + '...' 
    : item.description;

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
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
          <svg key={`empty-${i}`} className="w-4 h-4 fill-gray-300 dark:fill-gray-600" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Link 
      href={`/${item.slug}`}
      className="block group focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-500 rounded-lg"
      aria-label={`View details for ${item.name}`}
    >
      <article className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Image */}
        {item.imageUrl && (
          <div className="relative w-full h-40 sm:h-48 overflow-hidden">
            <ImageWithFallback
              src={item.imageUrl}
              alt={`${item.name} preview image`}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Card Content */}
        <div className="p-4 sm:p-6">
          {/* Header with name and category */}
          <div className="mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
              {item.name}
            </h3>
            <span className="inline-block px-2.5 sm:px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {item.category}
            </span>
          </div>

          {/* Rating */}
          <div className="mb-3">
            {renderStars(item.rating)}
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {shortDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 4 && (
              <span className="inline-block px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                +{item.tags.length - 4} more
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
