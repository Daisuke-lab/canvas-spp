import React, {useEffect, useState, useRef} from 'react';
import { Stage, Layer, Rect, Group, Text, Transformer, Line } from 'react-konva';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import {closeMenu, openMenu, updateEnabledItems} from '../../store/reducers/canvasReducer'
import {RowType, TableType, updateCurrentTable} from '../../store/reducers/canvasReducer'
import Row from './Row';
import EditableText from './EditableText'


interface Props {
    dispatch: any,
    state: any,
    table: TableType
}
function ERDiagram(props:Props) {
    const {dispatch, state, table} = props;
    const tables = state?.canvases?.tables !== undefined ?state?.canvases?.tables:[]
    const currentTable = state.canvases.currentTable
    const trRef = useRef() as any
    const erDiagramRef = useRef() as any
    const display = state.canvases.displayMenu.display
    const handleRightClick = (event: any) => {
        if (!display) {
          console.log('this is event in erdiagram')
        const target = event.currentTarget
        dispatch(openMenu({x: target.attrs.x, y:target.attrs.y}))
        dispatch(updateEnabledItems(["add-row", "copy"]))
        dispatch(updateCurrentTable(table))
        }
    }

    const onClick = () => {
        const tr = trRef?.current
        if (tr !== undefined && tr !== null) {
          dispatch(updateCurrentTable(table))
            tr.nodes([erDiagramRef?.current])
        }
    }
    const titleHeight = 20
  return (<><Group 
        draggable
        onContextMenu={handleRightClick}
        ref={erDiagramRef}
        onClick={onClick}
        >
        <EditableText
        onSelect={onClick}
        isSelected={currentTable === table}
        text={table.title}
        field="title"
        dispatch={dispatch}
        />
          {/* <Text
            fontFamily='Calibri'
            fill='red'
            text={table.title}
            x={0}
            y={0}
            /> */}
      {table.rows.map((row, index:number) => (
          <Row index={index} dispatch={dispatch} state={state} titleHeight={titleHeight}
          table={table} key={`${table.id}-row-${index}`} row={row}/>
        ))}
        <Line
          x={0}
          y={15*(table.rows.length) + titleHeight}
          stroke="black"
          strokeWidth={1}
          tension={1}
          points={[0,0, 60,0]}
          />
        </Group>
        <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                // limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
        </>)
}

export default ERDiagram;
