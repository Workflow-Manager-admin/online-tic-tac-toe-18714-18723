import React, { useState } from 'react';
import './App.css';

// Color constants for custom inline style usage
const COLORS = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#fcba03',
  lightBg: '#fff',
};

// PUBLIC_INTERFACE
function App() {
  /**
   * Main Tic Tac Toe app entry point: renders status/message, game board, and restart.
   *
   * State:
   *   - board: array[9] of null|'X'|'O', representing Tic Tac Toe cells
   *   - xIsNext: bool, true if X is next, false if O is next
   *   - hasWinner: bool, if the game is won
   *   - winningLine: array of indices of winning cells, or null
   *   - isDraw: bool, if the game is a draw
   */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // PUBLIC_INTERFACE
  function handleClick(index) {
    /**
     * Handles when a board cell is clicked. Updates board if the move is allowed.
     * @param {number} index - The index of the square (0-8)
     */
    if (board[index] || calculateWinner(board).winner) return; // Ignore click if cell filled or game ended

    const nextBoard = board.slice();
    nextBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    /**
     * Restarts the game, resetting all state.
     */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  // Extract game status
  const { winner, winningLine } = calculateWinner(board);
  const isDraw = !winner && board.every(Boolean);

  let statusMsg = '';
  if (winner) {
    statusMsg = `Winner: ${winner}`;
  } else if (isDraw) {
    statusMsg = "It's a draw!";
  } else {
    statusMsg = `Current Player: ${xIsNext ? 'X' : 'O'}`;
  }

  // Styling helpers for responsive centered layout and accent coloring
  const mainBg = COLORS.lightBg;
  const boardBorder = `2px solid ${COLORS.secondary}`;
  const boardMaxWidth = 320; // px

  return (
    <div
      className="tic-tac-toe-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: mainBg,
        color: COLORS.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        padding: '1.5rem 0',
      }}
    >
      {/* Status / Message area */}
      <div
        className="status-area"
        style={{
          marginBottom: '1.5rem',
          fontWeight: 600,
          fontSize: '1.35rem',
          letterSpacing: 0.5,
          color: statusMsg.startsWith('Current')
            ? COLORS.accent
            : (winner ? COLORS.primary : COLORS.secondary),
          textAlign: 'center',
          minHeight: '2.6em',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMsg}
      </div>
      {/* Game Board */}
      <div
        className="board-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TicTacToeBoard
          squares={board}
          onSquareClick={handleClick}
          winningLine={winningLine}
          colors={COLORS}
          boardBorder={boardBorder}
          boardMaxWidth={boardMaxWidth}
          disabled={Boolean(winner) || isDraw}
        />
      </div>
      {/* Restart Button */}
      <div
        className="restart-area"
        style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <button
          className="restart-btn"
          onClick={handleRestart}
          aria-label="Restart Game"
          style={{
            background: COLORS.primary,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.7em 2.3em',
            fontWeight: 'bold',
            fontSize: '1.05rem',
            letterSpacing: 0.6,
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.07)',
            transition: 'background 0.18s,box-shadow 0.18s',
            cursor: 'pointer',
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function TicTacToeBoard({
  squares,
  onSquareClick,
  winningLine,
  colors,
  boardBorder,
  boardMaxWidth,
  disabled
}) {
  /**
   * Renders the 3x3 Tic Tac Toe board, responsive and minimal.
   * @param {object} props
   */
  // Responsive size based on viewport width
  const size = `min(85vw, ${boardMaxWidth}px)`;

  const renderSquare = (i) => {
    const isWinner = winningLine && winningLine.includes(i);
    return (
      <button
        key={i}
        className="ttt-square"
        onClick={() => onSquareClick(i)}
        aria-label={`Square ${i + 1}: ${squares[i] ? squares[i] : 'empty'}`}
        disabled={!!squares[i] || disabled}
        tabIndex="0"
        style={{
          width: '100%',
          height: '100%',
          background: '#fff',
          color: squares[i] === 'X'
            ? colors.primary
            : (squares[i] === 'O' ? colors.secondary : colors.secondary),
          border: `1.5px solid ${colors.secondary}40`,
          fontSize: '2.2rem',
          fontWeight: '800',
          outline: isWinner ? `3.5px solid ${colors.accent}` : 'none',
          outlineOffset: isWinner ? '-2.5px' : '0',
          boxShadow: isWinner
            ? `0 0 14px 1px ${colors.accent}80`
            : 'none',
          cursor: squares[i] || disabled ? 'default' : 'pointer',
          transition: 'outline 0.12s,box-shadow 0.12s',
          userSelect: 'none',
        }}
      >
        {squares[i]}
      </button>
    );
  };

  return (
    <div
      className="ttt-board"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gridTemplateRows: 'repeat(3,1fr)',
        gap: 0,
        border: boardBorder,
        borderRadius: 14,
        width: size,
        maxWidth: '100vw',
        aspectRatio: '1 / 1',
        background: '#fafbff',
        boxShadow: '0 3px 20px 0 rgba(66,66,66,0.06)',
        overflow: 'hidden',
      }}
    >
      {Array(9).fill(null).map((_, i) => (
        <div
          key={i}
          style={{
            // Squared cells with minimal border
            aspectRatio: '1',
            width: '100%',
            height: '100%',
          }}
        >
          {renderSquare(i)}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /**
   * Determines if the board has a winner (returns {winner, winningLine})
   * or null. Classic Tic Tac Toe line checking.
   */
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // Rows
    [0,3,6],[1,4,7],[2,5,8], // Columns
    [0,4,8],[2,4,6],         // Diagonals
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (
      squares[a] && 
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], winningLine: line };
    }
  }
  return { winner: null, winningLine: null };
}

export default App;
