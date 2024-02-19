import React, { useState, useEffect } from "react";
import PlayerSelect from "./PlayerSelect";

import "./tictactoe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [winningSequence, setwinningSequence] = useState(null);

  const [winner, setWinner] = useState(null);

  const checkWinner = () => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setwinningSequence(lines[i]);
        return board[a];
      }
    }
    if (board.every((box) => box !== null)) {
      return "Tie";
    }
    return null;
  };

  const makeComputerMove = async (newBoard) => {
    try {
      const response = await fetch(
        "https://hiring-react-assignment.vercel.app/api/bot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(board),
        }
      );
      const computerMove = await response.json();

      if (typeof computerMove === "number" && newBoard[computerMove] === null) {
        const currentBoard = [...newBoard];
        currentBoard[computerMove] = playerSymbol === "X" ? "O" : "X";
        setBoard(currentBoard);
      }
    } catch (error) {
      console.error("Error making computer move:", error);
    }
  };

  const handleBoxClick = async (index) => {
    if (winner || board[index]) return;
    const newBoard = [...board];

    newBoard[index] = playerSymbol;

    setBoard(newBoard);

    const winnerFound = checkWinner();
    if (winnerFound) {
      setWinner(winnerFound);
      return;
    }

    await makeComputerMove(newBoard);
  };

  const handlePlayerSymbolSelect = (symbol) => {
    setPlayerSymbol(symbol);
  };

  useEffect(() => {
    const winnerFound = checkWinner();
    if (winnerFound) {
      setWinner(winnerFound);
    }
  }, [board]);

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      {!playerSymbol && (
        <PlayerSelect
          onSelectSymbol={(symbol) => handlePlayerSymbolSelect(symbol)}
        />
      )}
      {playerSymbol && (
        <div className="board">
          {board.map((box, index) => (
            <div
              className={`box ${
                winner && winner !== "Tie" && winningSequence.includes(index)
                  ? "highlight"
                  : ""
              }`}
              onClick={() => handleBoxClick(index)}
              key={index}
            >
              {board[index]}
            </div>
          ))}
        </div>
      )}
      {winner && winner !== "Tie" && <h2>{`${winner} wins!`}</h2>}
      {winner === "Tie" && <h2>It's a Tie!</h2>}
      {!winner && board.every((box) => box) && <h2>It's a Tie!</h2>}
      <button onClick={restartGame}>Restart Game</button>
    </div>
  );
};

export default TicTacToe;
