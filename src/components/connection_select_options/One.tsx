import React from 'react'
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import Button from '@mui/material/Button';
import styles from '../../../styles/Connection.module.css'
import {optionStageWidth, optionStageHeight} from '../ConnectionTypeSelect'
interface Props{
  direction: "source" | "destination"
}


function One(props:Props) {
  const {direction} = props
  const centerY = optionStageHeight/2
  const initialX = direction==="source"?13:23
  return (
    <div className={styles.stageContainer}>
    <Stage width={40} height={30}>
        <Layer>
            <Line x={3} y={centerY} points={[0,0,30,0]}
            stroke="black"
            strokeWidth={2}/>
            <Line x={initialX} y={centerY} points={[0,-5,0,5]}
            stroke="black"
            strokeWidth={2}/>  
            </Layer>
    </Stage>
    </div>
  )
}

export default One