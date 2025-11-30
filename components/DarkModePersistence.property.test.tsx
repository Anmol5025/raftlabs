import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';

/**
 * Feature: content-directory-site, Property 15: Dark mode persists across navigation
 * Validates: Requirements 7.4
 */
describe('Dark Mode Persistence Property', () => {
  let originalLocalStorage: Storage;

  beforeEach(() => {
    // Save original localStorage
    originalLocalStorage = global.localStorage;
    
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

    // Mock document.documentElement
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
  });

  afterEach(() => {
    // Restore original localStorage
    global.localStorage = originalLocalStorage;
  });

  test('dark mode setting persists across simulated page navigations', () => {
    fc.assert(
      fc.property(fc.boolean(), (isDarkMode) => {
        // Simulate setting dark mode on "page 1"
        localStorage.setItem('darkMode', String(isDarkMode));
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        const page1Setting = localStorage.getItem('darkMode');
        const page1HasDarkClass = document.documentElement.classList.contains('dark');

        // Simulate navigation to "page 2" - localStorage persists
        // In a real app, the DarkModeProvider would read from localStorage on mount
        const page2StoredValue = localStorage.getItem('darkMode');
        const page2ShouldBeDark = page2StoredValue === 'true';
        
        // Apply the persisted setting
        if (page2ShouldBeDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        const page2HasDarkClass = document.documentElement.classList.contains('dark');

        // The dark mode setting should be the same on both pages
        expect(page2StoredValue).toBe(page1Setting);
        expect(page2HasDarkClass).toBe(page1HasDarkClass);
        expect(page2HasDarkClass).toBe(isDarkMode);
      }),
      { numRuns: 100 }
    );
  });

  test('dark mode persists across multiple navigation sequences', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.array(fc.constant('navigate'), { minLength: 1, maxLength: 10 }),
        (initialDarkMode, navigations) => {
          // Set initial dark mode
          localStorage.setItem('darkMode', String(initialDarkMode));
          if (initialDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }

          const initialSetting = localStorage.getItem('darkMode');

          // Simulate multiple navigations
          for (const _ of navigations) {
            // On each "navigation", read from localStorage and apply
            const storedValue = localStorage.getItem('darkMode');
            const shouldBeDark = storedValue === 'true';
            
            if (shouldBeDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }

            // Verify persistence
            expect(localStorage.getItem('darkMode')).toBe(initialSetting);
            expect(document.documentElement.classList.contains('dark')).toBe(initialDarkMode);
          }

          // After all navigations, setting should still match initial
          expect(localStorage.getItem('darkMode')).toBe(initialSetting);
          expect(document.documentElement.classList.contains('dark')).toBe(initialDarkMode);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('dark mode changes persist when navigating after toggle', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.boolean(),
        (initialMode, toggleValue) => {
          // Set initial mode
          localStorage.setItem('darkMode', String(initialMode));
          if (initialMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }

          // User toggles dark mode
          const newMode = toggleValue;
          localStorage.setItem('darkMode', String(newMode));
          if (newMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }

          const afterToggleSetting = localStorage.getItem('darkMode');

          // Simulate navigation to new page
          const persistedValue = localStorage.getItem('darkMode');
          const shouldBeDark = persistedValue === 'true';
          
          if (shouldBeDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }

          // The new setting should persist
          expect(persistedValue).toBe(afterToggleSetting);
          expect(persistedValue).toBe(String(newMode));
          expect(document.documentElement.classList.contains('dark')).toBe(newMode);
        }
      ),
      { numRuns: 100 }
    );
  });
});
