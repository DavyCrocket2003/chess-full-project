// probably going to need express, morgan, express-session, ViteExpress
import express from "express"
import morgan from "morgan"
import session from "express-session"
import ViteExpress from "vite-express"
import http from "http"
import { Server } from "socket.io"



const app = express()
const server = http.createServer(app)
const io = new Server(server)


app.use(morgan("dev"))
app.use(express.urlencoded({ extended: false }))
app.use(express.static("src"))
app.use(express.json())
app.use(
  session({
    secret: "heeeeeey",
    saveUninitialized: false,
    resave: false,
  })
)



// Routes
app.get('/', (req, res) => {
    res.sendFile('/Users/davyc/devMountain/chess-full-project/index.html')
})

io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })







// Run the server
server.listen(8181, () => console.log('Now listening on http://localhost:8181'))
// ViteExpress.listen(app, 8181, () => console.log("Listening on http://localhost:8181"))

ViteExpress.bind(app, server)