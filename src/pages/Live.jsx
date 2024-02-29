import React, { useState, useEffect} from 'react'
import ChessBoard from '../components/ChessBoard'
import { socket } from '../socket'
import { useSelector, useDispatch } from 'react-redux'
import Seeks from '../components/Seeks'
import { updateSocketSession } from '../controllers/sessionActions'


function Live() {

    const userSession = useSelector((state) => state.userSession)
    const socketSession = useSelector((state) => state.socketSession)
    const clickCount = useSelector((state) => state.clickCount)
    const dispatch = useDispatch()
    const mySeeks =[
      {name: "david's game", owner: 'david', rating: 1200, time: '5 minutes', rated: false},
      {name: "josh's game", owner: 'josh', rating: 1350, time: '10 minutes', rated: true},
      {name: "michael's game", owner: 'michael', rating: 1700, time: '1 minute', rated: true}
    ]
    const seeks = useSelector((state) => state.seeks)
    const handleCountClick = () => {
      socket.emit('increment', 1, (count) => {
        dispatch({type: "UPDATE_CLICK_COUNT", payload: count})
      })
    }

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
        socket.off('disconnect', onDisconnect)
      }


    }, [])







  return (
    <>
    <p onClick={handleCountClick}>{clickCount}</p>
    {userSession.gameId ? (
    <div>
      <ChessBoard />
    </div>
  ) : (
    <Seeks games={seeks ? seeks : mySeeks} />
  )}
    </>
  )
    
  
}

export default Live
