//Using this to draw things for reference

let reduxStore = {
    liveChess: {
        boardState: {
            turn: 'white',
            lastMove: {origin: null, target: null},
            player1Time: 300,
            player2Time: 300,
            '11': {
                piece: "R",
                moves: []
            },
            '12': {
                piece: "N",
                moves: ['31','33']
            },
            '13': {
                piece: "B",
                moves: []
            }   // And so on
        },
        game: {
            gameId: '7ec3b748-e441-4683-a70b-31422715848b',
            date: "timestampOfGame",
            type: "live",
            on: true,
            owner: 'SomeUserId',
            whitePlayer: 'SomeUserId',
            blackPlayer: 'SomeUserId',

        },
        player1Id: "someUserId",
        player2Id: "someUserId",
        gameHistory: [str1,str2,str3,str4],
        messageHistory: []
    },
    userId: "someUserId",
    userData: {
        picture: "someURL",
        age: "optional_number",
        gender: "M or F",
        country: "SomeCountry",
        bio: "SomeString",
        password: "somePSWRD",
        rating: "someinteger",
        friends: ["SomeUserId's"],
        recentGames: ["SomeGameId's"]
    }
}