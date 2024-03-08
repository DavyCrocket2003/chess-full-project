

function ChessGame(params) {
    console.log('ChessGame called', params)
    // params should include {gameId, gameName player1Id, player2Id, createdAt?, rated, timeControl}
    const {gameId, gameName, player1Id, player2Id, rated, timeControl} = params



    // function that returns piece color, 'white', 'black', 'blank', or 'false' (if piece is undefined)
    function getColor(piece) {
        // console.log('getColor called', 'piece', piece)
        if (typeof piece === 'undefined') {
            return false
        }
        return piece === '' ? 'blank' : (piece.toUpperCase() === piece ? 'white' : 'black');
    }

    // function that evaluates the board state and looks for game state triggers
    // For instance check, stalemate, and checkmate
    function evaluateState() {
        // console.log('evaluateState called', 'color', gameState.turn)
        currentFlags.check = inCheck(gameState.pieces, gameState.turn)
        currentFlags.checkmate = false
        currentFlags.stalemate = false
        currentFlags.canMove = false
        for (let s in gameState.squares) {  // Search to see if current player has any legal moves
            if (gameState.squares[s].piece && getColor(gameState.squares[s].piece)===gameState.turn && gameState.squares[s].moves.length>0) {
                currentFlags.canMove = true
                break
            }
        }
        if (!currentFlags.canMove) {
            if (currentFlags.check) {
                currentFlags.checkmate = true
                gameState.status = gameState.turn==='white' ? '0-1' : '1-0' // I have the colors mixed up for some reason. So I just jury rigged it
                gameState.message = 'Game ended in checkmate. '
            } else {
                currentFlags.stalemate = true
                gameState.status = '½-½'
                gameState.message = 'Game drawn by stalemate. '
            }
        }

        /// Count positions for repetition draws \\\
        // Save time by only looking at states that match the turn of current turn
        gameState.positionCount = 1
        let historyLength = gameState.boardHistory.length
        let currentPosition = gameState.boardHistory[historyLength - 1]
        for (let i = gameState.turn==='white' ? 0 : 1; i<historyLength - 1; i+=2) {
            gameState.positionCount += gameState.boardHistory[i]===currentPosition
        }
        if (gameState.positionCount===5) {
            gameState.status = '½-½'
            gameState.message = 'Game drawn by five-fold repetition'
        }

        // console.log('evaluateState exiting')
        return 


        // Need to implement insufficient material

    }

    // function that creates a string representation of a move
    // from currentFlags and status then returns it
    function writeMove() {
        // console.log('writeMove called')
        if (currentFlags.OOO) {
            // console.log('writeMove returning OOO')
            return 'OOO'
        }
        if (currentFlags.OO) {
            // console.log('writeMove returning OO')
            return 'OO'
        }
        let [y1, x1, y2, x2] = [gameState.lastMove.origin[0], gameState.lastMove.origin[1], gameState.lastMove.target[0], gameState.lastMove.target[1]]
        const xmap = {1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G', 8: 'H'}

        // console.log('status', gameState.status)
        let result = xmap[x1] + y1 + (currentFlags.capture ? 'x' : '') + xmap[x2] + y2 + (currentFlags.checkmate ? '#' : (currentFlags.check ? '+' : '')) +  (currentFlags.enPassant ? 'ep' : '') + (currentFlags.stalemate ? '½-½' : '')
        // console.log('writeMove returning', result)
        return result
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
        // console.log('squareMoveCandidates called', includePeaceful)
        if (squaresObj[square]==='') {
            // console.log('squareMoveCandidates returning []')
            return []
        }
        let mySquaresObj = {...squaresObj}
        const [y0, x0] = [+square[0], +square[1]]
        const color0 = getColor(mySquaresObj[square])
        let candidates = []
        

        // This function adds candidate moves for a piece that moves straight in a direction [dydx]
        function straightMoves(y, x, dy, dx) {
            // console.log('straightMoves called', y, x, dy, dx)
            // look at the piece on the next square
            let nextSquare = `${y+dy}${x+dx}`
            let nextPiece = mySquaresObj[nextSquare]
            while (nextPiece==='') {    // as long as the next square is blank keep going
                candidates.push(nextSquare)
                y += dy     // now move to the open square
                x += dx     // and target the square after
                nextSquare = `${y+dy}${x+dx}`
                nextPiece = mySquaresObj[nextSquare]
            }
            // since the while condition did not trigger, we know the
            // next square is not open and our path is blocked
            // if the next square is an enemy piece, add to candidate moves
            if (getColor(nextPiece)===(color0==='white'?'black':'white')) {
                candidates.push(nextSquare)
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
                if (!includePeaceful || inCheck(mySquaresObj, color0)) {    // if king is in check skip castling checks
                    return
                }
                // function to test conditions for castling queen side
                // If: (A) '11': 'V' && '15': 'U' (B) '12', '13', '14' are blank (C) '13', '14', '15' not attacked (D) includePeaceful, then:
                const canWhiteOOO = () => {
                    if (!includePeaceful) {     // If only looking for check attacks, disregard castling
                        return false
                    }
                    if (!mySquaresObj['11']==='V') {    // Requires an unmoved queenside rook
                        return false
                    }       // squares in between must be empty
                    if (mySquaresObj['12'] || mySquaresObj['13'] || mySquaresObj['14']) {
                        return false
                    }       // A3 and A4 must not be in check (A5 checked before function call)
                    if (inCheck({...mySquaresObj, '14':'K', '15':''}, color0) || inCheck({...mySquaresObj, '13': 'K', '15':''})) {
                        return false
                    }
                    return true
                }
                if (canWhiteOOO()) {
                    candidates.push('13')
                }
                // If: (A) '18': 'V' && '15': 'U' (B) '16', '17' are blank (C) '15', '16' '17' not attacked (D) includePeaceful, then:
                const canWhiteOO = () => {
                    if (!includePeaceful) {     // If only looking for check attacks, disregard castling
                        return false
                    }
                    if (!mySquaresObj['18']==='V') {    // Requires an unmoved kingside rook
                        return false
                    }       // squares in between must be empty
                    if (mySquaresObj['16'] || mySquaresObj['17']) {
                        return false
                    }       // A6 and A7 must not be in check (A5 checked before function call)
                    if (inCheck({...mySquaresObj,'16':'K', '15': ''}, color0) || inCheck({...mySquaresObj, '17': 'K', '15':''})) {
                        return false
                    }
                    return true
                }
                if (canWhiteOO()) {
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
                pieceMoves.K()
                if (!includePeaceful || inCheck(mySquaresObj, color0)) {
                    return      // if king is in check, or only looking for check testing, skip castling
                }
                // If: (A) '81': 'v' && '85': 'u' (B) '82', '83', '84' are blank (C) '83', '84', '85' not attacked (D) includePeaceful, then:
                const canBlackOOO = () => {
                    if (!mySquaresObj['81']==='v') {    // Requires an unmoved queenside rook
                        return false
                    }       // squares in between must be empty
                    if (mySquaresObj['82'] || mySquaresObj['83'] || mySquaresObj['84']) {
                        return false
                    }       // C8 and D8 must not be in check (E8 checked before function call)
                    if (inCheck({...mySquaresObj, '84':'k', '85':''}, color0) || inCheck({...mySquaresObj, '83': 'k', '15':''})) {
                        return false
                    }
                    return true
                }
                if (canBlackOOO()) {
                    candidates.push('83')
                }
                // If: (A) '88': 'v' && '85': 'u' (B) '86', '87' are blank (C) '85', '86' '87' not attacked (D) includePeaceful, then:
                const canBlackOO = () => {
                    if (!mySquaresObj['88']==='v') {    // Requires an unmoved kingside rook
                        return false
                    }       // squares in between must be empty
                    if (mySquaresObj['86'] || mySquaresObj['87']) {
                        return false
                    }       // F8 and G8 must not be in check (E8 checked before function call)
                    if (inCheck({...mySquaresObj,'86':'k', '85': ''}, color0) || inCheck({...mySquaresObj, '87': 'k', '85':''})) {
                        return false
                    }
                    return true
                }
                if (canBlackOO()) {
                    candidates.push('87')
                }
            }

        }

        pieceMoves[mySquaresObj[square]]()
        // console.log('squareMoveCandidates returning', candidates)
        return candidates
    }

    // finds out if the king on the board with the given color is in check
    function inCheck(squaresObj, color) {
        // console.log('inCheck called')
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
                // console.log('King on', kingOn)
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
                    // console.log('inCheck returning true')
                    return true // if the square can attack the king square return true to inCheck
                }
            }
        }
        // console.log('inCheck returning false')
        return false
    }

    // function that adjusts the pieces on the board given a candidate move (candidate or legal)
    // Cleans up any piece transformations
    // Also returns an object that flags for {capture, enPassant, promote, OOO, OO}
    // Note the promote flag will be '' or a letter 
    function movePieces(squaresObj, origin, target, p='q') {
        // console.log('movePieces called', 'origin', origin, 'target', target, p)
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
            if (mySquaresObj[`${y1+2}${x1-1}`]==='p') {
                mySquaresObj[`${y1+2}${x1-1}`] = 'l'
            }
            if (mySquaresObj[`${y1+2}${x1+1}`]==='p') {
                mySquaresObj[`${y1+2}${x1+1}`] = 'm'
            }
        }
        if (piece === 'p' && y2 - y1 === -2) {
            if (mySquaresObj[`${y1-2}${x1-1}`]==='P') {
                mySquaresObj[`${y1-2}${x1-1}`] = 'M'
            }
            if (mySquaresObj[`${y1-2}${x1+1}`]==='P') {
                mySquaresObj[`${y1-2}${x1+1}`] = 'L'
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
            mySquaresObj[`${y1}4`] = ((pieceColor === 'white') ? 'R' : 'r')  // <<--To the other side of the king
            OOO = true      // flag Queenside castle
        }
        if (['K','k'].includes(piece) && x2-x1 === 2) {     // King side castle
            mySquaresObj[`${y1}8`] = ''                       // <<--Move the rook from it's start position
            mySquaresObj[`${y1}6`] = ((pieceColor === 'white') ? 'R' : 'r')  // <<--To the other side of the king
            OO = true       // flag kingside castle
        }
        let result = {squares: mySquaresObj, flags: {capture, enPassant, promote, OOO, OO}}
        // console.log('movePieces returning')
        return result
    }

    // function to check if candidate move is legal (must already follow the rules of piece movement)
    function isLegal(squaresObj, origin, target) {
        // console.log('isLegal called', 'origin', origin, 'target', target)
        let mySquaresObj = {...squaresObj}
        let color = getColor(mySquaresObj[origin])
        let testSquares = movePieces(mySquaresObj, origin, target).squares    // note, if there is a promotion, the type will not affect the legality
        let result = !inCheck(testSquares, color)
        // console.log('isLegal returning', result)
        return result
    }

    // function to populate a board (with pieces on it) with legal moves to hand back to players
    // translates pieces into cosmetics (ie no unmoveds or en passnant special pieces)
    function exportMoves(squaresObj) {
        // console.log('exportMoves called')
        let mySquaresObj = {...squaresObj}
        let result = {}
        for (let square in mySquaresObj) {
            result[square] = {
                piece:  {'': '', 'L': 'P', 'M': 'P', 'P': 'P', 'V': 'R', 'R': 'R', 'N': 'N', 'B': 'B', 'Q': 'Q', 'U': 'K', 'K': 'K',
                         'l': 'p', 'm': 'p', 'p': 'p', 'v': 'r', 'r': 'r', 'n': 'n', 'b': 'b', 'q': 'q', 'u': 'k', 'k': 'k',}
                         [mySquaresObj[square]],
                moves: squareMoveCandidates(mySquaresObj, square).filter((candidateMove) => isLegal(mySquaresObj, square, candidateMove)),
            }
        }
        // console.log('exportMoves returning', result)
        return result
    }

    // function to compress a board state into a string representation
    function stateToString(squaresObj, turn=gameState.turn) {
        console.log('stateToString called','turn', turn)
        let result = turn==='white' ? 'T': 't'
        for (let i=1; i<9; i++) {
            for (let j=1; j<9; j++) {
                result += squaresObj[`${i}${j}`] === '' ? '_' : squaresObj[`${i}${j}`]
            }
        }
        console.log('stateToString returning', result)
        return result
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
        moveHistory: [],
        rated: rated,
        timeControl: timeControl,
        player1Time: timeControl,
        player2Time: timeControl,
        lastMove: null,
        positionCount: 1,
        turn: 'white',
        gameName: gameName ? gameName : '',
        status: 'normal',
        message: null,
        gameId: gameId,

    }
    let currentFlags = {capture: false, enPassant: false, promote: false, OOO: false, OO: false, check: false, canMove: true, checkmate: false, stalemate: false}
    

    
    return {
        getState: function() {
            console.log('getState called')
            return {
                squares: gameState.squares,         // pieces and available moves for each square
                transcript: gameState.transcript,   // written record of moves as an array with bells and whistles
                moveHistory: gameState.moveHistory, // bare minimum move history
                status: gameState.status,           // 'normal', 'check', '1-0', '0-1', or '½-½'
                turn: gameState.turn,               // 'white' or 'black'
                message: gameState.message,                            // For conveying miscellaneous game info
                positionCount: gameState.positionCount,                      // How many times has current position arisen
                player1Id,                          // Who is white
                player2Id,                          // Who is black
                rated: gameState.rated,
                player1Time: gameState.player1Time, // remaining time
                player2Time: gameState.player2Time, // remaining time
            }
        },
        postMove: function({origin, target, p}) {
            console.log('postMove called', 'origin', origin, 'target', target, 'p', p)
            let {squares, flags} = movePieces(gameState.pieces, origin, target, p)
            gameState.pieces = squares
            currentFlags = flags
            gameState.squares = exportMoves(gameState.pieces)
            gameState.lastMove = {origin, target}
            gameState.turn = gameState.turn === 'white' ? 'black' : 'white'
            gameState.boardHistory.push(stateToString(gameState.pieces))
            gameState.moveHistory.push(origin + target + (p ? p.toLowerCase() : ''))
            evaluateState()     // updates game status with no return value
            gameState.transcript.push(writeMove())
            return this.getState()
        }
    }



}



export default ChessGame