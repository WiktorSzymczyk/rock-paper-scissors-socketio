import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

function Game() {
  const [choice, setChoice] = useState("");
  const [opponentChoice, setOpponentChoice] = useState("");
  const [player, setPlayer] = useState(1);
  const [score, setScore] = useState([0, 0]);
  const [winner, setWinner] = useState("");
  const [roundHistory, setRoundHistory] = useState([]);
  const [bothChoicesMade, setBothChoicesMade] = useState(false);
  const [roundOver, setRoundOver] = useState(false);
  const [startNewGame, setStartNewGame] = useState(false);
  const [roundWinner, setRoundWinner] = useState('');
  const [startNewRound, setStartNewRound] = useState(false);
 

  const handleChoice = (selectedChoice) => {
    if (bothChoicesMade) {
      return;
    }
    setChoice(selectedChoice);
    socket.emit("sendChoice", { choice: selectedChoice, player });
    setOpponentChoice(""); // reset opponent's choice since they haven't made one yet
    setPlayer(player === 1 ? 2 : 1);
  };
    
  const calculateWinner = (player1, player2, player1Choice, player2Choice) => {
    if (player1Choice === player2Choice) {
      return "tie";
    } else if (
      (player1Choice === "Rock" && player2Choice === "Scissors") ||
      (player1Choice === "Paper" && player2Choice === "Rock") ||
      (player1Choice === "Scissors" && player2Choice === "Paper")
    ) {
      return "player1";
    } else {
      return "player2";
    }
  };

  const addRoundToHistory = (player1Choice, player2Choice, winner) => {
    setRoundHistory((prevHistory) => [      ...prevHistory,      { player1: player1Choice, player2: player2Choice, winner },    ]);
  };
  
  useEffect(() => {
    socket.on("receiveChoice", ({ choice: oppChoice, player: oppPlayer }) => {
      if (oppPlayer !== player) {
        setOpponentChoice(oppChoice);
        const roundWinner = calculateWinner(player, oppPlayer, choice, oppChoice);
        addRoundToHistory(choice, oppChoice, roundWinner);
        if (roundWinner === "player1") {
          setScore((prevScore) => [prevScore[0] + 1, prevScore[1]]);
          setRoundWinner('player1');
        } else if (roundWinner === "player2") {
          setScore((prevScore) => [prevScore[0], prevScore[1] + 1]);
          setRoundWinner('player2');
        } else {
          setRoundWinner('tie');
        }
        setBothChoicesMade(true);
        setOpponentChoice("");
      }
    });
  
    socket.on("gameOver", ({ winner }) => {
      setWinner(winner);
      setRoundOver(true);
    });
  }, [choice, opponentChoice, player]);
    
  useEffect(() => {
    if (roundOver) {
      socket.emit("nextRound");
    }
  }, [roundOver]);

  return (
    <div>
      <h1>Rock Paper Scissors</h1>
      <div>
        <button disabled={!!choice} onClick={() => setChoice('Rock')}>Rock</button>
        <button disabled={!!choice} onClick={() => setChoice('Paper')}>Paper</button>
        <button disabled={!!choice} onClick={() => setChoice('Scissors')}>Scissors</button>
        {!bothChoicesMade && <p>Select your choice and wait for your opponent to make theirs.</p>}
      </div>
      <h1>Your choice: {choice || "-"}</h1>
      <h1>Opponent's choice: {opponentChoice || (bothChoicesMade ? "-" : "Waiting...")}</h1>
      <h1>Score: Player 1: {score[0]} | Player 2: {score[1]}</h1>
      {winner && <h1>{winner} wins!</h1>}
      <div>
        {roundHistory.map((round, index) => (
          <p key={index}>Player 1: {round.player1} | Player 2: {round.player2} | Winner: {round.winner}</p>
        ))}
      </div>
      {winner && <button onClick={startNewGame}>Start New Game</button>}
      {roundWinner && (
        <div>
          <h1>{roundWinner} wins this round!</h1>
          <button onClick={startNewRound}>Next Round</button>
        </div>
      )}
    </div>
  );
}

export default Game
