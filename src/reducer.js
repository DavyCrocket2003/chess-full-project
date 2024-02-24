```
const initialState = {
    "turn": 'white',
    "settings": {
        "player": 'white',
        "colorb": '#000000',
        "colorw": '#FFFFFF',
        "boardFlip": false,
        "showMoves": false,
    },
    "previousSquare": null,
    "81": {piece: "r", legalMoves: []},
    "82": {piece: "n", legalMoves: ['61','63']},
    "83": {piece: "b", legalMoves: []},
    "84": {piece: "q", legalMoves: []},
    "85": {piece: "k", legalMoves: []},
    "86": {piece: "b", legalMoves: []},
    "87": {piece: "n", legalMoves: ['76','78']},
    "88": {piece: "r", legalMoves: []},
    "71": {piece: "p", legalMoves: ['61','51']},
    "72": {piece: "p", legalMoves: ['62','52']},
    "73": {piece: "p", legalMoves: ['63','53']},
    "74": {piece: "p", legalMoves: ['64','54']},
    "75": {piece: "p", legalMoves: ['65','55']},
    "76": {piece: "p", legalMoves: ['66','56']},
    "77": {piece: "p", legalMoves: ['67','57']},
    "78": {piece: "p", legalMoves: ['68','58']},
    "61": {piece: "", legalMoves: []},
    "62": {piece: "", legalMoves: []},
    "63": {piece: "", legalMoves: []},
    "64": {piece: "", legalMoves: []},
    "65": {piece: "", legalMoves: []},
    "66": {piece: "", legalMoves: []},
    "67": {piece: "", legalMoves: []},
    "68": {piece: "", legalMoves: []},
    "51": {piece: "", legalMoves: []},
    "52": {piece: "", legalMoves: []},
    "53": {piece: "", legalMoves: []},
    "54": {piece: "", legalMoves: []},
    "55": {piece: "", legalMoves: []},
    "56": {piece: "", legalMoves: []},
    "57": {piece: "", legalMoves: []},
    "58": {piece: "", legalMoves: []},
    "41": {piece: "", legalMoves: []},
    "42": {piece: "", legalMoves: []},
    "43": {piece: "", legalMoves: []},
    "44": {piece: "", legalMoves: []},
    "45": {piece: "", legalMoves: []},
    "46": {piece: "", legalMoves: []},
    "47": {piece: "", legalMoves: []},
    "48": {piece: "", legalMoves: []},
    "31": {piece: "", legalMoves: []},
    "32": {piece: "", legalMoves: []},
    "33": {piece: "", legalMoves: []},
    "34": {piece: "", legalMoves: []},
    "35": {piece: "", legalMoves: []},
    "36": {piece: "", legalMoves: []},
    "37": {piece: "", legalMoves: []},
    "38": {piece: "", legalMoves: []},
    "21": {piece: "P", legalMoves: ['31','41']},
    "22": {piece: "P", legalMoves: ['32','42']},
    "23": {piece: "P", legalMoves: ['33','43']},
    "24": {piece: "P", legalMoves: ['34','44']},
    "25": {piece: "P", legalMoves: ['35','45']},
    "26": {piece: "P", legalMoves: ['36','46']},
    "27": {piece: "P", legalMoves: ['37','47']},
    "28": {piece: "P", legalMoves: ['38','48']},
    "11": {piece: "R", legalMoves: []},
    "12": {piece: "N", legalMoves: ['31','33']},
    "13": {piece: "B", legalMoves: []},
    "14": {piece: "Q", legalMoves: []},
    "15": {piece: "K", legalMoves: []},
    "16": {piece: "B", legalMoves: []},
    "17": {piece: "N", legalMoves: ['36','38']},
    "18": {piece: "R", legalMoves: []},
}
```
const initialState = {'11': 'THIS BETTER SHOW UP'}

const reducer = (state = initialState, action) => {
    console.log("Reducer Called", state)
    switch (action.type) {
        case 'MOVE':
            let newState = {...state}
            for (let square in action.payload) {
                newState[square].piece = action.payload[square]
            }
            return newState
        default:
            return state
    }
}

export default reducer