import React, { useState, useEffect} from 'react'
import ChessBoard from '../components/ChessBoard'
import { socket } from '../socket'
import { useSelector, useDispatch } from 'react-redux'
import Seeks from '../components/Seeks'
import { updateSocketSession } from '../sessionActions'


function Live() {

    const userSession = useSelector((state) => state.userSession)
    const socketSession = useSelector((state) => state.socketSession)
    const dispatch = useDispatch()
    const [seeks, setSeeks] = useState([
      {name: "david's game", owner: 'david', rating: 1200, time: '5 minutes', rated: false},
      {name: "josh's game", owner: 'josh', rating: 1350, time: '10 minutes', rated: true},
      {name: "michael's game", owner: 'michael', rating: 1700, time: '1 minute', rated: true}
    ])

    dispatch(updateSocketSession({connected: socket.connected}))

    useEffect(() => {
      function onConnect() {
        dispatch(updateSocketSession({connected: true}))
        console.log(`Connected to socket.io with id ${socket.id}`)
      }
      function onDisconnect() {
        dispatch(updateSocketSession({connected: false}))
      }
      socket.on('connect', onConnect)
      socket.on('disconnect', onDisconnect)
      
      return () => {
        socket.off('connect', onConnect)
        socket.off('diconnect', onDisconnect)
      }


    }, [])







  return userSession.gameId ? (
    <div>
      <ChessBoard />
    </div>
  ) : (
    <Seeks games={seeks}/>
  )
    
  
}

export default Live
