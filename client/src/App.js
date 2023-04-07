import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from '../src/pages/Landing'
import Rooms from "./pages/Rooms";
import Game from "./pages/Game";

const socket = io.connect("http://localhost:3001");

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/game' element={<Game socket={socket} />} />
      </Routes>
    </div>
  );
}

export default App;