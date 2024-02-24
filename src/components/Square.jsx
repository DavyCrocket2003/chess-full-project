import React from 'react'
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';
import Piece from './Piece';
import { useSelector } from 'react-redux';

function Square(props) {
  const {isOver, setNodeRef} = useDroppable({id: props.id})
  // // Access the piece data for the current square from the Redux state
  // const pieceData = useSelector((state) => state[props.id]);

  // // Extract the piece from the pieceData object
  const pieceData = useSelector((state) => state[props.id])
  const myPiece = pieceData ? pieceData.piece : null;
    
  return (
    <div ref={setNodeRef} style={{border: "solid black 1px", aspectRatio: "1 / 1", display: "flex", backgroundColor: isOver ? "red" : props.bc ? props.bc : "#e1e1e1"}}>
        {myPiece && <Piece piece={myPiece} />}
    </div>
  )
}

export default Square
