// src/components/VideoG.js
import React, { useRef, useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Import the FaTimes icon from react-icons

import '../Styles/VideoG.css';

const VideoG = ({ videoUrl, onClose }) => {

  
  const [iframeLoaded, setIframeLoaded] = useState(false); // State to track iframe loaded status
  const [loadingDots, setLoadingDots] = useState(''); // State for loading dots
  const modalRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots(prev => prev.length < 3 ? prev + '.' : '.');
    }, 200);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    

    const handleIframeLoad = () => {
      setIframeLoaded(true);
    };

    if (videoUrl) {
      
      setIframeLoaded(false); // Reset iframe loaded status when videoUrl changes
    }

    return () => {
      setIframeLoaded(false); // Reset iframe loaded status on component unmount
    };

    
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
          {videoUrl && iframeLoaded ? (
            <>
              // Render iframe when loaded
              <iframe
                title="Video Player"
                src={videoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </>
            
          ) : (
            <h2>VIDEO IS LOADING{loadingDots}</h2>
          )}
          
          <button onClick={onClose} className="close-btn" >Close</button>
        </div>
      </div>
    </div>
  );
};

export default VideoG;
