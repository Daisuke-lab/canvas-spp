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

function Many(props:Props) {
    const {anchorLocation,x, y} = props
    console.log(anchorLocation)
    const getFirstPoints = () => {
        switch(anchorLocation) {
            case "top":
                return [0, -10, -7, 0]
            case "bottom":
                return [0, 10, -7, 0]
            case "left":
                return [-10, 0, 0, 7]
            case "right":
                return [10, 0, 0, 7]
            default:
                return [0,0,0,0]
            
          }
    }

    const getSecondPoints = () => {
        switch(anchorLocation) {
            case "top":
                return [0, -10, 7, 0]
            case "bottom":
                return [0, 10, 7, 0]
            case "left":
                return [-10, 0, 0, -7]
            case "right":
                return [10, 0, 0, -7]
            default:
                return [0,0,0,0]
            
          }
    }
  return (
    <>
    <Line x={x} y={y} points={getFirstPoints()}
    stroke="black"
    strokeWidth={2}/>
    <Line x={x} y={y} points={getSecondPoints()}
    stroke="black"
    strokeWidth={2}/>
    </>
  )
}

export default Many