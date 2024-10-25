import React, { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { updateSocketSession, updateUserSession } from '../controllers/sessionActions'
import axios from 'axios'
import StaticChessBoard from '../components/StaticChessBoard'
import StaticGamePanel from '../components/StaticGamePanel'

function Review() {

    const {userId, username, status} = useSelector((state) => state.userSession)
    const playSound = useSelector((state) => state.playSound)
    const blackColor = useSelector(state => state.blackColor)
    const dispatch = useDispatch()
    // const [color, setColor] = useState('white')
    const [gameObj, setGameObj] = useState(null)
    const [pieces, setPieces] = useState({
            '11': 'R',
            '12': 'N',
            '13': 'B',
            '14': 'Q',
            '15': 'K',
            '16': 'B',
            '17': 'N',
            '18': 'R',
            '21': 'P',
            '22': 'P',
            '23': 'P',
            '24': 'P',
            '25': 'P',
            '26': 'P',
            '27': 'P',
            '28': 'P',
            '31': '', 
            '32': '', 
            '33': '', 
            '34': '', 
            '35': '', 
            '36': '', 
            '37': '', 
            '38': '', 
            '41': '', 
            '42': '', 
            '43': '', 
            '44': '', 
            '45': '', 
            '46': '', 
            '47': '', 
            '48': '', 
            '51': '', 
            '52': '', 
            '53': '', 
            '54': '', 
            '55': '', 
            '56': '', 
            '57': '', 
            '58': '', 
            '61': '', 
            '62': '', 
            '63': '', 
            '64': '', 
            '65': '', 
            '66': '', 
            '67': '', 
            '68': '', 
            '71': 'p',
            '72': 'p',
            '73': 'p',
            '74': 'p',
            '75': 'p',
            '76': 'p',
            '77': 'p',
            '78': 'p',
            '81': 'r',
            '82': 'n',
            '83': 'b',
            '84': 'q',
            '85': 'k',
            '86': 'b',
            '87': 'n',
            '88': 'r',
        },)
    const [moveNumber, setMoveNumber] = useState(0)
    const {gameId} = useParams()

    const fetchGame = async gameId => {
        console.log('fetchGame called')
        let {data} = await axios.get(`/game/${gameId}`)
        if (data.success) {
            console.log('Fetch game successful', data)
            setGameObj(data.gameObj)
        } else {
            console.log('Fetch game unsuccessful')
        }

    }
    const parseBoard = (index, states=gameObj.boardStates) => { // Used to populate the pieces on the board for a given position
        // console.log('parseBoard called:')
        let fenArr = []
        for (let char of states[index].fen.split(' ')[0]) {
            if (+char>0) {
                fenArr.push(...Array(+char).fill(''))
            } else if (char==='/') {
                continue
            } else {
                fenArr.push(char)
            }
        }
        let myPieces = {}
        for (let i=1; i<9; i++) {
            for (let j=8; j>0; j--) {
                myPieces[`${i}${j}`] = fenArr.pop()
            }
        }
        console.log('parseBoard', Object.keys(myPieces).length)
        return myPieces
    }
    const handleIncrement = () => {
        if (moveNumber < gameObj.boardStates.length-1) {
            setMoveNumber(moveNumber + 1)
            setPieces(parseBoard(moveNumber + 1))
            let lastMove = gameObj.boardStates[moveNumber].transcriptMove
            if (playSound) {
                if (lastMove.includes('+')) {
                    sound.check.play()
                } else if (lastMove.includes('x')) {
                    sound.capture.play()
                } else if (lastMove==='OOO'||lastMove==='OO') {
                    sound.castle.play()
                } else if (lastMove.includes('#')) {
                    sound.check.play()
                    sound.end.play()
                } else {
                    sound.move.play() // Could implement move.play() vs opponent.play()
                }
            }
            console.log('Move incremented', lastMove)
        }
    }
    const handleDecrement = () => {
        if (moveNumber > 0) {
            setMoveNumber(moveNumber - 1)
            setPieces(parseBoard(moveNumber - 1))
            console.log('Move decremented', moveNumber-1)
        }
    }
    

    // Fetch user game settings (if there is a user) and game data
    useEffect(() => {
        if (userId) {
            axios.get(`/users/${userId}`)   // get user settings
            .then((res) => {
                const {playSound, pieceStyle, whiteColor, blackColor, onBottom} = res.data.userData
                dispatch({type: 'UPDATE_STATE', payload: {playSound, pieceStyle, whiteColor, blackColor, onBottom}})
            })
        }

        fetchGame(gameId)   // get game data
    }, [])

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
            {!(gameObj) ?
            (<h4>Loading...</h4>) : (
            <div className='chessBox'>
              <StaticChessBoard pieces={pieces} player1Id={gameObj.player1Id} player2Id={gameObj.player2Id}/>
              <StaticGamePanel moveNumber={moveNumber} transcript={gameObj.boardStates.map(state=>state.transcriptMove)} handleIncrement={handleIncrement} handleDecrement={handleDecrement}/>
            </div>
            )}
        
        </>)
    
  
}

export default Review
