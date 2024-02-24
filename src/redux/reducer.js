const initialState = {
    'pieceStyle': 'old',      // 'old' or 'new'
    'blackColor': '#583927',    // '#2E6F1E', // '#583927',
    'whiteColor': '#EAC796', //'#56A62E',    // '#5f9ea0',    // 
    'dragOrigin': {square: null, piece: ''},
    'onBottom': 'white',
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
    }
    
}


export default function reducer(state = initialState, action) {
    switch (action.type) {
        case "UPDATE_STATE":
            return action.payload
        case "UPDATE_BOARD":
            let newState = {...state}
            for (let square in action.payload) {
                newState.squares[square] = action.payload[square]
            }
            return newState
        case "GRAB_PIECE":
            return {...state, dragOrigin: action.payload}
        case "DROP_PIECE":
            return {...state, dragOrigin: {square: null, piece: ''}}
        default:
            return state
    }
}