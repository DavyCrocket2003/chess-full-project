import React, {useState} from 'react';
import ChessBoard from './components/ChessBoard';
import { DndContext } from '@dnd-kit/core';
import { Draggable } from './Draggable';

export default function App() {

  return (
      <ChessBoard blackColor="black" whiteColor="green"/>
  )
}