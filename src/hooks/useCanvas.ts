import React, { useRef, useEffect, useState } from 'react';
import {RefType, LocationType} from '../GlobalType'
interface DrawInputType {
    ctx: CanvasRenderingContext2D,
    location: {x:number, y:number}
}


const SCALE = 0.1;
const OFFSET = 80;
const heartSVG = "M0 200 v-200 h200 a100,100 90 0,1 0,200 a100,100 90 0,1 -200,0 z"


const draw = (ctx:CanvasRenderingContext2D, location:LocationType) => {
    ctx.fillStyle = "red"
    ctx.save()
    ctx.scale(SCALE, SCALE);
    ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET);
    ctx.rotate(225 * Math.PI / 180);
    const SVG_PATH = new Path2D(heartSVG);
    ctx.fill(SVG_PATH);
    ctx.restore();  
  }


export default function useCanvas(width:number | string, height:number|string) {
    const canvasRef = useRef<React.RefObject<HTMLCanvasElement>>();
    const [coordinates, setCoordinates] = useState<LocationType[]>([])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) throw Error("canvas is not assigned");
        const ctx = canvas.getContext("2d")
        if (!ctx) throw Error("ctx is not assigned");
        ctx.clearRect(0,0,width, height)
        coordinates.forEach((coordinate) => {draw(ctx, coordinate)})
    })

    return {coordinates, setCoordinates, canvasRef, width, height}
}