

function ChessGame(params) {
    console.log('ChessGame called', params)
    // params should include {gameId, gameName player1Id, player2Id, createdAt?, rated, timeControl}
    const {gameId, gameName, player1Id, player2Id, createdAt, rated, timeControl} = params



    // function that returns piece color, 'white', 'black', 'blank', or 'false' (if piece is undefined)
    function getColor(piece) {
        console.log('getColor called', 'piece', piece)
        if (typeof piece === 'undefined') {
            return false
        }
        return piece === '' ? 'blank' : (piece.toUpperCase() === piece ? 'white' : 'black');
    }

    // function that evaluates the board state and looks for game state triggers
    // For instance check, stalemate, and checkmate
    function evaluateState() {
        console.log('evaluateState called')
        let check = inCheck(gameState.pieces, gameState.turn)
        let checkmate = false
        let stalemate = false
        let canMove = false
        for (let s in gameState.squares) {  // Search to see if current player has any legal moves
            if ((getColor(s.piece)===gameState.turn) && s.moves) {
                canMove = true
                break
            }
        }
        if (!canMove) {
            if (check) {
                checkmate = true
            } else {
                stalemate = true
            }
            gameOver = true
        }
        // Need to implement insufficient material
        // Need to implement repetition draws
        return {check, checkmate, stalemate,}
    }

    // function that creates a string representation of a move
    // from currentFlags and currentStatus returns it
    function writeMove() {
        console.log('writeMove called')
        if (currentFlags.OOO) {
            return 'OOO'
        }
        if (currentFlags.OO) {
            return 'OO'
        }
        if (currentStatus.stalemate) {
            return '½-½'
        }
        let [y1, x1, y2, x2] = [gameState.lastMove.origin[0], gameState.lastMove.origin[1], gameState.lastMove.target[0], gameState.lastMove.target[1]]
        const xmap = {1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G', 8: 'H'}
        return xmap[x1] + y1 + (currentFlags.capture ? 'x' : '') + xmap[x2] + y2 + (currentStatus.checkmate ? '#' : (currentStatus.check ? '+' : '')) +  (currentFlags.enPassant ? 'ep' : '')
    }

    ///\\\ Pseudocode for finding legal moves from board state
    // Step 1: tabulate possible moves
    // Step 2: test each of the possible moves for legality
    // For each possible move ->
        // A) Make the move on a test board
        // B) Test aggressive (includePeaceful=false) moves of all pieces of opposite color
        // C) If/When a move hits or attacks the king, flag move as illegal and break
        // D) If no moves flag as illegal, push the move to legal moves
    // Step 3: return legal moves



    // function that returns an array of candidate moves for square
    function squareMoveCandidates(squaresObj, square, includePeaceful=true) {
        console.log('squareMoveCandidates called', 'squaresObj', squaresObj, 'square', square, includePeaceful)
        if (squaresObj[square]==='') {
            return []
        }
        let mySquaresObj = {...squaresObj}
        const [y0, x0] = [+square[0], +square[1]]
        const color0 = getColor(mySquaresObj[square])
        let candidates = []
        

        // This function adds candidate moves for a piece that moves straight in a direction [dydx]
        function straightMoves(y, x, dy, dx) {
            let next = mySquaresObj[`${y + dy}${x + dx}`]
            let nextColor = getColor(next)
            while (nextColor === 'blank') {
                candidates.push(next)
                y += dy
                x += dx
                next = mySquaresObj[`${y + dy}${x + dx}`]
                nextColor = getColor(next)
            }
            if (nextColor && nextColor !== color0) {
                candidates.push(next)
            }
        }

        // This object holds functions that add candidate moves for a given piece
        const pieceMoves = {
            // Basic white pawn
            'P': () => {
                if (includePeaceful) {  // Do not include for check calculations
                    if (mySquaresObj[`${y0+1}${x0}`] === '') {    // if the square in front of the pawn is blank
                        candidates.push(`${y0+1}${x0}`)         // allow it to advance
                        if (y0 === 2 && mySquaresObj[`${y0+2}${x0}`] === '') {    // if the square 2 ahead is also blank (and it hasn't moved)
                            candidates.push(`${y0+2}${x0}`)                     // allow it to advance 2 squares
                        }
                    }
                }
                if (getColor(mySquaresObj[`${y0+1}${x0-1}`]) === 'black') {   // if forward left is an enemy
                    candidates.push(`${y0+1}${x0-1}`)           // allow capture
                }
                if (getColor(mySquaresObj[`${y0+1}${x0+1}`]) === 'black') {   // if forward right is an enemy
                    candidates.push(`${y0+1}${x0+1}`)           // allow capture
                }
            },
            // L stands for a white pawn that can en passant capture left
            'L': () => {
                pieceMoves.P()
                candidates.push(`${y0+1}${x0-1}`)
            },
            // M stands for a white pawn that can en passant capture right
            'M': () => {
                pieceMoves.P()
                candidates.push(`${y0+1}${x0+1}`)
            },
            // This setup will work for black rooks as well
            'R': () => {
                straightMoves(y0, x0, 1, 0)
                straightMoves(y0, x0, -1, 0)
                straightMoves(y0, x0, 0, -1)
                straightMoves(y0, x0, 0, 1)
            },
            // V stands for white unmoved rook (used for determining castleing rights)
            'V': () => {
                pieceMoves.R()
            },
            // This setup works for white knights and black knights.
            'N': () => {
                [`${y0+2}${x0-1}`,`${y0+2}${x0+1}`,`${y0+1}${x0+2}`,`${y0-1}${x0+2}`,`${y0-2}${x0+1}`,`${y0-2}${x0-1}`,`${y0-1}${x0-2}`,`${y0+1}${x0-2}`]
                .forEach((targetSquare) => {
                let targetColor = getColor(mySquaresObj[targetSquare])
                if (targetColor && (targetColor !== color0)) {
                    candidates.push(targetSquare)
                }
            })
            },
            // This should also work for black bishops
            'B': () => {
                straightMoves(y0, x0, 1, 1)
                straightMoves(y0, x0, -1, 1)
                straightMoves(y0, x0, 1, -1)
                straightMoves(y0, x0, -1, -1)
            },
            // Should also work for black queens
            'Q': () => {
                pieceMoves.R()
                pieceMoves.B()
            },
            // Will also work for black moved king
            'K': () => {
                [`${y0+1}${x0-1}`,`${y0+1}${x0}`,`${y0+1}${x0+1}`,`${y0}${x0+1}`,`${y0-1}${x0+1}`,`${y0-1}${x0}`,`${y0-1}${x0-1}`,`${y0}${x0-1}`]
                .forEach((targetSquare) => {
                    let targetColor = getColor(mySquaresObj[targetSquare])
                    if (targetColor && (targetColor !== color0)) {
                        candidates.push(targetSquare)
                    }
                })
            },
            'U': () => {    // white unmoved king
                pieceMoves.K()  // include regular king moves
                let canOOO = false  // hard coded values for castling queen side
                // If: (A) '11': 'V' && '15': 'U' (B) '12', '13', '14' are blank (C) '13', '14', '15' not attacked (D) includePeaceful, then:
                if (canOOO) {
                    candidates.push('13')
                }
                let canOO = false   // hard coded values for castling king side
                // If: (A) '18': 'V' && '15': 'U' (B) '16', '17' are blank (C) '15', '16' '17' not attacked (D) includePeaceful, then:
                if (canOO) {
                    candidates.push('17')
                }
            },
            'p': () => {
                if (includePeaceful) {
                    if (mySquaresObj[`${y0-1}${x0}`] === '') {                // if the square in front of the pawn is empty then
                        candidates.push(`${y0-1}${x0}`)                     // allow it to advance
                        if (y0 === 7 && mySquaresObj[`${y0-2}${x0}`] === '') {// if pawn unmoved and 2 squares ahead is empty then
                            candidates.push(`${y0-2}${x0}`)                 // allow it to advance forward 2 squares
                        }
                    }
                }
                if (getColor(mySquaresObj[`${y0-1}${x0-1}`]) === 'white') {   // if forward right is enemy piece
                    candidates.push(`${y0-1}${x0-1}`)           // allow capture
                }
                if (getColor(mySquaresObj[`${y0-1}${x0+1}`]) === 'white') {   // if forward left is enemy piece
                    candidates.push(`${y0-1}${x0+1}`)           // allow capture
                }
            },
            'l': () => {    // black pawn that can capture left en passant
                pieceMoves.p()
                candidates.push(`${y0-1}${x0+1}`)
            },
            'm': () => {    // black pawn that can capture right en passant
                pieceMoves.p()
                candidates.push(`${y0-1}${x0-1}`)
            },
            'r': () => {    // a black rook | moves same as a white rook
                pieceMoves.R()
            },
            'v': () => {    // a black unmoved rook | same move calculations as white rook
                pieceMoves.R()
            },
            'n': () => {    // black knights move the same as white knights
                pieceMoves.N()
            },
            'b': () => {    // black bishop moves same as white
                pieceMoves.B()
            },
            'q': () => {    // black queen same as white
                pieceMoves.Q()
            },
            'k': () => {    // black king same as white
                pieceMoves.K()
            },
            'u': () => {    // black unmoved king
                pieceMoves.K()  // include regular king moves
                let canOOO = false  // hard coded values for castling queen side
                let canOO = false   // hard coded values for castling king side
                // If: (A) '81': 'v' && '85': 'u' (B) '82', '83', '84' are blank (C) '83', '84', '85' not attacked, then:
                if (canOOO) {
                    candidates.push('83')
                }
                // If: (A) '81': 'v' && '85': 'u' (B) '86', '87' are blank (C) '85', '86' '87' not attacked, then:
                if (canOO) {
                    candidates.push('87')
                }
            }

        }

        pieceMoves[mySquaresObj[square]]()
        console.log('candidates', candidates)
        return candidates
    }

    // finds out if the king on the board with the given color is in check
    function inCheck(squaresObj, color) {
        console.log('inCheck called', 'squaresObj', squaresObj)
        let mySquaresObj = {...squaresObj}
        // find the king of the color
        let targets = color==='white'?['U','K']:['u','k']
        let kingOn = ''
        for (let square in mySquaresObj) {
            let squarePiece = mySquaresObj[square]
            if (squarePiece==='') {
                continue
            }
            if (targets.includes(squarePiece)) {
                kingOn = square
                break
            }
        }
        // now that we know where the king is, we can look for
        // any aggressive canditate moves to his square (aka check)
        for (let square in mySquaresObj) {
            let squarePiece = mySquaresObj[square]
            if (squarePiece==='' || getColor(squarePiece)===color) {    // skip blank squares and pieces of the same color
                continue
            } else {    // check the aggressive (flag to not includePeaceful) moves from the test square
                if (squareMoveCandidates(mySquaresObj, square, false).includes(kingOn)) {
                    return true // if the square can attack the king square return true to inCheck
                }
            }
        }
    }

    // function that adjusts the pieces on the board given a candidate move (candidate or legal)
    // Cleans up any piece transformations
    // Also returns an object that flags for {capture, enPassant, promote, OOO, OO}
    // Note the promote flag will be '' or a letter 
    function movePieces(squaresObj, origin, target, p='q') {
        console.log('movePieces called', 'squaresObj', squaresObj, 'origin', origin, 'target', target, p)
        let mySquaresObj = {...squaresObj}
        let piece = mySquaresObj[origin]
        let pieceColor = getColor(piece)
        let [y1, x1] = [+origin[0], +origin[1]]
        let [y2, x2] = [+target[0], +target[1]]
        // flags for tracking special events
        let capture = false     // flag to track if a piece is captured
        let enPassant = false   // tracks en passant
        let OOO = false         // queen side castle
        let OO = false          // king side castle
        let promote = ''       // promotion
        

        
        // En passant, need to remove the pawn behind
        if (['L','M','l','m'].includes(piece)) {
            mySquaresObj[`${y2 + (pieceColor === 'white' ? -1 : 1)}${x2}`] = ''
            enPassant = true
            capture = true
        }
        // If pawn is "jumping", need to add en passant to neighbor enemy pawns
        if (piece === 'P' && y2 - y1 === 2) {
            if (mySquaresObj[`${y1+1}${x1-1}`==='p']) {
                mySquaresObj[`${y1+1}${x1-1}`] = 'l'
            }
            if (mySquaresObj[`${y1+1}${x1+1}`==='p']) {
                mySquaresObj[`${y1+1}${x1+1}`] = 'l'
            }
        }
        if (piece === 'p' && y2 - y1 === -2) {
            if (mySquaresObj[`${y1-1}${x1-1}`==='P']) {
                mySquaresObj[`${y1-1}${x1-1}`] = 'M'
            }
            if (mySquaresObj[`${y1-1}${x1+1}`==='P']) {
                mySquaresObj[`${y1-1}${x1+1}`] = 'L'
            }
        }
        
        
        // Promotion | change the pawn into it's promote piece
        if ((piece==='P' || piece==='p') && (y2 === 1 || y2 === 8)) {
            promote = p         // flags that a promotion occured
            let newPiece = p
            if (pieceColor==='white') {
                newPiece = newPiece.toUpperCase()
            }
            piece = newPiece
        }

        // handle pieces that revert after being moved
        if (['L', 'M', 'l', 'm', 'V', 'v', 'U', 'u'].includes(piece)) {
            piece = {'L': 'P', 'M': 'P', 'l': 'p', 'm': 'p', 'V': 'R', 'v': 'r', 'U': 'K', 'u': 'k'}[piece]
        }
        
        // no pieces have been moved yet
        // in other words the origin still needs to move to the target
        // Most cases (all but castling), you just need to move the piece to the new square
        if (mySquaresObj[target] !== '') {
            capture = true          // if target square is occupied, flag capture
        }
        mySquaresObj[target] = piece  // place piece on new square
        mySquaresObj[origin] = ''     // remove piece from origin

        // Castling
        if (['K','k'].includes(piece) && x1-x2 === 2) {     // Queen side castle
            mySquaresObj[`${y1}1`] = ''                       // <<--Move the rook from it's start position
            mySquaresObj[`${y1}4`] = ((color === 'white') ? 'R' : 'r')  // <<--To the other side of the king
            OOO = true      // flag Queenside castle
        }
        if (['K','k'].includes(piece) && x2-x1 === 2) {     // King side castle
            mySquaresObj[`${y1}8`] = ''                       // <<--Move the rook from it's start position
            mySquaresObj[`${y1}6`] = ((color === 'white') ? 'R' : 'r')  // <<--To the other side of the king
            OO = true       // flag kingside castle
        }
        return {squares: mySquaresObj, flags: {capture, enPassant, promote, OOO, OO}}
    }

    // function to check if candidate move is legal (must already follow the rules of piece movement)
    function isLegal(squaresObj, origin, target) {
        console.log('isLegal called', 'squaresObj', squaresObj, 'origin', origin, 'target', target)
        let mySquaresObj = {...squaresObj}
        let color = getColor(mySquaresObj[origin])
        let testSquares = movePieces(mySquaresObj, origin, target).squares    // note, if there is a promotion, the type will not affect the legality
        return inCheck(testSquares, color)
    }

    // function to populate a board (with pieces on it) with legal moves to hand back to players
    // translates pieces into cosmetics (ie no unmoveds or en passnant special pieces)
    function exportMoves(squaresObj) {
        console.log('exportMoves called', 'squaresObj', squaresObj)
        let mySquaresObj = {...squaresObj}
        let result = {}
        for (let square in mySquaresObj) {
            result[square] = {
                piece:  {'L': 'P', 'M': 'P', 'P': 'P', 'V': 'R', 'R': 'R', 'N': 'N', 'B': 'B', 'Q': 'Q', 'U': 'K', 'K': 'K',
                         'l': 'p', 'm': 'p', 'p': 'p', 'v': 'r', 'r': 'r', 'n': 'n', 'b': 'b', 'q': 'q', 'u': 'k', 'k': 'k',}
                         [mySquaresObj[square]],
                moves: squareMoveCandidates(mySquaresObj, square).filter((candidateMove) => isLegal(mySquaresObj, square, candidateMove)),
            }
        }
        return result
    }

    // function to compress a board state into a string representation
    function stateToString(squaresObj, turn) {
        console.log('stateToString called', 'squaresObj', squaresObj, 'turn', turn)
        let result = turn==='white' ? 'T': 't'
        for (let i=1; i<9; i++) {
            for (let j=1; j<9; j++) {
                result += squaresObj[`${i}${j}`] === '' ? '_' : squaresObj[`${i}${j}`]
            }
        }
    }


    ///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\
    /// data that needs to be tracked inside game object:                      \\\
    /// gameId                                                                 \\\
    /// gameState                                                              \\\
    /// squares: {'11': {piece: 'V', moves: [], etc...}}                       \\\
    /// repetitionCount                                                        \\\
    /// a history of board states | array of strings WITH Turn                 \\\
    /// movesTranscript | array of short strings representing moves            \\\
    /// player1Id                                                              \\\
    /// player2Id                                                              \\\
    /// createdAt                                                              \\\
    /// rated?                                                                 \\\
    /// timeControl                                                            \\\
    /// player1Time                                                            \\\
    /// player2Time                                                            \\\
    /// build GameObject                                                       \\\
    /// last move?                                                             \\\
    ///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\
    /// methods that the game object needs                                     \\\
    /// getState | method for boards to update (if refreshing or something)    \\\
    /// postMove | player makes a move game will update                        \\\
    /// sendState | board will emit the state to player(s)                     \\\
    /// gameEnd  | triggered by end condition | send end state to players      \\\
    /// saveGame | return a save file for exporting to db                      \\\
    ///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\///\\\

    ///\\\ initialize necessary game data ///\\\
    let gameState = {
        pieces: {
            "11": "V",
            "12": "N",
            "13": "B",
            "14": "Q",
            "15": "U",
            "16": "B",
            "17": "N",
            "18": "V",
            "21": "P",
            "22": "P",
            "23": "P",
            "24": "P",
            "25": "P",
            "26": "P",
            "27": "P",
            "28": "P",
            "31": "",
            "32": "",
            "33": "",
            "34": "",
            "35": "",
            "36": "",
            "37": "",
            "38": "",
            "41": "",
            "42": "",
            "43": "",
            "44": "",
            "45": "",
            "46": "",
            "47": "",
            "48": "",
            "51": "",
            "52": "",
            "53": "",
            "54": "",
            "55": "",
            "56": "",
            "57": "",
            "58": "",
            "61": "",
            "62": "",
            "63": "",
            "64": "",
            "65": "",
            "66": "",
            "67": "",
            "68": "",
            "71": "p",
            "72": "p",
            "73": "p",
            "74": "p",
            "75": "p",
            "76": "p",
            "77": "p",
            "78": "p",
            "81": "v",
            "82": "n",
            "83": "b",
            "84": "q",
            "85": "u",
            "86": "b",
            "87": "n",
            "88": "v",
        },
        squares: exportMoves({
            "11": "V",
            "12": "N",
            "13": "B",
            "14": "Q",
            "15": "U",
            "16": "B",
            "17": "N",
            "18": "V",
            "21": "P",
            "22": "P",
            "23": "P",
            "24": "P",
            "25": "P",
            "26": "P",
            "27": "P",
            "28": "P",
            "31": "",
            "32": "",
            "33": "",
            "34": "",
            "35": "",
            "36": "",
            "37": "",
            "38": "",
            "41": "",
            "42": "",
            "43": "",
            "44": "",
            "45": "",
            "46": "",
            "47": "",
            "48": "",
            "51": "",
            "52": "",
            "53": "",
            "54": "",
            "55": "",
            "56": "",
            "57": "",
            "58": "",
            "61": "",
            "62": "",
            "63": "",
            "64": "",
            "65": "",
            "66": "",
            "67": "",
            "68": "",
            "71": "p",
            "72": "p",
            "73": "p",
            "74": "p",
            "75": "p",
            "76": "p",
            "77": "p",
            "78": "p",
            "81": "v",
            "82": "n",
            "83": "b",
            "84": "q",
            "85": "u",
            "86": "b",
            "87": "n",
            "88": "v",
        }),
        transcript: [],
        boardHistory: ['TSNBQUBNSPPPPPPPP________________________________ppppppppsnbqkbns'],
        repetitionCount: 1,
        player1Time: timeControl,
        player2Time: timeControl,
        lastMove: null,
        turn: 'white',
        gameName: gameName ? gameName : '',
        gameOn: true,
        gameId: gameId,
        result: null,

    }
    let currentFlags = {capture: false, enPassant: false, promote: false, OOO: false, OO: false}
    let currentStatus = {check: false, checkmate: false, stalemate: false}
    

    
    return {
        getState: () => {
            console.log('getState called')
            return {
                squares: gameState.squares,
                transcript: gameState.transcript,
                gameOn: gameState.gameOn,
                turn: gameState.turn,
                player1Id,
                player2Id,
                player1Time: gameState.player1Time,
                player2Time: gameState.player2Time,
            }
        },
        postMove: (origin, target, p=null) => {
            console.log('postMove called', 'origin', origin, 'target', target, 'p', p)
            let {squares, flags} = movePieces(gameState.pieces, origin, target, p)
            gameState.pieces = squares
            currentFlags = flags
            gameState.squares = exportMoves(gameState.pieces)
            gameState.boardHistory.push(stateToString(gameState.pieces))
            gameState.lastMove = {origin, target}
            currentStatus = evaluateState()
            gameState.transcript.push(writeMove())
            return this.getState()
        }
    }



}



export default ChessGame