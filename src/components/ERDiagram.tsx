import React, {useEffect, useState, useRef} from 'react';
import { Stage, Layer, Rect, Group, Text, Transformer, Line } from 'react-konva';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import {closeMenu, openMenu, updateCurrentRoom, updateEnabledItems} from '../../store/reducers/canvasReducer'
import {updateCurrentTable, updateTable, addHistory} from '../../store/reducers/canvasReducer'
import Row from './Row';
import EditableText from './EditableText'
import Border from './Border'
import backendAxios from '../helpers/getAxios';
import { RootState, AppDispatch } from '../../store/store';
import {CustomSessionType, TableType} from "../../types"
import { useSession } from 'next-auth/react';
import getAxios from '../helpers/getAxios';
import { CAN_EDIT, OWNER, TABLE } from '../constant';
import Anchors from './Anchors';
import { SettingsInputAntenna } from '@mui/icons-material';
import TableWrapper from './TableWrapper';

export const defaultTitleHeight = 20
export const defaultErDiagramWidth = 100
export const defaultRowHeight = 15


interface Props {
    dispatch: AppDispatch,
    state: RootState,
    table: TableType,
    stageRef: any
}
function ERDiagram(props:Props) {
    const {dispatch, state, table, stageRef} = props;
    const historyStep = state.canvases.historyStep
    const tables = state?.canvases?.tables !== undefined ?state?.canvases?.tables:[]
    const currentTableId = state.canvases.currentTable?.id
    const currentTable = tables.find((table) => table.id === currentTableId)
    const currentPermission = state.canvases.currentPermission
    const currentRoom = state.canvases.currentRoom
    const canEdit = [CAN_EDIT, OWNER].includes(currentPermission)
    const [initialLocation, setInitialLocation] = useState<{x:number,y:number}>({x: table.x, y:table.y})
    const tableIndex = tables.indexOf(table)
    const editingField = state.canvases.editingField
    const connectionPreview = state.canvases.connectionPreview
    const trRef = useRef() as any
    const currentRow = state.canvases.currentRow
    const erDiagramRef = useRef() as any
    const display = state.canvases.displayMenu.display
    const session = state.users.session
    const axios = getAxios(session as CustomSessionType | null)
    const [hovered, setHovered] = useState<boolean>(false)




    useEffect(() => {
      setInitialLocation({x: table.x, y:table.y})
      console.log("history step changed")
    }, [historyStep])
    const handleRightClick = (event: any) => {
      const target = event.currentTarget
        if (!display && table === currentTable && currentRow === null) {
        dispatch(openMenu({x: target.attrs.x, y:target.attrs.y}))
        dispatch(updateEnabledItems(["add-row", "copy", "delete-table"]))
        }

    }

    const onClick = (event:any) => {


        const tr = trRef?.current
        if (currentTable !== table) {
          dispatch(updateCurrentTable(table))
        }
        if (tr !== undefined && tr !== null && currentTable === table) {
            tr.nodes([erDiagramRef?.current])
        }
    }

    useEffect(() => {
      const tr = trRef?.current
      if (tr !== undefined && tr !== null && editingField?.tableIndex !== tableIndex && table.id === currentTable?.id) {
        tr.nodes([erDiagramRef?.current])
    }
    }, [table.rows.length, currentTable])

    const handleDragMove = (e:any) => {
      const position = e.target.position();
      const stage = e.target.getStage();
      const newTable = {
        ...table,
        x: position.x,
        y: position.y,
        scale: erDiagramRef.current.scale(),
        rotation: erDiagramRef.current.rotation()
      }
      if (table.id === currentTable?.id && connectionPreview === null) {
        dispatch(updateTable(newTable))
      }
      
    }

    const onTransform = (e:any) => {
      const position = e.target.position();
      const newTable = {
        ...table,
        x: position.x,
        y: position.y,
        scale: erDiagramRef.current.scale(),
        rotation: erDiagramRef.current.rotation(),
        updatedBy: session?.id
      }
      if (table.id === currentTable?.id && connectionPreview === null) {
        dispatch(updateTable(newTable))
      }
    }
    const handleDragEnd = async (e:any) => {
      
      try {
        const res = await axios.put(`/api/v1/erDiagram/${currentTable?.id}`, currentTable)
        console.log(res)
        dispatch(addHistory())
      } catch(err) {
        console.log(err)
      }

      try {
        const newRoom = {...currentRoom, previewImg: stageRef.current?.toDataURL()}
        const res = await axios.put(`/api/v1/room/${currentRoom?.id}`, newRoom)
        dispatch(updateCurrentRoom(newRoom))
        console.log(res)
      } catch (err) {
        console.log(err)
      }
      
    }

    const onTransformEnd = async (e:any) => {
      try {
        const res = await axios.put(`/api/v1/erDiagram/${currentTable?.id}`, currentTable)
        console.log(res)
      } catch(err) {
        console.log(err)
      }
      try {
        const newRoom = {...currentRoom, previewImg: stageRef.current?.toDataURL()}
        const res = await axios.put(`/api/v1/room/${currentRoom?.id}`, newRoom)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    }
  return (<>
  <Group
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  id={table.id}>
    <Anchors targetRef={erDiagramRef} state={state} dispatch={dispatch} table={table} hovered={hovered}/>
  <Group 
        draggable={editingField?.tableIndex !== tableIndex && table.id === currentTable?.id && canEdit}
        onContextMenu={handleRightClick}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        ref={erDiagramRef}
        width={defaultErDiagramWidth}
        onTransform={onTransform}
        onTransformEnd={onTransformEnd}
        height={defaultTitleHeight}
        onClick={onClick}
        x={initialLocation.x}
        y={initialLocation.y}
        rotation={table.rotation}
        scale={table.scale}
        name={TABLE}
        >
          <Border targetRef={erDiagramRef} state={state} dispatch={dispatch} id={table.id}/>
        <EditableText
        isSelected={currentTable === table}
        text={table.title}
        field="title"
        dispatch={dispatch}
        state={state}
        stageRef={stageRef}
        width={defaultErDiagramWidth}
        height={defaultTitleHeight}
        erDiagramRef={erDiagramRef}
        table={table}
        row={null}
        />
      {table.rows.map((row, index:number) => (
          <Row index={index} dispatch={dispatch} state={state} titleHeight={defaultTitleHeight}
          stageRef={stageRef} erDiagramRef={erDiagramRef}
          table={table} key={`${table.id}-row-${index}`} row={row}
          erDiagramWidth={defaultErDiagramWidth} rowHeight={defaultRowHeight}/>
        ))}
        <Line
          x={0}
          y={defaultRowHeight*(table.rows.length) + defaultTitleHeight}
          stroke="black"
          strokeWidth={1}
          tension={1}
          points={[0,0, defaultErDiagramWidth,0]}
          />
        </Group>
        
        </Group>
        {editingField?.tableIndex !== tableIndex && table.id === currentTable?.id && canEdit?
        <>
        <Transformer
        ref={trRef}
        name={`${table.id}`}
        boundBoxFunc={(oldBox, newBox) => {
          // limit resize
          if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
      </>:
      <></>
        }
        </>)
}

export default ERDiagram;
