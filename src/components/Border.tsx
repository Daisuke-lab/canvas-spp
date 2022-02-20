import React from 'react'
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import Anchor from './Anchor'
interface CoordinateType {
     x: number,
     y: number,
     width: number,
     height: number
}

interface Props {
    targetRef: any,
    state: any,
    dispatch: any
}
function Border(props:Props) {
    const {targetRef, state, dispatch} = props
    //const absolutePosition = targetRef.current?.absolutePosition()
    const absolutePosition = {x:0,y:0}
    console.log(targetRef.current?.clientX)
    console.log(absolutePosition)

    const getX = (location:string) => {
        switch(location) {
            case "left":
                return absolutePosition?.x
            case "right":
                return absolutePosition?.x + targetRef.current?.width()
            case "top":
                return absolutePosition?.x
            case "bottom":
                return absolutePosition?.x  
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
                return absolutePosition?.y + targetRef.current?.height()     
        }
    }
    
    const getPoints = (location:string) => {
        switch(location) {
            case "left":
                return [0,0,0, targetRef.current?.height()]
            case "right":
                return [0,0,0, targetRef.current?.height()]
            case "top":
                return [0,0,targetRef.current?.width(),0]
            case "bottom":
                return [0,0,targetRef.current?.width(),0]     
        }
    }

    const getAnchorPoint = (location:string) => {
        switch(location) {
            case "left":
                return {x: getX(location), y:getY(location) + (targetRef.current?.height()/2)}
            case "right":
                return {x: getX(location), y:getY(location) + (targetRef.current?.height()/2)}
            case "top":
                return {x: getX(location) + (targetRef.current?.width() / 2), y: getY(location)}
            case "bottom":
                return {x: getX(location) + (targetRef.current?.width() / 2), y: getY(location)}
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
            stroke="red"
            strokeWidth={2}
            perfectDrawEnabled={false}
          />
          <Anchor {...getAnchorPoint(lineLocation)} state={state} dispatch={dispatch}/>
          </>)
        })}
      </>
    )
}

export default Border