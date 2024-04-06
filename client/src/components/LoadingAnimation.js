// src/components/SearchBar.js
import React, { useState } from 'react';

import './animation.css'

const LoadingAnimation = ({ videos, setSearchResults, onSearchRequest }) => {

  return (
    <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  );
};

export default LoadingAnimation;