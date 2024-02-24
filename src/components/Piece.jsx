import React from 'react'
import {useDraggable} from '@dnd-kit/core';

function Piece(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style =transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const pieceRoutes = {
    P: 'pawn.png',
    R: 'rook.png',
    N: 'knight.png',
    B: 'bishop.png',
    Q: 'queen.png',
    K: 'king.png',
    p: 'pawn1.png',
    r: 'rook1.png',
    n: 'knight1.png',
    b: 'bishop1.png',
    q: 'queen1.png',
    k: 'king1.png',
  }
    
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.piece !== "" ? (<img src={`../pieces/${pieceRoutes[props.piece]}`} alt={pieceRoutes[props.piece]} style={{ width: '100%', height: '100%' }}/>) : null}
    </div>
  )
}

export default Piece