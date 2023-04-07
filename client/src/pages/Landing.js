import React from 'react'
import logo from '../img/clipart942700.png'
import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div>  
        <h1>Welcome to Rock, Paper, Scissors Game!</h1>
        <img alt='' src={logo}/>
        <Link to='/game'>Start</Link>
  </div>
  )
}

export default Landing