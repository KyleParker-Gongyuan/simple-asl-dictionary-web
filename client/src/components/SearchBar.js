// src/components/SearchBar.js
import React, { useState } from 'react';
import Fuse from 'fuse.js';
import '../scssStyle/SearchBar.css'
import { FaSearch } from 'react-icons/fa';
const SearchBar = ({ videos, setSearchResults, onSearchRequest }) => {
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
  const handleQuery = () => {
    onSearchRequest(query); // Call the callback function with the query
  }

  return (
    <div className="search-container">
      
        <input
          type="text"
          className="search-bar" // Apply the CSS class
          placeholder="Search for Signs..."
          value={query}
          onChange={handleSearch}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              handleQuery();
            }
          }}

        />
        <button onClick={handleQuery}>
        <FaSearch />
        </button>
    </div>
  );
};

export default SearchBar;