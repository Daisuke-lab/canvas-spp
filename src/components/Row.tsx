import React, {useEffect, useState, useRef} from 'react';
import { Stage, Layer, Rect, Group, Text, Transformer, Line } from 'react-konva';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import {closeMenu, openMenu, updateEnabledItems} from '../../store/reducers/canvasReducer'
import {RowType, TableType, updateCurrentTable, updateCurrentRow} from '../../store/reducers/canvasReducer'
import EditableText from './EditableText'

interface Props {
    index: number,
    table: TableType,
    titleHeight: number,
    dispatch: any,
    state: any,
    row: RowType,
    stageRef: any,
    rowHeight: number,
    erDiagramWidth: number,
    erDiagramRef: any

}

function Row(props:Props) {
    const {index, table, titleHeight, dispatch, state, row, stageRef,
    rowHeight, erDiagramWidth, erDiagramRef} = props
    const currentTable = state.canvases.currentTable
    const currentRow = state.canvases.currentRow
    const fieldWidth = erDiagramWidth / 2
    const editingField = state.canvases.editingField
    const onRowRightClick = (event: any) => {
      if (row === currentRow) {
        const target = event.currentTarget
        console.log('row clicked')
        dispatch(openMenu({x: target.parent.attrs.x, y:target.parent.attrs.y}))
        dispatch(updateEnabledItems(["delete-row","add-row", "delete-table"]))
      }
    }

    const onClick = () => {
      console.log("row clicked")
        if (table === currentTable && row !== currentRow) {
          console.log(row)
          console.log(currentRow)
          dispatch(updateCurrentRow(row))
          dispatch(updateCurrentTable(table))
        } else if (table !== currentTable) {
          console.log("you are updating table from row")
          dispatch(updateCurrentTable(table))
        } else {
          console.log(table === currentTable)
          console.log(editingField)
        }
    }
  return (
    <Group onContextMenu={onRowRightClick} onClick={onClick}>
          <Line
          x={0}
          y={rowHeight*(index+1) + titleHeight}
          stroke="#432818"
          strokeWidth={1}
          tension={1}
          points={[0,0, erDiagramWidth,0]}
          />

          <Line
          x={0}
          y={rowHeight*index + titleHeight}
          stroke="#432818"
          strokeWidth={1}
          tension={1}
          points={[0,0, 0,rowHeight]}
          />
          <EditableText
          onSelect={onClick}
          isSelected={currentRow === row}
          text={row.key}
          field="key"
          dispatch={dispatch}
          state={state}
          stageRef={stageRef}
          erDiagramRef={erDiagramRef}
          x={0}
          y={rowHeight*index + titleHeight}
          width={fieldWidth}
          height={rowHeight}
          row={row}
          table={table}
          />
            <Line
          x={fieldWidth}
          y={rowHeight*index + titleHeight}
          stroke="#432818"
          strokeWidth={1}
          tension={1}
          points={[0,0, 0,rowHeight]}
          />
          <EditableText
            onSelect={onClick}
            isSelected={currentRow === row}
            text={row.value}
            field="value"
            dispatch={dispatch}
            state={state}
            stageRef={stageRef}
            x={fieldWidth}
            y={rowHeight*index + titleHeight}
            width={fieldWidth}
            height = {rowHeight}
            erDiagramRef={erDiagramRef}
            row={row}
            table={table}
            />
            <Line
          x={fieldWidth * 2}
          y={rowHeight*index + titleHeight}
          stroke="#432818"
          strokeWidth={1}
          tension={1}
          points={[0,0, 0,rowHeight]}
          />
          {currentRow === row?
          <Rect 
          stroke="#99582A"
          strokeWidth={1.2}
          zIndex={15}
          x={0}
          y={rowHeight*index + titleHeight}
          width={erDiagramWidth}
          height={rowHeight}
          />
          :<></>}
        </Group>
  )
}

export default Row