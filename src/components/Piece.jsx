import React from 'react'
import {useDraggable} from '@dnd-kit/core';

function Piece(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    // backgroundColor: transparent,
  } : undefined;
    
  return (
    <div>
      
    </div>
  )
}

export default Piece
props