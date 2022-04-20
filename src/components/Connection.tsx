
import React, {useRef, useState, useEffect} from 'react'
import { Stage, Layer, Rect, Text, Line, Transformer } from "react-konva";
import {ConnectionType, ConnectionPointType, AnchorLocationType, updateCurrentConnectionId,
openMenu, updateEnabledItems} from '../../store/reducers/canvasReducer'
import {getR, getRotation} from "../helpers/transformHelper"
import uuid from 'react-uuid'
import ConnectionOption from './ConnectionOption'

interface Props {
    dispatch: any,
    state: any,
    connection: ConnectionType
}
export default function Connection(props:Props) {
    const {state, dispatch, connection} = props
    const connectionPreview = state.canvases.connectionPreview
    const tables = state.canvases.tables
    const [selected, setSelected] = useState<boolean>(false)
    const trRef = useRef() as any
    const lineRef = useRef() as any
    const source = tables.find((table) => table.id === connection.source.id)
    const connectionDestination = connection.destination as ConnectionPointType
    const destination =  tables.find((table) => table.id === connectionDestination.id) !== undefined?
    tables.find((table) => table.id === connectionDestination.id):{scale: {x:1,y:1}, rows:[], rotation:0}
    const connectionRef = useRef<any>(null)
    const currentConnectionId = state.canvases.currentConnectionId
    const display = state.canvases.displayMenu.display


    const sourceTitleHeight = 20  *source.scale.y
    const sourceErDiagramWidth = 100 *source.scale.x
    const sourceRowHeight = 15  *source.scale.y
    const sourceErDiagramHeight = sourceTitleHeight + sourceRowHeight * source.rows.length
    const sourceR = getR(connection.source.anchorLocation, sourceErDiagramWidth, sourceErDiagramHeight)
    const sourceRotation = getRotation(connection.source.anchorLocation, sourceErDiagramWidth, sourceR, source.rotation)
    const sourceRadians = (Math.PI / 180) * sourceRotation
    const sourceCosTheta = Math.cos(sourceRadians)
    const sourceSinTheta = Math.sin(sourceRadians)
    const startX = source.x + sourceCosTheta*sourceR
    const startY = source.y + sourceSinTheta*sourceR
    const instanceofConnectionPoint = (object:any):object is ConnectionType => {
        return "anchorLocation" in object
    }

    let endX = 0
    let endY = 0
    if (connection.destination?.id !== null && connection.destination?.id !== undefined) {
        const destinationTitleHeight = 20  *destination.scale.y
        const destinationErDiagramWidth = 100 *destination.scale.x
        const destinationRowHeight = 15  *destination.scale.y
        const destinationErDiagramHeight = destinationTitleHeight + destinationRowHeight * destination.rows.length
        const destinationR = getR(connection.destination.anchorLocation, destinationErDiagramWidth, destinationErDiagramHeight)
        const destinationRotation = getRotation(connection.destination.anchorLocation, destinationErDiagramWidth, destinationR, destination.rotation)
        const destinationRadians = (Math.PI / 180) * destinationRotation
        const destinationCosTheta = Math.cos(destinationRadians)
        const destinationSinTheta = Math.sin(destinationRadians)
        endX = destination.x + destinationCosTheta*destinationR
        endY = destination.y + destinationSinTheta*destinationR
    } else {
        endX = connection.destination.x
        endY = connection.destination.y
    }

    const onLineClick = (event:any) => {
        console.log(event)
        if (currentConnectionId !== connection.id) {
            dispatch(updateCurrentConnectionId(connection.id))
        }
        console.log('line clicked')


      }

    const handleRightClick = (event:any) => {
        //event?.preventDefault();
        console.log("line right clicked")
        if (!display) {
            console.log(event.target)
            dispatch(openMenu({x: event.target.attrs.points[0], y:event.target.attrs.points[1]}))
            dispatch(updateEnabledItems(["delete-connection"]))
          }


    }



    const avoidingCollisionPoint = (points:number[]) => {
        const stage = connectionRef.current?.getStage();
        const sourceTable = stage.findOne(`.${source.id}`)
        const destinationTable = stage.findOne(`.${destination.id}`)
        if (haveIntersection(sourceTable, connectionRef.current, points)) {
            switch(connection.source.anchorLocation) {
                case "top":
                    console.log('you are here')
                    points.splice(4, 1, sourceTable.attrs.width+10)
                    points.splice(5, 1, -10)
                    //setPoints(points)
                    break
                case "right":
                    points.splice(4, 1, 10)
                    points.splice(5, 1, sourceTable.attrs.height+10)
                    break
                case "bottom":
                    points.splice(4, 1, -sourceTable.attrs.width-10)
                    points.splice(5, 1, -10)
                    break
                case "left":
                    points.splice(4, 1, -10)
                    points.splice(5, 1, -sourceTable.attrs.height-10)
                    break
            }
        }
        if (haveIntersection(destinationTable, connectionRef.current, points) && instanceofConnectionPoint(connection.destination)) {
            const connectionDestination = connection.destination as ConnectionPointType
            switch(connectionDestination.anchorLocation) {
                case "top":
                    console.log('you are here')
                    points.splice(6, 1, endY - startY + destinationTable.attrs.width + 10)
                    points.splice(7, 1, endY - startY - 10)
                    //setPoints(points)
                    break
                case "right":
                    points.splice(6, 1, endX + 10)
                    points.splice(7, 1, destinationTable.attrs.height + 10)
                    break
                case "bottom":
                    points.splice(6, 1, -destinationTable.attrs.width-10)
                    points.splice(7, 1, endY -10)
                    break
                case "left":
                    points.splice(6, 1, endX -10)
                    points.splice(7, 1, -destinationTable.attrs.height -10)
                    break
            }
        }


    }

    const haveIntersection = (table:any, line:any, points:number[]) => {
        if (typeof table?.attrs?.width === "number" && typeof table?.attrs?.height === "number") {
            console.log('loop start')
                for (let i=0; i < points.length; i+=2) {
                    const startX = points[i]
                    const startY = points[i+1]
                    const endX = points[i+2]
                    const endY = points[i+3]
                    console.log('........................')
                    console.log(line.attrs.x + startX )
                    console.log(table.attrs.x + table.attrs.width)
                    console.log(line.attrs.y + startY < table.attrs.y)
                    console.log( line.attrs.y + endY > table.attrs.y + table.attrs.height)
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

    const middlePoint = (location:AnchorLocationType) => {
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


    const [sourceMiddleX, sourceMiddleY] = middlePoint(connection.source.anchorLocation)
    const [destinationMiddleX, destinationMiddleY] = middlePoint(connection.destination?.anchorLocation)
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
    }, [source,  display, endX, endY])
    return (
    <>
    {currentConnectionId === connection.id && connection !== null?
    <>
         <Line
         x={0}
         y={0}
         ref={connectionRef}
         points={points}
         stroke="skyblue"
         lineCap='round'
         lineJoin='round'
         strokeWidth={7}
         tension={0}
         onClick={onLineClick}/>
         <Line
         x={0}
         y={0}
         ref={connectionRef}
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
    <ConnectionOption anchorLocation={connection.source.anchorLocation}
    connectionOption={connection.source.connectionOption}
    x={startX}
    y={startY}
    />
            <Line
            id={connection.id}
            x={0}
            y={0}
            ref={connectionRef}
            points={points}
            stroke="#6F1D1B"
            lineCap='round'
            lineJoin='round'
            strokeWidth={2}
            tension={0}
            ref={lineRef}
            onClick={onLineClick}
            onContextMenu={handleRightClick}
        />
        <ConnectionOption anchorLocation={connection.destination.anchorLocation}
            connectionOption={connection.destination.connectionOption}
            x={endX}
            y={endY}
            />
    </>
        :<></>
            }
    </>
  )
}
