import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { Navigation } from './Navigation';
import { DarkModeToggle } from './DarkModeToggle';
import { DarkModeProvider } from './DarkModeProvider';

/**
 * Feature: content-directory-site, Property 13: Interactive elements support keyboard navigation
 * Validates: Requirements 6.3
 */
describe('Keyboard Navigation Property', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock: Record<string, string> = {};
    global.localStorage = {
      getItem: (key: string) => localStorageMock[key] || null,
      setItem: (key: string, value: string) => {
        localStorageMock[key] = value;
      },
      removeItem: (key: string) => {
        delete localStorageMock[key];
      },
      clear: () => {
        Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
      },
      key: (index: number) => Object.keys(localStorageMock)[index] || null,
      length: Object.keys(localStorageMock).length,
    } as Storage;
  });

  test('all interactive elements in Navigation are focusable', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(
          <DarkModeProvider>
            <Navigation />
          </DarkModeProvider>
        );

        // Get all interactive elements (links and buttons)
        const links = container.querySelectorAll('a');
        const buttons = container.querySelectorAll('button');
        const interactiveElements = [...Array.from(links), ...Array.from(buttons)];

        // Property: All interactive elements should be focusable
        // An element is focusable if it has tabIndex >= 0 or is naturally focusable (like <a> with href, <button>)
        interactiveElements.forEach((element) => {
          const tagName = element.tagName.toLowerCase();
          const hasHref = element.hasAttribute('href');
          const tabIndex = element.getAttribute('tabindex');
          
          // Check if element is naturally focusable or has explicit tabIndex
          const isFocusable = 
            (tagName === 'a' && hasHref) ||
            tagName === 'button' ||
            (tabIndex !== null && parseInt(tabIndex) >= 0);

          expect(isFocusable).toBe(true);
        });

        // Verify we found interactive elements
        expect(interactiveElements.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  test('DarkModeToggle button is focusable and has accessible label', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(
          <DarkModeProvider>
            <DarkModeToggle />
          </DarkModeProvider>
        );

        const button = container.querySelector('button');
        
        // Property: Button should exist and be focusable
        expect(button).not.toBeNull();
        expect(button?.tagName.toLowerCase()).toBe('button');
        
        // Property: Button should have aria-label for accessibility
        const ariaLabel = button?.getAttribute('aria-label');
        expect(ariaLabel).not.toBeNull();
        expect(ariaLabel).toBeTruthy();
        expect(typeof ariaLabel).toBe('string');
        expect(ariaLabel!.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  test('all links in Navigation have valid href attributes', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(
          <DarkModeProvider>
            <Navigation />
          </DarkModeProvider>
        );

        const links = container.querySelectorAll('a');

        // Property: All links should have href attribute (makes them keyboard navigable)
        links.forEach((link) => {
          const href = link.getAttribute('href');
          expect(href).not.toBeNull();
          expect(typeof href).toBe('string');
          expect(href!.length).toBeGreaterThan(0);
        });

        // Verify we found links
        expect(links.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  test('buttons in Navigation have appropriate accessibility attributes', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(
          <DarkModeProvider>
            <Navigation />
          </DarkModeProvider>
        );

        const buttons = container.querySelectorAll('button');

        // Property: All buttons should be keyboard accessible
        buttons.forEach((button) => {
          // Button element is inherently focusable
          expect(button.tagName.toLowerCase()).toBe('button');
          
          // Buttons should have either aria-label or visible text content
          const ariaLabel = button.getAttribute('aria-label');
          const textContent = button.textContent?.trim();
          const hasAccessibleName = (ariaLabel && ariaLabel.length > 0) || (textContent && textContent.length > 0);
          
          expect(hasAccessibleName).toBe(true);
        });

        // Verify we found buttons
        expect(buttons.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  test('interactive elements do not have negative tabindex that prevents keyboard access', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(
          <DarkModeProvider>
            <Navigation />
          </DarkModeProvider>
        );

        const interactiveElements = container.querySelectorAll('a, button, input, select, textarea');

        // Property: No interactive element should have tabindex="-1" which removes it from keyboard navigation
        interactiveElements.forEach((element) => {
          const tabIndex = element.getAttribute('tabindex');
          if (tabIndex !== null) {
            expect(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
          }
        });
      }),
      { numRuns: 100 }
    );
  });
});
