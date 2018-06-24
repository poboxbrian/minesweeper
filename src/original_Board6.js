import React, { Component } from 'react';
import './Board.css';

const pbxMF = require('./pbxMathFunctions');
const pbxArr = require('./pbxArrayVarious');

//16 x 30
const EASY_GRID = 8;
const EASY_MINES = 10;
//const MID_GRID = 16;
//const HARD_GRID = 24;
//const MID_MINES = 40;
//const HARD_MINES = 99;
const MAX_MOVES = (EASY_GRID * EASY_GRID) - EASY_MINES;

const DEFAULT_SQUARE = '*';
const DEFAULT_MINE = 'm';
const DEFAULT_SUCCESS = 'Keep trying';
const DEFAULT_WINNER = 'WINNER';
const DEFAULT_LOSER = 'you lose';

function Square(props) {
    return (
        <button className="square" 
            key={props.key}
            onClick={props.onClick}
        >{props.value}
        </button>
    );
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.iRows = EASY_GRID;
        this.iCols = EASY_GRID;
        this.iMines = EASY_MINES;
        this.state = {
            squares: this.BuildMineField(),
            status: {
                moves: 0,
                remaining: MAX_MOVES,
                points: 0,
                status: DEFAULT_SUCCESS,
            },
            handleClick: this.handleClick.bind(this),
        };
    }

    renderHeader(oStatus) {
        return (
            <header className="board-header">
                <div className="remaining">{oStatus.remaining}</div>
                <div className="status">   {oStatus.status}</div>
                <div className="points">   {oStatus.points}</div>
            </header>
        );
    }

    renderRow(data, row, onClick) {
        return (
            <div className="board-row">{
                data.map(function(value, column) {
                    let child = {row: row, column: column};
                    return (
                        <Square
                            value={value}
                            onClick={e => onClick(child,e)}
                        />
                    );
                })
            }</div>
        );
    }

    render() {
        return (
        <div className="game">
            {this.renderHeader(this.state.status)}
            <div className="board">
                {this.state.squares.map( (data, row) => this.renderRow(data, row, this.state.handleClick))}
            </div>
        </div>
        );
    }

    handleClick(childData, event) {
        let oStatus = this.state.status;
        let squares = this.state.squares;

        oStatus.moves++;
    
        if ( this.isMine(childData.row, childData.column) ) {
            oStatus.status = DEFAULT_LOSER;
        } else {
            oStatus.remaining--;

            let iMineCount = this.countNeighborMines(childData.row, childData.column);
            oStatus.points += iMineCount;
            squares[childData.row][childData.column] = iMineCount;

            if (iMineCount === 0) {
                // This function changes oStatus & squares
                this.clearTheNeighborsWithoutMines(childData.row, childData.column, squares);
                this.setState({ squares: squares});
                oStatus = this.updateStatus(this.state.squares);
            } else {
                this.setState({ squares: squares});
            }
        }
        if (oStatus.remaining === 0) {
            oStatus.status = DEFAULT_WINNER;
        }

        this.setState({status: oStatus});
    }

    // squares may be altered by this function
    clearTheNeighborsWithoutMines = (iRow, iCol, squares) => {
        let iMineCount = 0;

        if (iRow !== 0) {
            if (iCol !== 0) {
                this.updateMineAssociations(iRow-1, iCol-1, squares);
            }
            this.updateMineAssociations(iRow-1, iCol, squares);
            if (iCol !== (this.iCols - 1)) {
                this.updateMineAssociations(iRow-1, iCol+1, squares);
            }
        }

        if (iCol !== 0) {
            this.updateMineAssociations(iRow, iCol-1, squares);
        }
        if (iCol !== (this.iCols - 1)) {
            this.updateMineAssociations(iRow, iCol+1, squares);
        }

        if (iRow !== (this.iRows - 1)) {
            if (iCol !== 0) {
                this.updateMineAssociations(iRow+1, iCol-1, squares);
            }
            this.updateMineAssociations(iRow+1, iCol, squares);
            if (iCol !== (this.iCols - 1)) {
                this.updateMineAssociations(iRow+1, iCol+1, squares);
            }
        }
    }

    updateMineAssociations = (iRow, iCol, squares) => {
        let iMineCount = this.countNeighborMines(iRow, iCol);
        squares[iRow][iCol] = iMineCount;
        
        if (iMineCount === 0) {
            //this.clearTheNeighborsWithoutMines(iRow, iCol, squares);
        }
    }

    updateStatus = (squares) => {
        var oStatusBuf = {
            moves: 0,
            remaining: MAX_MOVES,
            points: 0,
            status: DEFAULT_SUCCESS,
        };

        squares.map( (data) => {
            data.map(function(value) {
                switch (value) {
                    case DEFAULT_SQUARE:
                        break;
                    case DEFAULT_MINE:
                        break;
                    default:
                        oStatusBuf.moves++;
                        oStatusBuf.remaining--;
                        oStatusBuf.points += value;
                        break;
                }
            });
        });
        if (oStatusBuf.remaining === 0) {
            oStatusBuf.status = DEFAULT_WINNER;
        }

        return oStatusBuf;
    }


    BuildMineField() {
        let aBuf = pbxArr.CreateMultiDArray(this.iRows, this.iCols, DEFAULT_SQUARE, false);
        aBuf = this.assignMines(aBuf, this.iMines, this.iRows, this.iCols);
        return aBuf;
    }

    assignMines(aField, iMines, iRows, iCols) {
        let aBuf = aField.slice();
        let iTotalCells = iRows * iCols;
        
        let iCount = 0;
        let iBuf = 0;
        let iBufRow = 0;
        let iBufCol = 0;

        while (iCount < iMines) {
            iBuf = pbxMF.getRandomInt(iTotalCells);
            iBufRow = Math.floor(iBuf/iRows);
            iBufCol = iBuf % iCols;

            if (aField[iBufRow][iBufCol] !== DEFAULT_MINE) {
                aBuf[iBufRow][iBufCol] = DEFAULT_MINE;
                iCount++;
            }
        }
        return aBuf;
    }

    isMine(iRow, iCol) {
        if (this.state.squares[iRow][iCol] === DEFAULT_MINE) {
            return true;
        }
        return false;
    }

    countNeighborMines(iRow, iCol) {
        let iMineCount = 0;

        if (iRow !== 0) {
            if (iCol !== 0) {
                if (this.state.squares[iRow-1][iCol-1] === DEFAULT_MINE) {
                    iMineCount++;
                }
            }
            if (this.state.squares[iRow-1][iCol] === DEFAULT_MINE) {
                iMineCount++;
            }
            if (iCol !== (this.iCols - 1)) {
                if (this.state.squares[iRow-1][iCol+1] === DEFAULT_MINE) {
                    iMineCount++;
                }
            }
        }

        if (iCol !== 0) {
            if (this.state.squares[iRow][iCol-1] === DEFAULT_MINE) {
                iMineCount++;
            }
        }
        if (iCol !== (this.iCols - 1)) {
            if (this.state.squares[iRow][iCol+1] === DEFAULT_MINE) {
                iMineCount++;
            }
        }

        if (iRow !== (this.iRows - 1)) {
            if (iCol !== 0) {
                if (this.state.squares[iRow+1][iCol-1] === DEFAULT_MINE) {
                    iMineCount++;
                }
            }
            if (this.state.squares[iRow+1][iCol] === DEFAULT_MINE) {
                iMineCount++;
            }
            if (iCol !== (this.iCols - 1)) {
                if (this.state.squares[iRow+1][iCol+1] === DEFAULT_MINE) {
                    iMineCount++;
                }
            }
        }

        return iMineCount;
    }
}

export default Game;