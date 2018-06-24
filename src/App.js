import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Game from './Board';

//16 x 30

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Minesweeper</h1>
        </header>
        <Game />
        
      </div>
    );
  }
}

export default App;
