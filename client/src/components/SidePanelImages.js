
import React from 'react';

const SidePanelImages = ({ isOpen, onClose, imagePaths }) => {
  return (
    <div className={`side-panel ${isOpen ? 'open' : ''}`}>
      <button onClick={onClose}>Close</button>
      <h2>Alphabet</h2>
      <div className="image-list">
        {imagePaths.map((imagePath, index) => (
          <img key={index} src={imagePath} alt={`Image ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default SidePanelImages;
