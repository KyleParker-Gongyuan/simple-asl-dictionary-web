// src/components/VideoList.js
import React, { useState, useEffect } from 'react';
import VideoG from './VideoG';
import SearchBar from './SearchBar';
import { getSignVid,getSignsList} from '../Scripts/SignApi';
import '../Styles/VideoList.css';

// src/components/VideoList.js

const VideoList = () => {
  
  const [videos, setVideos] = useState([]);

  const [errorShowAble, setError] = useState(null);
  
  const offsetAmount = 50
  const [dictionary, setdictionaryoffset] = useState(offsetAmount);

  const [currentVideo, setCurrentVideo] = useState(null);
  
  const handleClick = (video) => {
    singleVideos(video)

  };

  const [showVideoPlayer, setVideoPlayer] = useState(false);

  const handleCloseModal = () => {
    setVideoPlayer(false);
  };

  const [searchResults, setSearchResults] = useState(null);

  

  useEffect(() => {
    // Function to read TSV file and set its content to videos state
    try {
      

      const fetchData = async () => {
        try {
          const response = await getSignsList();
          
          setVideos(response);
          console.log("WE GOOD!")
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      // Call the function to fetch data when the component mounts
      fetchData();
      
      
      
    }
    catch(e){
      console.error('Error getting dictionar of signs:', e);
      setError("Error: [ " + e.message +" ] somthing broke and we cant get the dictionary ಥ_ಥ sorry,"); // Set error state if an error occurs

    }
    
  }, [dictionary]);
/*
  
  useEffect(() => {
    // Function to read TSV file and set its content to videos state
    try {
      const aslData = async () => {
        try {
          const dictionaryData = await getSignsList();
          setVideos(dictionaryData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      
      aslData();
      
      window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
      
    }
    catch(e){
      console.error('Error getting dictionar of signs:', e);
      setError("Error: [ " + e.message +" ] somthing broke and we cant get the dictionary ಥ_ಥ sorry,"); // Set error state if an error occurs

    }
    
  }, []); // Empty dependency array ensures that this effect runs only once
*/
  const handleScroll = () => {
    
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load next page if close to the end
      if (scrollPosition + windowHeight >= documentHeight - 20) {
        setdictionaryoffset(offsetPages => offsetPages + offsetAmount);

      }

      // Remove old words if close to the top
      if (scrollPosition <= 20) {
        // Remove words from the top of the list
        // (e.g., words 1 to 80 if current page is 101 to 200)
      }
  

  };



  const singleVideos = async (video) => {
    try {
      const response = await getSignVid(video.id);
      console.log(response)
      
      setCurrentVideo(response);
      setVideoPlayer(true);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError("Error: [ " + error.message +" ] somthing broke when getting the video"); // Set error state if an error occurs

    }
  };

  return (
    <div className='maincenter'>
      <h2>Sign Lanugage Dictionary</h2>
      
      <div className="searchBar">
      <SearchBar videos={videos} setSearchResults={setSearchResults} />
      </div>
      <div className="video-list">
        {(errorShowAble)? (<div className="error-txt"> <p>{errorShowAble}</p></div>):(
          
          
        (searchResults || videos).map(video => (
          <button 
            key={video.id} 
            className="video-button" 
            onClick={() => handleClick(video)}
          >
            {video.title}
          </button> 
          
        )))}
      </div>
      
      {showVideoPlayer && currentVideo && (
        <VideoG 
          videoUrl={currentVideo} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};


export default VideoList;