import React, { Component } from 'react';
import './Board.css';

//16 x 30
const MAX_ROWS = 16;
const MAX_COLS = 30;


function CreateMultiDArray(iRows, iCols, defaultVal, bAppendLocation) {
    let aBuf = [];
    let value = '';

    for (let i=0; i < iRows; i++){
        let aRow = [];
        for (let j=0; j < iCols; j++){
            value = "" + defaultVal;
            if (bAppendLocation) {
                value = value + '-' + i + '-' + j;
            }
            aRow.push([value]);
        }
        aBuf.push(aRow);
    }

    return aBuf;
}

function Square(props) {
    return (
        <button className="square" 
            key={props.row+'-'+props.index} 
            value={props.row+'-'+props.index} 
            onClick={props.onClick(props.row, props.index)}
        >{props.row+'-'+props.index}
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

    renderSquares(data, iRow, onClick) {
        return (
            <div className="board-row">{
                data.map(function(value, index) {
                    return (
                        <Square
                            row={ iRow } 
                            index={index}
                            onClick={(i,j) => onClick(i,j)}
                        />
                    );
                    return <button >{value}</button>;
                })
            }</div>
        );
    }

    renderBoard(squares, onClick) {

        return (
            <div className="Playground">
            {squares.map( (data, iRow) => this.renderSquares(data, iRow, onClick))}
            </div>
        );
    }
    
    render() {
        const iRemaining = 100;
        const status = 'good';
        const iPoints = 150;

        const squares = this.props.squares;
        const onClick = this.props.onClick;
        
        return (
        <div className="Board">
            {this.renderHeader(iRemaining, status, iPoints)}
            {this.renderBoard(squares, onClick)}
        </div>
        );
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: CreateMultiDArray(MAX_ROWS, MAX_COLS, null, true),
            iMoves: 0,
        }
    }

    handleClick(val1, val2) {
        alert(val1+'-'+val2);
    }

    render() {
        const squares = this.state.squares;

        return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares={squares}
                    onClick={(i,j) => this.handleClick.bind(this, i,j)}
                />
            </div>
        </div>
        );
    }

}

export default Game;