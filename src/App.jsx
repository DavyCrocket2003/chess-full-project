import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';
import Test from './Test';
import {Droppable} from './Droppable';
import {Draggable} from './Draggable';

export default function App() {
  const [parent, setParent] = useState(null);
  const draggableMarkup = (
    <Draggable id="draggable"><img src="pieces/king.png" alt="Chess King" /></Draggable>
  );

  return (
    <>
      <Draggable />
      <Test />
      {/* <ContainerFluidExample /> */}
    </>
  )

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
}