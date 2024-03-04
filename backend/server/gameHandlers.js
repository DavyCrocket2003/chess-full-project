// This file handles all the events for creating and seeking games
import { v4 as uuidv4 } from 'uuid'
import ChessGame from './ChessGame.js'



let clickCount = 0
export const users = {}
let seeks = [
    // {name: "david's game", owner: 'david', rating: 1200, time: '5 minutes', rated: false, userId: 8},
    // {name: "josh's game", owner: 'josh', rating: 1350, time: '10 minutes', rated: true, userId: 5},
    // {name: "michael's game", owner: 'michael', rating: 1700, time: '1 minute', rated: true, userId: 7}

]
let games = {}


export function handleConnect(socket, io) {
    let userId
    let username
    let status
    let gameId
    let myGame
    
    // register the client
    socket.emit('connectData', socket.id, (userSession) => {
        userId = userSession.userId
        username = userSession.username
        status = userSession.status
        users[userId] = {...users[userId], username, status, socketId: socket.id}
        console.log(`${username} connected to socket ${socket.id}`)
        console.log(users[userId])
    })

    // handle increment for a clicker element used for troubleshooting
    socket.on('increment', (amount, callback) => {
        console.log('handleIncrement called')
        console.log(users, games)
        clickCount += amount
        callback(clickCount)    
    })

    // handle get seeks request (client wants to see list of available live games)
    socket.on('getSeeks', (resCallback) => {
        resCallback({success: true, message: 'Here are the seeks', data: seeks})
    })

    // handle user creating a new seek
    socket.on('seek', (data, resCallback) => {
        console.log('seek event received', data)
        let newGame = {time: 300, rated: false}
        newGame = {...newGame, owner: username, userId, name: `${username}'s game`}
        newGame = {...newGame, ...data}
        seeks.push(newGame)
        status = 'seeking'
        users[userId].status = 'seeking'
        io.emit('newSeek', newGame)
        resCallback({success: true, message: 'Seek successfully created'})

    })

    // Handle a user cancelling a seek
    socket.on('cancelSeek', (resCallback) => {
        console.log('cancelSeek triggered')
        let seekIndex = seeks.findIndex((seek) => seek.userId===userId)
        seeks.splice(seekIndex, 1)
        // tell all sockets that a seek was removed associated with userId
        io.emit('removeSeek', userId)
        resCallback({success: true, message: 'Your seek was cancelled'})
    })

    // Handle a user accepting a seek
    socket.on('acceptSeek', (ownerId) => {
        console.log('acceptSeek event triggered')
        let ownerSocket = io.sockets.sockets.get(users[ownerId].socketId)
        let mySeek = seeks.splice(seeks.findIndex((seek) => seek.userId === ownerId),1)
        // Players are paired and ready to play: Need to start game
        gameId = uuidv4()
        socket.join(gameId)         // tell acceptee to join game room
        ownerSocket.join(gameId)    // tell creator to join game room
        console.log(socket.rooms)
        console.log(ownerSocket.rooms)
        users[userId].gameId = gameId   // update gameId of the acceptee
        users[ownerId].gameId = gameId   // update gameId of the creator
        users[userId].status = 'inGame'   // update status of the acceptee
        users[ownerId].status = 'inGame'   // update gameId of the creator

        
        console.log('creatorid', ownerId, 'acceptorid', userId)
        let chooseTF = Math.random*2 > 1
        let gameData = {
            gameId,
            gameName: mySeek.name,
            player1Id: chooseTF ? userId : ownerId,
            player2Id: ! chooseTF ? userId : ownerId,
            createdAt: new Date(),
            rated: mySeek.rated,
            timeControl: mySeek.time,
        }
        myGame = ChessGame(gameData)
        games[gameId] = myGame

        io.to(gameId).emit('gameStart', {...gameData, gameOn: true})

                
    })

    // Handle client making a move
    socket.on('move', (move, gameId) => {
        console.log(games, gameId)
        console.log(socket.rooms)
        let gameUpdate = games[gameId].postMove(move)
        // Do things depending on game state
        if (gameUpdate.positionCount>=3) {
            // implement emit draw offer
        }
        // check if the game outcome has been resolved
        if (['1-0', '0-1', '½-½'].includes(gameUpdate.status)) {
            
        }


        io.to(gameId).emit('gameUpdate', gameUpdate)
    })


    // Handle socket disconnect
    socket.on('disconnect', (socket) => {
        console.log(`${username} disconnected`)
    })
}