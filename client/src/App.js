//import logo from './logo.svg';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import VideoList from './components/VideoList';
import AslTrainer from './components/AslTrainer';
import Navbar from './components/Navbar';


function App() {
  return (
    //! make 2 pages and have page 1 be the video player, page 2 be the game/trainer
    //? create a nav bar and have it switch it
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" exact Component={VideoList}/>
          <Route path="/trainer" exact Component={AslTrainer}/>
          
        </Routes>
      </Router>
    </div>
  /*
    React.createElement('div', { className: 'App' },
    React.createElement(AslTrainer, null)
  )
  */
  );
}

export default App;
