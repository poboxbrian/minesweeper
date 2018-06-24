import React, { Component } from 'react';
import './Board.css';

//16 x 30
const MAX_ROWS = 16;
const MAX_COLS = 30;


function CreateMultiDArray(iRows, iCols) {
    let aBuf = [];

    for (let i=0; i < iRows; i++){
        let aRow = [];
        for (let j=0; j < iCols; j++){
            aRow.push([null]);
        }
        aBuf.push(aRow);
    }

    return aBuf;
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>XX
            {props.value}
        </button>
    );
}


class Board extends React.Component {
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
        for (let j = 0; j < MAX_COLS; j++) {
            return (
                <Square 
                    /*value={this.props.squares[i,j]}*/
                    /*onClick={() => this.props.onClick(i,j)}*/
                />
            );
        }
    }

    renderBoard() {
        for (let i = 0; i < MAX_ROWS; i++) {
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

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: CreateMultiDArray(16, 30),
            iMoves: 0,
        }
    }

    handleClick(i,j) {
        alert('Hello');
    }

    render() {
        const current = this.state.squares;

        return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    /*onClick={(i,j) => this.handleClick(i,j)}*/
                />
            </div>
        </div>
        );
    }

}

export default Board;