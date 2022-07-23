import React, {useEffect, useState} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import {closeMenu, addRow, addTable, deleteRow, deleteTable, deleteConnection} from '../../store/reducers/canvasReducer'
import TableType from '../../types/TableType'
import { v4 as uuid } from 'uuid';
import getAxios from '../helpers/getAxios';
import { useRouter } from 'next/router'
import { useSession,getSession } from "next-auth/react"
import { CustomSessionType } from '../../types';
import { CAN_EDIT, OWNER, RESTRICTED } from '../constant';




function CustomMenu() {
const dispatch = useAppDispatch()
const displayMenu = useAppSelector(state => state.canvases.displayMenu)
const enabledItems = useAppSelector(state => state.canvases.enabledItems)
const currentTable = useAppSelector(state=> state.canvases.currentTable)
const currentRow = useAppSelector(state => state.canvases.currentRow)
const currentConnection = useAppSelector(state => state.canvases.currentConnection)
const currentPermission = useAppSelector(state => state.canvases.currentPermission)
const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
const router = useRouter()
const {data: session} = useSession()
const axios = getAxios(session as CustomSessionType | null)
const canEdit = [CAN_EDIT, OWNER].includes(currentPermission) 
let roomId:string | string[] | undefined = undefined
    if (router !== null) {
      roomId = router.query.id
    }


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
    title: {id: uuid(), content:"this is title", style:{fontFamily:"Caribri"}, updatedBy: session?.id},
    rows: [],
    x: displayMenu.x,
    y: displayMenu.y,
    rotation: 0,
    scale: {x:1,y:1},
    roomId: roomId,
    updatedBy: session?.id,
}

const rowData = {
    id: uuid(),
    key: {id: uuid(), content:"Field", style:{fontFamily:"Caribri"}, updatedBy: session?.id},
    value:{id: uuid(), content:"Integer", style:{fontFamily:"Caribri"}, updatedBy: session?.id},
    updatedBy: session?.id
}

const createTable = async () => {
    try {
     const res = await axios.post("api/v1/erDiagram", tableData)
     console.log(res)
     //dispatch(addTable(res.data))   
    } catch(err) {
        console.log(err)
    }
}

const deleteERDiagram = async () => {
    try {
        const res = await axios.delete(`api/v1/erDiagram/${currentTable?.id}`)
        console.log(res)
        //dispatch(deleteTable(currentTable))
    } catch(err) {
        console.log(err)
    }
}


const onAddRow = async () => {
    try {
        const res = await axios.post(`api/v1/row/${currentTable?.id}`, rowData)
        console.log(res)
    } catch(err) {
        console.log(err)
    }
}

const onDeleteRow = async () => {
    try {
        const res = await axios.delete(`api/v1/row/${currentTable?.id}/${currentRow?.id}`)
    } catch (err) {
        console.log(err)
    }
}

const onDeleteConnection = async () => {
    try {
        const res = await axios.delete(`api/v1/connection/${currentConnection?.id}`)
        console.log(res)
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
                 disabled={!enabledItems.includes("add-row") || !canEdit}>Add Row</MenuItem>
                <MenuItem onClick={onDeleteRow} disabled={!enabledItems.includes("delete-row") || !canEdit}>Delete Row</MenuItem>
                <MenuItem onClick={createTable} disabled={!enabledItems.includes("add-table") || !canEdit}>Add Table</MenuItem>
                <MenuItem onClick={deleteERDiagram} disabled={!enabledItems.includes("delete-table") || !canEdit}>Delete Table</MenuItem>
                <MenuItem onClick={onDeleteConnection} disabled={!enabledItems.includes("delete-connection") || !canEdit}>Delete Connection</MenuItem>
                <MenuItem onClick={() => dispatch(closeMenu())} disabled={!enabledItems.includes("copy") || !canEdit} >Copy</MenuItem>
            </Menu>
        </div>
            }



            
export default CustomMenu;
