// Test the search functionality
console.log('Testing search with "car" and "lagos"');

// Expected routing behavior:
// If search input is "car" and location is "lagos"
// Should route to /product/car?location=lagos

// Simulate the handleSearch function
const handleSearch = (searchTerm, location) => {
  if (searchTerm.trim() === '') {
    return '/product';
  } else {
    const term = searchTerm.trim();
    const queryParams = location.trim() ? `?location=${encodeURIComponent(location.trim())}` : '';
    return `/product/${encodeURIComponent(term)}${queryParams}`;
  }
};

// Test with user's example
const result = handleSearch('car', 'lagos');
console.log('Result:', result); // Should output: "/product/car?location=lagos"

// Test edge cases
console.log('Empty search:', handleSearch('', 'lagos')); // "/product"
console.log('Search only:', handleSearch('car', '')); // "/product/car"
console.log('Search with spaces:', handleSearch('electric car', 'los angeles')); // "/product/electric%20car?location=los%20angeles"
