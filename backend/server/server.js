// probably going to need express, morgan, express-session, ViteExpress
import express from "express"
import morgan from "morgan"
import session from "express-session"
import ViteExpress from "vite-express"
import http from "http"
import { Server } from "socket.io"
import { handlerFunctions } from "./controller.js"

const port = 8800

const app = express()



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



io.on('connection', (socket) => {
  console.log(`${socket.id} user connected`)
  const session = socket.request.session
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})



// Routes
app.post('/login', handlerFunctions.login)


app.get('/logout', handlerFunctions.logout)

app.get('/session-check', handlerFunctions.sessionCheck)







// Run the server
httpServer.listen(port, () => console.log(`Now listening on http://localhost:${port}`))

ViteExpress.bind(app, httpServer)