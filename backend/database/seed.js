import { db, User, Game, Message, Friendship, BoardState } from './model.js'

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
  uuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',  
  player1Time: null,
  player2Time: null,
  timeControl: null,
  rated: false,
  status: '½-½',
  length: 25,
  player1Id: 8,
  player2Id: 7,
  result: 'stalemate'
})

let states1 = [
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index: 0, fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'         , move: '2444', transcriptMove: 'D2D4'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index: 1, fen: 'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b Qkq - 0 1'        , move: '7454', transcriptMove: 'D7D5'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index: 2, fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w Qkq - 0 2'      , move: '1335', transcriptMove: 'C1E3'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index: 3, fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P4/4B3/PPP1PPPP/RN1QKBNR b Qkq - 1 3'    , move: '8365', transcriptMove: 'C8E6'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index: 4, fen: 'rn1qkbnr/ppp1pppp/4b3/3p4/3P4/4B3/PPP1PPPP/RN1QKBNR w Qkq - 2 4'  , move: '1233', transcriptMove: 'B1C3'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index: 5, fen: 'rn1qkbnr/ppp1pppp/4b3/3p4/3P4/2N1B3/PPP1PPPP/R2QKBNR b Qkq - 3 5' , move: '8263', transcriptMove: 'B8C6'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index: 6, fen: 'r2qkbnr/ppp1pppp/2n1b3/3p4/3P4/2N1B3/PPP1PPPP/R2QKBNR w Qkq - 4 6', move: '1434', transcriptMove: 'D1D3'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index: 7, fen: 'r2qkbnr/ppp1pppp/2n1b3/3p4/3P4/2NQB3/PPP1PPPP/R3KBNR b Qkq - 5 7' , move: '8464', transcriptMove: 'D8D6'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index: 8, fen: 'r3kbnr/ppp1pppp/2nqb3/3p4/3P4/2NQB3/PPP1PPPP/R3KBNR w Qkq - 6 8'  , move: '1513', transcriptMove: 'OOO'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index: 9, fen: 'r3kbnr/ppp1pppp/2nqb3/3p4/3P4/2NQB3/PPP1PPPP/2KR1BNR b kq - 7 9'  , move: '7767', transcriptMove: 'G7G6'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:10, fen: 'r3kbnr/ppp1pp1p/2nqb1p1/3p4/3P4/2NQB3/PPP1PPPP/2KR1BNR w kq - 0 10', move: '3467', transcriptMove: 'D3xG6'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:11, fen: 'r3kbnr/ppp1pp1p/2nqb1Q1/3p4/3P4/2N1B3/PPP1PPPP/2KR1BNR b kq - 0 11', move: '8766', transcriptMove: 'G8F6'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:12, fen: 'r3kb1r/ppp1pp1p/2nqbnQ1/3p4/3P4/2N1B3/PPP1PPPP/2KR1BNR w kq - 1 12', move: '3354', transcriptMove: 'C3xD5'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:13, fen: 'r3kb1r/ppp1pp1p/2nqbnQ1/3N4/3P4/4B3/PPP1PPPP/2KR1BNR b kq - 0 13' , move: '8677', transcriptMove: 'F8G7'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:14, fen: 'r3k2r/ppp1ppbp/2nqbnQ1/3N4/3P4/4B3/PPP1PPPP/2KR1BNR w kq - 1 14'  , move: '5473', transcriptMove: 'D5xC7+'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:15, fen: 'r3k2r/ppN1ppbp/2nqbnQ1/8/3P4/4B3/PPP1PPPP/2KR1BNR b kq - 0 15'    , move: '6473', transcriptMove: 'D6xC7'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:16, fen: 'r3k2r/ppq1ppbp/2n1bnQ1/8/3P4/4B3/PPP1PPPP/2KR1BNR w kq - 0 16'    , move: '4454', transcriptMove: 'D4D5'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:17, fen: 'r3k2r/ppq1ppbp/2n1bnQ1/3P4/8/4B3/PPP1PPPP/2KR1BNR b kq - 0 17'    , move: '8887', transcriptMove: 'H8G8'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:18, fen: 'r3k1r1/ppq1ppbp/2n1bnQ1/3P4/8/4B3/PPP1PPPP/2KR1BNR w q - 1 18'    , move: '5464', transcriptMove: 'D5D6'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:19, fen: 'r3k1r1/ppq1ppbp/2nPbnQ1/8/8/4B3/PPP1PPPP/2KR1BNR b q - 0 19'      , move: '7564', transcriptMove: 'E7xD6'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:20, fen: 'r3k1r1/ppq2pbp/2npbnQ1/8/8/4B3/PPP1PPPP/2KR1BNR w q - 0 20'       , move: '3524', transcriptMove: 'E3D2'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:21, fen: 'r3k1r1/ppq2pbp/2npbnQ1/8/8/8/PPPBPPPP/2KR1BNR b q - 1 21'         , move: '8788', transcriptMove: 'G8H8'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:22, fen: 'r3k2r/ppq2pbp/2npbnQ1/8/8/8/PPPBPPPP/2KR1BNR w q - 2 22'          , move: '6734', transcriptMove: 'G6D3'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:23, fen: 'r3k2r/ppq2pbp/2npbn2/8/8/3Q4/PPPBPPPP/2KR1BNR b q - 3 23'         , move: '7351', transcriptMove: 'C7A5'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:24, fen: 'r3k2r/pp3pbp/2npbn2/q7/8/3Q4/PPPBPPPP/2KR1BNR w q - 4 24'         , move: '2451', transcriptMove: 'D2xA5'},
              {gameUuid: 'b408b1b6-beb9-4a6d-b5a9-a4c15acb4bec',    index:25, fen: 'r3k2r/pp3pbp/2npbn2/B7/8/3Q4/PPP1PPPP/2KR1BNR b q - 0 25'         , move: '7262', transcriptMove: 'B7B6'}
]
BoardState.bulkCreate(states1)

const game2 = await Game.create({
  uuid: '5596e41d-f978-4bb1-84f5-aa8fd58f41d3',  
  player1Time: null,
  player2Time: null,
  timeControl: null,
  rated: false,
  status: '1-0',
  length: 17,
  player1Id: 3,
  player2Id: 4,
  result: 'checkmate'
})
// moves: [2444,7454,1335,8365,1233,8263,1434,8464,1513,7767,3467,8766,3354,8677,5473,6473,4454,8887,5464,7564,3524,8788,6734,8587,3464,7364,2468,6424,1424,8684,2484,7786,8481,6647,8186],
  

const game3 = await Game.create({
  uuid: '5596e41d-f978-4bb1-84f5-bb8fd58f41d3',
  player1Time: null,
  player2Time: null,
  timeControl: null,
  rated: false,
  status: '0-1',
  length: 2,
  player1Id: 7,
  player2Id: 8,
  result: 'checkmate'
})
// moves: [2636,7555,2747,8448],
let myStates = ['nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w',
  'nbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b',
  'nbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w',
  'nbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b',
  'nb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR b']
  let myMoves = ['F2F3', 'E7E5', 'G2G4', 'D8H4#']
BoardState.bulkCreate(myStates.map((e, i) => {
  return {
    gameUuid: '5596e41d-f978-4bb1-84f5-bb8fd58f41d3',
    index: i,
    fen: e,
    transcriptMove: myMoves[i]
  }
}))

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