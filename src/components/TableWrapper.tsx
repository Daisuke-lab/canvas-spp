//rowも含めて、heightとして認識させるためのrect
//ちなみにborderをrectにすると、rectのborderが隠れて機能しないのでこれを用いる。

import React from 'react'
import TableType from '../../types/TableType'
import * as Konva from "konva"
import { Stage, Layer, Rect, Text, Line, Transformer } from "react-konva";
import {defaultTitleHeight, defaultErDiagramWidth, defaultRowHeight} from "./ERDiagram"

interface Props {
    table: TableType,
    tableRef: React.RefObject<Konva.default.Group>
}
function TableWrapper(props:Props) {
    const {table, tableRef} = props
    const x = tableRef.current?.attrs.x;
    const y = tableRef.current?.attrs.y;
    console.log(tableRef.current)
    const width = defaultErDiagramWidth
    const height = (defaultTitleHeight + table.rows.length * defaultRowHeight)
  return (
    <Rect x={0} y={0} width={width} height={height} fill="red"/>
  )
}

export default TableWrapper