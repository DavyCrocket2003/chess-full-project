import {User, Game} from './model.js'
import { Op } from 'sequelize'


Game.findAll({
    where: {
        [Op.or]: [
            {player1Id: 8},
            {player2Id: 8}
        ]
    }
}).then(games => {
    console.log(games)
})

