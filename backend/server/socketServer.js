import { Server } from "socket.io"
import { gameHandlers } from "./gameHandlers"


export default function (httpServer) {
    
    // Create create socketIO server on top of the normal server that was passed (http server)
    const io = new Server(httpServer)

    // Namespace for all live game activity
    // const gamesNamespace = io.of('/games')

    gamesNamespace.on('connection', (socket) => gameHandlers.handleConnect(socket))

}