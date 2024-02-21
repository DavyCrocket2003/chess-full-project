// probably going to need express, morgan, express-session, ViteExpress
import express from "express"
import morgan from "morgan"
import session from "express-session"
import ViteExpress from "vite-express"
import http from "http"
import { Server } from "socket.io"

const port = 8800

const app = express()



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

const httpServer = http.createServer(app)
const io = new Server(httpServer)




io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })







// Run the server
httpServer.listen(port, () => console.log(`Now listening on http://localhost:${port}`))
// ViteExpress.listen(app, 8181, () => console.log(`Listening on http://localhost:${port}`))

ViteExpress.bind(app, httpServer)