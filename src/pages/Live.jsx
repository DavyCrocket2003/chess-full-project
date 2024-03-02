import React, { useState, useEffect} from 'react'
import ChessBoard from '../components/ChessBoard'
import { socket } from '../socket'
import { useSelector, useDispatch } from 'react-redux'
import Seeks from '../components/Seeks'
import { updateSocketSession } from '../controllers/sessionActions'


function Live() {

    const userSession = useSelector((state) => state.userSession)
    // const socketSession = useSelector((state) => state.socketSession)
    const clickCount = useSelector((state) => state.clickCount)
    const dispatch = useDispatch()
    
    // const seeks = useSelector((state) => state.seeks)
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
    <p onClick={handleCountClick}>{clickCount} </p>
    {userSession.status==='inGame' ? (
    <div>
      <ChessBoard />
    </div>
  ) : (
    <Seeks />
  )}
    </>
  )
    
  
}

export default Live
