import { socket } from "../socket"
import { updateUserSession } from "./sessionActions"

const socketHandlers = {
    ///\\\ emit events ///\\\
    // get seeks request
    emitGetSeeks: (dispatch) => {
        socket.emit('getSeeks', (res) => {
            if (res.success) {
                dispatch({type: "UPDATE_SEEKS", payload: res.seeks})
            }
        })
    },
    // seek creation
    emitSeek: (dispatch) => {
        socket.emit('newSeek', (res) => {
            if (res.success) {
                dispatch(updateUserSession({status: 'seeking'}))
        }})
    },

    // seek cancel
    emitCancelSeek: (dispatch) => {
        socket.emit('cancelSeek', (res) => {
            if (res.success) {
                dispatch(updateUserSession({status: 'loggedIn'}))
            }
        })
    },

    // put move
    emitMove: (move) => {
        socket.emit('move', move)
    },

    // resign
    emitResign: () => {
        socket.emit('resign')
    },

    // offer draw
    emitDrawOffer: () => {
        socket.emit('drawOffer')
    },

    // accept draw
    emitAcceptDraw: () => {
        socket.emit('AcceptDraw')
    },

    // claim draw 3 fold repetition
    emitClaimRepetitionDraw: () => {
        socket.emit('claimRepetitionDraw')
    },

    // send message
    emitMessage: (message) => {
        socket.emit('message', message)
    },

    // get game state
    emitGetGameState: (dispatch) => {
        socket.emit('getGameState', (res) => {
            if (res.success) {
                dispatch({type: "UPDATE_GAME", payload: res.data})
            }
        })
    },


    ///\\\ handle events ///\\\
    // handle game start
    handleGameStart: (dispatch, data, resCallback) => {
        dispatch({type: "UPDATE_GAME", payload: data})
        dispatch(updateUserSession({status: 'inGame'}))
        resCallback({message: "game joined successfully", success: true})

    },
    
    // handle new sent from server

    // handle a seek being removed

    // handle game update
    handleGameUpdate: (dispatch, data, resCallback) => {
        dispatch({type: "UPDATE_GAME", payload: data})
        resCallback({message: "game updated successfully", success: true})
    },

    // handle game end
    handleGameEnd: (dispatch, data, resCallback) => {
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

    // handle draw offer (from other player)

    // handle 3 fold offer (from server)

    
}