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
    moves: ['e2e4','e7e5','f1c4','b8c6','d1f3','d7d6','f3f7#']

})

const game2 = await Game.create({
    moves: ['f2f3','e7e6','g2g4','d8h4#']

})

await game1.setPlayer1(1)
await game1.setPlayer2(2)
await game2.setPlayer1(1)
await game2.setPlayer2(2)


await db.close()