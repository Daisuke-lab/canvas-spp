import React from 'react'
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import Button from '@mui/material/Button';
import styles from '../../../styles/Connection.module.css'
import {optionStageWidth, optionStageHeight} from '../ConnectionTypeSelect'
interface Props{
    direction: "source" | "destination"
}
function Many(props:Props) {
    const {direction} = props
    const initialX = direction==="source"?13:optionStageWidth/2+3
    const endX = direction==="source"?-10:10
    const centerY = optionStageHeight/2
  return (
      <div className={styles.stageContainer}>
    <Stage width={optionStageWidth} height={optionStageHeight}>
        <Layer>
            <Line x={3} y={centerY} points={[0,0,30,0]}
            stroke="black"
            strokeWidth={2}/>
            <Line x={initialX} y={centerY} points={[0,0,endX,7]}
            stroke="black"
            strokeWidth={2}/>
            <Line x={initialX} y={centerY} points={[0,0,endX,-7]}
            stroke="black"
            strokeWidth={2}/>
        </Layer>
    </Stage>
    </div>
  )
}

export default Many