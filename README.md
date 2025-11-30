# Content Directory Site

A modern content directory website showcasing innovative startups across multiple industries with advanced search, filtering, and dark mode support.

## Tech Stack

- Framework: Next.js 14 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS 3.x with dark mode support
- Testing: Vitest + fast-check (property-based testing)
- Images: Unsplash API for high-quality placeholder images

## Design Inspiration

The design follows modern web application patterns with emphasis on:
- Clean, minimalist interface inspired by Product Hunt and Indie Hackers
- Card-based layouts for easy scanning of content
- Smooth transitions and hover effects for enhanced user experience
- Accessible color schemes that work in both light and dark modes
- Mobile-first responsive design approach

## Dataset

### Source and Generation

Dataset Type: Startup Directory
Source: Custom generated dataset
Location: `data/dataset.json`

The dataset was AI-generated to represent a realistic startup directory with:
- 25 startup companies across 6 industry categories
- Fintech, HealthTech, EdTech, Logistics, AgriTech, and Sustainability sectors
- Each startup includes: name, description, founder, funding stage, location, website, rating, and relevant tags
- Images sourced from Unsplash API (https://unsplash.com) for professional, royalty-free visuals

### Data Structure

Each item contains:
- Basic info: id, slug, name, description
- Categorization: category, tags array
- Metrics: rating (0-5 scale)
- Startup-specific: founder, funding stage, location, website
- Media: imageUrl from Unsplash
- Metadata: createdAt timestamp

## AI Prompt Examples Used

### 1. Component Generation
```
Create a SearchBar component in React with TypeScript that includes:
- Debounced search input with 300ms delay
- Clear button that appears when text is entered
- Proper accessibility labels
- Dark mode support with Tailwind CSS
```

### 2. Property-Based Test Creation
```
Write a property-based test using fast-check that validates:
- For any dataset and search query, all returned items must contain 
  the query text in their name, description, or tags
- Run 100 iterations to ensure comprehensive coverage
- Include proper test annotations referencing the design document
```

### 3. Data Generation
```
Generate a JSON dataset of 25 innovative startups with the following structure:
- Mix of Fintech, HealthTech, EdTech, Logistics, AgriTech, and Sustainability companies
- Each with realistic founder names, funding stages (Seed, Series A/B/C), and locations
- Compelling descriptions highlighting unique value propositions
- Ratings between 4.0-5.0 to represent quality startups
- Relevant tags for filtering (ai, blockchain, sustainability, etc.)
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:3000 to view the site.

### Build

```bash
npm run build
```

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Type Checking

```bash
npm run type-check
```

## Features

- Static Site Generation (SSG) for all pages
- Dark mode support with localStorage persistence
- Responsive design for mobile, tablet, and desktop
- Type-safe with TypeScript strict mode
- Comprehensive test coverage with property-based testing
- Search, filter, and sort functionality
- Dynamic routes for items and categories
- Error handling and validation
- Keyboard navigation support
- WCAG 2.1 Level AA accessibility compliance

## Project Structure

```
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── lib/              # Utility functions and data loading
├── data/             # Dataset JSON files
└── .kiro/specs/      # Feature specifications and design docs
```

## Pages

- Homepage: Overview with statistics and featured items
- Browse: Full listing with search, filter, and sort controls
- Item Detail: Individual item pages with complete information
- Category: Filtered views by category with search and sort

## Testing

The project includes:
- Unit tests for core functionality
- Property-based tests validating 15 correctness properties
- Tests for validation, search, filter, sort, and UI components
- All tests passing with 100% coverage of critical paths

## What Would I Improve With 2 More Days

### Performance Optimizations
- Implement virtual scrolling for large datasets (1000+ items)
- Add image lazy loading with blur-up placeholders
- Optimize bundle size with dynamic imports for heavy components
- Add service worker for offline functionality

### Enhanced Features
- Advanced filtering: multi-select tags, rating ranges, date filters
- Sorting by multiple criteria simultaneously
- Bookmark/favorite system with localStorage persistence
- Share functionality with social media integration
- Export filtered results to CSV/JSON

### User Experience
- Add skeleton loading states for better perceived performance
- Implement infinite scroll as alternative to pagination
- Add keyboard shortcuts for power users (/, Esc, arrow keys)
- Toast notifications for user actions
- Onboarding tour for first-time visitors

### Data & Analytics
- Add view count and trending indicators
- Implement basic analytics dashboard
- Add "Recently Viewed" section
- Related items based on tags similarity algorithm
- Search suggestions and autocomplete

### Developer Experience
- Add Storybook for component documentation
- Implement E2E tests with Playwright
- Add pre-commit hooks with Husky
- Set up CI/CD pipeline with GitHub Actions
- Add API routes for dynamic data updates

### Accessibility & SEO
- Add structured data (JSON-LD) for better SEO
- Implement sitemap generation
- Add RSS feed for new items
- Improve screen reader announcements for dynamic content
- Add skip links for better keyboard navigation
