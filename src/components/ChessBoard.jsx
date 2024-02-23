import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import './ChessBoard.css';

import { Droppable } from '../Droppable';
import { Draggable } from '../Draggable';

export default function ChessBoard() {
  const [parent, setParent] = useState(null);
  const draggableMarkup = (
    <Draggable id="king"><img src="pieces/king.png" alt="Chess King" /></Draggable>
  );
  let squareKeys = []
  for (let i=1; i<9; i++) {
    for (let j=1; j<9; j++) {
        squareKeys.push(`${i}${j}`)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkup : null}
      <div className="grid-container">
        <div className="grid">
            {squareKeys.map((key) => (
                <div className="square" key={key}>
                    <Droppable id={key} />
                </div>
            ))}
        </div>
      </div>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
}
