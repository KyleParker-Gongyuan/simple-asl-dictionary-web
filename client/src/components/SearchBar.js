// src/components/SearchBar.js
import React, { useState } from 'react';
import Fuse from 'fuse.js';
import '../Styles/SearchBar.css'; // Import the CSS file

const SearchBar = ({ videos, setSearchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    // If the query is empty, clear the search results
    if (value === '') {
      setSearchResults(null);
      return;
    }

    // Configure Fuse.js options
    const options = {
      includeScore: true,
      keys: ['title', 'extraData'] // Properties to search in
    };

    // Create a new Fuse instance
    const fuse = new Fuse(videos, options);

    // Perform fuzzy search
    const result = fuse.search(value);

    // Update search results
    setSearchResults(result.map(item => item.item));
  };

  return (
    <input
      type="text"
      className="search-bar" // Apply the CSS class
      placeholder="Search for Signs..."
      value={query}
      onChange={handleSearch}
    />
  );
};

export default SearchBar;