// This file handles all the events for creating and seeking games

let clickCount = 0
let seeks = []


export const gameHandlers = {
    // handleConnect is unique in that it will call all the other gameHandlers from within it
    handleConnect: (socket) => {
        console.log(`User ${socket.id} has connected`)

        const req = socket.request

        // handle increment for a clicker element used for troubleshooting
        socket.on('increment', (amount, callback) => {
            console.log('handleIncrement called')
            clickCount += amount
            callback(clickCount)
        })

        // handle get seeks request (client wants to see list of available live games)
        socket.on('getSeeks', (resCallback) => {
            resCallback({success: true, message: 'Here are the seeks', data: seeks})
        })

        // handle user creating a new seek
        socket.on('newSeek', (data, resCallback) => {
            let newGame = {time: 300, rated: false}
            req.session.reload((err) => {
                if (err) {
                    resCallback({success: false, message: 'Session not found'})
                    return socket.disconnect()

                }
                newGame = {...newGame, owner: req.session.username, userId: req.session.userId, name: `${req.session.username}'s game`}
            })
            newGame = {...newGame, ...data}
            seeks.push(newGame)
            resCallback({success: true, message: 'Seek successfully created'})
        })

        // Handle a user cancelling a seek
        socket.on('cancelSeek', (resCallback) => {
            req.session.reload((err) => {
                if (err) {
                    resCallback({success: false, message: 'Your seek was not cancelled'})
                    return socket.disconnect()
                }
                const seekIndex = seeks.findIndex((seek) => seek.userId===req.session.userId)
                if (seekIndex === -1) {
                    resCallback({success: false, message: 'Your seek was not found'})
                } else {
                    seeks.splice(seekIndex, 1)
                    // tell all sockets that a seek was removed associated with userId
                    resCallback({success: true, message: 'Your seek was cancelled'})
                    io.emit('removeSeek', req.session.userId)
                }
            })
        })

        // Handle a user accepting a seek
        socket.on('acceptSeek', (userId) => {
            req.session.reload((err) => {
                if (err) {
                    return socket.disconnect()
                } else {
                    // Players are paired and ready to play: Need to start game
                    
                }
            })
        })



        // Handle socket disconnect
        socket.on('disconnect', (socket) => {
            console.log(`User ${socket.id} disconnected`)
        })
    

    },
    // handle new seek
    handle : (socket, resCallback) => {

    },
    // handle 
    handle : (socket, resCallback) => {

    },
    // handle 
    handle : (socket, resCallback) => {

    },
    // handle 
    handle : (socket, resCallback) => {

    },
    // handle 
    handle : (socket, resCallback) => {

    },
    // handle 
    handle : (socket, resCallback) => {

    },
    // handle 
    handle : (socket, resCallback) => {

    },
   
}