import {User, Game} from '../database/model.js'
import {Op, Sequelize} from 'sequelize'
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
        // Successful login branch here
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
                status: socketUsers[req.session.userId] ? socketUsers[req.session.userId].status : 'loggedIn'
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
    },

    getUser: async (req, res) => {
        console.log('getUser endpoint hit',  req.params)
        try {
            const userData = await User.findByPk(req.params.userId)
            res.send({message: "Here is the user data", userData, success: true})
        } catch (error) {
            console.error('An error occured', error)
            res.send({message: 'an error occured', success: false})
        }
    },

    putUser: async(req,res) => {
        try {
            await User.update({...req.body.data}, {where: {userId: req.body.userId}})
            res.send({message: `user ${req.body.userId} updated successfully`, success: true})
        } catch (error) {
            console.error('An error occured', error)
            res.send({message: 'an error occured', success: false})
        }
    },

    putStatus: (req, res) => {
        console.log('putStatus endpoint hit', req.params.userId, req.body.status)
        socketUsers[req.params.userId] = {...socketUsers[req.params.userId], ...req.body}
        res.send({message: `User ${req.params.userId} status set to ${req.body.status}`, success: true})
    },

    verifyPassword: async (req, res) => {
        const myUser = await User.findByPk(req.body.userId)
        if (myUser.password!==req.body.password || myUser.username!==req.body.username) {
            res.send({success: false, message: 'Validation failed'})
        } else {
            res.send({success: true, message: 'Correct password'})
        }
    },

    register: async (req, res) => {
        const {username, password1, password2, email} = req.body
        if (password1!==password2) {
            res.send({message: 'Passwords do not match', success: false})
            return
        }
        try {
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{username: username}, {email: email}]
                }
            })
            if (existingUser) {
                const message = `That ${existingUser.username===username ? 'username' : 'email'} is already in use`
                res.send({message, success: false})
            } else {
                await User.create({username, password: password1, email})
                res.send({message: 'Registration successful', success: true})
            }
            return
        } catch (err) {
            res.send({message: 'Error creating user', success: false})
            throw err
        }
    },

    deleteUser: async (req, res) => {
        try {
            console.log(req.params)
            await User.destroy({
                where: {userId: req.params.userId}
            })
            res.send({message: 'User account deleted', success: true})
        } catch (err) {
            res.send({message: 'Error deleting account', success: false})
            throw(err)
        }
        return
    }
    
}

