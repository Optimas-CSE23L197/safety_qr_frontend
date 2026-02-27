/**
 * useDebounce Hook
 * Delays updating a value until after a pause in changes.
 * Perfect for search inputs — don't fire API on every keystroke.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchTerm, 400);
 *   useEffect(() => { fetchStudents(debouncedSearch); }, [debouncedSearch]);
 */

import { useState, useEffect } from "react";

/**
 * @param {any} value - value to debounce
 * @param {number} delay - milliseconds to wait (default: 400ms)
 * @returns debounced value
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
