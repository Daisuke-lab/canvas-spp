import React from 'react'
import { Stage, Layer, Rect, Text, Line } from "react-konva";

interface Props {
    dispatch: any,
    state: any
}
function ConnectionPreview(props:Props) {
    const {state, dispatch} = props
    const connectionPreview = state.canvases.connectionPreview
    return (
    <>
    {connectionPreview !== null?
            <Line
            x={0}
            y={0}
            points={[connectionPreview.source.x, connectionPreview.source.y,connectionPreview.destination.x, connectionPreview.destination.y] }
            stroke="black"
            strokeWidth={2}
        />:<></>
            }
    </>
  )
}



export default ConnectionPreview