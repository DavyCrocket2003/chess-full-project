// This file handles all the events for creating and seeking games
import { v4 as uuidv4 } from 'uuid'
import ChessGame from './ChessGame.js'



let clickCount = 0
let seeks = [
    {name: "david's game", owner: 'david', rating: 1200, time: '5 minutes', rated: false, userId: 8},
    {name: "josh's game", owner: 'josh', rating: 1350, time: '10 minutes', rated: true, userId: 5},
    {name: "michael's game", owner: 'michael', rating: 1700, time: '1 minute', rated: true, userId: 7}
  ]
let games = []


export const gameHandlers = {
    // handleConnect is unique in that it will call all the other gameHandlers from within it
    handleConnect: (socket, io) => {
        console.log(`User ${socket.id} has connected`)
        const req = socket.request
        const session = req.session
        const userId = session.userId
        // Place each user in their own room initially
        socket.join(req.session.userId)
        console.log(req.session)

        // Create an event handler to add users to specified rooms
        socket.on('joinRoom', (roomId) => {
            console.log(`User ${userId} received a join command for room ${roomId}`)
            socket.join(roomId)
            console.log(`${roomId}`)
            req.session.reload((err) => {
                if (err) {
                    resCallback({success: false, message: 'You did not enter the room'})
                    return socket.disconnect()
                } else {
                    req.session.gameId = roomId
                }
                req.session.save()
            })
        })

        // debugging event - return req.session
        socket.on('sessionTest', (resCallback) => {
            console.log(`User ${userId} sent a 'sessionTest' event`)
            resCallback(req.session)
        })
        
        // debugging event - return req.session
        socket.on('sessionTestRenewed', (resCallback) => {
            console.log(`User ${userId} received a join command for room ${roomId}`)
            req.session.reload((err) => {
                console.log(req.session)
                if (err) {
                    resCallback({success: false, message: 'Session not found'})
                    return socket.disconnect()

                } else {
                    resCallback({success: true, message: 'Here is the session data', data: req.session})
                }
            })
        })

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
            console.log('newSeek event received', data)
            let newGame = {time: 300, rated: false}
            req.session.reload((err) => {
                console.log(req.session)
                if (err) {
                    resCallback({success: false, message: 'Session not found'})
                    return socket.disconnect()

                }
                newGame = {...newGame, owner: req.session.username, userId: req.session.userId, name: `${req.session.username}'s game`}
                newGame = {...newGame, ...data}
                seeks.push(newGame)
                resCallback({success: true, message: 'Seek successfully created'})
            })
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
            console.log('acceptSeek event triggered')
            let mySeek = seeks.splice(seeks.findIndex((seek) => seek.userId === userId),1)
            // Players are paired and ready to play: Need to start game
            const gameId = uuidv4()
            socket.join(gameId)
            io.to(userId).emit('joinRoom', gameId)
            req.session.reload(() => {
                req.session.gameId = gameId
                req.session.save()
            })
            console.log('creatorid', userId, 'acceptorid', gameId)
            let chooseTF = Math.random*2 > 1
            let gameData = {
                gameId,
                gameName: mySeek.name,
                player1Id: chooseTF?req.session.userId:userId,
                player2Id: chooseTF?userId:req.session.userId,
                createdAt: new Date(),
                rated: mySeek.rated,
                timeControl: mySeek.time,
            }
            let myGame = ChessGame(gameData)
            games.push(myGame)

            io.to(gameId).emit('startGame', {...gameData, gameOn: true})

                   
        })

        // Handle client making a move



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