import React from 'react'
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import Button from '@mui/material/Button';
import styles from '../../../styles/Connection.module.css'
import {optionStageWidth, optionStageHeight} from '../ConnectionTypeSelect'


function Normal() {
    const centerY = optionStageHeight/2
  return (
    <div className={styles.stageContainer}>
    <Stage width={40} height={30}>
        <Layer>
            <Line x={3} y={centerY} points={[0,0,33,0]}
            stroke="black"
            strokeWidth={2}/>
            </Layer>
    </Stage>
    </div>
  )
}

export default Normal