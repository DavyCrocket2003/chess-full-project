import { io } from 'socket.io-client';

// Replace 'http://localhost:8800' with your server URL
const URL = 'http://localhost:8800';

// Connect to the '/games' namespace on the server
export const socket = io(URL, {autoConnect: false});