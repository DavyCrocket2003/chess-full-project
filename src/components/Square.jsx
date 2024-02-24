import React from 'react'
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';
import Piece from './Piece';
import { useSelector } from 'react-redux';

function Square(props) {
  const {isOver, setNodeRef} = useDroppable({id: props.id})
  console.log('Square called', props)

  // // Extract the piece from the pieceData object
  const pieceData = useSelector((state) => state.squares[props.id])
  const myPiece = pieceData ? pieceData.piece : null;
    
  return (
    <div ref={setNodeRef} style={{border: "solid black 1px", aspectRatio: "1 / 1", display: "flex", backgroundColor: isOver ? "red" : props.bc ? props.bc : "#e1e1e1"}}>
        {myPiece && <Piece piece={myPiece} id={`p${props.id}`}/>}
    </div>
  )
}

export default Square
