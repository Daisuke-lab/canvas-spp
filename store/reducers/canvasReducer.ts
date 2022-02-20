
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface RowType {
    key: string,
    value: string,
    id: string
}

export interface TableType {
    rows: RowType[],
    id: string,
    title: string
}

interface ConnectionType {
    source: {x: number, y:number},
    destination: {x:number, y:number}
}
interface StateType {
    tables: TableType[],
    displayMenu: {
        display: boolean,
        x: number,
        y: number
    },
    enabledItems: string[],
    currentTable: TableType | null,
    currentRow: RowType | null,
    editingField: {text: string, field:string, tableIndex:number, rowIndex:number} | null,
    connectionPreview: ConnectionType | null,
    connections: ConnectionType[]
}



const initialState:StateType = {
    tables: [],
    displayMenu: {
        display: false,
        x: 0,
        y: 0
    },
    enabledItems: [],
    currentTable: null,
    currentRow:  null,
    editingField: null,
    connectionPreview: null,
    connections: []

}


export const canvasSlice = createSlice({
    name: 'canvases',
    initialState: initialState,
    reducers: {
      insertRows: (state, action) => {
          state.tables = action.payload
          state.displayMenu.display = false
      },
      openMenu: (state, action) => {
          state.displayMenu = {...state.displayMenu, display: true, ...action.payload}
      },
      closeMenu: (state) => {
          state.displayMenu.display = false
          state.currentTable = null
      },
      addRow: (state, action) => {
          const newTables = state.tables.filter(table => table.id !== state.currentTable?.id)
          if (state.currentTable !== null) {
            state.currentTable.rows = [...state.currentTable.rows, action.payload]
            state.tables = [...newTables, state.currentTable]
          }
          state.displayMenu.display = false
      },
      deleteRow: (state) => {
        const newTables = state.tables.filter(table => table.id !== state.currentTable?.id)
        if (state.currentTable !== null && state.currentRow !== null) {
          state.currentTable.rows = state.currentTable.rows.filter(row => row.id !== state.currentRow?.id)
          state.tables = [...newTables, state.currentTable]
          state.currentRow = null
        }
        state.displayMenu.display = false 
      },
      addTable: (state, action) => {
          state.tables = [...state.tables, action.payload]
          state.displayMenu.display = false
      },
      deleteTable: (state) => {
          state.tables = state.tables.filter((table) => table.id !== state.currentTable?.id)
          state.currentTable = null
          state.displayMenu.display = false
      },
      updateEnabledItems: (state, action) => {
          state.enabledItems = action.payload
      },
      updateCurrentTable: (state, action) => {
          state.currentTable = action.payload
          state.currentRow = null
      },
      updateCurrentRow: (state, action) => {
          state.currentRow = action.payload
      },
      updateText: (state, action) => {
          const field = action.payload.field
          const newText = action.payload.text
          const tableIndex = action.payload.tableIndex
          const rows = action.payload.rows
          const rowIndex = action.payload.rowIndex !== null?action.payload.rowIndex:-1
          const newTables = state.tables.filter((table, index) => index !== tableIndex)
          const editingTable = state.tables[tableIndex]
          const editingRow = field !== "title"?editingTable.rows[action.payload.rowIndex]:null
          console.log(rows)
          console.log("new Text::", newText)
          if (editingTable !== undefined) {
            switch(field) {
                case "title":
                    editingTable.title = newText
                    state.tables = [...newTables, editingTable]
                    break
                case "key":
                    if (editingRow !== null) {
                        editingRow.key = newText
                        const newRows = [...rows]
                        newRows.splice(rowIndex, 1, editingRow)
                        editingTable.rows = newRows
                        state.tables = [...newTables, editingTable]
                        break
                    }
                case "value":
                    if (editingRow !== null) {
                        editingRow.value = newText
                        const newRows = [...rows]
                        newRows.splice(rowIndex, 1, editingRow)
                        editingTable.rows = newRows
                        state.tables = [...newTables, editingTable]
                        break
                    }
                }
          }
      },
      resetEditingField: (state) => {
          state.editingField = null
      },
      updateEditingField: (state, action) => {
          state.editingField = action.payload
      },
      updateConnectionPreview: (state, action) => {
          state.connectionPreview = action.payload
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { insertRows, openMenu, closeMenu, addRow, updateEnabledItems, addTable, deleteTable,
                updateCurrentTable, updateCurrentRow, deleteRow, updateText, updateEditingField,
                resetEditingField, updateConnectionPreview} = canvasSlice.actions
  
  export default canvasSlice.reducer