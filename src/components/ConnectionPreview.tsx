import React from 'react'
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import {getR, getRotation} from '../helpers/transformHelper'
import { RootState, AppDispatch } from '../../store/store';
import {TableType, ConnectionType, PointConnectionType} from '../../types'


interface Props {
    dispatch: AppDispatch,
    state: RootState
}
function ConnectionPreview(props:Props) {
    const {state, dispatch} = props
    const connectionPreview = state.canvases.connectionPreview as ConnectionType
    const destination = connectionPreview.destination as PointConnectionType
    const tables = state.canvases.tables
    const sourceTable = tables.find((table) => table.id === connectionPreview?.source?.id) as TableType

    const titleHeight = 20  *sourceTable?.scale?.y
    const erDiagramWidth = 100 *sourceTable?.scale?.x
    const rowHeight = 15  *sourceTable?.scale?.y
    const erDiagramHeight = titleHeight + rowHeight * sourceTable?.rows?.length


    const r = getR(connectionPreview.source.anchorLocation, erDiagramWidth, erDiagramHeight)
    const rotation = getRotation(connectionPreview.source.anchorLocation, erDiagramWidth, r, sourceTable.rotation)

    const radians = (Math.PI / 180) * rotation
    const cosTheta = Math.cos(radians)
    const sinTheta = Math.sin(radians)
    const lineX = sourceTable.x + cosTheta*r
    const lineY = sourceTable.y + sinTheta*r


    return (
    <>
    {connectionPreview !== null?
            <Line
            x={lineX}
            y={lineY}
            points={[0, 0,destination.x -lineX, 
                    destination.y - lineY] }
            stroke="black"
            strokeWidth={2}
        />:<></>
            }
    </>
  )
}



export default ConnectionPreview