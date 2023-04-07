import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001'); // connect to backend server

function Game() {
  const [choice, setChoice] = useState("");
  const [choiceReceived, setChoiceReceived] = useState("");
  const [score, setScore] = useState([0, 0]); // player1 score is score[0], player2 score is score[1]
  const [winner, setWinner] = useState("");

  const sendChoice = () => {
    socket.emit("sendChoice", { choice });
    setChoice('')
  }

  const calculateWinner = (player1, player2) => {
    if (player1 === player2) {
      return "tie";
    } else if ((player1 === "Rock" && player2 === "Scissors") || 
               (player1 === "Paper" && player2 === "Rock") ||
               (player1 === "Scissors" && player2 === "Paper")) {
      return "player1";
    } else {
      return "player2";
    }
  }

  useEffect(() => {
    socket.on("receiveChoice", (data) => {
      const roundWinner = calculateWinner(choice, data.choice);
      if (roundWinner === "player1") {
        setScore([score[0] + 1, score[1]]);
      } else if (roundWinner === "player2") {
        setScore([score[0], score[1] + 1]);
      }
      setChoiceReceived(data.choice);
      
      if (score[0] === 3) {
        setWinner("Player 1");
        socket.emit("gameOver", { winner: "Player 1" });
      } else if (score[1] === 3) {
        setWinner("Player 2");
        socket.emit("gameOver", { winner: "Player 2" });
      }
    });

    socket.on("gameOver", (data) => {
      setWinner(data.winner);
    });
  }, [choice, score]);

  return (
    <div>
      <h1>Rock Paper Scissors</h1>
      <button id='choice-btn' onClick={() => setChoice('Rock')}>Rock</button>
      <button id='choice-btn' onClick={() => setChoice('Paper')}>Paper</button>
      <button id='choice-btn' onClick={() => setChoice('Scissors')}>Scissors</button>
      <button onClick={sendChoice}>Send Choice</button>
      <h1>Your choice: {choice}</h1>
      <h1>Not your choice: {choiceReceived}</h1>
      <h1>Score: Player 1: {score[0]} | Player 2: {score[1]}</h1>
      {winner && <h1>{winner} wins!</h1>}
    </div>
  );
}

export default Game;
