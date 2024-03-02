import { socket } from "../socket"
import { updateUserSession } from "./sessionActions"

export const socketHandlers = {
    ///\\\ emit events ///\\\
    // get seeks request
    emitGetSeeks: (dispatch) => {
        console.log('emitGetSeeks called')
        socket.emit('getSeeks', (res) => {
            if (res.success) {
                dispatch({type: "UPDATE_SEEKS", payload: res.data})
            }
        })
    },
    // seek creation
    emitSeek: (dispatch, data) => {
        console.log('emitSeek called')
        console.log('emitSeek called')
        socket.emit('newSeek', data, (res) => {
            if (res.success) {
                dispatch(updateUserSession({status: 'seeking'}))
        }})
    },

    // seek cancel
    emitCancelSeek: (dispatch) => {
        console.log('emitCancelSeek called')
        socket.emit('cancelSeek', (res) => {
            if (res.success) {
                dispatch(updateUserSession({status: 'loggedIn'}))
            }
        })
    },

    // accept seek
    emitAcceptSeek: (userId) => {
        console.log('emitAcceptSeek called')
        socket.emit('acceptSeek', userId, )
    },

    // put move
    emitMove: (move) => {
        console.log('emitMove called')
        socket.emit('move', move)
    },

    // resign
    emitResign: () => {
        console.log('emitResign called')
        socket.emit('resign')
    },

    // offer draw
    emitDrawOffer: () => {
        console.log('emitDrawOffer called')
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
        console.log('emitMessage called')
        socket.emit('message', message)
    },

    // get game state
    emitGetGameState: (dispatch) => {
        console.log('emitGetGameState called')
        socket.emit('getGameState', (res) => {
            if (res.success) {
                dispatch({type: "UPDATE_GAME", payload: res.data})
            }
        })
    },


    ///\\\ handle events ///\\\
    // handle game start
    handleGameStart: (dispatch, data) => {
        console.log('handleGameStart called')
        dispatch({type: "UPDATE_GAME", payload: data})
        dispatch(updateUserSession({status: 'inGame'}))
        resCallback({message: "game joined successfully", success: true})

    },
    
    // handle new seek sent from server

    // handle a seek being removed

    // handle game update
    handleGameUpdate: (dispatch, data, resCallback) => {
        console.log('handleGameUpdate called')
        dispatch({type: "UPDATE_GAME", payload: data})
        resCallback({message: "game updated successfully", success: true})
    },

    // handle game end
    handleGameEnd: (dispatch, data, resCallback) => {
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
    },

    // handle draw offer (from other player)
    handleDrawOffer: () => {
        console.log('handleDrawOffer called')
        let response = ''
        while (!(response === 'Y' || response === 'N')) {
            response = prompt('Would you like to accept a draw? Y or N')[0].toUpperCase()
        }
        socket.emit('acceptDraw')
    }

    // handle 3 fold offer (from server)
    // for now just using the same handler as draw offer

    
}