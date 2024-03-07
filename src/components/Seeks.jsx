import React from 'react'
import { socket } from '../socket'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

function Seeks({emitters}) {

  const dispatch = useDispatch()
  const seeks = useSelector((state) => state.seeks)
  const userSession = useSelector((state) => state.userSession)

  useEffect(() => {
  }, [])


  function handleClickNew() {
    let name = prompt('Game name: ')
    let timeControl = prompt('Time control: ')
    let gameData = {name, time: timeControl, userId: userSession.userId, rated: true}
    emitters.seek(gameData)
  }
  

    let gameRows = seeks.map((seek, index) => (
        <tr key={index}>
            <td><button onClick={() => emitters.acceptSeek(seek.userId)}>Join</button></td>
            <td>{seek.name}</td>
            <td>{seek.owner}</td>
            <td>{seek.rating}</td>
            <td>{seek.time}</td>
            <td>{seek.rated}</td>
        </tr>
    ))


  return (
    <table>
      <tbody>
        <tr>
          <td colSpan={5}><button onClick={handleClickNew}>New Game</button></td>

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
