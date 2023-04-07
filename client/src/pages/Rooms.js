import React from 'react'
import { Location } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Rooms(props) {
  const rooms = props.rooms
  const listItems = rooms.map((item) => <li><Link to={`/game/${item}`}>{item}</Link></li>)
  return (
    <ul>{listItems}</ul>
  )
}

export default Rooms