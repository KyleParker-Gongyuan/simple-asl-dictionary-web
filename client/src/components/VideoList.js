// src/components/VideoList.js
import React, { useState, useEffect } from 'react';
import VideoG from './VideoG';
import SearchBar from './SearchBar';
import { getSignVid,getSignsList} from '../Scripts/SignApi';
import '../Styles/VideoList.css';

// src/components/VideoList.js

const VideoList = ({ data }) => {
  
  const [dictionaryWords, setDictionaryWords] = useState(data);

  const [errorShowAble, setError] = useState(null);
  
  const offsetAmount = 50
  const [dictionary, setdictionaryoffset] = useState(offsetAmount);

  const [currentVideo, setCurrentVideo] = useState(null);
  

  const [uniqueIds, setUniqueIds] = useState(new Set());

  const handleClick = (video) => {
    singleVideos(video)

  };

  const [showVideoPlayer, setVideoPlayer] = useState(false);

  const handleCloseModal = () => {
    setCurrentVideo(null)
    setVideoPlayer(false);
  };

  const [searchResults, setSearchResults] = useState(null);

  //! make a manual J block load app (just a webapp) (https://www.youtube.com/watch?v=DTsQjiPlksA)

  useEffect(() => {
    try {
      

      const fetchData = async () => {
        try {
          const response = await getSignsList(0,500);
          if (response){

            const filteredResponse = response.filter(item => !uniqueIds.has(item.id)); // Filter out duplicates
            setDictionaryWords(prevWords => [...(prevWords || []), ...filteredResponse]); // Merge new data with existing dictionary
            filteredResponse.forEach(item => uniqueIds.add(item.id)); // Add new ids to the set
            
            
            console.log("WE GOOD!")
            console.log(response)
          }
          else{
            console.error('Response is undefined or null');
          }
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


  const lookUpWord = async (search4Word) => {
    //! get a word
    try {
      const response = await getSignsList(0,500,search4Word);
      if (response){

        const filteredResponse = response.filter(item => !uniqueIds.has(item.id)); // Filter out duplicates
        setDictionaryWords(prevWords => [...(prevWords || []), ...filteredResponse]); // Merge new data with existing dictionary
        filteredResponse.forEach(item => uniqueIds.add(item.id)); // Add new ids to the set
        
        console.log("we got data relative: " + search4Word)
      }
      else{
        console.error('Response is undefined or null');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const singleVideos = async (video) => {
    try {
      setVideoPlayer(true);
      const response = await getSignVid(video.id);
      //console.log(response)
      
      setCurrentVideo(response);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError("Error: [ " + error.message +" ] somthing broke when getting the video"); // Set error state if an error occurs

    }
  };

  return (
    <div className='maincenter'>
      <h2>Sign Lanugage Dictionary</h2>
      
      <div className="searchBar">
      <SearchBar videos={dictionaryWords} setSearchResults={setSearchResults} onSearchRequest={lookUpWord}/>
      </div>
      <div className="video-list">
        {(errorShowAble)? (<div className="error-txt"> <p>{errorShowAble}</p></div>):(
          
          
          (searchResults || dictionaryWords || []).map(video => (
            <button 
              key={video.id} 
              className="video-button" 
              onClick={() => handleClick(video)}
            >
              {video.title}
            </button> 
            
          ))
        )}
      </div>
      
      {showVideoPlayer && (
        <VideoG 
          videoUrl={currentVideo} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};
/* 
export async function generateStaticParams() {
  // Fetch initial data at build time
  const initialData = await fetch('/api/data').then(res => res.json());

  return {
    props: {
      data: initialData,
    },
    // ISR configuration
    revalidate: 604800, // 1 week in seconds
  };
};
 */

export default VideoList;