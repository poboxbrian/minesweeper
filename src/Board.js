import React, { Component } from 'react';
import './Board.css';

const pbxMF = require('./pbxMathFunctions');
const pbxArr = require('./pbxArrayVarious');



/*******
 * TODO
 * 
 * CSS
 *   unused, mines, spaces, numbers
 *   counters & status
 *   reset div and button
 *******/

const JSON_DIFFICULTY = '[' +
    '{"desc": "Easy" ,  "num": {"grid": "8",  "mines": "10"}},' +
    '{"desc": "Medium", "num": {"grid": "16", "mines": "24"}},' +
    '{"desc": "Hard"  , "num": {"grid": "40", "mines": "99"}}' +
    ']';

const DEFAULT_DIFFICULTY = "Easy";
const DEFAULT_SQUARE = '*';
const DEFAULT_MINE = 'm';
const DEFAULT_CONTINUE = 'Keep trying';
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

        let defaultDifficulty = 0;
        let mySelect = JSON.parse(JSON_DIFFICULTY);
        for (let i in mySelect) {
            if (mySelect[i].desc === DEFAULT_DIFFICULTY) {
                defaultDifficulty = i;
            }
        }
        this.difficulty = mySelect[defaultDifficulty].desc;
        this.iRows = mySelect[defaultDifficulty].num.grid;
        this.iCols = mySelect[defaultDifficulty].num.grid;
        this.iMines = mySelect[defaultDifficulty].num.mines;

        this.state = {
            squares: this.buildMineField(),
            status: {
                moves: 0,
                remaining: (this.iRows * this.iCols) - this.iMines,
                points: 0,
                status: DEFAULT_CONTINUE,
            },
            handleClick: this.handleClick.bind(this),
            handleReset: this.handleReset.bind(this),
            changeDifficulty: this.changeDifficulty.bind(this), 
        };
    }

    renderHeader(oStatus) {
        return (
            <header className="board-header">
                <div className="remaining">Remaining: {oStatus.remaining}</div>
                <div className="status">   {oStatus.status}</div>
                <div className="points">   Points: {oStatus.points}</div>
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

    renderDifficulty() {
        let mySelect = JSON.parse(JSON_DIFFICULTY);
    
        return (
            <select id="difficulty" onChange={this.state.changeDifficulty} value={this.state.difficulty}>
            {
                mySelect.map(obj => {
                    return (
                        <option value={obj.desc}>{obj.desc}</option>
                    );
                })
            }
            </select>
        );
    }
    
    render() {
        return (
        <div className="game">
            {this.renderHeader(this.state.status)}
            <div className="board">
                {this.state.squares.map( (data, row) => this.renderRow(data, row, this.state.handleClick))}
            </div>
            <div className="board-footer">
                <div className="board-difficulty">
                    {this.renderDifficulty()}
                </div>
                <div className="board-reset">
                    <button className="reset" key="reset" onClick={this.state.handleReset}>Reset</button>
                </div>
            </div>
        </div>
        );
    }

    /*******
     * Click Handlers
     *******/
    handleClick(childData, event) {
        let oStatus = this.state.status;

        if (oStatus.status !== DEFAULT_CONTINUE) { return;}

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
                oStatus = this.updateStatus(this.state.squares, oStatus.moves);
            } else {
                this.setState({ squares: squares});
            }
        }
        if (oStatus.remaining === 0) {
            oStatus.status = DEFAULT_WINNER;
            oStatus.points += (this.iRows * this.iCols) - this.iMines - oStatus.moves;
        }

        this.setState({status: oStatus});
    }

    handleReset() {
        this.setState({
            squares: this.buildMineField(), 
            status: {
                moves: 0,
                remaining: (this.iRows * this.iCols) - this.iMines,
                points: 0,
                status: DEFAULT_CONTINUE,
            }
        });
    }

    changeDifficulty(event) {
        let mySelect = JSON.parse(JSON_DIFFICULTY);
        for (let i in mySelect) {
            if (mySelect[i].desc === event.target.value) {
                this.difficulty = event.target.value;
                this.iRows  = mySelect[i].num.grid;
                this.iCols  = mySelect[i].num.grid;
                this.iMines = mySelect[i].num.mines;
            }
        }

        this.handleReset();
    }

    /*******
     * Minefield functions
     *******/
    buildMineField() {
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

    updateStatus = (squares, iMoves) => {
        var oStatusBuf = {
            moves: iMoves,
            remaining: (this.iRows * this.iCols) - this.iMines,
            points: 0,
            status: DEFAULT_CONTINUE,
        };

        squares.map( (data) => {
            data.map(function(value) {
                switch (value) {
                    case DEFAULT_SQUARE:
                        break;
                    case DEFAULT_MINE:
                        break;
                    default:
                        oStatusBuf.remaining--;
                        oStatusBuf.points += value;
                        break;
                }
            });
        });
        if (oStatusBuf.remaining === 0) {
            oStatusBuf.status = DEFAULT_WINNER;
            oStatusBuf.points += (this.iRows * this.iCols) - this.iMines - oStatusBuf.moves;
        }

        return oStatusBuf;
    }
}

export default Game;