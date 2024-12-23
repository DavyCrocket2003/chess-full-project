import React, { useState, useEffect} from 'react'
import ChessBoard from '../components/ChessBoard'
import { useSelector, useDispatch } from 'react-redux'
import Seeks from '../components/Seeks'
import { updateSocketSession } from '../controllers/sessionActions'
import { updateUserSession } from '../controllers/sessionActions'
import { io } from 'socket.io-client'
import axios from 'axios'
import GamePanel from '../components/GamePanel'

const URL = 'http://localhost:8800'
const socket = io(URL, {autoConnect: false})



function Live() {

    const {userId, username, status, socketId} = useSelector((state) => state.userSession)
    const {gameId} = useSelector((state) => state.gameState)
    const playSound = useSelector((state) => state.playSound)
    const blackColor = useSelector(state => state.blackColor)
    const vsComputer = useSelector(state => state.vsComputer)
    const dispatch = useDispatch()
    const [showAcceptDrawModal, setShowAcceptDrawModal] = useState(false)

    function handleStartComp(e) {
      e.preventDefault()
      emitters['startComp']({userId, color})
    }
    
    const [color, setColor] = useState('white')

    // console.log('userId', userId, 'username', username, 'status', status, 'socketId', socketId, 'gameId', gameId, 'playSound', playSound, 'blackColor', blackColor, 'vsComputer', vsComputer)

    // Attach socket listeners and connect to socketserver
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
      
      // handle seek emit   CAN FIX IN REDUCER? (to only add 1 time)
      function handleNewSeek(newSeek) {
        console.log('handleNewSeek triggered', 'newSeek', newSeek)
        dispatch({type: 'UPDATE_SEEKS', payload: newSeek})
      }

      // handle seek cancel
      function handleCancelSeek(userId) {
        console.log('handleCancleSeek triggered', 'userId', userId)
      }

      // handle game start
      function handleGameStart(data) {
        console.log('handleGameStart triggered', 'data', data)
        const {transcript, ...restOfData} = data
        dispatch({type: "UPDATE_GAME", payload: {...restOfData, squares: {
          '11': {piece: 'R', moves: []},
          '12': {piece: 'N', moves: ['31','33']},
          '13': {piece: 'B', moves: []},
          '14': {piece: 'Q', moves: []},
          '15': {piece: 'K', moves: []},
          '16': {piece: 'B', moves: []},
          '17': {piece: 'N', moves: ['36','38']},
          '18': {piece: 'R', moves: []},
          '21': {piece: 'P', moves: ['31','41']},
          '22': {piece: 'P', moves: ['32','42']},
          '23': {piece: 'P', moves: ['33','43']},
          '24': {piece: 'P', moves: ['34','44']},
          '25': {piece: 'P', moves: ['35','45']},
          '26': {piece: 'P', moves: ['36','46']},
          '27': {piece: 'P', moves: ['37','47']},
          '28': {piece: 'P', moves: ['38','48']},
          '31': {piece: '', moves: []},
          '32': {piece: '', moves: []},
          '33': {piece: '', moves: []},
          '34': {piece: '', moves: []},
          '35': {piece: '', moves: []},
          '36': {piece: '', moves: []},
          '37': {piece: '', moves: []},
          '38': {piece: '', moves: []},
          '41': {piece: '', moves: []},
          '42': {piece: '', moves: []},
          '43': {piece: '', moves: []},
          '44': {piece: '', moves: []},
          '45': {piece: '', moves: []},
          '46': {piece: '', moves: []},
          '47': {piece: '', moves: []},
          '48': {piece: '', moves: []},
          '51': {piece: '', moves: []},
          '52': {piece: '', moves: []},
          '53': {piece: '', moves: []},
          '54': {piece: '', moves: []},
          '55': {piece: '', moves: []},
          '56': {piece: '', moves: []},
          '57': {piece: '', moves: []},
          '58': {piece: '', moves: []},
          '61': {piece: '', moves: []},
          '62': {piece: '', moves: []},
          '63': {piece: '', moves: []},
          '64': {piece: '', moves: []},
          '65': {piece: '', moves: []},
          '66': {piece: '', moves: []},
          '67': {piece: '', moves: []},
          '68': {piece: '', moves: []},
          '71': {piece: 'p', moves: ['61','51']},
          '72': {piece: 'p', moves: ['62','52']},
          '73': {piece: 'p', moves: ['63','53']},
          '74': {piece: 'p', moves: ['64','54']},
          '75': {piece: 'p', moves: ['65','55']},
          '76': {piece: 'p', moves: ['66','56']},
          '77': {piece: 'p', moves: ['67','57']},
          '78': {piece: 'p', moves: ['68','58']},
          '81': {piece: 'r', moves: []},
          '82': {piece: 'n', moves: ['61','63']},
          '83': {piece: 'b', moves: []},
          '84': {piece: 'q', moves: []},
          '85': {piece: 'k', moves: []},
          '86': {piece: 'b', moves: []},
          '87': {piece: 'n', moves: ['66','68']},
          '88': {piece: 'r', moves: []}
        }}})
        dispatch({type: "UPDATE_TRANSCRIPT", payload: []})
        dispatch(updateUserSession({status: 'inGame'}))
        dispatch({type: "CLEAR_MESSAGES"})
      }

      // handle game update
      function handleGameUpdate(data) {
        console.log('handleGameUpdate triggered', 'data', data)
        const {transcript, ...restOfData} = data
        dispatch({type: "UPDATE_GAME", payload: restOfData})
        dispatch({type: "UPDATE_TRANSCRIPT", payload: transcript})
        // console.log('playSound', playSound)
        if (playSound) {
          let lastMove = data.transcript[data.transcript.length-1]
          if (lastMove.includes('+')) {
            sound.check.play()
          } else if (lastMove.includes('x')) {
            sound.capture.play()
          } else if (lastMove==='OOO'||lastMove==='OO') {
            sound.castle.play()
          } else {
            sound.move.play() // Could implement move.play() vs opponent.play()
          }
        }
        // handle game over statuses
        if (['1-0', '0-1', '½-½'].includes(data.status)) {
          if (playSound) {
            sound.end.play()
          }
          // append score to transcript
          dispatch({type: "UPDATE_TRANSCRIPT", payload: [...transcript, data.status]})
          // print end game message in chat
          let gameMessage = ''
          let whiteWon = data.status === '1-0'
          let player1White = data.player1Id===userId
          let userWon = whiteWon===player1White
          switch (data.result) {
            case 'checkmate':
              gameMessage = data.message + (userWon ? 'You won!' : (whiteWon ? 'White won' : 'Black won'))
              break;
          
            case 'stalemate':
              // Handle stalemate result
              break;
          
            case 'agreement':
              gameMessage = 'Game drawn by agreement'
              break;
          
            case 'resignation':
              gameMessage = userWon ? 'You won by resignation' : 'You resigned'
              break;
          
            case 'abandonment':
              gameMessage = 'Game abandoned'
              break;
          
            case 'insufficient':
              gameMessage = 'Insufficient material'
              break;
          
            case 'timeout':
              gameMessage = (userWon ? 'You won' : (whiteWon ? 'White won' : 'Black won')) + ' by timeout'
              break;
          
            case 'repetition3Fold':
              gameMessage = 'Drawn by 3 fold repetition'
              break;
          
            case 'repetition5Fold':
              gameMessage = 'Drawn by 5 fold repetition'
              break;
          
            case 'fiftyMoveRule':
              gameMessage = 'Drawn by 50 move rule'
              break;
          
            default:
              gameMessage = 'Error with game ending'
              break;
          }
          dispatch(updateUserSession({status: 'completed'}))
          axios.put(`/status/${userId}`, {status: 'completed'})
          dispatch({type: "UPDATE_MESSAGES", payload: {senderName: 'SYSTEM', message: gameMessage}})
        }
      }

      // handle draw offer NEEDS IMPLEMENTED
      function handleDrawOffer() {
        console.log('handleDrawOffer triggered')
        setShowAcceptDrawModal(true)
      }

      // handle message
      function handleMessage({senderName, message}) {
        console.log(message)
        dispatch({type: "UPDATE_MESSAGES", payload: {senderName, message}})
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
        socket.off('disconnect', onDisconnect)
        dispatch({type: "UPDATE_USER_SESSION", payload: {socketId: null}})
      }

    }, [playSound])

    // Get user game settings
    useEffect(() => {
      // console.log('predispatch playSound', playSound)
      axios.get(`/users/${userId}`)
      .then((res) => {
        // console.log(res.data)
        const {playSound, pieceStyle, whiteColor, blackColor, onBottom} = res.data.userData
        dispatch({type: 'UPDATE_STATE', payload: {playSound, pieceStyle, whiteColor, blackColor, onBottom}})
      })
    }, [])

    // get socket information and seeks list
    useEffect(() => {
      const socketCheck = () => {
        console.log('socketCheck called')
        socket.emit('socketCheck', (res => {
          if (res.success) {
            let {socketId, socketUserId, gameId, status} = res.data
            dispatch(updateUserSession({socketId, gameId, status, userId}))
          }

        }))
      }

      const getSeeks = () => {
        socket.emit('getSeeks', {userId}, (res) => {
          console.log('getSeeks called', res.data)
          if (res.success) {
            dispatch({type: 'UPDATE_SEEKS', payload: res.data})
          }
      })
      }

      socketCheck()
      getSeeks()

    }, [userId, username, status, socketId])

    // Effect to handle cleanup when the component unmounts
    useEffect(() => {
      return () => {
        // Dispatch action to update game status if the game is completed
        if (status === 'completed') {
          dispatch(updateUserSession({status: 'loggedIn'}))
        }
      }
    }, [dispatch, userId, status]);

    // Define socket emitter functions to communicate with server
    const emitters = {
      // emit new seek
      seek: (data) => {
        console.log('seek called', 'data', data)
        socket.emit('seek', {data, userId}, (res) => {
          console.log('seek response', res)
        })
        dispatch(updateUserSession({status: 'seeking'}))
      },

      // emit a request to get seek list
      getSeeks: () => {
        console.log('getSeeks called')
        socket.emit('getSeeks', {userId}, (res) => {
            if (res.success) {
                dispatch({type: "UPDATE_SEEKS", payload: res.data})
            }
        })
      },

      // emit a cancel seek
      cancelSeek: () => {
        console.log('cancelSeek called')
        socket.emit('cancelSeek', {userId}, (res) => {
            if (res.success) {
                dispatch(updateUserSession({status: 'loggedIn'}))
            }
      })},

      // emit a request to accept an existing seek
      acceptSeek: (ownerId) => {
        console.log('acceptSeek called')
        socket.emit('acceptSeek', {ownerId, userId}, )
      },
      
      // emit a request to start a computer match
      startComp: ({userId, color}) => {
        console.log('startComp called')
        socket.emit('startComp', {userId, color}, )
      },

      ///\\\ The below occur inside a game room \\\///
      // emit a move
      move: (move) => {
        console.log('move called', move)
        socket.emit('move', {move, gameId, userId})
      },

      // resign
      resign: () => {
        console.log('resign called')
        socket.emit('resign', {userId})
      },

      // offer draw
      drawOffer: () => {
        console.log('drawOffer called')
        socket.emit('drawOffer', {userId})
      },
      
      // execute draw (for an accepted draw or claiming 3 fold repetition)
      draw: (message) => {
        console.log('emit draw() called', message)
        socket.emit('draw', {userId, message})

      },

      // emit message (used emit convention to not confuse meaning)
      emitMessage: (message) => {
        console.log('emitMessage called', 'message', message)
        socket.emit('message', {userId, message, senderName: username})
      }
    }

    const sound = {   // Audio for game events
      start: new Audio('../pieces/start.mp3'),
      move: new Audio('../pieces/move.mp3'),
      opponent: new Audio('../pieces/opponent.mp3'),
      capture: new Audio('../pieces/capture.mp3'),
      check: new Audio('../pieces/check.mp3'),
      castle: new Audio('../pieces/castle.mp3'),
      end: new Audio('../pieces/end.mp3'),
    }
  return (
    <>
        {(status==='inGame' || status==='completed') ? (
        <div className='chessBox'>
          <ChessBoard emitters={emitters}/>
          <GamePanel emitters={emitters} status={status} acceptDrawModal={{showAcceptDrawModal, setShowAcceptDrawModal}}/>
        </div>
        ) : (
          <div >
            {vsComputer ? (
              <div className='styledContainer' id='computerForm'>
              <form onSubmit={(e) => handleStartComp(e)} >
                <div  className='boldText' id=''>Choose your color</div>
                <label className='computerFormElement'>
                  White <input type="radio" name="color" value="white" checked={color==='white'} onChange={()=>setColor('white')}/>
                </label>
                <label className='computerFormElement'>
                  Black <input type="radio" name="color" value="black" checked={color==='black'} onChange={()=>setColor('black')}/>
                </label>
                <input type="submit" value="Start" className='startButton' />
              </form>
              </div>
            ) : (
              <Seeks emitters={emitters}/>
            )}
          </div>
        )}
    </>
  )
    
  
}

export default Live
