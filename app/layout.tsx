import type { Metadata } from "next";
import "./globals.css";
import { DarkModeProvider } from "@/components/DarkModeProvider";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Content Directory - Browse and Discover",
  description: "A modern content directory website with comprehensive browsing, searching, and filtering capabilities",
  keywords: ["directory", "content", "browse", "search", "filter"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <DarkModeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg">
            Skip to main content
          </a>
          <Navigation />
          <main id="main-content">
            {children}
          </main>
          <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} Content Directory. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </DarkModeProvider>
      </body>
    </html>
  );
}
