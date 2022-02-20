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
    const onRowRightClick = (event: any) => {
      if (row === currentRow) {
        console.log('right click in row')
        const target = event.currentTarget
        dispatch(openMenu({x: target.parent.attrs.x, y:target.parent.attrs.y}))
        dispatch(updateEnabledItems(["delete-row","add-row"]))
      }
    }

    const onClick = () => {
        console.log('it clicked', index)
        if (table === currentTable && row !== currentRow) {
          console.log(row)
          console.log(currentRow)
          dispatch(updateCurrentRow(row))
        }
    }
  return (
    <Group onContextMenu={onRowRightClick} onClick={onClick}>
      {currentRow === row?
          <Rect 
          stroke="blue"
          strokeWidth={1.2}
          x={0}
          y={rowHeight*index + titleHeight}
          width={erDiagramWidth}
          height={rowHeight}
          />
          :<></>}

          <Line
          x={0}
          y={rowHeight*index + titleHeight}
          stroke="black"
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
          stroke="black"
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
          stroke="black"
          strokeWidth={1}
          tension={1}
          points={[0,0, 0,rowHeight]}
          />
          
        </Group>
  )
}

export default Row