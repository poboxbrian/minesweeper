import React, { Component } from 'react';
import './Board.css';

const pbxMF = require('./pbxMathFunctions');

//16 x 30
const EASY_GRID = 8;
const MID_GRID = 16;
const HARD_GRID = 24;
const EASY_MINES = 10;
const MID_MINES = 40;
const HARD_MINES = 99;


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
            aRow.push(value);
        }
        aBuf.push(aRow);
    }

    return aBuf;
}

function Square(props) {
    return (
        <button className="square" 
            key={props.row+'-'+props.index}
            onClick={() => props.onClick(props.row, props.index)}
        >{props.value}
        </button>
    );
}


class Board extends Component {
    renderHeader(iRemaining, status, iPoints) {
        return (
            <header className="Board-header">
                <div className="remaining">{iRemaining}</div>
                <div className="status">{status}</div>
                <div className="points">{iPoints}</div>
            </header>
        );
    }

    renderSquares(data, iRow, onClick) {
        return (
            <div className="board-row">{
                data.map(function(value, index) {
                    return (
                        <Square
                            key={iRow+'-'+index}
                            row={ iRow } 
                            index={index}
                            value={value}
                            onClick={onClick}
                        />
                    );
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
        return (
        <div className="Board">
            {this.renderHeader(this.props.remaining, this.props.status, this.props.points)}
            {this.renderBoard(this.props.squares, this.props.onClick)}
        </div>
        );
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.squares = CreateMultiDArray(EASY_GRID, EASY_GRID, 'H', false);
        this.iRows = EASY_GRID;
        this.iCols = EASY_GRID;
        this.iMines = EASY_MINES;
        this.iMoves = 0;
        this.iRemaining = (MID_GRID * MID_GRID) - EASY_MINES;
        this.points = 0;
        this.status = 'Keep trying';
        this.assignMines(EASY_MINES, EASY_GRID, EASY_GRID);
    }

    assignMines(iMines, iRows, iCols) {
        let iTotalCells = iRows * iCols;
        
        let iCount = 0;
        let iBuf = 0;
        let iBufRow = 0;
        let iBufCol = 0;

        while (iCount < iMines) {
            iBuf = pbxMF.getRandomInt(iTotalCells);
            iBufRow = Math.floor(iBuf/this.iRows);
            iBufCol = iBuf % this.iCols;

            if (this.squares[iBufRow][iBufCol] !== 'm') {
                this.squares[iBufRow][iBufCol] = 'm';
                iCount++;
            }
        }
    }

    isMine(iRow, iCol) {
        if (this.squares[iRow][iCol] === 'm') {
            return true;
        }
        return false;
    }

    setProximityToMine(iRow, iCol) {
        let iMineCount = 0;

        if (iRow !== 0) {
            if (iCol !== 0) {
                if (this.squares[iRow-1][iCol-1] === 'm') {
                    iMineCount++;
                }
            }
            if (this.squares[iRow-1][iCol] === 'm') {
                iMineCount++;
            }
            if (iCol !== (this.iCols - 1)) {
                if (this.squares[iRow-1][iCol+1] === 'm') {
                    iMineCount++;
                }
            }
        }

        if (iCol !== 0) {
            if (this.squares[iRow][iCol-1] === 'm') {
                iMineCount++;
            }
        }
        if (iCol !== (this.iCols - 1)) {
            if (this.squares[iRow][iCol+1] === 'm') {
                iMineCount++;
            }
        }

        if (iRow !== (this.iRows - 1)) {
            if (iCol !== 0) {
                if (this.squares[iRow+1][iCol-1] === 'm') {
                    iMineCount++;
                }
            }
            if (this.squares[iRow+1][iCol] === 'm') {
                iMineCount++;
            }
            if (iCol !== (this.iCols - 1)) {
                if (this.squares[iRow+1][iCol+1] === 'm') {
                    iMineCount++;
                }
            }
        }

        this.squares[iRow][iCol] = iMineCount;
        return iMineCount;
    }

    handleClick = (iRow, iCol) => {
        alert(iRow+'-'+iCol);

        this.iMoves++;

        if ( this.isMine(iRow, iCol) ) {
            this.status = 'You lose';
        } else {
            this.points = this.setProximityToMine(iRow, iCol);
            this.iRemaining = this.iRemaining - 1;
        }
        if (this.iRemaining === 0) {
            this.status = 'WINNER';
        }
    }

    render() {
        return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares={this.squares}
                    remaining={this.iRemaining}
                    status={this.status}
                    points={this.points}
                    onClick={this.handleClick}
                />
            </div>
        </div>
        );
    }

}

export default Game;