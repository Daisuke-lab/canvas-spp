import React, {useEffect, useState} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import {closeMenu, addRow, addTable, deleteRow, deleteTable, deleteConnection, TableType} from '../../store/reducers/canvasReducer'
import uuid from 'react-uuid'
import backendAxios from '../helpers/axios';
function CustomMenu() {
const dispatch = useAppDispatch()
const displayMenu = useAppSelector(state => state.canvases.displayMenu)
const enabledItems = useAppSelector(state => state.canvases.enabledItems)
const currentTable = useAppSelector(state=> state.canvases.currentTable)
const currentRow = useAppSelector(state => state.canvases.currentRow)
const currentConnectionId = useAppSelector(state => state.canvases.currentConnectionId)
const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
useEffect(()=> {
    const newDiv = document.createElement("div");
    newDiv.style.position = "absolute"
    newDiv.style.left = displayMenu.x + "px"
    newDiv.style.top = displayMenu.y + "px"
    //newDiv.style.display = "none"
    const canvasContainer = document.getElementById("canvas-container")
    canvasContainer?.appendChild(newDiv)
    setAnchorEl(newDiv)
}, [displayMenu.display])
const tableData = {
    title: {id: uuid(), content:"this is title", style:{fontFamily:"Caribri"}},
    rows: [],
    id: uuid(),
    x: displayMenu.x,
    y: displayMenu.y,
    rotation: 0,
    scale: {x:1,y:1}    
} as TableType

const rowData = {
    key: {id: uuid(), content:"Field", style:{fontFamily:"Caribri"}},
    value:{id: uuid(), content:"Integer", style:{fontFamily:"Caribri"}}
}

const createTable = async () => {
    try {
     const res = await backendAxios.post("api/v1/erDiagram", tableData)
     console.log(res)
     dispatch(addTable(res.data))   
    } catch(err) {
        console.log(err)
    }
}

const deleteERDiagram = async () => {
    try {
        const res = await backendAxios.delete(`api/v1/erDiagram/${currentTable?.id}`)
        console.log(res)
        dispatch(deleteTable())
    } catch(err) {
        console.log(err)
    }
}


const onAddRow = async () => {
    try {
        const res = await backendAxios.post(`api/v1/row/${currentTable?.id}`, rowData)
        console.log(res)
        dispatch(addRow(rowData))
        console.log(res)
    } catch(err) {
        console.log(err)
    }
}

const onDeleteRow = async () => {
    try {
        const res = await backendAxios.delete(`api/v1/row/${currentTable?.id}/${currentRow?.id}`)
        dispatch(deleteRow())
    } catch (err) {
        console.log(err)
    }
}

const onDeleteConnection = async () => {
    try {
        const res = await backendAxios.delete(`api/v1/connection/${currentConnectionId}`)
        console.log(res)
        dispatch(deleteConnection())
    } catch(err) {
        console.log(err)
    }
}

  return <div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={displayMenu.display}
                onClose={() => dispatch(closeMenu())}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={onAddRow}
                 disabled={!enabledItems.includes("add-row")}>Add Row</MenuItem>
                <MenuItem onClick={onDeleteRow} disabled={!enabledItems.includes("delete-row")}>Delete Row</MenuItem>
                <MenuItem onClick={createTable} disabled={!enabledItems.includes("add-table")}>Add Table</MenuItem>
                <MenuItem onClick={deleteERDiagram} disabled={!enabledItems.includes("delete-table")}>Delete Table</MenuItem>
                <MenuItem onClick={onDeleteConnection} disabled={!enabledItems.includes("delete-connection")}>Delete Connection</MenuItem>
                <MenuItem onClick={() => dispatch(closeMenu())} disabled={!enabledItems.includes("copy")}>Copy</MenuItem>
            </Menu>
        </div>
            }



            
export default CustomMenu;
