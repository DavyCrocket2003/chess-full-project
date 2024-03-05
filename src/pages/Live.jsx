import React, { useState, useEffect} from 'react'
import ChessBoard from '../components/ChessBoard'
import { useSelector, useDispatch } from 'react-redux'
import Seeks from '../components/Seeks'
import { updateSocketSession } from '../controllers/sessionActions'
import { updateUserSession } from '../controllers/sessionActions'
import { io } from 'socket.io-client'
const URL = 'http://localhost:8800'
const socket = io(URL, {autoConnect: false})


function Live() {

    const {userId, username, status, socketId} = useSelector((state) => state.userSession)
    const clickCount = useSelector((state) => state.clickCount)
    const gameId = useSelector((state) => state.gameState.gameId)
    const dispatch = useDispatch()
    
    const handleCountClick = () => {
      socket.emit('increment', 1, (count) => {
        dispatch({type: "UPDATE_CLICK_COUNT", payload: count})
      })
    }

    // Attatch socket listeners
    useEffect(() => {
      // listen for errors
      socket.on('error', (error) => { console.error(error) })

      // handle registering of initial connection
      function handleConnectData(socketId, resCallback) {
        console.log('handleConnectData triggered')
        // register socketId in the redux userSession for reference
        dispatch({type: "UPDATE_USER_SESSION", payload: socketId})
        // register user in the socket data
        resCallback({userId, username, status})
      }
      
      // handle seek emit
      function handleNewSeek(newSeek) {
        console.log('handleNewSeek triggered', 'newSeek', newSeek)
        dispatch({type: 'ADD_SEEK', newSeek})
      }

      // handle seek cancel
      function handleCancelSeek(userId) {
        console.log('handleCancleSeek triggered', 'userId', userId)
      }

      // handle game start
      function handleGameStart(data) {
        console.log('handleGameStart triggered', 'data', data)
        dispatch({type: "UPDATE_GAME", payload: data})
        dispatch(updateUserSession({status: 'inGame'}))
      }

      // handle game update
      function handleGameUpdate(data) {
        console.log('handleGameUpdate triggered', 'data', data)
        dispatch({type: "UPDATE_GAME", payload: data})
        // handle game over statuses
        if (['1-0', '0-1', '½-½'].includes(data.status)) {
          // alert that pops up at the end of the game
          let alertMessage = data.message + player1Id===userId ? {'1-0': 'You won!', '0-1': `${data.player2Id} won`, '½-½': ''}[data.status] : {'0-1': 'You won!', '1-0': `${data.player2Id} won`, '½-½': ''}[data.status]
          alert(alertMessage)

          // do other game end things
        }

      }

      // handle draw offer
      function handleDrawOffer() {
        console.log('handleDrawOffer triggered')
        let response = ''
        while (!(response === 'Y' || response === 'N')) {
            response = prompt('Would you like to accept a draw? Y or N')[0].toUpperCase()
        }
        socket.emit('acceptDraw')
      }

      // handle message
      function handleMessage(message) {
        //  Need to implement
        console.log(message)
      }

      // handle game end
      function handleGameEnd(data) {
        console.log('handleGameEnd called')
        let resultMessage = ''
        if (data.result==='draw') {
            resultMessage = 'Draw'
        } else if (data.result === player1Win) {
            resultMessage = 'White Wins'
        } else {
            resultMessage = 'Black Wins'
        }
        alert(resultMessage)
        dispatch(updateUserSession({status: 'seeking'}))
      }



      function onDisconnect() {
        dispatch(updateSocketSession({connected: false}))
      }

      socket.on('connectData', handleConnectData)
      socket.on('newSeek', handleNewSeek)
      socket.on('cancelSeek', handleCancelSeek)
      socket.on('gameStart', handleGameStart)
      socket.on('gameUpdate', handleGameUpdate)
      socket.on('drawOffer', handleDrawOffer)
      socket.on('message', handleMessage)
      socket.on('gameEnd', handleGameEnd)
      socket.on('disconnect', onDisconnect)
      
      // manually turn socket on
      socket.connect()


      return () => {
        socket.off('connectData', handleConnectData)
        socket.off('cancelSeek', handleCancelSeek)
        socket.off('gameStart', handleGameStart)
        socket.off('gameUpdate', handleGameUpdate)
        socket.off('drawOffer', handleDrawOffer)
        socket.off('message', handleMessage)
        socket.off('gameEnd', handleGameEnd)
        socket.off('disconnect', onDisconnect)
      }


    }, [])

    // get socket information and seeks list
    useEffect(() => {
      const socketCheck = () => {
        console.log('socketCheck called')
        socket.emit('socketCheck', (res => {
          clg(res.message)
          if (res.success) {
            let {socketId, socketUserId, gameId, status} = res.data
            dispatch(updateUserSession({socketId, gameId, status, userId}))
          }

        }))
      }

      const getSeeks = () => {
        socket.emit('getSeeks', (res) => {
          console.log('getSeeks called')
          if (res.success) {
            dispatch({type: 'UPDATE_SEEKS', payload: res.data})
          }
        })
      }

      socketCheck()
      getSeeks()

    }, [userId, username, status, socketId])

    // Define socket emitter functions to communicate with server
    const emitters = {
      // emit new seek
      seek: (data) => {
        console.log('seek called', 'data', data)
        socket.emit('seek', data, (res) => {
          console.log(res)
        })
        dispatch(updateUserSession({status: 'seeking'}))
      },

      // emmit a request to get seek list
      getSeeks: () => {
        console.log('getSeeks called')
        socket.emit('getSeeks', (res) => {
            if (res.success) {
                dispatch({type: "UPDATE_SEEKS", payload: res.data})
            }
        })
      },

      // emit a cancel seek
      cancelSeek: (dispatch) => {
        console.log('cancelSeek called')
        socket.emit('cancelSeek', (res) => {
            if (res.success) {
                dispatch(updateUserSession({status: 'loggedIn'}))
            }
      })},

      // emit a request to accept an existing seek
      acceptSeek: (userId) => {
        console.log('acceptSeek called')
        socket.emit('acceptSeek', userId, )
      },

      ///\\\ The below occur inside a game room \\\///
      // emit a move
      move: (move) => {
        console.log('move called', move)
        socket.emit('move', move, gameId)
      },

      // resign
      resign: () => {
        console.log('resign called')
        socket.emit('resign')
      },

      // offer draw
      drawOffer: () => {
        console.log('drawOffer called')
        socket.emit('drawOffer')
      },

      // emit message (used emit convention to not confuse meaning)
      emitMessage: (message) => {
        console.log('emitMessage called', 'message', message)
        socket.emit('message', message)
      }
    }





  return (
    <>
    <h3>userId {userId} username {username} gameId {gameId?gameId:null} status {status} socketId {socketId}</h3>
    <p onClick={handleCountClick}>{clickCount} </p>
    {status==='inGame' ? (
    <div>
      <ChessBoard emitters={emitters}/>
    </div>
  ) : (
    <Seeks emitters={emitters}/>
  )}
    </>
  )
    
  
}

export default Live
