import React, {useEffect, useState} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import {closeMenu, addRow, addTable, deleteRow} from '../../store/reducers/canvasReducer'
import uuid from 'react-uuid'
function CustomMenu() {
const dispatch = useAppDispatch()
const displayMenu = useAppSelector(state => state.canvases.displayMenu)
const enabledItems = useAppSelector(state => state.canvases.enabledItems)
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
    title: "this is title",
    rows: [],
    id: uuid()
    
    
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
                <MenuItem onClick={() => dispatch(addRow({key: "key", value: "value1", id: uuid()}))}
                 disabled={!enabledItems.includes("add-row")}>Add Row</MenuItem>
                <MenuItem onClick={() => dispatch(deleteRow())} disabled={!enabledItems.includes("delete-row")}>Delete Row</MenuItem>
                <MenuItem onClick={() => dispatch(addTable(tableData))} disabled={!enabledItems.includes("add-table")}>Add Table</MenuItem>
                <MenuItem onClick={() => dispatch(closeMenu())} disabled={!enabledItems.includes("delete-table")}>Delete Table</MenuItem>
                <MenuItem onClick={() => dispatch(closeMenu())} disabled={!enabledItems.includes("copy")}>Copy</MenuItem>
            </Menu>
        </div>
            }



            
export default CustomMenu;
