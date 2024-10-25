import React from 'react'
// import {useDroppable} from '@dnd-kit/core';
import Piece from './Piece';
// import { useSelector } from 'react-redux';

function StaticSquare({piece, bc}) {
  // const {isOver, setNodeRef} = useDroppable({id: props.id})

  // Extract the piece from the pieceData object in the redux store
  // const pieceData = useSelector((state) => state.gameState.squares[props.id])
  // const dragOrigin = useSelector((state) => state.dragOrigin)
    
  return (
    <div style={{border: "solid black 1px", aspectRatio: "1 / 1", display: "flex", backgroundColor: bc ? bc : "#e1e1e1"}}>
        {piece && <Piece piece={piece}/>}
    </div>
  )
}

export default StaticSquare
