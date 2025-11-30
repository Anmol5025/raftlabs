import { getDataset, normalizeCategoryForUrl } from '@/lib/dataset';
import CategoryPageClient from './CategoryPageClient';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Generate static params for all categories at build time
export async function generateStaticParams() {
  const dataset = getDataset();
  
  return dataset.categories.map((category) => ({
    category: normalizeCategoryForUrl(category),
  }));
}

// Disable dynamic params to prevent 404s from being caught by this route
export const dynamicParams = false;

export default function CategoryPage({ params }: CategoryPageProps) {
  // Pass the normalized category parameter to the client component
  // The client component will handle resolution and error handling
  return <CategoryPageClient category={params.category} />;
}
