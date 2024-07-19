import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://chess-stockfish16.p.rapidapi.com/best-move',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
    'X-RapidAPI-Host': 'chess-stockfish16.p.rapidapi.com'
  },
  data: new URLSearchParams({
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR'
  })
};

axios.request(options).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});
