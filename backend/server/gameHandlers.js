// This file handles all the events for creating and seeking games

let clickCount = 0
let seeks = []


export const gameHandlers = {
    // handleConnect is unique in that it will call all the other gameHandlers from within it
    handleConnect: (socket) => {
        console.log(`User ${socket.id} has connected`)

        socket.on('increment', (amount, callback) => gameHandlers.handleIncrement(amount, callback))


        socket.on('disconnect', (socket) => gameHandlers.handleDisconnect(socket))
    },

    // Clicker element used to troubleshoot socket.io
    handleIncrement: (amount, callback) => {
        console.log('handleIncrement called')
        clickCount += amount
        callback(clickCount)

    },
    handleDisconnect: (socket) => {
        console.log(`User ${socket.id} disconnected`)
    },

    ///\\\ Event Handlers ///\\\
    // handle request for seek list
    handleGetSeeks : (resCallback) => {
        resCallback({success: true, message: 'Here are the seeks', data: seeks})
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