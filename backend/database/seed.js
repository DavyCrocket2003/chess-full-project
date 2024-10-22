import { db, User, Game, Message, Friendship } from './model.js'

await db.sync({ force: true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
let users = ["Cat", "Ty", "Lincoln", "Jesse", "Josh", "Jackson", "Michael", "David"]

for (const user of users) {
  await User.create({
    username: user.toLowerCase(),
    password: "test",
    email: `${user.toLowerCase()}@gmail.com`,

  })
}

User.create({
  username: 'Mar',
  password: "test",
  email: `mar@gmail.com`,
  phtoURL: 'https://www.cheatsheet.com/wp-content/uploads/2021/06/Headshot-of-Marilyn-Monroe-wearing-bright-red-lipstick-and-smiling-for-the-camera.jpg?w=2048&h=1561'

})


const game1 = await Game.create({
  uuid: 'b17605a0-c419-45eb-9878-8712b0ee126f',  
  moves: [2545,7555,1643,8766,1736,8263,1517,7464,3657,8365,5765,7665,4365,8475,6554,6654,4554,6344,2343,8583,1233,7548,3352,4452,4352,8675,1436,8486,3637,4837,2837,7566,3747,7353,5263,6648,2636,4837,6372,8373,7282,8682,2242,8242,2444,5544,1346,3746,1614,4252,1444,5254,4454,8886,1114,4655,1726,7757,2737,7868,3646,5746,3746,5546,2636,4613,3645,1357,5464,8684,6484,5784,4556,8457,5665,7151,1454,5141,5451,7363,5141,6353,4145,5713,6566,5354,4541,5464,6667,1324,4144,6455,4424,5546,2427,4636,2717,3626,1712,2636,6758,3646,1242,4636,5868,3635,4757,3534,5767,3433,4248,3322,4828,2211,6777,1112,7787,1211,8732],
  player1Time: null,
  player2Time: null,
  timeControl: null,
  rated: false,
  status: '½-½',
  player1Id: 8,
  player2Id: 7,
  result: 'stalemate'
})

const game2 = await Game.create({
  uuid: '5596e41d-f978-4bb1-84f5-aa8fd58f41d3',  
  moves: [2444,7454,1335,8365,1233,8263,1434,8464,1513,7767,3467,8766,3354,8677,5473,6473,4454,8887,5464,7564,3524,8788,6734,8587,3464,7364,2468,6424,1424,8684,2484,7786,8481,6647,8186],
  player1Time: null,
  player2Time: null,
  timeControl: null,
  rated: false,
  status: '1-0',
  player1Id: 3,
  player2Id: 4,
  result: 'checkmate'
})

const game3 = await Game.create({
  uuid: '5596e41d-f978-4bb1-84f5-bb8fd58f41d3',  
  moves: [2636,7555,2747,8448],
  player1Time: null,
  player2Time: null,
  timeControl: null,
  rated: false,
  status: '0-1',
  player1Id: 5,
  player2Id: 4,
  result: 'checkmate'
})

await Friendship.create({user1Id: 1, user2Id: 8, status: 'accepted', requestedBy: 8})
await Friendship.create({user1Id: 2, user2Id: 8, status: 'accepted', requestedBy: 8})
await Friendship.create({user1Id: 3, user2Id: 8, status: 'accepted', requestedBy: 8})
await Friendship.create({user1Id: 4, user2Id: 8, status: 'accepted', requestedBy: 8})
await Friendship.create({user1Id: 5, user2Id: 8, status: 'accepted', requestedBy: 8})
await Friendship.create({user1Id: 6, user2Id: 8, status: 'accepted', requestedBy: 8})
await Friendship.create({user1Id: 7, user2Id: 8, status: 'accepted', requestedBy: 8})
await Friendship.create({user1Id: 1, user2Id: 2, status: 'accepted', requestedBy: 1})

// await game1.setPlayer1(1)
// await game1.setPlayer2(2)
// await game2.setPlayer1(1)
// await game2.setPlayer2(2)


await db.close()