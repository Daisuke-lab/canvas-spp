import React, {useEffect, useState, useRef} from 'react'
import { Line, Circle } from "react-konva";
import {updateConnectionPreview} from '../../store/reducers/canvasReducer'
interface Props {
    x: any,
    y: any,
    state: any,
    dispatch: any
}
function Anchor(props:Props) {
    const {x, y, dispatch, state} = props
    const anchorRef = useRef<any>(null);
    const currentConnectionPreview = state.canvases
    const dragBounds = () => {
        if (anchorRef.current !== null) {
          return anchorRef.current.getAbsolutePosition();
        }
        return {
          x: 0,
          y: 0,
        }
      }
    const handleAnchorDragStart = (e:any) => {
        console.log("drag started")
        const position = e.target.position();
        const connectionPreview = {
            source: {x,y},
            destination: {x: position.x, y: position.y}
        }
        dispatch(updateConnectionPreview(connectionPreview))
    }
    const handleAnchorDragMove = (e:any) => {
        const position = e.target.position();
        const stage = e.target.getStage();
        //console.log(connection)
        const pointerPosition = stage.getPointerPosition();
        const mousePos = {
          x: pointerPosition.x - position.x,
          y: pointerPosition.y - position.y
        }
        const connectionPreview = {
            source: {x,y},
            destination: {x:pointerPosition.x, y:pointerPosition.y}
        }
        dispatch(updateConnectionPreview(connectionPreview))
      }

    const handleAnchorDragEnd = () => {
        dispatch(updateConnectionPreview(null))
      }
    
  return (
    <Circle
      x={x}
      y={y}
      radius={5}
      fill='black'
      draggable
      dragBoundFunc={() => dragBounds()}
      perfectDrawEnabled={false}
      ref={anchorRef}
      onDragStart={handleAnchorDragStart}
      onDragMove={handleAnchorDragMove}
      onDragEnd={handleAnchorDragEnd}
    />
  )
}

export default Anchor