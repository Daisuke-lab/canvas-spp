import React, {useEffect, useState} from 'react'
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import dynamic from 'next/dynamic';
import EditableText from './EditableText';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import ERDiagram from './ERDiagram'
import CustomMenu from './CustomMenu';
import {addRow, openMenu, updateEnabledItems} from "../../store/reducers/canvasReducer"
function Conva() {
    const [selectedId, setSelectedId] = useState<string>('')
    const stageRef = React.useRef<HTMLCanvasElement>()
    const dispatch = useAppDispatch()
    const state = useAppSelector(state => state)
    const tables = useAppSelector(state => state.canvases.tables)
    const display = useAppSelector(state => state.canvases.displayMenu.display)
    const handleRightClick = (event:any) => {
      event?.preventDefault();
      console.log("this is event in conva")
      if (!display) {
        dispatch(openMenu({x: event.clientX, y:event.clientY}))
      dispatch(updateEnabledItems(["add-table", "delete-table"]))
      }

  }
    return (
      <div  onContextMenu={handleRightClick} id="canvas-container">
        <Stage width={window.innerWidth} height={window.innerHeight} ref={stageRef}>
      <Layer>
        {/* <EditableText key={`ERDiagram-${1}`}
        isSelected={selectedId === `ERDiagram-${1}`}
        onSelect={() => {
            setSelectedId(`ERDiagram-${1}`);
          }}
        stageRef={stageRef}
        /> */}
        {tables.map((table, index) => (
          <ERDiagram dispatch={dispatch} state={state} key={`er-diagram-${table.id}`} table={table}/>))}
      </Layer>
    </Stage>
    <CustomMenu/>
    </div>
    )
}

export default Conva
