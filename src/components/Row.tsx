import React, {useEffect, useState, useRef} from 'react';
import { Stage, Layer, Rect, Group, Text, Transformer, Line } from 'react-konva';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import {closeMenu, openMenu, updateEnabledItems} from '../../store/reducers/canvasReducer'
import {RowType, TableType, updateCurrentTable, updateCurrentRow} from '../../store/reducers/canvasReducer'


interface Props {
    index: number,
    table: TableType,
    titleHeight: number,
    dispatch: any,
    state: any,
    row: RowType

}

function Row(props:Props) {
    
    const {index, table, titleHeight, dispatch, state, row} = props
    const currentTable = state.canvases.currentTable
    const currentRow = state.canvases.currentRow
    const onRowRightClick = (event: any) => {
      if (row === currentRow) {
        console.log('right click in row')
        const target = event.currentTarget
        console.log(target)
        console.log({x: target.parent.attrs.x, y:target.parent.attrs.y})
        dispatch(openMenu({x: target.parent.attrs.x, y:target.parent.attrs.y}))
        dispatch(updateEnabledItems(["delete-row"]))
      }
    }

    const onClick = () => {
        console.log('it clicked', index)
        if (table === currentTable) {
          dispatch(updateCurrentRow(row))
        }
    }
  return (
    <Group onContextMenu={onRowRightClick} onClick={onClick}>
          <Line
          x={0}
          y={15*index + titleHeight}
          stroke="black"
          strokeWidth={1}
          tension={1}
          points={[0,0, 0,15]}
          />
          <Text
            fontFamily='Calibri'
            fill='red'
            text="test2"
            x={0}
            y={15*index + titleHeight}
            />
            <Line
          x={30}
          y={15*index + titleHeight}
          stroke="black"
          strokeWidth={1}
          tension={1}
          points={[0,0, 0,15]}
          />
          <Text
          fontFamily='Calibri'
          fill='green'
          text="test"
          x={30}
          y={15*index + titleHeight}
            />
            <Line
          x={60}
          y={15*index + titleHeight}
          stroke="black"
          strokeWidth={1}
          tension={1}
          points={[0,0, 0,15]}
          />
          {currentRow === row?
          <Rect 
          stroke="blue"
          strokeWidth={1.2}
          x={0}
          y={15*index + titleHeight}
          width={60}
          height={15}
          />
          :<></>}
        </Group>
  )
}

export default Row