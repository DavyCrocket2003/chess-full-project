import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import './ChessBoard.css';
import Square from './Square';
import Piece from './Piece';
import { useSelector, useDispatch } from 'react-redux';
import {snapCenterToCursor} from '@dnd-kit/modifiers'

export default function ChessBoard(props) {
  console.log('ChessBoard Rendered')
  const dragOrigin = useSelector((state) => state.dragOrigin)
  const onBottom = useSelector((state) => state.onBottom)
  const gameState = useSelector((state) => state.gameState)
  const userId = useSelector((state) => state.userSession.userId)

  // generate key seed of strings '11' to '88' to make squares representing the board
  let squareKeys = []
  // ternary used below to conditionally render which player is 'onBottom"
  const whiteOnBottom = (onBottom === 'regular' && gameState.player1===userId) || (!onBottom === 'regular' && !gameState.player1===userId)
  for (let i = (whiteOnBottom ? 8 : 1); i!== (whiteOnBottom ? 0 : 9); i += (onBottom === 'white' ? -1 : 1)) {
    for (let j = (whiteOnBottom ? 1 : 8); j!== (whiteOnBottom ? 9 : 0); j += (onBottom === 'white' ? 1 : -1)) {
        squareKeys.push(`${i}${j}`)
    }
  }
  const whiteColor = useSelector((state) => state.whiteColor)
  const blackColor = useSelector((state) => state.blackColor)
  const dispatch = useDispatch()

  return (
    <DndContext modifiers={[snapCenterToCursor]} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="grid">
      {squareKeys.map((key) => (
        
          <Square key={key} id={key} bc={(+key[0] + +key[1]) % 2 ? whiteColor : blackColor}/>
        
      ))}
      </div>
    </DndContext>
  );

  // function that updates the board state after a piece move
  function handleDragEnd(event) {
    // console.log('handleDragEnd called', event)
    const { active, over } = event;
    if (over && squares[active.id.slice(1)].moves.includes(over.id)) {
      dispatch({
        type: "UPDATE_BOARD",
        payload: {[dragOrigin.square]: {piece: '', moves: []}, [over.id]: {piece: dragOrigin.piece, moves: []}}
      })
    }
    dispatch({type: 'DROP_PIECE'})
  }
  // function that watches for a "GRAB_PIECE" action to record the origin square and piece
  function handleDragStart(event) {
    const {id} = event.active
    const square = id.slice(1)
    const piece = squares[square].piece
    const moves = squares[square].moves
    dispatch({type: "GRAB_PIECE", payload: {square: square, piece: piece, moves:moves}})
  }
}
