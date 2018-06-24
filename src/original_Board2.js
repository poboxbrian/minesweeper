import React, { Component } from 'react';
import './Board.css';

//16 x 30
const MAX_ROWS = 16;
const MAX_COLS = 30;


function CreateMultiDArray(iRows, iCols, defaultVal) {
    let aBuf = [];

    for (let i=0; i < iRows; i++){
        let aRow = [];
        for (let j=0; j < iCols; j++){
            aRow.push([defaultVal+'-'+i+'_'+j]);
        }
        aBuf.push(aRow);
    }

    return aBuf;
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}


class Board extends Component {
    renderHeader(iRemaining, status, iPoints) {
        return (
            <header className="Board-header">
                <div className="iRemaining">{iRemaining}</div>
                <div className="status">{status}</div>
                <div className="iPoints">{iPoints}</div>
            </header>
        );
    }

    renderSquares(i) {
        const squares = this.props.squares;

        for (let j=0; j < squares[i].length; j++) {
            return (
                <button id={i+'-'+j}>{this.props.squares[i,j]}</button>
            )
//            return (
//                <Square 
//                    id={i+'-'+j}
//                    value={this.props.squares[i,j]}
//                    onClick={() => this.props.onClick}
//                />
//            );
        }
    }

    renderBoard() {
        const squares = this.props.squares;

        for (let i=0; i < squares.length; i++) {
            return (
                <div className="board-row">{this.renderSquares(i)}</div>
            );
        }
    }
    
    render() {
        const iRemaining = 100;
        const status = 'good';
        const iPoints = 150;

        return (
        <div className="Board">
            {this.renderHeader(iRemaining, status, iPoints)}
            <div className="Playground">{this.renderBoard()}</div>
        </div>
        );
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: CreateMultiDArray(MAX_ROWS, MAX_COLS, 'zyz'),
            iMoves: 0,
        }
    }

    handleClick(i,j) {
        alert('Hello');
    }

    render() {
        const squares = this.state.squares;

        return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares={squares}
                    onClick={(i,j) => this.handleClick(i,j)}
                />
            </div>
        </div>
        );
    }

}

export default Game;