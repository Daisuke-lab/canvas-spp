
import React, {useRef, useState, useEffect} from 'react'
import { Stage, Layer, Rect, Text, Line, Transformer } from "react-konva";
import {updateCurrentConnection, openMenu, updateEnabledItems} from '../../store/reducers/canvasReducer'
import { ConnectionType, TableConnectionType, TableType, PointConnectionType, AnchorLocationType } from '../../types';
import {getR, getRotation} from "../helpers/transformHelper"
import { v4 as uuid } from 'uuid';
import ConnectionOption from './ConnectionOption'
import { mainTheme } from '../../themes/MainTheme';
import { RootState, AppDispatch } from '../../store/store';
import * as Konva from "konva"

interface Props {
    dispatch: AppDispatch,
    state: RootState,
    connection: ConnectionType
}
export default function Connection(props:Props) {
    const {state, dispatch, connection} = props
    const connectionPreview = state.canvases.connectionPreview
    const tables = state.canvases.tables
    const connectionRef = useRef<Konva.default.Line>(null)
    const sourceTable = tables.find((table) => table.id === connection.source?.id) as TableType
    const destinationId = (connection.destination as TableConnectionType)?.id
    const destinationTable =  tables.find((table) => table.id === destinationId)
    const currentConnection = state.canvases.currentConnection
    const display = state.canvases.displayMenu.display


    const sourceTitleHeight = 20  *sourceTable?.scale?.y ?? 0
    const sourceErDiagramWidth = 100 *sourceTable?.scale?.x ?? 0
    const sourceRowHeight = 15  *sourceTable?.scale?.y ?? 0
    const sourceErDiagramHeight = sourceTitleHeight + sourceRowHeight * sourceTable?.rows?.length ?? 0
    const sourceR = getR(connection.source?.anchorLocation ?? 0, sourceErDiagramWidth, sourceErDiagramHeight)
    const sourceRotation = getRotation(connection.source?.anchorLocation ?? 0, sourceErDiagramWidth, sourceR, sourceTable?.rotation ?? 0)
    const sourceRadians = (Math.PI / 180) * sourceRotation
    const sourceCosTheta = Math.cos(sourceRadians)
    const sourceSinTheta = Math.sin(sourceRadians)
    const startX = sourceTable?.x + sourceCosTheta*sourceR
    const startY = sourceTable?.y + sourceSinTheta*sourceR
    const instanceofConnectionPoint = (object:any):object is ConnectionType => {
        return "anchorLocation" in object
    }

    let endX = 0
    let endY = 0
    let destination:TableConnectionType|PointConnectionType;
    if (destinationTable != undefined) {
        destination = connection.destination as TableConnectionType
        const destinationTitleHeight = 20  *destinationTable.scale.y
        const destinationErDiagramWidth = 100 *destinationTable.scale.x
        const destinationRowHeight = 15  *destinationTable.scale.y
        const destinationErDiagramHeight = destinationTitleHeight + destinationRowHeight * destinationTable.rows.length
        const destinationR = getR(destination.anchorLocation, destinationErDiagramWidth, destinationErDiagramHeight)
        const destinationRotation = getRotation(destination.anchorLocation, destinationErDiagramWidth, destinationR, destinationTable.rotation)
        const destinationRadians = (Math.PI / 180) * destinationRotation
        const destinationCosTheta = Math.cos(destinationRadians)
        const destinationSinTheta = Math.sin(destinationRadians)
        endX = destinationTable.x + destinationCosTheta*destinationR
        endY = destinationTable.y + destinationSinTheta*destinationR
    } else {
        destination = connection.destination as PointConnectionType
        endX = destination?.x ?? 0
        endY = destination?.y ?? 0
    }

    const onLineClick = (event:any) => {
        if (currentConnection?.id !== connection.id) {
            dispatch(updateCurrentConnection(connection))
        }


      }

    const handleRightClick = (event:any) => {
        //event?.preventDefault();
        if (!display) {
            dispatch(openMenu({x: event.target.attrs.points[0], y:event.target.attrs.points[1]}))
            dispatch(updateEnabledItems(["delete-connection"]))
          }


    }



    const avoidingCollisionPoint = (points:number[]) => {
        const stage = connectionRef.current?.getStage();
        const sourceCanvasTable = stage?.findOne(`.${sourceTable.id}`)
        const destinationCanvasTable = stage?.findOne(`.${destinationTable?.id}`)
        if (haveIntersection(sourceTable, connectionRef.current, points)) {
            switch(connection.source.anchorLocation) {
                case "top":
                    points.splice(4, 1, sourceCanvasTable?.attrs.width+10)
                    points.splice(5, 1, -10)
                    //setPoints(points)
                    break
                case "right":
                    points.splice(4, 1, 10)
                    points.splice(5, 1, sourceCanvasTable?.attrs.height+10)
                    break
                case "bottom":
                    points.splice(4, 1, -sourceCanvasTable?.attrs.width-10)
                    points.splice(5, 1, -10)
                    break
                case "left":
                    points.splice(4, 1, -10)
                    points.splice(5, 1, -sourceCanvasTable?.attrs.height-10)
                    break
            }
        }
        if (haveIntersection(destinationTable, connectionRef.current, points) && instanceofConnectionPoint(connection.destination)) {
            const connectionDestination = connection.destination as TableConnectionType
            switch(connectionDestination.anchorLocation) {
                case "top":
                    points.splice(6, 1, endY - startY + destinationCanvasTable?.attrs.width + 10)
                    points.splice(7, 1, endY - startY - 10)
                    //setPoints(points)
                    break
                case "right":
                    points.splice(6, 1, endX + 10)
                    points.splice(7, 1, destinationCanvasTable?.attrs.height + 10)
                    break
                case "bottom":
                    points.splice(6, 1, -destinationCanvasTable?.attrs.width-10)
                    points.splice(7, 1, endY -10)
                    break
                case "left":
                    points.splice(6, 1, endX -10)
                    points.splice(7, 1, -destinationCanvasTable?.attrs.height -10)
                    break
            }
        }


    }

    const haveIntersection = (table:any, line:any, points:number[]) => {
        if (typeof table?.attrs?.width === "number" && typeof table?.attrs?.height === "number") {
                for (let i=0; i < points.length; i+=2) {
                    const startX = points[i]
                    const startY = points[i+1]
                    const endX = points[i+2]
                    const endY = points[i+3]
                    const result = (line.attrs.x + startX >= table.attrs.x &&
                                    line.attrs.x + startX <= table.attrs.x + table.attrs.width) &&
                                    ((line.attrs.y + startY <= table.attrs.y &&
                                    line.attrs.y + endY >= table.attrs.y + table.attrs.height) ||
                                    (line.attrs.y + startY >= table.attrs.y &&
                                        line.attrs.y + endY <= table.attrs.y + table.attrs.height)
                                    )

                    if (result) {
                        return true
                    }
                }
        }
        return false
    }
    //const point = avoidingCollisionPoint(connection.source.anchorLocation)

    const middlePoint = (location:AnchorLocationType | undefined) => {
        switch(location) {
            case "top":
                return [0, -20]
            case "right":
                return [20,0]
            case "bottom":
                return [0, 20]
            case "left":
                return [-20, 0]
            default:
                return [0, 0]
        }
    }


    const [sourceMiddleX, sourceMiddleY] = middlePoint(connection.source?.anchorLocation)
    const [destinationMiddleX, destinationMiddleY] = middlePoint((destination as TableConnectionType)?.anchorLocation)
    const [points, setPoints] = useState<number[]>([startX, startY,
        startX + sourceMiddleX, startY + sourceMiddleY,
        startX + sourceMiddleX, endY - destinationMiddleY,
        endX + destinationMiddleX, endY - destinationMiddleY,
        endX, endY - destinationMiddleY,
        endX, endY])
    useEffect(() => {
        const newPoints = [startX, startY,
            startX + sourceMiddleX, startY + sourceMiddleY,
            startX + sourceMiddleX, endY + destinationMiddleY,
            endX + destinationMiddleX, endY + destinationMiddleY,
            endX, endY + destinationMiddleY,
            endX, endY]
        // if(connectionRef.current !== null) {
        //     avoidingCollisionPoint(newPoints)
        // }
        // newPoints.splice(6, 1, newPoints[4])
        // newPoints.splice(7, 1, newPoints[9])
        if (startY < endY) {
            newPoints.splice(4, 1, endX + destinationMiddleX)
            newPoints.splice(5, 1, startY + sourceMiddleY)
            newPoints.splice(6, 1, endX + destinationMiddleX)
            newPoints.splice(7, 1, endY + destinationMiddleY)
        }
        setPoints(newPoints)
    }, [sourceTable,  display, endX, endY])
    return (
    <>
    {currentConnection?.id === connection.id && connection !== null?
    <>
         <Line
         x={0}
         y={0}
         points={points}
         stroke={mainTheme.primary}
         lineCap='round'
         lineJoin='round'
         strokeWidth={7}
         tension={0}
         onClick={onLineClick}/>
         <Line
         x={0}
         y={0}
         points={points}
         stroke="white"
         lineCap='round'
         lineJoin='round'
         strokeWidth={5}
         onClick={onLineClick}/></>:
      <></>
        }
    {connection !== null?
    <>
    <ConnectionOption anchorLocation={connection.source?.anchorLocation ?? "top"}
    connectionOption={connection.source?.connectionOption ?? "one"}
    x={startX}
    y={startY}
    />
            <Line
            id={connection.id}
            x={0}
            y={0}
            ref={connectionRef}
            points={points}
            stroke="black"
            lineCap='round'
            lineJoin='round'
            strokeWidth={2}
            tension={0}
            onClick={onLineClick}
            onContextMenu={handleRightClick}
        />
        <ConnectionOption anchorLocation={(connection.destination as TableConnectionType)?.anchorLocation ?? "top"}
            connectionOption={connection.destination?.connectionOption ?? "one"}
            x={endX}
            y={endY}
            />
    </>
        :<></>
            }
    </>
  )
}
