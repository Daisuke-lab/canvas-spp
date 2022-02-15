
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
interface StateType {
    tables: TableType[],
    displayMenu: {
        display: boolean,
        x: number,
        y: number
    },
    enabledItems: string[],
    currentTable: TableType | null,
    currentRow: RowType | null
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
    currentRow:  null

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
          //const table = state.tables.find(table => table === state.currentTable)
          //table.rows = [...state.currentTable.rows, action.payload]
          //console.log('this is table::', table)
          if (state.currentTable !== null) {
            state.currentTable.rows = [...state.currentTable.rows, action.payload]
            state.tables = [...newTables, state.currentTable]
          }
          state.displayMenu.display = false
      },
      deleteRow: (state) => {
        const newTables = state.tables.filter(table => table.id !== state.currentTable?.id)
        //const table = state.tables.find(table => table === state.currentTable)
        //table.rows = [...state.currentTable.rows, action.payload]
        //console.log('this is table::', table)
        if (state.currentTable !== null && state.currentRow !== null) {
            console.log('you are here')
            console.log(state.currentTable.rows.filter(row => row !== state.currentRow).length)
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
      updateEnabledItems: (state, action) => {
          state.enabledItems = action.payload
      },
      updateCurrentTable: (state, action) => {
          state.currentTable = action.payload
      },
      updateCurrentRow: (state, action) => {
          state.currentRow = action.payload
      },
      updateText: (state, action) => {
          const field = action.payload.field
          const newText = action.payload.text
          const newTables = state.tables.filter(table => table.id !== state.currentTable?.id)
          if (state.currentTable !== null) {
            switch(field) {
                case "title":
                    state.currentTable.title = newText
                case "key":
                    if (state.currentRow !== null) {
                        const newRows = state.currentTable.rows.filter(row => row.id !== state.currentRow?.id)
                        state.currentRow.key = newText
                        state.currentTable.rows = [...newRows, state.currentRow]
                        state.tables = [...newTables, state.currentTable]
                    }
                case "value":
                    if (state.currentRow !== null) {
                        const newRows = state.currentTable.rows.filter(row => row.id !== state.currentRow?.id)
                        state.currentRow.value= newText
                        state.currentTable.rows = [...newRows, state.currentRow]
                        state.tables = [...newTables, state.currentTable]
                    }
            }
            }
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { insertRows, openMenu, closeMenu, addRow, updateEnabledItems, addTable,
                updateCurrentTable, updateCurrentRow, deleteRow, updateText} = canvasSlice.actions
  
  export default canvasSlice.reducer