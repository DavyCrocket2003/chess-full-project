const initialState = {
    userSession: {
        userId: null,
        username: null,
        status: 'loggedOut',
        socketId: null,
    },
    socketSession: {connected: false},  // not really in use
    seeks: [],              // populates a list of games to join
    onBottom: 'regular',    // User setting for flipping the board
    playSound: true,
    pieceStyle: 'new',      // 'old' or 'new'
    blackColor: '#583927',    // '#2E6F1E', // '#583927',
    whiteColor: '#EAC796', //'#56A62E',    // '#5f9ea0',    // 
    dragOrigin: {square: null, piece: '', moves: []},   // Used for Chessboard to handle drag events
    gameState: {
        squares: {
            '11': {piece: 'R', moves: []},
            '12': {piece: 'N', moves: ['31','33']},
            '13': {piece: 'B', moves: []},
            '14': {piece: 'Q', moves: []},
            '15': {piece: 'K', moves: []},
            '16': {piece: 'B', moves: []},
            '17': {piece: 'N', moves: ['36','38']},
            '18': {piece: 'R', moves: []},
            '21': {piece: 'P', moves: ['31','41']},
            '22': {piece: 'P', moves: ['32','42']},
            '23': {piece: 'P', moves: ['33','43']},
            '24': {piece: 'P', moves: ['34','44']},
            '25': {piece: 'P', moves: ['35','45']},
            '26': {piece: 'P', moves: ['36','46']},
            '27': {piece: 'P', moves: ['37','47']},
            '28': {piece: 'P', moves: ['38','48']},
            '31': {piece: '', moves: []},
            '32': {piece: '', moves: []},
            '33': {piece: '', moves: []},
            '34': {piece: '', moves: []},
            '35': {piece: '', moves: []},
            '36': {piece: '', moves: []},
            '37': {piece: '', moves: []},
            '38': {piece: '', moves: []},
            '41': {piece: '', moves: []},
            '42': {piece: '', moves: []},
            '43': {piece: '', moves: []},
            '44': {piece: '', moves: []},
            '45': {piece: '', moves: []},
            '46': {piece: '', moves: []},
            '47': {piece: '', moves: []},
            '48': {piece: '', moves: []},
            '51': {piece: '', moves: []},
            '52': {piece: '', moves: []},
            '35': {piece: '', moves: []},
            '54': {piece: '', moves: []},
            '55': {piece: '', moves: []},
            '56': {piece: '', moves: []},
            '57': {piece: '', moves: []},
            '58': {piece: '', moves: []},
            '61': {piece: '', moves: []},
            '62': {piece: '', moves: []},
            '63': {piece: '', moves: []},
            '64': {piece: '', moves: []},
            '65': {piece: '', moves: []},
            '66': {piece: '', moves: []},
            '67': {piece: '', moves: []},
            '68': {piece: '', moves: []},
            '71': {piece: 'p', moves: ['61','51']},
            '72': {piece: 'p', moves: ['62','52']},
            '73': {piece: 'p', moves: ['63','53']},
            '74': {piece: 'p', moves: ['64','54']},
            '75': {piece: 'p', moves: ['65','55']},
            '76': {piece: 'p', moves: ['66','56']},
            '77': {piece: 'p', moves: ['67','57']},
            '78': {piece: 'p', moves: ['68','58']},
            '81': {piece: 'r', moves: []},
            '82': {piece: 'n', moves: ['61','63']},
            '83': {piece: 'b', moves: []},
            '84': {piece: 'q', moves: []},
            '85': {piece: 'k', moves: []},
            '86': {piece: 'b', moves: []},
            '87': {piece: 'n', moves: ['66','68']},
            '88': {piece: 'r', moves: []}
        },
        moveHistory: [],
        status: null,
        chat: [],
        turn: 'white',
        message: null,
        positionCount: null,
        player1Id: null,
        player2Id: null,
        player1Time: null,
        player2Time: null,
        gameId: null,

    },
    transcript: [],
    clickCount: 0,
    square11Ref: null,      // Intended for anchoring to the chess board for dynamic sizing of other elements
    profileId: null,        // This is for viewing others' profiles.
    
}


export default function reducer(state = initialState, action) {
    switch (action.type) {
        case "UPDATE_STATE":
            return {...state, ...action.payload}

        case "UPDATE_BOARD":    // deprecated use "UPDATE_GAME" instead \\ On second thought, I'm not so sure
            return {...state, gameState: {...state.gameState, squares: {...state.gameState.squares, ...action.payload}}}
            
        case "GRAB_PIECE":
            return {...state, dragOrigin: action.payload}

        case "DROP_PIECE":
            return {...state, dragOrigin: {square: null, piece: ''}}

        case "CONNECTION":
            return {...state, isConnected: action.payload}
        
        case "UPDATE_USER_SESSION":
            return {...state, userSession: {...state.userSession, ...action.payload}}
        
        case "UPDATE_CLICK_COUNT":
            return {...state, clickCount: action.payload}

        case "UPDATE_SEEKS":
            console.log("UPDATE_SEEKS", state.seeks, action.payload)
            if (Array.isArray(action.payload)){
                return {...state, seeks: action.payload}
            } else {
                return {...state, seeks: [...state.seeks, action.payload]}
            }

        case "UPDATE_GAME":
            return {...state, gameState: {...state.gameState, ...action.payload}}

        case "UPDATE_TRANSCRIPT":
            return {...state, transcript: action.payload}
        case "UPDATE_REF":
            return {...state, square11Ref: action.payload}

        case "UPDATE_PROFILE":
            return {...state, profileId: action.payload}

        default:
            return state
    }
}