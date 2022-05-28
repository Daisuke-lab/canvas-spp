import React from 'react'
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import Anchor from './Anchor'
import {defaultTitleHeight, defaultErDiagramWidth, defaultRowHeight} from './ERDiagram'
import { RootState, AppDispatch } from '../../store/store';

interface CoordinateType {
     x: number,
     y: number,
     width: number,
     height: number
}

interface Props {
    targetRef: React.RefObject<any>,
    state: RootState,
    dispatch: AppDispatch,
    id: string
}
function Border(props:Props) {
    const {targetRef, state, dispatch, id} = props
    //const absolutePosition = targetRef.current?.absolutePosition()
    const absolutePosition = {x:0,y:0}
    const anchorDistance = 10
    const table = state.canvases.tables.find((table) => table.id === id)
    const titleHeight = defaultTitleHeight
    const erDiagramWidth = defaultErDiagramWidth
    const rowHeight = defaultRowHeight
    const rowLength  = table !== undefined?table.rows.length:0
    const erDiagramHeight = titleHeight + rowHeight * rowLength

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
        <Line
            key={`border-title-bottom-${id}`}
            x={getX("top")}
            y={getY("top") + titleHeight}
            points={getPoints("top")}
            stroke="black"
            strokeWidth={1}
            perfectDrawEnabled={false}
          />
        {lineLocations.map((lineLocation, index) => {
            return (
            <>
            <Line
            key={`border-${index}`}
            x={getX(lineLocation)}
            y={getY(lineLocation)}
            points={getPoints(lineLocation)}
            stroke="black"
            strokeWidth={1}
            perfectDrawEnabled={false}
          />

          <Anchor {...getAnchorPoint(lineLocation)} state={state} dispatch={dispatch}
          targetRef={targetRef} id={id} location={lineLocation as "left"|"right"|"top"|"bottom"}/>
          
          </>)
        })}
      </>
    )
}

export default Border