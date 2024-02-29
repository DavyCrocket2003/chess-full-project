import React from 'react'
import { socket } from '../socket'

function Seeks(props) {


  function handleClick(e) {
    socket.emit('button_press')
  }
  

    let gameRows = props.games.map((game, index) => (
        <tr key={index}>
            <td><button>Join</button></td>
            <td>{game.name}</td>
            <td>{game.owner}</td>
            <td>{game.rating}</td>
            <td>{game.time}</td>
            <td>{game.rated}</td>
        </tr>
    ))


  return (
    <table>
      <tbody>
        <tr>
          <td colSpan={5}><button onClick={handleClick}>New Game</button></td>
        </tr>
        <tr>
          <td></td>
          <td>Name</td>
          <td>Owner</td>
          <td>Rating</td>
          <td>Time Control</td>
          <td>Rated Game?</td>
        </tr>
        {gameRows}
      </tbody>

    </table>
  )
}

export default Seeks
