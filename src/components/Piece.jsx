import React from 'react'
import {useDraggable} from '@dnd-kit/core';
import { useSelector } from 'react-redux';

function Piece(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style =transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  const pieceStyle = useSelector((state) => state.pieceStyle)
  const extension = {'old': 'png', 'new': 'svg'}[pieceStyle]
  const pieceRoutes = {
    P: 'pawn',
    R: 'rook',
    N: 'knight',
    B: 'bishop',
    Q: 'queen',
    K: 'king',
    p: 'pawn1',
    r: 'rook1',
    n: 'knight1',
    b: 'bishop1',
    q: 'queen1',
    k: 'king1',
  }
    
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.piece !== "" ? (<img src={`../pieces/${pieceRoutes[props.piece]}.${extension}`} alt={pieceRoutes[props.piece]} style={{ width: '100%', height: '100%'}}/>) : null}
    </div>
  )
}

export default Piece