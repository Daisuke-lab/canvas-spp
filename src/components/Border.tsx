import React from 'react'
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import Anchor from './Anchor'
import {defaultTitleHeight, defaultErDiagramWidth, defaultRowHeight} from './ERDiagram'
interface CoordinateType {
     x: number,
     y: number,
     width: number,
     height: number
}

interface Props {
    targetRef: any,
    state: any,
    dispatch: any,
    id: string
}
function Border(props:Props) {
    const {targetRef, state, dispatch, id} = props
    //const absolutePosition = targetRef.current?.absolutePosition()
    const absolutePosition = {x:0,y:0}
    const table = state.canvases.tables.find((table) => table.id === id)
    const titleHeight = defaultTitleHeight
    const erDiagramWidth = defaultErDiagramWidth
    const rowHeight = defaultRowHeight
    const erDiagramHeight = titleHeight + rowHeight * table.rows.length
    //console.log(table.scale.y)
    //console.log(rowHeight)
    //console.log(erDiagramHeight)

    const getX = (location:string) => {
        switch(location) {
            case "left":
                return absolutePosition?.x
            case "right":
                return absolutePosition?.x + erDiagramWidth
            case "top":
                return absolutePosition?.x
            case "bottom":
                return absolutePosition?.x  
            default:
                return 0
        }
    }

    const getY = (location:string) => {
        switch(location) {
            case "left":
                return absolutePosition?.y
            case "right":
                return absolutePosition?.y
            case "top":
                return absolutePosition?.y
            case "bottom":
                return absolutePosition?.y + erDiagramHeight
            default:
                return 0
        }
    }
    
    const getPoints = (location:string) => {
        switch(location) {
            case "left":
                return [0,0,0, erDiagramHeight]
            case "right":
                return [0,0,0, erDiagramHeight]
            case "top":
                return [0,0,erDiagramWidth,0]
            case "bottom":
                return [0,0,erDiagramWidth,0]     
        }
    }

    const getAnchorPoint = (location:string) => {
        switch(location) {
            case "left":
                return {x: getX(location), y:getY(location) + (erDiagramHeight/2)}
            case "right":
                return {x: getX(location), y:getY(location) + (erDiagramHeight/2)}
            case "top":
                return {x: getX(location) + (erDiagramWidth/ 2), y: getY(location)}
            case "bottom":
                return {x: getX(location) + (erDiagramWidth / 2), y: getY(location)}
            default:
                return {x:0, y:0}
        }
    }
    const lineLocations = ["left", "right", "top", "bottom"]
    return (
        <>
        {lineLocations.map((lineLocation, index) => {
            return (
            <>
            <Line
            key={`border-${index}`}
            x={getX(lineLocation)}
            y={getY(lineLocation)}
            points={getPoints(lineLocation)}
            stroke="#432818"
            strokeWidth={1}
            perfectDrawEnabled={false}
          />
          <Anchor {...getAnchorPoint(lineLocation)} state={state} dispatch={dispatch}
          targetRef={targetRef} id={id} location={lineLocation}/>
          </>)
        })}
      </>
    )
}

export default Border