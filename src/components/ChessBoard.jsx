import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import './ChessBoard.css';
import Square from './Square';
import Piece from './Piece';

export default function ChessBoard(props) {
  console.log('ChessBoard Rendered')
  const [parent, setParent] = useState(null);
  let squareKeys = []
  for (let i=1; i<9; i++) {
    for (let j=1; j<9; j++) {
        squareKeys.push(`${i}${j}`)
    }
  }
  let whiteColor = props.whiteColor ? props.whiteColor : 'white'
  let blackColor = props.blackColor ? props.blackColor : 'black'

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid">
      {squareKeys.map((key) => (
        
          <Square key={key} id={key} parent={parent} bc={(+key[0] + +key[1]) % 2 ? blackColor : whiteColor}/>
        
      ))}
      </div>
      <p>{parent ? parent : 'No Parent'}</p>
    </DndContext>
  );

  function handleDragEnd(event) {
    console.log('handleDragEnd called')
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
}
