import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {Droppable} from './Droppable';
import {Draggable} from './Draggable';

export default function Board() {
  const [parent, setParent] = useState(null);
  const draggableMarkup = (
    <Draggable id="draggable"><img src="pieces/king.png" alt="Chess King" /></Draggable>
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkup : null}

      <Container fluid>
        <Row>
            <Droppable id="11"><Col xs="1"></Col></Droppable>
            <Droppable id="12"><Col xs="1"></Col></Droppable>
            <Droppable id="13"><Col xs="1"></Col></Droppable>
        </Row>
        <Row>
            <Droppable id="21"><Col xs="1"></Col></Droppable>
            <Droppable id="22"><Col xs="1"></Col></Droppable>
            <Droppable id="23"><Col xs="1"></Col></Droppable>
        </Row>
        <Row>
            <Droppable id="31"><Col xs="1"></Col></Droppable>
            <Droppable id="32"><Col xs="1"></Col></Droppable>
            <Droppable id="33"><Col xs="1"></Col></Droppable>
        </Row>
      </Container>
    </DndContext>
  );

  function handleDragEnd(event) {
    const {over} = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
};