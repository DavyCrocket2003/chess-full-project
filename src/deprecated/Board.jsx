import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Board.css';

import { Droppable } from '../Droppable';
import { Draggable } from '../Draggable';

export default function Board() {
  const [parent, setParent] = useState(null);
  const draggableMarkup = (
    <Draggable id="king"><img src="pieces/king.png" alt="Chess King" /></Draggable>
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {parent === null ? draggableMarkup : null}

      <Container>
        {[1, 2, 3].map(row => (
          <Row key={row} xs={1}>
            {[1, 2, 3].map(col => (
                <Col key={`${row}-${col}`} className="square" xs={2}>
                    <Droppable id={`${row}${col}`} />
                </Col>
            ))}
          </Row>
        ))}
      </Container>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { over } = event;

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null);
  }
}
