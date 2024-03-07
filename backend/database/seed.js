import { db, User, Game, Message } from './model.js'

await db.sync({ force: true })

let users = ["Cat", "Ty", "Lincoln", "Jesse", "Josh", "Jackson", "Michael", "David"]

for (const user of users) {
  await User.create({
    username: user.toLowerCase(),
    password: "test",
    email: `${user.toLowerCase()}@gmail.com`,

  })
}

const game1 = await Game.create({
  uuid: 'b17605a0-c419-45eb-9878-8712b0ee126f',  
  moves: ['e2e4','e7e5','f1c4','b8c6','d1f3','d7d6','f3f7#'],
  player1Time: null,
  player2Time: null,
  timeControl: null,
  rated: false,
  result: '1-0',
  player1Id: 8,
  player2Id: 7,


})

const game2 = await Game.create({
  uuid: '5596e41d-f978-4bb1-84f5-aa8fd58f41d3',  
  moves: ['f2f3','e7e6','g2g4','d8h4#'],
  player1Time: null,
  player2Time: null,
  timeControl: null,
  rated: false,
  result: '0-1',
  player1Id: 8,
  player2Id: 7,

})

const game3 = await Game.create({
  uuid: '5596e41d-f978-4bb1-84f5-bb8fd58f41d3',  
  moves: ['f2f3','e7e6','g2g4','d8h4#'],
  player1Time: null,
  player2Time: null,
  timeControl: null,
  rated: false,
  result: '0-1',
  player1Id: 5,
  player2Id: 4,

})

// await game1.setPlayer1(1)
// await game1.setPlayer2(2)
// await game2.setPlayer1(1)
// await game2.setPlayer2(2)


await db.close()