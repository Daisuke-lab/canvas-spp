import React from 'react'
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import Button from '@mui/material/Button';
import styles from '../../../styles/Connection.module.css'
import {optionStageWidth, optionStageHeight} from '../ConnectionTypeSelect'
import { AnchorLocationType } from '../../../store/reducers/canvasReducer';
interface Props{
  anchorLocation: AnchorLocationType,
  x: number,
  y:number
}


function One(props:Props) {
  const {anchorLocation,x, y} = props
  const centerY = optionStageHeight/2

  const getPoints = () => {
      switch(anchorLocation) {
        case "top":
            return [-5, -10, 5, -10]
        case "bottom":
            return [-5, 10, 5, 10]
        case "left":
            return [-10, 5, -10, -5]
        case "right":
            return [10, 5, 10, -5]
        default:
            return [0,0,0,0]
        
      }
  }
  return (
    <>
        <Line x={x} y={y} points={getPoints()}
        stroke="black"
        strokeWidth={2}/>  
    </>
  )
}

export default One