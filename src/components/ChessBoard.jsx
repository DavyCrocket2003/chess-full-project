import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import './ChessBoard.css';
import Square from './Square';
import Piece from './Piece';
import { useSelector, useDispatch } from 'react-redux';
import {snapCenterToCursor} from '@dnd-kit/modifiers'
import { socketHandlers } from '../controllers/socketHandlers';

export default function ChessBoard(props) {
  const dragOrigin = useSelector((state) => state.dragOrigin)
  const dragColor = dragOrigin.piece === dragOrigin.piece.toUpperCase() ? 'white' : 'black'
  const onBottom = useSelector((state) => state.onBottom)
  const gameState = useSelector((state) => state.gameState)
  const squares = gameState.squares
  const userId = useSelector((state) => state.userSession.userId)

  // generate key seed of strings '11' to '88' to make squares representing the board
  let squareKeys = []
  // ternary used below to conditionally render which player is 'onBottom"
  const whiteOnBottom = true //(onBottom === 'regular' && gameState.player1===userId) || (!onBottom === 'regular' && !gameState.player1===userId)
  for (let i = (whiteOnBottom ? 8 : 1); i!== (whiteOnBottom ? 0 : 9); i += (onBottom === 'white' ? -1 : 1)) {
    for (let j = (whiteOnBottom ? 1 : 8); j!== (whiteOnBottom ? 9 : 0); j += (onBottom === 'white' ? 1 : -1)) {
        squareKeys.push(`${i}${j}`)
    }
  }
  const whiteColor = useSelector((state) => state.whiteColor)
  const blackColor = useSelector((state) => state.blackColor)
  const dispatch = useDispatch()
  const playerColor = gameState.player1Id === userId ? 'white' : 'black'

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
    const { active, over } = event
    if (over && gameState.turn===playerColor && playerColor===dragColor && squares[dragOrigin.square].moves.includes(over.id)) {
      // emit move to server  Will need to implement promotions here
      props.emitters.move({origin: dragOrigin.square, target: over.id})
      // update local game board
      dispatch({
        type: "UPDATE_BOARD",
        payload: {[dragOrigin.square]: {piece: '', moves: []}, [over.id]: {piece: dragOrigin.piece, moves: []}}
      })
    }
    dispatch({type: 'DROP_PIECE'})
  }
  // function that watches for a "GRAB_PIECE" action to record the origin square, piece, and if it's your color
  function handleDragStart(event) {
    const {id} = event.active
    const square = id.slice(1)
    const piece = squares[square].piece
    const moves = squares[square].moves
    dispatch({type: "GRAB_PIECE", payload: {square: square, piece: piece, moves:moves}})
  }
}
