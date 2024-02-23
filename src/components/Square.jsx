import React from 'react'
import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';
import Piece from './Piece';

function Square(props) {
    const {isOver, setNodeRef} = useDroppable({id: props.id})
    // console.log(props)
  return (
    <div ref={setNodeRef} style={{border: "solid black 1px", aspectRatio: "1 / 1", display: "flex", backgroundColor: isOver ? "red" : props.bc ? props.bc : "#e1e1e1"}}>
        {props.parent===props.id ? (<Piece piece="K" id="king"/>) : null}
    </div>
  )
}

export default Square
