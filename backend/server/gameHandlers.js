// This file handles all the events for managing live games
import { v4 as uuidv4 } from 'uuid'
import ChessGame from './ChessGame.js'
import {User, Game} from '../database/model.js'
import { getBestMove } from './stockfish.js'



const updateUser = ({userId, ...otherInfo}) => {
    
    users[userId] = {...users[userId], ...otherInfo}
}

export const users = {}
const seeks = []
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
        users[userId] = {...users[userId], username, status, socket}
    })
    console.log(`${username} connected to socket ${socket.id}`)
    console.log(users[userId])
    if (users[userId]?.gameId) {    // check if user is connected to a game
        socket.join(gameId)
        socket.emit('gameUpdate', games[users[userId].gameId].getState())
    }
    
    // handle increment for a clicker element used for troubleshooting
    socket.on('increment', (amount, callback) => {
        console.log('handleIncrement called')
        console.log(users, games)
        clickCount += amount
        callback(clickCount, users)    
    })

    // handle get seeks request (client wants to see list of available live games)
    socket.on('getSeeks', ({userId}, resCallback) => {
        updateUser({userId, socket})
        console.log('req', userId, resCallback)
        resCallback({success: true, message: 'Here are the seeks', data: seeks})
    })

    // handle user creating a new seek
    socket.on('seek', ({data, userId}, resCallback) => {
        updateUser({userId, socket, status: 'seeking'})
        console.log('seek event received', data)
        User.findByPk(userId, {attributes: ['publicRating']})
            .then(({publicRating}) => {
                console.log('rating return from db', publicRating)
                let newGame = {time: 300, rated: false, rating: publicRating, owner: username, userId, name: `${username}'s game`}
                newGame = {...newGame, ...data}
                console.log('newGame rated?', newGame.rated)
                seeks.push(newGame)
                io.emit('newSeek', newGame)
                resCallback({success: true, message: 'Seek successfully created'})
            })

    })

    // Handle a user cancelling a seek
    socket.on('cancelSeek', ({userId}, resCallback) => {
        // need to account for a logged out user (possible for this to be hit)
        // I think the issue is multiple sockets with the same user
        updateUser({userId, socket})
        console.log('cancelSeek triggered')
        let seekIndex = seeks.findIndex((seek) => seek.userId===userId)
        seeks.splice(seekIndex, 1)
        users[userId] = {...users[userId], status: 'loggedIn'}
        // tell all sockets that a seek was removed associated with userId
        io.emit('removeSeek', userId)
        resCallback({success: true, message: 'Your seek was cancelled'})
    })

    // Handle a user starting a game against the computer
    socket.on('startComp', ({userId, color}) => {
        updateUser({userId, socket})
        console.log('startComputer event triggered', userId, color)
        let gameId = uuidv4()
        socket.join(gameId)
        users[userId] = {...users[userId], gameId, status: 'inGame'}
        let gameData = {
            gameId,
            gameName: `${userId} vs computer`,
            player1Id: color==='white' ? userId : null,
            player2Id: color==='white' ? null : userId,
            createdAt: new Date(),
            rated: false,
            timeControl: null,
        }
        let myGame = ChessGame(gameData)
        games[gameId] = myGame
        io.to(gameId).emit('gameStart', {...gameData, gameOn: true, turn: 'white'})
        if (color==='black') {
            let myGameState = myGame.getState
            myGameState = {...myGameState, fen:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}
            computerMove(myGameState, gameId)
        }
    })

    // Function for closing a game. Does the following:
    // 1. Saves the game to the database
    // 2. Update ratings
    // 3. Remove game from users state
    // 4. Emit game end
    // 5. Remove sockets from room
    // 6. Remove game from games list
    function closeGame(gameObj) {
        console.log('closeGame called', gameObj.gameId)
        // 1. Save the game to the database
        console.log('Game Saving', gameObj.gameId)
        Game.create({
            uuid: gameObj.gameId,
            moves: gameObj.moveHistory,
            player1Time: gameObj.player1Time,
            player2Time: gameObj.player2Time,
            timeControl: gameObj.timeControl,
            rated: gameObj.rated,
            result: gameObj.result,
            status: gameObj.status,
            player1Id: gameObj.player1Id,
            player2Id: gameObj.player2Id,

        })

        // 2. Update player ratings
        console.log('Ratings being updated', gameObj.gameId)
        if (gameObj.player1Id && gameObj.player2Id) {
            User.findAll({where: {userId: [gameObj.player1Id, gameObj.player2Id]}, attributes: ['userId', 'publicRating', 'privateRating']})
                .then(playerRecords => {
                    if (playerRecords[0].userId!==gameObj.player1Id) {
                        playerRecords = [playerRecords[1], playerRecords[0]]
                    }       // players now sorted as [white, black]
                    let privateDelta = calculateElo(playerRecords[0].privateRating, playerRecords[1].privateRating, gameObj.status)
                    playerRecords[0].privateRating += privateDelta
                    playerRecords[1].privateRating -= privateDelta
                    console.log('rated?', gameObj.rated)
                    if (gameObj.rated) {
                        let publicDelta = calculateElo(playerRecords[0].publicRating, playerRecords[1].publicRating, gameObj.status)
                        playerRecords[0].publicRating += publicDelta
                        playerRecords[1].publicRating -= publicDelta
                        // could implement emit rating change
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
        }

        // 3. Remove game from users state
        console.log('Removing game from game list', gameObj.gameId)
        if (gameObj.player1Id)
            users[gameObj.player1Id].gameId = null
        if (gameObj.player2Id)
            users[gameObj.player2Id].gameId = null

        // 4.(-a) grab socket ids in preperation for removing room
        console.log(gameObj.gameId)
        let socket1 = null
        let socket2 = null
        if (gameObj.player1Id)
            socket1 = users[gameObj.player1Id].socket
        if (gameObj.player2Id)
            socket2 = users[gameObj.player2Id].socket

        // 4. Emit game end
        console.log('emitting last game update', gameObj.gameId)
        io.to(gameObj.gameId).emit('gameUpdate', gameObj)
        
        // 5. Remove sockets from room
        console.log('removing sockets from room', gameObj.gameId)
        if (socket1)
            socket1.leave(gameObj.gameId)
        if (socket2)
            socket2.leave(gameObj.gameId)

        // 6. Delete game from games list
        console.log('Deleting game', gameObj.gameId)
        delete games[gameId]
        console.log('Game over')
    }

    // Function that checks game state and sends out moves (or game end)
    function executeGameEvents(gameUpdate, gameId) {
        console.log('executeGameEvents() triggered', gameId)
        // VVV Check for 3-fold repetition draw VVV
        if (gameUpdate.positionCount>=3) {
            // implement emit draw offer
        }
        // check if the game outcome has been determined (meaning game is over)
        if (['1-0', '0-1', '½-½'].includes(gameUpdate.status)) {
            closeGame({gameId, ...gameUpdate, result: gameUpdate.status==='½-½'?'stalemate':'checkmate'})
        }

        // Otherwise, game is in progress ('normal') and should just be updated
        if (gameUpdate.status==='normal'){  // send normal game update
            console.log(`should emit gameUpdate to ${gameId}`)
            io.to(gameId).emit('gameUpdate', gameUpdate)
        }
        console.log('executeGameEvents complete')
    }

    // Handle a user accepting a seek
    socket.on('acceptSeek', ({ownerId, userId}) => {
        updateUser({userId, socket})
        // refresh both socket sessions
        console.log('acceptSeek event triggered')
        let ownerSocket = users[ownerId].socket
        console.log('users', users, 'ownerSocket', ownerSocket.id)
        let mySeek = seeks.splice(seeks.findIndex((seek) => seek.userId === ownerId),1)[0]
        // Players are paired and ready to play: Need to start game
        let gameId = uuidv4()           // generate the game's unique id
        socket.join(gameId)         // tell seek acceptor to join game 'room'
        ownerSocket.join(gameId)    // tell seek creator to join game 'room'
        console.log(socket.rooms)
        console.log(ownerSocket.rooms)
        users[userId].gameId = gameId   // update gameId of the acceptee
        users[ownerId].gameId = gameId   // update gameId of the creator
        users[userId].status = 'inGame'   // update status of the acceptee
        users[ownerId].status = 'inGame'   // update gameId of the creator

        
        console.log('creatorid', ownerId, 'acceptorid', userId, mySeek)
        let chooseTF = Math.random*2 > 1    // flip a coin to decide who gets which pieces
        let gameData = {
            gameId,
            gameName: mySeek.name,
            player1Id: chooseTF ? userId : ownerId,
            player2Id: ! chooseTF ? userId : ownerId,
            createdAt: new Date(),
            rated: mySeek.rated,
            timeControl: mySeek.time,
        }
        
        console.log('rated from acceptSeek', mySeek.rated)
        console.log('creatorid', ownerId, 'acceptorid', userId, mySeek)
        let myGame = ChessGame(gameData)    // call into being a new Game Object
        games[gameId] = myGame              // register the game in lists of games

        io.to(gameId).emit('gameStart', {...gameData, gameOn: true, turn: 'white'})

                
    })

    // Handle the computer's turn
    async function  computerMove(gameUpdate, gameId) {
        console.log('computerMove called', gameUpdate, gameId)
        let data = await getBestMove(gameUpdate.fen)
        let bestMove = data.bestmove
        let origin, target, p
        if (!(bestMove)) {
            bestMove = games[gameId].findMate()
            origin = bestMove.origin
            target = bestMove.target
        } else {
            let charMap = {'a': 1,'b': 2,'c': 3,'d': 4,'e': 5,'f': 6,'g':7,'h':8}
            origin = `${bestMove[1]}${charMap[bestMove[0]]}`
            target = `${bestMove[3]}${charMap[bestMove[2]]}`
            p = bestMove[4]
        }

        gameUpdate = games[gameId].postMove({origin, target, p})
        
        // send out game updates or game end
        executeGameEvents(gameUpdate, gameId)
    }

    // Handle client making a move
    socket.on('move', async ({move, gameId, userId}) => {
        updateUser({userId, socket})
        console.log('move event triggered', move)
        // console.log(games, gameId)
        // console.log(socket.rooms)
        let gameUpdate = games[gameId].postMove(move)   // This updates the game state to account for 'move'
        

        executeGameEvents(gameUpdate, gameId)

        // If after the game update it's a computer's turn, fetch a move from stockfish &FS(D*F&S)
        // and update the game again
        if (!(gameUpdate.turn === 'white' ? gameUpdate.player1Id : gameUpdate.player2Id)) 
            computerMove(gameUpdate, gameId)

        
    })

    // Handle game chat messages
    socket.on('message', ({userId, senderName, message}) => {
        updateUser({userId, socket})
        
        socket.broadcast.to(users[userId].gameId).emit('message', {senderName, message})
    })

    // Handle a resignation event
    socket.on('resign', ({userId}) => {
        gameId = users[userId].gameId
        console.log('resign event triggered. userId:', userId, 'gameId:', gameId)
        let gameObj = games[gameId].getState()
        let myStatus = userId===gameObj.player1Id ? '0-1' : '1-0'
        closeGame({...gameObj, gameId, status: myStatus, result: 'resignation'})
    })

    // Handle a draw offer event
    socket.on('drawOffer', ({userId}) => {
        console.log('drawOffer event triggered', userId)
        updateUser({userId, socket})

        socket.broadcast.to(users[userId].gameId).emit('drawOffer')
    })

    // Handle a draw event
    socket.on('draw', ({userId}) => {
        gameId = users[userId].gameId
        console.log('draw event triggered. userId:', userId, 'gameId:', gameId)
        let gameObj = games[gameId].getState()
        closeGame({...gameObj, gameId, status: '½-½', result: 'agreement'})
    })

    // Handle socket disconnect
    socket.on('disconnect', (socket) => {
        for (let user in users) {
            if (users[user].socket===socket) {
                users[user] = {...users[user], socket:null, status: 'disconnected'}
            }
        }
        console.log(`${username} disconnected`)
    })
}