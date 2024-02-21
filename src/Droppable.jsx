import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import { isAxiosError } from 'axios';

export function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
    backgroundColor: isOver ? 'green': (+props.id[0] + +props.id[1])%2 === 0 ? 'cadetblue' : 'white'
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}