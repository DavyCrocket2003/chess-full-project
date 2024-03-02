import {User} from '../database/model.js'

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

        req.session.userId = user.userId
        req.session.username = usernameInput

        res.send({
            message: "user logged in",
            success: true,
            userId: req.session.userId
        })

    },

    sessionCheck: async (req, res) => {
        if (req.session.userId) {
            res.send({
                message: "The user is still logged in",
                success: true,
                userId: req.session.userId,
                username: req.session.username,
            })
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
        req.session.destroy()

        res.send({
            message: "User logged out",
            success: true,
        })
        return
    }
    
}

