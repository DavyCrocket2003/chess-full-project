// This provides the function to get moves from a free stockfish 16 api.
import axios from 'axios';

export async function getBestMove(fen) {
  console.log('getBestMove called', fen)
  const formData = new FormData();
  formData.append('fen', fen);

  try {
    const response = await axios.post(
      'https://chess-stockfish-16-api.p.rapidapi.com/chess/api',  // Endpoint
      formData,  // This is the request body
      {
        headers: {
          'X-Rapidapi-Key': 'a2b2ec78e2msh3789693a9846348p1d36dfjsn9802397cbac2',  // API key
          'X-Rapidapi-Host': 'chess-stockfish-16-api.p.rapidapi.com',
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    const data = response.data;
    console.log('move received,', data)
    return data;
  } catch (error) {
    console.error("Error fetching stockfish move:", error.response ? error.response.data : error.message);
  }
}