import React, {useEffect, useState, useRef} from 'react';
import { Stage, Layer, Rect, Group, Text, Transformer, Line } from 'react-konva';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import {closeMenu, openMenu, updateEnabledItems} from '../../store/reducers/canvasReducer'
import {updateCurrentTable, updateCurrentRow} from '../../store/reducers/canvasReducer'
import {TableType, RowType} from "../../types"
import EditableText from './EditableText'

import { AppDispatch, RootState } from '../../store/store';
import * as Konva from "konva"
import CurrentRowDecoration from './CurrentRowDecoration';
interface Props {
    index: number,
    table: TableType,
    titleHeight: number,
    dispatch: AppDispatch,
    state: RootState,
    row: RowType,
    stageRef: React.RefObject<Konva.default.Stage>,
    rowHeight: number,
    erDiagramWidth: number,
    erDiagramRef: React.RefObject<Konva.default.Group>

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
        dispatch(openMenu({x: target.parent.attrs.x, y:target.parent.attrs.y}))
        dispatch(updateEnabledItems(["delete-row","add-row", "delete-table"]))
      }
    }

    const onClick = () => {
      console.log('row clicked')
        if (table === currentTable && row !== currentRow) {
          dispatch(updateCurrentRow(row))
          dispatch(updateCurrentTable(table))
        } else if (table !== currentTable) {
          dispatch(updateCurrentTable(table))
        }
    }
  return (
    <Group onContextMenu={onRowRightClick} onClick={onClick}>
          <Line
          x={0}
          y={rowHeight*(index+1) + titleHeight}
          stroke="black"
          strokeWidth={1}
          tension={1}
          points={[0,0, erDiagramWidth,0]}
          />

          <Line
          x={0}
          y={rowHeight*index + titleHeight}
          stroke="black"
          strokeWidth={1}
          tension={1}
          points={[0,0, 0,rowHeight]}
          />
          <EditableText
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
            <Line
          x={fieldWidth * 2}
          y={rowHeight*index + titleHeight}
          stroke="black"
          strokeWidth={1}
          tension={1}
          points={[0,0, 0,rowHeight]}
          />
          <EditableText
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
            {currentRow === row?
          <CurrentRowDecoration
          x={0}
          y={rowHeight*(index) + titleHeight}
          erDiagramWidth={erDiagramWidth}
          rowHeight={rowHeight}
          />
          :<></>}
        </Group>
  )
}

export default Row