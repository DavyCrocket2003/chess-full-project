import {User} from '../database/model.js'
import { users as socketUsers } from './gameHandlers.js'

export const handlerFunctions = {
    login: async (req, res) => {
        const {usernameInput, passwordInput} = req.body
        if (!usernameInput) {
            res.send({message: 'username undefined', success: false})
            return
        }
        const user = await User.findOne({
            where: {
                username: usernameInput
            }
        })
        if (!user) {
            res.send({
              message: 'no username found',
              success: false
            })
            return
        }
        

        if (user.password !== passwordInput) {
            res.send({
                message: 'password does not match',
                success: false,
            })
            return
        }
        let userSession = {
        userId: user.userId,
        username: usernameInput,
        status: 'loggedIn'
        }
        req.session.userId = user.userId
        req.session.username = usernameInput
        req.session.status = 'loggedIn'
        socketUsers[user.userId] = {...socketUsers[user.userId], ...userSession}

        res.send({
            message: "user logged in",
            success: true,
            ...userSession
        })

    },

    sessionCheck: async (req, res) => {
        if (req.session.userId) {
            let response = {
                message: "The user is still logged in",
                success: true,
                userId: req.session.userId,
                username: req.session.username,
                status: 'loggedIn'
            }
            let socketUser = socketUsers[response.userId]
            if (socketUser) {
                response = {...response, ...socketUser}
            }
            res.send(response)
        } else {
            res.send({
                message: "No user logged in",
                success: false,
            })
        }
        console.log(req.session)
        return
    },

    logout: async (req,res) => {
        // remove from session
        // and remove from socketio data
        delete socketUsers[req.session.userId]
        req.session.destroy()

        res.send({
            message: "User logged out",
            success: true,
        })
        return
    }
    
}

