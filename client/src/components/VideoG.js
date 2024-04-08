// src/components/VideoG.js
import React, { useRef, useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Import the FaTimes icon from react-icons
import LoadingAnimation from './LoadingAnimation';

import '../Styles/VideoG.css';

const VideoG = ({ videoUrl, onClose }) => {

  
  const [loading, setLoading] = useState(true);

  const modalRef = useRef();



  useEffect(() => {
    setLoading(true);
    
    
    
    if (videoUrl) {
      
      setLoading(false); // Reset iframe loaded status when videoUrl changes
    }
    
  }, [videoUrl]);
    
  


  

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClickOutside}>
      <div className="modal-content" ref={modalRef}>
        <div className="video-container">
          <button onClick={onClose} className="top-close-btn"><FaTimes /></button>
          
          {loading ? (
            <>
                <div className='loader'>
                
                <h2>VIDEO IS LOADING</h2>
                <LoadingAnimation/>

                </div>
            </>
            
          ) : (
            <>
              
              <iframe
                title="Video Player"
                src={videoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </>
          )}
          
          <button onClick={onClose} className="close-btn" >Close</button>
        </div>
      </div>
    </div>
  );
};

export default VideoG;
