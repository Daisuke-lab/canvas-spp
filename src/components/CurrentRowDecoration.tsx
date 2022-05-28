import React from 'react'
import {mainTheme} from "../../themes/MainTheme"
import {Line} from "react-konva"
interface Props {
    x: number,
    y:number,
    rowHeight: number,
    erDiagramWidth: number,
}
function CurrentRowDecoration(props:Props) {
    const {x, y, rowHeight, erDiagramWidth} = props
  return (
    <>
    <Line
        x={x}
        y={y}
        stroke={mainTheme.secondary}
        strokeWidth={1}
        tension={1}
        points={[0,0, erDiagramWidth,0]}
        />

        <Line
        x={x}
        y={y + rowHeight}
        stroke={mainTheme.secondary}
        strokeWidth={1}
        tension={1}
        points={[0,0, erDiagramWidth, 0]}
        />

        <Line
        x={x}
        y={y}
        stroke={mainTheme.secondary}
        strokeWidth={1}
        tension={1}
        points={[0,0, 0, rowHeight]}
        />
        <Line
        x={x + erDiagramWidth}
        y={y}
        stroke={mainTheme.secondary}
        strokeWidth={1}
        tension={1}
        points={[0,0, 0, rowHeight]}
        />
    </>
  )
}

export default CurrentRowDecoration