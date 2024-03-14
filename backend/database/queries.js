import {User, Game, Message} from './model.js'
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

// Message.findAll({
//     include: [
//       {
//         model: User,
//         as: 'sender',
//         attributes: ['username', 'profileImageUrl'], // Specify user-related attributes to select
//         where: { senderId: 4 } // Filter by senderId = 4
//       }
//     ]
//   })
//   .then(messages => {
//     // Handle the retrieved messages here
//     console.log((messages))
//   })

Message.findAll({
  include: [
    {
      model: User,
      as: 'sender',
      attributes: ['username', 'photoURL'], // Select sender-related attributes
    },
    {
      model: User,
      as: 'receiver',
      attributes: ['username', 'photoURL'], // Select receiver-related attributes
    }
  ],
  where: {
    receiverId: 4
  }
})
.then(messages => {
  // Handle the retrieved messages here
  console.log(messages);
})
.catch(error => {
  // Handle errors here
  console.error(error);
});