import { getLocationOrigin } from 'next/dist/shared/lib/utils';
import React, {useEffect, useState, useRef} from 'react'
import { Line, Circle } from "react-konva";
import * as Konva from "konva"
import {updateConnectionPreview, addConnection, updateCurrentConnection} from '../../store/reducers/canvasReducer'
import { v4 as uuid } from 'uuid';
import {ConnectionOptionType, CustomSessionType} from '../../types'
import {getR, getRotation} from '../helpers/transformHelper'
import { ScaleSharp } from '@mui/icons-material';
import backendAxios from '../helpers/getAxios';
import { useRouter } from 'next/router'
import { RootState, AppDispatch } from '../../store/store';
import { useSession } from 'next-auth/react';
import getAxios from '../helpers/getAxios';
import TableConnectionType from '../../types/TableConnectionType';
import AnchorLocationType from '../../types/AnchorLocationType';
import TableType from '../../types/TableType';
import getAnchorPoint from '../helpers/getAnchorPoint';
import {mainTheme} from "../../themes/MainTheme"
import LocationType from '../../types/LocationType';
import ShapeType from '../../types/ShapeType';

interface Props {
    state: RootState,
    dispatch: AppDispatch,
    targetRef: React.RefObject<Konva.default.Shape | Konva.default.Group>,
    table: TableType,
    location: AnchorLocationType
}

function Anchor(props:Props) {
    const {dispatch, state, targetRef, table, location} = props
    const [x,y] = getAnchorPoint(targetRef, location)
    const anchorRef = useRef<Konva.default.Circle>(null)
    const currentConnectionPreview = state.canvases.connectionPreview
    const defaultConnectionOption = state.canvases.defaultConnectionOption
    const [destination, setDestination] = useState<TableConnectionType | null>(null)
    const roomId = state.canvases.currentRoom?.id
    const session = state.users.session
    const axios = getAxios(session as CustomSessionType | null)
    const [color, setColor] = useState<"black" | typeof mainTheme.secondary>("black")

  


    const dragBounds = () => {
        if (anchorRef.current !== null) {
          return anchorRef.current.getAbsolutePosition();
        }
        return {
          x: 0,
          y: 0,
        }
      }
    const scale = targetRef.current?.scale() ?? {x:1,y:1};
    const titleHeight = 20  *scale.y
    const erDiagramWidth = 100 *scale.x
    const rowHeight = 15  *scale.y
    const rowLength  = table !== undefined?table.rows.length:0
    const erDiagramHeight = titleHeight + rowHeight * rowLength

    // const r = "bottom" === location?Math.sqrt((erDiagramWidth/2)**2 + (erDiagramHeight)**2)
    // :location==="top"?(erDiagramWidth/2)
    // :location==="left"?erDiagramHeight/2
    // :Math.sqrt((erDiagramWidth)**2 + (erDiagramHeight/2)**2)
    const r = getR(location, erDiagramWidth, erDiagramHeight)
    const rotation = getRotation(location, erDiagramWidth, r, targetRef.current?.rotation() ?? 0)
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
        const connectionPreview = {
            source: {id: table.id, anchorLocation: location, connectionOption: defaultConnectionOption.source},
            destination: {x: position.x, y: position.y, connectionOption: defaultConnectionOption.destination
            }
        }
        dispatch(updateConnectionPreview(connectionPreview))
    }
    const handleAnchorDragMove = (e:any) => {
        const position = e.target.position();
        const stage = e.target.getStage();
        const layer = e.target.getLayer();

        
        const pointerPosition = stage.getPointerPosition() as LocationType;
        detectCollision(layer, pointerPosition)
        const mousePos = {
          x: pointerPosition.x - position.x,
          y: pointerPosition.y - position.y
        }
        const connectionPreview = {
            source: {id : table.id, anchorLocation: location, connectionOption: defaultConnectionOption.source},
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
        source: {id: table.id, x: absolutePosition?.x, y: absolutePosition?.y, anchorLocation: location, connectionOption: defaultConnectionOption.source},
        destination:finalDestination,
        id: connectionId,
        roomId: roomId
        }
        try {
          const res = await axios.post("/api/v1/connection", connectionPreview)
          console.log(res)
          //dispatch(addConnection(connectionPreview))
          dispatch(updateConnectionPreview(null))
          dispatch(updateCurrentConnection(connectionPreview))
        } catch (err) {
          console.log(err)
        }
      }


      const detectCollision = (layer:Konva.default.Layer, target:LocationType) => {
        layer.find(`.connectable`).forEach(function (_shape) {
          const shape = _shape as Konva.default.Shape
          // do not check intersection with itself
          if (shape?.parent?.attrs.name === table?.id) {
            return;
          }
          // && group.nodeType === "Group"
          if (haveIntersection(target, shape)) {
            //group.scale({x:2, y:2})
            const name = shape.attrs.name
            const location = name.includes("right")?"right":
                        name.includes("left")?"left":
                        name.includes("top")?"top":
                        "bottom"
            setDestination({id: shape.parent?.attrs.id, anchorLocation: location, connectionOption: defaultConnectionOption.destination})
            shape.fill(mainTheme.secondary);
          } else {
            if (shape.attrs.name.includes(destination?.anchorLocation) && shape.parent?.attrs.id === destination?.id) {
              setDestination(null)
            }
            shape.fill('black');
          }
        })
    }

    const haveIntersection = (currentPoint:LocationType, shape:Konva.default.Shape) => {
      if (typeof shape.attrs.width === "number" && typeof shape.attrs.height === "number") {
        return (
          currentPoint.x > shape.attrs.x &&
          currentPoint.x < shape.attrs.x + shape.attrs.width &&
          currentPoint.y > shape.attrs.y &&
          currentPoint.y < shape.attrs.y + shape.attrs.height
        );
      } else if (typeof shape.attrs.radius === "number") {
        const circleAbsolutePosition = shape.absolutePosition()
        console.log("you are here")
        return (
          currentPoint.x > circleAbsolutePosition.x - (shape.attrs.radius)&&
          currentPoint.x < circleAbsolutePosition.x + (shape.attrs.radius) &&
          currentPoint.y > circleAbsolutePosition.y - (shape.attrs.radius) &&
          currentPoint.y < circleAbsolutePosition.y + (shape.attrs.radius)
        )
      }else return false
    }

    
  return (
    <Circle
      x={x}
      y={y}
      radius={7}
      fill={color}
      draggable
      dragBoundFunc={() => dragBounds()}
      perfectDrawEnabled={false}
      ref={anchorRef}
      onDragStart={handleAnchorDragStart}
      onDragMove={handleAnchorDragMove}
      onDragEnd={handleAnchorDragEnd}
      onMouseEnter={() => setColor(mainTheme.secondary)}
      onMouseLeave={() => setColor("black")}
      name={`connectable ${location}`}
    />
  )
}

export default Anchor