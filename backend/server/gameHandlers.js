// This file handles all the events for creating and seeking games
import { v4 as uuidv4 } from 'uuid'
import ChessGame from './ChessGame.js'
import {User, Game} from '../database/model.js'




let clickCount = 0
export const users = {}
const seeks = [
    // {name: "david's game", owner: 'david', rating: 1200, time: '5 minutes', rated: false, userId: 8},
    // {name: "josh's game", owner: 'josh', rating: 1350, time: '10 minutes', rated: true, userId: 5},
    // {name: "michael's game", owner: 'michael', rating: 1700, time: '1 minute', rated: true, userId: 7}
]
const games = {}


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
        callback(clickCount, users)    
    })

    // handle get seeks request (client wants to see list of available live games)
    socket.on('getSeeks', (resCallback) => {
        resCallback({success: true, message: 'Here are the seeks', data: seeks})
    })

    // handle user creating a new seek
    socket.on('seek', (data, resCallback) => {
        console.log('seek event received', data)
        User.findByPk(userId, {attributes: ['publicRating']})
            .then(({publicRating}) => {
                console.log('rating return from db', publicRating)
                let newGame = {time: 300, rated: false, rating: publicRating, owner: username, userId, name: `${username}'s game`}
                newGame = {...newGame, ...data}
                seeks.push(newGame)
                status = 'seeking'
                users[userId].status = 'seeking'
                io.emit('newSeek', newGame)
                resCallback({success: true, message: 'Seek successfully created'})
            })

    })
    

    // Handle a user cancelling a seek
    socket.on('cancelSeek', (resCallback) => {
        console.log('cancelSeek triggered')
        let seekIndex = seeks.findIndex((seek) => seek.userId===userId)
        seeks.splice(seekIndex, 1)
        users[userId] = {...users[userId], status: 'loggedIn'}
        // tell all sockets that a seek was removed associated with userId
        io.emit('removeSeek', userId)
        resCallback({success: true, message: 'Your seek was cancelled'})
    })

    // function refreshSocketSession(userId) {}
    // Handle a user accepting a seek
    socket.on('acceptSeek', (ownerId) => {
        console.log('acceptSeek event triggered')
        let ownerSocket = io.sockets.sockets.get(users[ownerId].socketId)
        console.log('users', users, 'ownerSocket', ownerSocket)
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

        
        console.log('creatorid', ownerId, 'acceptorid', userId, mySeek)
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
    socket.on('move', async (move, gameId) => {
        console.log('move event triggered', move)
        console.log(games, gameId)
        console.log(socket.rooms)
        let gameUpdate = games[gameId].postMove(move)
        // Do things depending on game state
        if (gameUpdate.positionCount>=3) {
            // implement emit draw offer
        }
        // check if the game outcome has been determined (meaning game is over)
        if (['1-0', '0-1', '½-½'].includes(gameUpdate.status)) {
            Game.create({
                uuid: gameId,
                moves: gameUpdate.moveHistory,
                player1Time: gameUpdate.player1Time,
                player2Time: gameUpdate.player2Time,
                timeControl: gameUpdate.timeControl,
                rated: gameUpdate.rated,
                result: gameUpdate.status,
                player1Id: gameUpdate.player1Id,
                player2Id: gameUpdate.player2Id,

            })
            
            // update player rankings
            let winner = {'1-0': gameUpdate.player1Id, '½-½': gameUpdate.player2Id, '0-1': null}[gameUpdate.status]
            User.findAll({where: {userId: [gameUpdate.player1Id, gameUpdate.player2Id]}, attributes: ['userId', 'publicRating', 'privateRating']})
                .then(playerRecords => {
                    if (playerRecords[0].userId!==gameUpdate.player1Id) {
                        playerRecords = [playerRecords[1], playerRecords[0]]
                    }       // players now sorted as [white, black]
                    let privateDelta = calculateElo(playerRecords[0].privateRating, playerRecords[1].privateRating, gameUpdate.status)
                    playerRecords[0].privateRating += privateDelta
                    playerRecords[1].privateRating -= privateDelta
                    if (gameUpdate.rated) {
                        let publicDelta = calculateElo(playerRecords[0].publicRating, playerRecords[1].publicRating, gameUpdate.status)
                        playerRecords[0].publicRating += publicDelta
                        playerRecords[1].publicRating -= publicDelta
                    }
                    playerRecords[0].save()
                    playerRecords[1].save()
                    
                    function calculateElo(r1, r2, outcome) {            // takes rating 1, rating 2, and who won
                        let score1 = {'1-0':1, '½-½':0.5, '0-1': 0}[outcome]// and returns the delta for 1 (negate for 2)
                        let expectedScore1 = 1/(1+10**((r2-r1)/400))
                        let delta = 32*(score1-expectedScore1)
                        return Math.round(delta)
                    }
                })


            // remove game from users' userId
            users[gameUpdate.player1Id].gameId = null
            users[gameUpdate.player2Id].gameId = null

            // remove users' sockets from room
            let socket1 = io.sockets.sockets.get(users[gameUpdate.player1Id].socketId)
            let socket2 = io.sockets.sockets.get(users[gameUpdate.player1Id].socketId)
            io.to(gameId).emit('gameUpdate', gameUpdate)
            if (socket1) {
                socket1.leave(gameId)
            }
            if (socket2) {
                socket2.leave(gameId)
            }

            // delete game from users list
            delete games[gameId]
            console.log('Game over')
        }

        if (gameUpdate.status==='normal'){
            io.to(gameId).emit('gameUpdate', gameUpdate)
        }
    })


    // Handle socket disconnect
    socket.on('disconnect', (socket) => {
        console.log(`${username} disconnected`)
    })
}