import React from 'react'
import { AppDispatch, RootState } from '../../store/store'
import AnchorLocationType from '../../types/AnchorLocationType'
import TableType from '../../types/TableType'
import {TOP, LEFT, RIGHT, BOTTOM, TABLE} from "../constant"
import Anchor from './Anchor'
import * as Konva from "konva"
import {anchorDistance, getRowsLength} from "../helpers/getAnchorPoint"
import getMarginalLinePoints from '../helpers/getMarginalLinePoints'
import { Stage, Layer, Rect, Text, Line, Transformer } from "react-konva";
import ShapeType from '../../types/ShapeType'
import { defaultRowHeight } from './ERDiagram'


interface Props {
    table: TableType,
    state: RootState,
    dispatch: AppDispatch,
    targetRef: React.RefObject<Konva.default.Shape | Konva.default.Group>,
    hovered: boolean
}
function Anchors(props:Props) {
    const {table, state, dispatch, targetRef, hovered} = props
    const locations:AnchorLocationType[] = [TOP, LEFT, RIGHT, BOTTOM]

    const connectionPreview = state.canvases.connectionPreview

    const width = (targetRef.current?.attrs.width * targetRef.current?.attrs.scaleX) + anchorDistance*4
    let height = (targetRef.current?.attrs.height * targetRef.current?.attrs.scaleY) + anchorDistance*4
    const x = targetRef.current?.attrs.x - anchorDistance*2
    const y = targetRef.current?.attrs.y - anchorDistance*2
    if (targetRef.current?.attrs.name === TABLE) {
      const rowsLength = getRowsLength(targetRef as React.RefObject<Konva.default.Group>)
      height += rowsLength * defaultRowHeight * targetRef.current?.attrs.scaleY
  }

  return (
    <>
    <Rect x={x} y={y} width={width} height={height}/>
    {(hovered  || connectionPreview != null) && locations.map((location, index) => (
     <><Anchor location={location} key={`${table.id}_anchor_${location}`}
     {...props}/>
     
     </>))}
     
    </>
  )
}

export default Anchors