import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useRef, useEffect, useState } from 'react';
import useCanvas from '../hooks/useCanvas'
import {BoxType} from '../GlobalType'

function CustomCanvas() {
    const [location, setLocation] = useState<BoxType>({width:500, height:500})
    useEffect(() => {
        setLocation({
            width:window.innerWidth,
            height:window.innerHeight
        })
    },[])
    

    const {coordinates, setCoordinates, canvasRef} = useCanvas(location.width, location.height)

    const handleCanvasClick = (event:React.MouseEvent<HTMLCanvasElement>) => {
        console.log(event)
        const scrollbarWidth = document.body.offsetWidth - document.body.clientWidth;
        const box = document.getElementById('canvas-box')
        console.log(box.offsetWidth - document.body.offsetWidth)
        const currentCoord = {x: event.clientX, y: event.clientY+ document.documentElement.scrollTop}
        setCoordinates([...coordinates, currentCoord])

    }
    return (
        <div style={{border: "1px solid"}} id="canvas-box">
            <canvas
            ref={canvasRef}
            width={location.width}
            height={location.height}
            onClick={handleCanvasClick}
            />
        </div>
    )
}

export default CustomCanvas
