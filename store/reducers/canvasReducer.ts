
import { ConnectWithoutContactSharp } from '@mui/icons-material'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConnectionOptionType } from '../../src/GlobalType'
import backendAxios from '../../src/helpers/axios'
export interface TextStyleType {
    fontFamily?: string
    fontSize? : number,
    fontWeight?: "unset" | "bold",
    fontStyle?: "unset" | "italic",
    textDecorationLine?: "unset" | "underline",
    textAlign?: "unset" | "left" | "center" | "right",
    color?: string
}
export interface TextType {
    id: string,
    content: string,
    style: TextStyleType
    
    
}
export interface RowType {
    key: TextType,
    value: TextType,
    id: string
}

export interface TableType {
    rows: RowType[],
    id: string,
    title: TextType,
    x: number,
    y: number,
    rotation: number,
    scale: {x: number, y:number}
}

export type AnchorLocationType = "top" | "bottom" | "left" | "right"
export interface ConnectionPointType {
    id: string,
    anchorLocation: AnchorLocationType,
    connectionOption: ConnectionOptionType
}
export interface ConnectionType {
    source: ConnectionPointType,
    destination: {x:number, y:number, connectionOption: ConnectionOptionType} | ConnectionPointType,
    id: string
}
interface StateType {
    history: {tables: TableType[], connections: ConnectionType[]}[]
    historyStep: number,
    tables: TableType[],
    displayMenu: {
        display: boolean,
        x: number,
        y: number
    },
    enabledItems: string[],
    currentTable: TableType | null,
    currentRow: RowType | null,
    currentConnectionId: null | string,
    editingField: {text: string, field:string, tableIndex:number, rowIndex:number} | null,
    connectionPreview: ConnectionType | null,
    connections: ConnectionType[],
    defaultConnectionOption: {
        source: ConnectionOptionType,
        destination: ConnectionOptionType
    },
    defaultTextStyle: TextStyleType,
}



const initialState:StateType = {
    history:[{tables: [], connections:[]}],
    historyStep: 0,
    tables: [],
    displayMenu: {
        display: false,
        x: 0,
        y: 0
    },
    enabledItems: [],
    currentTable: null,
    currentRow:  null,
    currentConnectionId: null,
    editingField: null,
    connectionPreview: null,
    connections: [],
    defaultConnectionOption: {
        source: "normal",
        destination: "normal"
    },
    defaultTextStyle: {
        fontFamily: "Caribri",
        fontSize: 10,
        fontWeight: "unset",
        fontStyle: "unset",
        textDecorationLine: "unset",
        color: "black",
        textAlign: "unset"

        
    },

}


export const canvasSlice = createSlice({
    name: 'canvases',
    initialState: initialState,
    reducers: {
      openMenu: (state, action) => {
          state.displayMenu = {...state.displayMenu, display: true, ...action.payload}
      },
      closeMenu: (state) => {
          state.displayMenu.display = false
          state.currentTable = null
          state.currentConnectionId = null
      },

      setTables: (state, action) => {
          state.tables = action.payload
      },
      setConnections: (state, action) => {
          state.connections = action.payload
      },
      addRow: (state, action) => {
          const newTables = state.tables.filter(table => table.id !== state.currentTable?.id)
          if (state.currentTable !== null) {
            state.currentTable.rows = [...state.currentTable.rows, action.payload]
            state.tables = [...newTables, state.currentTable]
          }
          state.displayMenu.display = false
          state.history = [...state.history, {tables: state.tables, connections:state.connections}]
          state.historyStep += 1
      },
      deleteRow: (state) => {
        const newTables = state.tables.filter(table => table.id !== state.currentTable?.id)
        if (state.currentTable !== null && state.currentRow !== null) {
          state.currentTable.rows = state.currentTable.rows.filter(row => row.id !== state.currentRow?.id)
          state.tables = [...newTables, state.currentTable]
          state.currentRow = null
        }
        state.displayMenu.display = false
        state.history = [...state.history, {tables: state.tables, connections:state.connections}]
        state.historyStep += 1
      },
      addTable: (state, action) => {
          state.tables = [...state.tables, action.payload]
          state.displayMenu.display = false
          state.history = [...state.history, {tables: state.tables, connections:state.connections}]
          state.historyStep += 1
      },
      deleteTable: (state) => {
          state.connections = state.connections.filter((connection) => connection.source.id !== state.currentTable?.id && connection.destination?.id !== state.currentTable?.id)
          state.tables = state.tables.filter((table) => table.id !== state.currentTable?.id)
          state.currentTable = null
          state.displayMenu.display = false
          state.history = [...state.history, {tables: state.tables, connections:state.connections}]
          state.historyStep += 1
      },
      updateEnabledItems: (state, action) => {
          state.enabledItems = action.payload
      },
      updateCurrentTable: (state, action) => {
          if (state.currentTable?.id !== action.payload.id) {
            state.currentRow = null
          }
          state.currentTable = action.payload
          //state.disableContainerClick = false
      },
      updateCurrentRow: (state, action) => {
          state.currentRow = action.payload
      },
      updateCurrentConnectionId: (state, action) => {
          state.currentConnectionId = action.payload
      },
      deleteConnection: (state) => {
          const newConnections = state.connections.filter((connection) => connection.id !== state.currentConnectionId)
          state.connections = [...newConnections]
          state.currentConnectionId = null
          state.displayMenu.display = false
          state.history = [...state.history, {tables: state.tables, connections:state.connections}]
          state.historyStep += 1
      },
      updateText: (state, action) => {
          const field = action.payload.field
          const newText = action.payload.text
          console.log({text:newText})
          const textId = action.payload.id
          const tableIndex = action.payload.tableIndex
          const rows = action.payload.rows
          const rowIndex = action.payload.rowIndex !== null?action.payload.rowIndex:-1
          const newTables = state.tables.filter((table, index) => index !== tableIndex)
          const editingTable = state.tables[tableIndex]
          const editingRow = field !== "title"?editingTable.rows[action.payload.rowIndex]:null
          if (editingTable !== undefined) {
            switch(field) {
                case "title":
                    editingTable.title = {style:state.defaultTextStyle, content: newText, id:textId}
                    state.tables = [...newTables, editingTable]
                    break
                case "key":
                    if (editingRow !== null) {
                        editingRow.key = {style:state.defaultTextStyle, content: newText, id: textId}
                        const newRows = [...rows]
                        newRows.splice(rowIndex, 1, editingRow)
                        editingTable.rows = newRows
                        state.tables = [...newTables, editingTable]
                        break
                    }
                case "value":
                    if (editingRow !== null) {
                        editingRow.value = {style:state.defaultTextStyle, content: newText, id: textId}
                        const newRows = [...rows]
                        newRows.splice(rowIndex, 1, editingRow)
                        editingTable.rows = newRows
                        state.tables = [...newTables, editingTable]
                        break
                    }
                }
          }
          state.history = [...state.history, {tables: state.tables, connections:state.connections}]
          state.historyStep += 1
      },
      resetEditingField: (state) => {
          state.editingField = null
      },
      updateEditingField: (state, action) => {
          state.editingField = action.payload
      },
      updateConnectionPreview: (state, action) => {
          state.connectionPreview = action.payload
      },
      addConnection: (state, action) => {
          state.connections = [...state.connections, action.payload]
          state.history = [...state.history, {tables: state.tables, connections:state.connections}]
          state.historyStep += 1
      },
      updateTable:(state, action) => {
          const tables = state.tables.filter((table)=> table.id !== action.payload.id)
          state.tables = [...tables, action.payload]
      },
      resetCurrentSelection: (state) => {
          state.currentTable = null
          state.currentRow = null
          state.currentConnectionId = null
      },
      updateDefaultConnectionOption: (state, action) => {
          state.defaultConnectionOption = action.payload
      },
      updateConnections: (state, action) => {
          state.connections = action.payload
          state.history = [...state.history, {tables: state.tables, connections:state.connections}]
          state.historyStep += 1
      },
      updateDefaultTextStyle: (state, action) => {
          state.defaultTextStyle = action.payload
      },

      increaseDefaultFontSize: (state) => {
          state.defaultTextStyle.fontSize += 1
      },
      decreaseDefaultFontSize: (state) => {
          state.defaultTextStyle.fontSize -= 1
      },
      increaseHistoryStep: (state) => {
          state.historyStep += 1
          console.log(state.historyStep)
          const currentHistory = state.history[state.historyStep]
          state.tables = currentHistory.tables
          state.connections = currentHistory.connections
      },
      decreaseHistoryStep: (state) => {
        state.historyStep -= 1
        console.log(state.historyStep)
        const currentHistory = state.history[state.historyStep]
        console.log(currentHistory.tables.length)
        state.tables = currentHistory.tables
        state.connections = currentHistory.connections
    },
    addHistory: (state) => {
        state.history = [...state.history, {tables: state.tables, connections: state.connections}]
        state.historyStep += 1
    }
    },
    
  })
  
  // Action creators are generated for each case reducer function
  export const {openMenu, closeMenu, addRow, updateEnabledItems, addTable, deleteTable,
                updateCurrentTable, updateCurrentRow, deleteRow, updateText, updateEditingField,
                resetEditingField, updateConnectionPreview, addConnection, updateTable,
                updateCurrentConnectionId, deleteConnection, resetCurrentSelection,
                updateDefaultConnectionOption, updateConnections, updateDefaultTextStyle,
                increaseDefaultFontSize, decreaseDefaultFontSize, setTables, setConnections,
                increaseHistoryStep, decreaseHistoryStep, addHistory} = canvasSlice.actions
  
  export default canvasSlice.reducer