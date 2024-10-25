import {User, Game, Friendship, Message, BoardState} from '../database/model.js'
import {Op} from 'sequelize'
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
        socketUsers[user.userId] = {...socketUsers[user.userId], username: userSession.username, status: userSession.status}

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
                status: 'loggedIn',
            }
            let socketUser = socketUsers[req.session.userId]
            if (socketUser) {
                const {socket, ...cleanData} = socketUser
                response = {...response, ...cleanData}
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
        if (!req.params.userId) {
            res.send({message: 'No userId sent', success: false})
        }
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
        User.findByPk(req.params.userId)
            .then(user => {
                if (!user) {
                return res.status(404).send({message: 'User not found', success: false});
                }
                return user.destroy();
            })
            .then(() => {
                res.send({message: 'User deleted successfully', success: true});
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                res.status(500).send({message: 'An error occurred while deleting the user', success: false});
        });
    },

    getGames: async (req, res) => {
        console.log('getGames requested for user:', req.params)
        const {userId} = req.params
        const unsortedGames = await Game.findAll({
            where: {[Op.or]: [{player1Id: userId}, {player2Id: userId}]},
            attributes: ['uuid', 'createdAt', 'status', 'result', 'length', 'player1Id', 'player2Id'],
            include: [
                {model: User, as: 'player1', attributes: ['username']},
                {model: User, as: 'player2', attributes: ['username']}
            ]
        })
        res.send({message: 'Here is the list of games', success: true, games: unsortedGames})
    },

    getGame: async (req, res) => {
        let myGame = req.params.gameId
        try {
            let myGameObj = await Game.findOne({
                where: {uuid: myGame},
                include: [
                    {model: User, as: 'player1', attributes: ['username']},
                    {model: User, as: 'player2', attributes: ['username']},
                    {model: BoardState},
                ]
            })
            res.send({message: 'Here is the game info', gameObj: myGameObj, success: true})
        } catch (error) {
            console.log(error)
            res.send({message: 'Error fetching game', error, success: false})
        }

    },

    getFriends: async (req, res) => {
        const {userId} = req.params
        const unsortedFriends = await Friendship.findAll({
            where: {[Op.or]: [{user1Id: userId}, {user2Id: userId}]}
        })
         const friendList = unsortedFriends.map(friend => {
            console.log('friend', friend, 'userId', userId)
            console.log({
                userId: (+userId)!==(+friend.user1Id)?friend.user1Id:friend.user2Id,
                createdAt: friend.createdAt,
                requestedBy: friend.requestedBy,
                status: friend.status,
            })
            return {
                userId: (+userId)!==(+friend.user1Id)?friend.user1Id:friend.user2Id,
                createdAt: friend.createdAt,
                requestedBy: friend.requestedBy,
                status: friend.status,
            }
         })
        res.send({message: 'Here are the list of friends', success: true, friendList})
    },

    getFriendship: async (req, res) => {
        console.log('getFriendship request', req.query)
        const friendship = await Friendship.findOne({
            where: {
                [Op.or]: [{
                    [Op.and]: [{user1Id: req.query.user1Id}, {user2Id: req.query.user2Id}]
                }, {
                    [Op.and]: [{user1Id: req.query.user2Id}, {user2Id: req.query.user1Id}]
                }]
        }})
        if (!friendship) {
            res.send({success: false, message: 'users are not friends'})
        } else {
            res.send({success: true, message: 'here is the friendship info', friendship})
        }
    },

    postFriendship: async (req, res) => {
        console.log('postFriendship', req.body)
        try {
            await Friendship.create({
                user1Id: req.body.user1Id,
                user2Id: req.body.user2Id,
                requestedBy: req.body.user1Id,
                status: 'pending',
            })
            res.send({success: true, message: 'friendship requested'})
        } catch (err) {
            res.send({success: false, message: 'friendship request failed'})
            throw err
        }
        
    },

    putFriendship: async (req, res) => {
        console.log('putFriendship', req.body)
        try {
                const friendship = await Friendship.findOne({
                where: {
                    [Op.or]: [{
                        [Op.and]: [{user1Id: req.body.user1Id}, {user2Id: req.body.user2Id}]
                    }, {
                        [Op.and]: [{user1Id: req.body.user2Id}, {user2Id: req.body.user1Id}]
                    }]
            }})
            if (!friendship) {
                res.send({success: false, message: 'users are not friends'})
            } else {
                friendship.createdAt = Date.now()
                friendship.status = req.body.status
                await friendship.save()
                res.send({success: true, message: `friendship status updated to ${req.body.status}`})
            }}
        catch (err) {
            console.log('error updating friendship', err)
            res.status(500).send({success: false, message: 'An error occurred while updating friendship'})
        }
    },

    postMessage: async (req, res) => {
        try {
            const {subject, body, senderId, receiverId} = req.body
            await Message.create({subject, body, senderId, receiverId})
            res.send({message: "Message sent successfully", success: true})
        } catch (err) {
            console.error(err)
            res.send({message: "There was a problem saving the message", success: false})
        }
    },

    getSentMessages: (req, res) => {
        Message.findAll({
            where: {senderId: req.params.userId},
            include: {model: User, as: 'receiver', attributes: ['username', 'photoURL']}
        })
            .then((sentMessages) => {
                res.send({message: "Here are the sent messages", sentMessages, success: true})
            })
            .catch(error => {
                console.error(error)
                res.send({message: "Error fetching messages", success: false, error})
            })
    },

    getReceivedMessages: (req, res) => {
        Message.findAll({
            where: {receiverId: req.params.userId},
            include: {model: User, as: 'sender', attributes: ['username', 'photoURL']}
        })
            .then((receivedMessages) => {
                res.send({message: "Here are the received messages", receivedMessages, success: true})
            })
            .catch(error => {
                console.error(error)
                res.send({message: "Error fetching messages", success: false, error})
            })
    },

    putMessage: (req, res) => {
        Message.findByPk(req.body.messageId).then(message => {
            if (message) {
                return message.update({status: req.body.status})
            }
        }).then(updatedMessage => {
            if (updatedMessage) {
                res.send({message: 'Message updated successfully', success: true})
            } else {
                res.send({message: 'Error updating message', success: false})
            }
        })
    },

    deleteMessage: (req, res) => {
        Message.findByPk(req.params.messageId)
            .then(message => {
                if (!message) {
                return res.status(404).send('Message not found');
                }
                return message.destroy();
            })
            .then(() => {
                res.send({message: 'Message deleted successfully', success: true});
            })
            .catch(error => {
                console.error('Error deleting message:', error);
                res.status(500).send({message: 'An error occurred while deleting the message', success: false});
        });
    }
    
}

