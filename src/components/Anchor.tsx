import { getLocationOrigin } from 'next/dist/shared/lib/utils';
import React, {useEffect, useState, useRef} from 'react'
import { Line, Circle } from "react-konva";
import {updateConnectionPreview, addConnection, updateCurrentConnectionId} from '../../store/reducers/canvasReducer'
import uuid from 'react-uuid'
import { ConnectionOptionType } from '../GlobalType';
import {getR, getRotation} from '../helpers/transformHelper'
import { ScaleSharp } from '@mui/icons-material';
import backendAxios from '../helpers/axios';
interface Props {
    x: any,
    y: any,
    state: any,
    dispatch: any,
    targetRef: any,
    id: string,
    location: "top" | "bottom" | "right" | "left"
}

interface DestinationType {
  id: string,
  anchorLocation: "top" | "bottom" | "right" | "left",
  connectionOption: ConnectionOptionType
}
function Anchor(props:Props) {
    const {x, y, dispatch, state, targetRef, id, location} = props
    const anchorRef = useRef<any>(null);
    const currentConnectionPreview = state.canvases.connectionPreview
    const defaultConnectionOption = state.canvases.defaultConnectionOption
    const [destination, setDestination] = useState<DestinationType | null>(null)
    const dragBounds = () => {
        if (anchorRef.current !== null) {
          return anchorRef.current.getAbsolutePosition();
        }
        return {
          x: 0,
          y: 0,
        }
      }
    const table = state.canvases.tables.find((table) => table.id === id)
    const scale = targetRef.current?.scale() !== undefined?targetRef.current?.scale():{x:1,y:1};
    const titleHeight = 20  *scale.y
    const erDiagramWidth = 100 *scale.x
    const rowHeight = 15  *scale.y
    const erDiagramHeight = titleHeight + rowHeight * table.rows.length

    // const r = "bottom" === location?Math.sqrt((erDiagramWidth/2)**2 + (erDiagramHeight)**2)
    // :location==="top"?(erDiagramWidth/2)
    // :location==="left"?erDiagramHeight/2
    // :Math.sqrt((erDiagramWidth)**2 + (erDiagramHeight/2)**2)
    const r = getR(location, erDiagramWidth, erDiagramHeight)
    const rotation = getRotation(location, erDiagramWidth, r, targetRef.current?.rotation())
    // const rotation = "top"===location?targetRef.current?.rotation()
    // :"right"===location?targetRef.current?.rotation() + Math.acos(erDiagramWidth / r) * (180 / Math.PI)
    // :"bottom"===location?targetRef.current?.rotation() + Math.acos((erDiagramWidth /2) / r) * (180 / Math.PI)
    // :targetRef.current?.rotation() + 90


    const radians = (Math.PI / 180) * rotation
    const cosTheta = Math.cos(radians)
    const sinTheta = Math.sin(radians)
    // const lineX = source.x + cosTheta*r
    // const lineY = source.y + sinTheta*r

    const handleAnchorDragStart = (e:any) => {
        const position = e.target.position();
        const absolutePosition = targetRef.current?.absolutePosition()
        console.log(targetRef.current?.rotation())
        console.log(rotation)
        //console.log("anchorX*cosTheta::", anchorX*cosTheta)
        const connectionPreview = {
            source: {id, anchorLocation: location, connectionOption: defaultConnectionOption.source},
            destination: {x: position.x, y: position.y, connectionOption: defaultConnectionOption.destination
            }
        }
        console.log(connectionPreview)
        dispatch(updateConnectionPreview(connectionPreview))
    }
    const handleAnchorDragMove = (e:any) => {
        const position = e.target.position();
        const stage = e.target.getStage();
        const layer = e.target.getLayer();

        
        const pointerPosition = stage.getPointerPosition();
        detectCollision(layer, pointerPosition)
        const mousePos = {
          x: pointerPosition.x - position.x,
          y: pointerPosition.y - position.y
        }
        const connectionPreview = {
            source: {id, anchorLocation: location, connectionOption: defaultConnectionOption.source},
            destination: {x:pointerPosition.x, y:pointerPosition.y, connectionOption: defaultConnectionOption.destination}
        }
        dispatch(updateConnectionPreview(connectionPreview))
      }

    const handleAnchorDragEnd = async (e:any) => {
      const absolutePosition = targetRef.current?.absolutePosition()
      const stage = e.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      const finalDestination = destination === null?{x:pointerPosition.x, y:pointerPosition.y, connectionOption: defaultConnectionOption.destination}
      :destination
      const connectionId = uuid()
      const connectionPreview = {
        ...currentConnectionPreview,
        source: {id, x: absolutePosition?.x, y: absolutePosition?.y, anchorLocation: location, connectionOption: defaultConnectionOption.source},
        destination:finalDestination,
        id: connectionId
        }
        try {
          const res = await backendAxios.post("/api/v1/connection", connectionPreview)
          console.log(res)
          dispatch(addConnection(connectionPreview))
          dispatch(updateConnectionPreview(null))
          dispatch(updateCurrentConnectionId(connectionId))
        } catch (err) {
          console.log(err)
        }
      }

      const getAnchorLocation = (name:string) => {
        const location = name.includes("right")?"right":
                        name.includes("left")?"left":
                        name.includes("top")?"top":
                        "bottom"
      }

      const detectCollision = (layer:any, target:any) => {
        layer.find(`.connectable`).forEach(function (group:any) {
          // do not check intersection with itself
          if (group.parent.attrs.name === table.id) {
            return;
          }
          // && group.nodeType === "Group"
          if (haveIntersection(group, target)) {
            //group.scale({x:2, y:2})
            console.log("you detected collision")
            console.log(group)
            const name = group.attrs.name
            const location = name.includes("right")?"right":
                        name.includes("left")?"left":
                        name.includes("top")?"top":
                        "bottom"
            console.log("destination::", {id: group.parent.attrs.id, location: location})
            setDestination({id: group.parent.attrs.id, anchorLocation: location, connectionOption: defaultConnectionOption.destination})
            group.fill('yellow');
          } else {
            if (group.attrs.name.includes(destination?.anchorLocation) && group.parent.attrs.id === destination?.id) {
              setDestination(null)
            }
            group.fill('black');
          }
        })
    }

    const haveIntersection = (r1:any, r2:any) => {
      if (typeof r1.attrs.width === "number" && typeof r1.attrs.height === "number") {
        return (
          r2.x > r1.attrs.x &&
          r2.x < r1.attrs.x + r1.attrs.width &&
          r2.y > r1.attrs.y &&
          r2.y < r1.attrs.y + r1.attrs.height
        );
      } else if (typeof r1.attrs.radius === "number") {
        const circleAbsolutePosition = r1.absolutePosition()
        return (
          r2.x > circleAbsolutePosition.x - (r1.attrs.radius)&&
          r2.x < circleAbsolutePosition.x + (r1.attrs.radius) &&
          r2.y > circleAbsolutePosition.y - (r1.attrs.radius) &&
          r2.y < circleAbsolutePosition.y + (r1.attrs.radius)
        )
      }else return false
    }

    
  return (
    <Circle
      x={x}
      y={y}
      radius={5/scale.x}
      fill='black'
      draggable
      dragBoundFunc={() => dragBounds()}
      perfectDrawEnabled={false}
      ref={anchorRef}
      onDragStart={handleAnchorDragStart}
      onDragMove={handleAnchorDragMove}
      onDragEnd={handleAnchorDragEnd}
      name={`connectable ${location}`}
    />
  )
}

export default Anchor