import React from 'react'
import { socket } from '../socket'
import { socketHandlers } from '../controllers/socketHandlers'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

function Seeks() {

  const dispatch = useDispatch()
  const seeks = useSelector((state) => state.seeks)
  const userSession = useSelector((state) => state.userSession)
  const [sessionData, setSessionData] = useState(null)
  const [sessionDataRenewed, setSessionDataRenewed] = useState(null)

  useEffect(() => {
    socketHandlers.emitGetSeeks(dispatch)
  }, [])


  function handleClickNew() {
    let name = prompt('Game name: ')
    let timeControl = prompt('Time control: ')
    let gameData = {name, time: timeControl, userId: userSession.userId}
    socketHandlers.emitSeek(dispatch, gameData)
  }
  

    let gameRows = seeks.map((seek, index) => (
        <tr key={index}>
            <td><button onClick={() => socketHandlers.emitAcceptSeek(userSession.userId)}>Join</button></td>
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
          

          
          
          
          <td colSpan={5}><button onClick={() => {
            socket.emit('sessionTest', (res) => {
              setSessionData(res)
              alert('Not Renewed Clicked')
            })
          }}>{sessionData ? JSON.stringify(sessionData) : 'Data Without Renewing'}</button></td>


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
