// This file handles all the events for creating and seeking games

let clickCount = 0


export const gameHandlers = {
    handleConnect: (socket) => {
        console.log(`User ${socket.id} has connected`)

        socket.on('increment', (amount, callback) => gameHandlers.handleIncrement(amount, callback))


        socket.on('disconnect', (socket) => gameHandlers.handleDisconnect(socket))
    },

    handleIncrement: (amount, callback) => {
        console.log('handleIncrement called')
        clickCount += amount
        callback(clickCount)

    },
    handleDisconnect: (socket) => {
        console.log(`User ${socket.id} disconnected`)
    }
   
}