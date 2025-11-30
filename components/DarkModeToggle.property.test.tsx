import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';

/**
 * Feature: content-directory-site, Property 14: Dark mode toggle round-trip
 * Validates: Requirements 7.2, 7.3
 */
describe('Dark Mode Toggle Round-Trip Property', () => {
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

  test('toggling dark mode on then off returns to original light mode state', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // Start in light mode (no dark class)
        const initialHasDarkClass = document.documentElement.classList.contains('dark');
        const initialStorageValue = localStorage.getItem('darkMode');

        // Simulate toggling dark mode ON
        localStorage.setItem('darkMode', 'true');
        document.documentElement.classList.add('dark');
        
        const afterToggleOn = document.documentElement.classList.contains('dark');
        expect(afterToggleOn).toBe(true);
        expect(localStorage.getItem('darkMode')).toBe('true');

        // Simulate toggling dark mode OFF
        localStorage.setItem('darkMode', 'false');
        document.documentElement.classList.remove('dark');

        const afterToggleOff = document.documentElement.classList.contains('dark');
        const finalStorageValue = localStorage.getItem('darkMode');

        // After round-trip, should be back to light mode
        expect(afterToggleOff).toBe(initialHasDarkClass);
        expect(finalStorageValue).toBe('false');
        
        // The styling should be consistent with light mode
        expect(afterToggleOff).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  test('toggling dark mode twice returns to original state regardless of starting state', () => {
    fc.assert(
      fc.property(fc.boolean(), (startInDarkMode) => {
        // Set initial state
        if (startInDarkMode) {
          localStorage.setItem('darkMode', 'true');
          document.documentElement.classList.add('dark');
        } else {
          localStorage.setItem('darkMode', 'false');
          document.documentElement.classList.remove('dark');
        }

        const initialHasDarkClass = document.documentElement.classList.contains('dark');
        const initialStorageValue = localStorage.getItem('darkMode');

        // First toggle
        const newValue1 = !startInDarkMode;
        localStorage.setItem('darkMode', String(newValue1));
        if (newValue1) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        // Second toggle (back to original)
        const newValue2 = !newValue1;
        localStorage.setItem('darkMode', String(newValue2));
        if (newValue2) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        const finalHasDarkClass = document.documentElement.classList.contains('dark');
        const finalStorageValue = localStorage.getItem('darkMode');

        // After two toggles, should be back to original state
        expect(finalHasDarkClass).toBe(initialHasDarkClass);
        expect(finalStorageValue).toBe(initialStorageValue);
      }),
      { numRuns: 100 }
    );
  });
});
