// probably going to need express, morgan, express-session, ViteExpress
import express from "express"
import morgan from "morgan"
import session from "express-session"
import ViteExpress from "vite-express"
import http from "http"
import { Server } from "socket.io"
import { handlerFunctions } from "./controller.js"
import cors from "cors"
import { handleConnect } from "./gameHandlers.js"


const port = 8800

const app = express()


app.use(cors({
  origin: 'http://localhost:4000', // Allow requests from this origin
  credentials: true // Allow cookies to be sent back and forth
}))
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: false }))
app.use(express.static("src"))
app.use(express.json())

const sessionMiddleware = session({
  secret: "heeeeeey",
  saveUninitialized: false,
  resave: false,
})

app.use(sessionMiddleware)
const httpServer = http.createServer(app)
const io = new Server(httpServer)
io.engine.use(sessionMiddleware)



io.on('connection', (socket) => handleConnect(socket, io))



// Routes
app.post('/login', handlerFunctions.login)

// get user from DB
app.get('/users/:userId', handlerFunctions.getUser)

app.put('/users', handlerFunctions.putUser)

app.get('/logout', handlerFunctions.logout)

app.get('/session-check', handlerFunctions.sessionCheck)

app.put('/status/:userId', handlerFunctions.putStatus)

app.post('/verify', handlerFunctions.verifyPassword)

app.post('/register', handlerFunctions.register)

app.delete('/users/:userId', handlerFunctions.deleteUser)

app.get('/friends/:userId', handlerFunctions.getFriends)

app.get('/friendship', handlerFunctions.getFriendship)

app.post('/friendship', handlerFunctions.postFriendship)

app.put('/friendship', handlerFunctions.putFriendship)

app.post('/messages', handlerFunctions.postMessage)

app.get('/sentMessages/:userId', handlerFunctions.getSentMessages)

app.get('/receivedMessages/:userId', handlerFunctions.getReceivedMessages)

app.put('/messages', handlerFunctions.putMessage)





// Run the server
httpServer.listen(port, () => console.log(`Now listening on http://localhost:${port}`))

ViteExpress.bind(app, httpServer)