import React, { useEffect, useState } from 'react'
import axios from 'axios';
import SidePanelImages from './SidePanelImages';
import {randomword, alphabet} from '../Scripts/SignApi';
import  '../scssStyle/AslTrainer.css';

//! this is better then https://asl.ms/ (WE ARE BETTER!!!!)
const AslTrainer = () => {
  
  const [gameState, setGameState] = useState({
    images: [],
    word:''
  });
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [speed, setSpeed] = useState(1); // Speed state

  const [inputWord, setInputValue] = useState('');;

  const [wordLength, setWordLength] = useState('any'); // Word length state

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [sidePanelimagePaths, setsidePanelImagePaths] = useState([]);
  const [points, setpoints] = useState('0');
  const [isTrue, setIsTrue] = useState(false);




	useEffect(() => {
    
    const jsonData = {
      wordLength: 6,
      wordList: "eng",
      wantSvg: false
    };

    //const response = axios.post('/api/randomword', jsonData);
    /* axios.post('/api/randomword', jsonData)
      .then(response => {
        setImagePaths(response.data);
      })
      .catch(error => {
        console.error('Error fetching image paths:', error);
      });
     */
    

    const getAslWord = async () => {
      try {
        const response = await randomword(wordLength);
        
        setGameState(response); //? we need to also get the word itself not just the image
        
        const responsez = await alphabet();
        setsidePanelImagePaths(responsez)
      } catch (error) {
        console.error('Error fetching ASL word sign: ', error.message);
        
  
      }
    };
  getAslWord();

    
    /* 
    // Fetch the list of image paths from Flask backend
    axios.get('/randomword')
      .then(response => {
        setImagePaths(response.data);
      })
      .catch(error => {
        console.error('Error fetching image paths:', error);
      }); 
      */
  }, []);
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      // Increment current image index
      setCurrentImageIndex(prevIndex =>
        (prevIndex + 1) % gameState.images.length
      );
    }, 1000 / speed); // Change image, 1 second div by speed

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [gameState, speed]);
*/
   // Handler for speed change
  const handleSpeedChange = (event) => {
    const newValue = event.target.value;
    // Prevent NaN
    if (newValue === '' || isNaN(newValue) || parseFloat(newValue) < 0) {
      setSpeed('0');
    } else {
      const newSpeed = parseFloat(newValue);
      setSpeed(newSpeed);
      
    }
  };



  // Handler for word length change
  const handleWordLengthChange = (event) => {
    setWordLength(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isTrue) {
      try {
        const response = await randomword(wordLength);
        
        setGameState(response);
        
      } catch (error) {
        console.error('Error fetching ASL word sign: ', error.message);
        
  
      }
    }
    else{
      if (inputWord === gameState.word)
      {setpoints(points+1)}
      else{
        setpoints(0)
      }
    }
    
    setIsTrue(!isTrue);
    
  };


  const handleWordChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButton1Click = () => {
    // Functionality for Button 1
    console.log("Button 1 clicked");
  };

  const handleButton2Click = () => {
    // Functionality for Button 2
    console.log("Button 2 clicked");
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const checkifWordCorrect = () => {
    // Functionality for Button 2
    console.log("isword correct");
  };

	return (
		<div className='trainer'>
      <h1>ASL LETTER TRAINER</h1>

      {/* <SidePanelImages isOpen={isSidePanelOpen} onClose={toggleSidePanel} imagePaths={sidePanelimagePaths} /> */}
      <div className="Image-container">
      {/* {gameState.images.length > 0 && ( 
        <img src={gameState.images[currentImageIndex]} alt={`Image ${currentImageIndex}`} />
      )}*/}
      
      


        <div className='shitVert'>
          <button className='game-button' onClick={handleButton1Click}>New Word</button>
          <button className='game-button' onClick={handleButton2Click}>Replay</button>
        </div>
          <form onSubmit={handleSubmit} className='largVert'>
            
            <button onClick={toggleSidePanel} className='popz'>ASL letter panel</button>
          
            <input type="text" className='popz' id='plz' placeholder='Type answer: ...' value={inputWord} onChange={handleWordChange} />
          
            <button type="submit" className='popz'>Submit</button>

          </form>
        
      </div>
      <div>
        <div className='lengthSelection'>
          <label>Word Length:</label>
          <label>
            <input type="radio" name="wordLength" value="3" checked={wordLength === '3'} onChange={handleWordLengthChange} />
            3
          </label>
          <label>
            <input type="radio" name="wordLength" value="4" checked={wordLength === '4'} onChange={handleWordLengthChange} />
            4
          </label>
          <label>
            <input type="radio" name="wordLength" value="5" checked={wordLength === '5'} onChange={handleWordLengthChange} />
            5
          </label>
          <label>
            <input type="radio" name="wordLength" value="6" checked={wordLength === '6'} onChange={handleWordLengthChange} />
            6
          </label>
          <label>
            <input type="radio" name="wordLength" value="any" checked={wordLength === 'any'} onChange={handleWordLengthChange} />
            Any
          </label>
        </div>
      
        <div className='speedSelection'>
          <label className='sped' htmlFor="speedControl">Speed:</label>
          <input className='sped' type="range"
            id="speedControl"
            name="speedControl"
            min="0.1"
            max="2"
            step="0.1"
            value={speed}
            onChange={handleSpeedChange}/>
          <span className='sped' >{speed}</span>
            
        </div>
        <div className='zza'>

          <span id='points'>Score: {points}</span>
        </div>
      
      </div>
    </div>
		
	);
}

export default AslTrainer