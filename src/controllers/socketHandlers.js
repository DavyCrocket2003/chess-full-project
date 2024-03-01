import { socket } from "../socket"
import { updateUserSession } from "./sessionActions"

const socketHandlers = {
    ///\\\ emit events ///\\\
    // get seeks request
    emitGetSeeks: (dispatch) => {
        socket.emit('getSeeks', (res) => {
            if (res.success) {
                dispatch({type: "UPDATE_SEEKS", payload: res.data})
            }
        })
    },
    // seek creation
    emitSeek: (dispatch, data) => {
        socket.emit('newSeek', data, (res) => {
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

    // accept seek
    emitAcceptSeek: (userId) => {
        socket.emit('acceptSeek', userId, )
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
    // handled by handleDrawOffer

    // claim draw 3 fold repetition
    // currently handled by handleDrawOffer
    // emitClaimRepetitionDraw: () => {
    //     socket.emit('claimRepetitionDraw')
    // },

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
    
    // handle new seek sent from server

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
    },

    // handle draw offer (from other player)
    handleDrawOffer: () => {
        let response = ''
        while (!(response === 'Y' || response === 'N')) {
            response = prompt('Would you like to accept a draw? Y or N')[0].toUpperCase()
        }
        socket.emit('acceptDraw')
    }

    // handle 3 fold offer (from server)
    // for now just using the same handler as draw offer

    
}