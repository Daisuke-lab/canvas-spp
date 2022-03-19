import React from 'react'
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import {getR, getRotation} from '../helpers/transformHelper'
interface Props {
    dispatch: any,
    state: any
}
function ConnectionPreview(props:Props) {
    const {state, dispatch} = props
    const connectionPreview = state.canvases.connectionPreview
    const tables = state.canvases.tables
    const source = tables.find((table) => table.id === connectionPreview?.source?.id) !== undefined?
    tables.find((table) => table.id === connectionPreview?.source?.id):{scale:{x:1,y:1},rotation:0}


    const titleHeight = 20  *source?.scale?.y
    const erDiagramWidth = 100 *source?.scale?.x
    const rowHeight = 15  *source?.scale?.y
    const erDiagramHeight = titleHeight + rowHeight * source?.rows?.length


    const r = getR(connectionPreview.source.anchorLocation, erDiagramWidth, erDiagramHeight)
    const rotation = getRotation(connectionPreview.source.anchorLocation, erDiagramWidth, r, source.rotation)

    const radians = (Math.PI / 180) * rotation
    const cosTheta = Math.cos(radians)
    const sinTheta = Math.sin(radians)
    const lineX = source.x + cosTheta*r
    const lineY = source.y + sinTheta*r


    return (
    <>
    {connectionPreview !== null?
            <Line
            x={lineX}
            y={lineY}
            points={[0, 0,connectionPreview.destination.x -lineX, 
                    connectionPreview.destination.y - lineY] }
            stroke="black"
            strokeWidth={2}
        />:<></>
            }
    </>
  )
}



export default ConnectionPreview