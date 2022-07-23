import React from 'react'
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import Anchor from './AnchorOld'
import {defaultTitleHeight, defaultErDiagramWidth, defaultRowHeight} from './ERDiagram'
import { RootState, AppDispatch } from '../../store/store';
import { BOTTOM, LEFT, RIGHT, TOP } from '../constant';
import { AnchorLocationType } from '../../types';

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

    const getX = (location:AnchorLocationType) => {
        switch(location) {
            case LEFT:
                return absolutePosition?.x
            case RIGHT:
                return absolutePosition?.x + erDiagramWidth
            case TOP:
                return absolutePosition?.x
            case BOTTOM:
                return absolutePosition?.x  
            default:
                return 0
        }
    }

    const getY = (location:AnchorLocationType) => {
        switch(location) {
            case LEFT:
                return absolutePosition?.y
            case RIGHT:
                return absolutePosition?.y
            case TOP:
                return absolutePosition?.y
            case BOTTOM:
                return absolutePosition?.y + erDiagramHeight
            default:
                return 0
        }
    }
    
    const getPoints = (location:AnchorLocationType) => {
        switch(location) {
            case LEFT:
                return [0,0,0, erDiagramHeight]
            case RIGHT:
                return [0,0,0, erDiagramHeight]
            case TOP:
                return [0,0,erDiagramWidth,0]
            case BOTTOM:
                return [0,0,erDiagramWidth,0]     
        }
    }

    const getAnchorPoint = (location:AnchorLocationType) => {
        switch(location) {
            case LEFT:
                return {x: getX(location), y:getY(location) + (erDiagramHeight/2)}
            case RIGHT:
                return {x: getX(location), y:getY(location) + (erDiagramHeight/2)}
            case TOP:
                return {x: getX(location) + (erDiagramWidth/ 2), y: getY(location)}
            case BOTTOM:
                return {x: getX(location) + (erDiagramWidth / 2), y: getY(location)}
            default:
                return {x:0, y:0}
        }
    }
    const lineLocations:AnchorLocationType[] = [LEFT, RIGHT, TOP, BOTTOM]
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
          
          </>)
        })}
      </>
    )
}

export default Border