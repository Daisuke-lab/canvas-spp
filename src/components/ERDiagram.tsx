import React, {useEffect, useState, useRef} from 'react';
import { Stage, Layer, Rect, Group, Text, Transformer, Line } from 'react-konva';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import {closeMenu, openMenu, updateEnabledItems} from '../../store/reducers/canvasReducer'
import {RowType, TableType, updateCurrentTable} from '../../store/reducers/canvasReducer'
import Row from './Row';
import EditableText from './EditableText'
import Border from './Border'


interface Props {
    dispatch: any,
    state: any,
    table: TableType,
    stageRef: any
}
function ERDiagram(props:Props) {
    const {dispatch, state, table, stageRef} = props;
    const tables = state?.canvases?.tables !== undefined ?state?.canvases?.tables:[]
    const currentTable = state.canvases.currentTable
    const tableIndex = tables.indexOf(table)
    const editingField = state.canvases.editingField
    const editingFieldNum = state.canvases.editingFieldNum
    const trRef = useRef() as any
    const erDiagramRef = useRef() as any
    const display = state.canvases.displayMenu.display
    const handleRightClick = (event: any) => {
        if (!display) {
          console.log('this is event in erdiagram')
        const target = event.currentTarget
        dispatch(openMenu({x: target.attrs.x, y:target.attrs.y}))
        dispatch(updateEnabledItems(["add-row", "copy", "delete-table"]))
        dispatch(updateCurrentTable(table))
        }
    }

    const onClick = () => {
      console.log('er diagram clicked')
        const tr = trRef?.current
        dispatch(updateCurrentTable(table))
        if (tr !== undefined && tr !== null && currentTable === table) {
            tr.nodes([erDiagramRef?.current])
        }
    }
    const titleHeight = 20
    const erDiagramWidth = 100
    const rowHeight = 15
  return (<><Group 
        draggable={editingField?.tableIndex !== tableIndex && table === currentTable}
        onContextMenu={handleRightClick}
        ref={erDiagramRef}
        width={erDiagramWidth}
        height={20}
        >
          <Border targetRef={erDiagramRef} state={state} dispatch={dispatch}/>
          <Rect
            x={0}
            y={0}
            width={erDiagramWidth}
            height={titleHeight}
            strokeWidth={1}
            stroke="black"
            onClick={onClick}
            />
        <EditableText
        onSelect={onClick}
        isSelected={currentTable === table}
        text={table.title}
        field="title"
        dispatch={dispatch}
        state={state}
        stageRef={stageRef}
        width={erDiagramWidth}
        height={titleHeight}
        erDiagramRef={erDiagramRef}
        table={table}
        row={null}
        />
      {table.rows.map((row, index:number) => (
          <Row index={index} dispatch={dispatch} state={state} titleHeight={titleHeight}
          stageRef={stageRef} erDiagramRef={erDiagramRef}
          table={table} key={`${table.id}-row-${index}`} row={row}
          erDiagramWidth={erDiagramWidth} rowHeight={rowHeight}/>
        ))}
        <Line
          x={0}
          y={rowHeight*(table.rows.length) + titleHeight}
          stroke="black"
          strokeWidth={1}
          tension={1}
          points={[0,0, erDiagramWidth,0]}
          />
        </Group>
        {editingField?.tableIndex !== tableIndex && table === currentTable?
        <Transformer
        ref={trRef}
        boundBoxFunc={(oldBox, newBox) => {
          // limit resize
          if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />:
      <></>
        }
        </>)
}

export default ERDiagram;
