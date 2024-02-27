import {User} from '../database/model.js'

export const handlerFunctions = {
    login: async (req, res) => {
        const {username, password} = req.body

        const user = await User.findOne({
            where: {
                username: username
            }
        })
        if (!user) {
            res.send({
              message: 'no username found',
              success: false
            })
            return
        }
        

        if (user.password !== password) {
            res.send({
                message: 'password does not match',
                success: false,
            })
            return
        }

        req.session.userId = user.userId

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
                userId: req.session.userId
            })
            return
        } else {
            res.send({
                message: "No user logged in",
                success: false,
            })
            return
        }
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

