// AntiChess.jsx
"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AntiChess() {
  const initialBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", "."],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];

  // player 1 starts the match first
  let currentPlayer = 1; 
  // initializes "gameActive" variable to the boolean value "true"
  let gameActive = true;
  // "useState" is a hook provided by React that allows you to add state to a functional component.
  const [message, setMessage] = useState("It player 1's turn");

  useEffect(() => {
    renderBoard(initialBoard);

    // Cleanup function (optional) for event listeners
    return () => {
      // Any clean-up code goes here
    };
  }, []); // Empty dependency array to run effect only once

  // Define symbols for pieces
  const pieceSymbols = {
    p: "♙",
    r: "♖",
    n: "♘",
    b: "♗",
    q: "♕",
    k: "♔",
    P: "♟",
    R: "♜",
    N: "♞",
    B: "♝",
    Q: "♛",
    K: "♚",
    ".": "",
  };

  // Function to render the chess board with symbols
  function renderBoard(board) {
    const boardContainer = document.getElementById("board");
    boardContainer.innerHTML = "";

    board.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        const square = document.createElement("div");
        square.className = "square";
        square.dataset.row = rowIndex;
        square.dataset.col = colIndex;
        square.textContent = pieceSymbols[piece]; // Use symbol instead of piece
        square.addEventListener("click", () =>
          squareClicked(rowIndex, colIndex)
        );
        boardContainer.appendChild(square);
      });
    });
  }

  // Handle click on a square
  function squareClicked(row, col) {
    if (!gameActive) return;

    const piece = initialBoard[row][col];

    // Check if it's the current player's piece
    if (!isPlayersPiece(currentPlayer, piece)) {
      showMessage(`It Player ${currentPlayer}'s turn.`);
      return;
    }

    // Highlight legal moves
    const legalMoves = getLegalMoves(row, col);
    highlightLegalMoves(legalMoves);

    // Handle move logic
    function handleMove(toRow, toCol) {
      if (!isValidMove(row, col, toRow, toCol)) {
        showMessage("Invalid choice :( Try again.");
        return;
      }

      makeMove(row, col, toRow, toCol);
    }

    // Add event listener for legal moves
    document.querySelectorAll(".legal").forEach((legalSquare) => {
      legalSquare.addEventListener("click", () => {
        const toRow = parseInt(legalSquare.dataset.row);
        const toCol = parseInt(legalSquare.dataset.col);
        handleMove(toRow, toCol);
      });
    });
  }

  // Function to determine if a piece belongs to the current player
  function isPlayersPiece(player, piece) {
    return player === 1
      ? piece === piece.toUpperCase()
      : piece === piece.toLowerCase();
  }

  // Function to get legal moves for a piece
  function getLegalMoves(fromRow, fromCol) {
    const piece = initialBoard[fromRow][fromCol].toLowerCase(); // Piece type (e.g., 'p', 'r', 'n', ...)
    const legalMoves = [];

    // Iterate through each square on the board
    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
          legalMoves.push({ row: toRow, col: toCol });
        }
      }
    }

    return legalMoves;
  }

  // Function to highlight legal moves on the board
  function highlightLegalMoves(legalMoves) {
    document.querySelectorAll(".legal").forEach((square) => {
      square.classList.remove("legal");
    });

    legalMoves.forEach((move) => {
      const square = document.querySelector(
        `.square[data-row="${move.row}"][data-col="${move.col}"]`
      );
      square.classList.add("legal");
    });
  }

  // Function to validate if a move is legal
  function isValidMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow === toRow && fromCol === toCol) {
      return false; // Same square
    }

    const piece = initialBoard[fromRow][fromCol];
    const targetPiece = initialBoard[toRow][toCol];

    // Check if the piece moves according to its rules (specific logic for each piece type)
    switch (piece.toLowerCase()) {
      case "p":
        return isValidPawnMove(fromRow, fromCol, toRow, toCol, targetPiece);
      case "r":
        return isValidRookMove(fromRow, fromCol, toRow, toCol, targetPiece);
      case "n":
        return isValidKnightMove(fromRow, fromCol, toRow, toCol, targetPiece);
      case "b":
        return isValidBishopMove(fromRow, fromCol, toRow, toCol, targetPiece);
      case "q":
        return isValidQueenMove(fromRow, fromCol, toRow, toCol, targetPiece);
      case "k":
        return isValidKingMove(fromRow, fromCol, toRow, toCol, targetPiece);
      default:
        return false; // Invalid piece type
    }
  }

  // Function to validate pawn move
  function isValidPawnMove(fromRow, fromCol, toRow, toCol, targetPiece) {
    const player = currentPlayer === 1 ? "white" : "black";
    const direction = currentPlayer === 1 ? -1 : 1;

    // Normal move (one square forward)
    if (fromCol === toCol && initialBoard[toRow][toCol] === ".") {
      if (fromRow + direction === toRow) {
        return true;
      }
      // First move (two squares forward)
      if (
        (player === "white" && fromRow === 6 && toRow === 4) ||
        (player === "black" && fromRow === 1 && toRow === 3)
      ) {
        if (
          initialBoard[fromRow + direction][fromCol] === "." &&
          initialBoard[toRow][toCol] === "."
        ) {
          return true;
        }
      }
    }

    // Capture move (diagonally)
    if (Math.abs(fromCol - toCol) === 1 && fromRow + direction === toRow) {
      if (isOpponentPiece(player, targetPiece)) {
        return true;
      }
    }

    return false;
  }

  // Function to check if a piece is an opponent's piece
  function isOpponentPiece(player, piece) {
    return player === "white"
      ? piece === piece.toLowerCase()
      : piece === piece.toUpperCase();
  }

  // Function to validate rook move
  function isValidRookMove(fromRow, fromCol, toRow, toCol, targetPiece) {
    if (fromRow !== toRow && fromCol !== toCol) {
      return false; // Rook moves horizontally or vertically
    }

    if (fromRow === toRow) {
      // Horizontal move
      const colDir = toCol > fromCol ? 1 : -1;
      for (let i = 1; i < Math.abs(toCol - fromCol); i++) {
        if (initialBoard[fromRow][fromCol + i * colDir] !== ".") {
          return false;
        }
      }
    } else {
      // Vertical move
      const rowDir = toRow > fromRow ? 1 : -1;
      for (let i = 1; i < Math.abs(toRow - fromRow); i++) {
        if (initialBoard[fromRow + i * rowDir][fromCol] !== ".") {
          return false;
        }
      }
    }

    return true;
  }

  // Function to validate knight move
  function isValidKnightMove(fromRow, fromCol, toRow, toCol, targetPiece) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  // Function to validate
  // Function to validate bishop move
  function isValidBishopMove(fromRow, fromCol, toRow, toCol, targetPiece) {
    if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) {
      return false; // Bishop moves diagonally
    }

    const rowDir = toRow > fromRow ? 1 : -1;
    const colDir = toCol > fromCol ? 1 : -1;
    for (let i = 1; i < Math.abs(toRow - fromRow); i++) {
      if (initialBoard[fromRow + i * rowDir][fromCol + i * colDir] !== ".") {
        return false;
      }
    }

    return true;
  }

  // Function to validate queen move
  function isValidQueenMove(fromRow, fromCol, toRow, toCol, targetPiece) {
    return (
      isValidRookMove(fromRow, fromCol, toRow, toCol, targetPiece) ||
      isValidBishopMove(fromRow, fromCol, toRow, toCol, targetPiece)
    );
  }

  // Function to validate king move
  function isValidKingMove(fromRow, fromCol, toRow, toCol, targetPiece) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return rowDiff <= 1 && colDiff <= 1;
  }

  // Function to make a move
  function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = initialBoard[fromRow][fromCol];
    const targetPiece = initialBoard[toRow][toCol];

    // Check if the target square contains an opponent's piece or is empty
    if (
      isOpponentPiece(currentPlayer === 1 ? "white" : "black", targetPiece) ||
      targetPiece === "."
    ) {
      // Move piece
      initialBoard[toRow][toCol] = piece;
      initialBoard[fromRow][fromCol] = ".";
      renderBoard(initialBoard);
    } else {
      showMessage("Cannot capture your own piece. Try again.");
      return;
    }

    // Check if the move results in a win (all pieces sacrificed)
    if (hasPlayerWon()) {
      showMessage(`Player ${currentPlayer} wins!`);
      gameActive = false;
      return;
    }

    // Switch player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    showMessage(`Player ${currentPlayer}'s turn.`);
  }

  // Function to check if a player has won (no legal moves left or all pieces lost)
  function hasPlayerWon() {
    const player = currentPlayer === 1 ? "white" : "black";

    // Check if the player has no legal moves left
    let noLegalMovesLeft = true;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (
          initialBoard[row][col] !== "." &&
          isPlayersPiece(currentPlayer, initialBoard[row][col])
        ) {
          const legalMoves = getLegalMoves(row, col);
          if (legalMoves.length > 0) {
            noLegalMovesLeft = false;
            break;
          }
        }
      }
      if (!noLegalMovesLeft) {
        break;
      }
    }

    // Check if the player has lost all their pieces
    const piecesLeft = initialBoard
      .flat()
      .filter((piece) => piece !== "." && isPlayersPiece(currentPlayer, piece));
    if (piecesLeft.length === 0) {
      return true; // Player has lost all their pieces
    }

    return noLegalMovesLeft; // Player has no legal moves left
  }

  // Function to display messages using Toastify
  function showMessage(msg) {
    toast(msg, {
      position: "top-right",
      autoClose: 2000, // Automatically close after 2 seconds
      hideProgressBar: false,
      closeButton: false,
      className: "toast-message",
    });
  }

  // Event listener for quit button
  function handleQuit() {
    const winner = currentPlayer === 1 ? 2 : 1;
    toast.success(`Player ${winner} wins!`, {
      position: "top-right",
      autoClose: 3000, // Automatically close after 3 seconds
      hideProgressBar: false,
      closeButton: false,
      className: "toast-message",
    });
    gameActive = false;
  }

  return (
    <>
      <div className="App">
        <div id="board" className="board"></div>

        <button id="quit" onClick={handleQuit}>
          Quit 
        </button>
      </div>
      <ToastContainer />
    </>
  );
}
