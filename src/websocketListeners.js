
import { useDispatch, useSelector } from 'react-redux'
import { socket } from './socket'


const dispatch = useDispatch()

  useEffect(() => {
    // Setup listeners for the websocket
    function onConnect() {
      dispatch({type: "CONNECTION", payload: true})
      console.log('Connected to socket.io')
    }
    function onDisconnect() {
      dispatch ({type: "CONNECTION", payload: false})
      console.log('Disconnected from socket.io')
    }

    function onUpdateBoard(newBoard) {
      dispatch({type: "UPDATE_BOARD", payload: newBoard})
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('updateBoard', onUpdateBoard)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('updateBoard', onUpdateBoard);
    }
  }, [])