
import { ConnectWithoutContactSharp } from '@mui/icons-material'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import backendAxios from '../../src/helpers/getAxios'
import { RoomType, TableType, RowType, ConnectionOptionType,  TextStyleType,
ConnectionType, TableConnectionType, PermissionType} from '../../types'
import { NO_PERMISSION } from '../../types/PermissionType'





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
    currentConnection: ConnectionType | null,
    currentRoom: RoomType | null,
    currentPermission: PermissionType,
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
    currentConnection: null,
    currentRoom: null,
    currentPermission: NO_PERMISSION,
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
          state.currentConnection = null
      },

      setTables: (state, action) => {
          state.tables = action.payload
      },
      setConnections: (state, action) => {
          state.connections = action.payload
      },
      addRow: (state, action) => {
          const newTables = state.tables.filter(table => table.id !== state.currentTable?.id)
          const currentTable = state.tables.find(table => table.id === state.currentTable?.id)
          if (currentTable !== undefined) {
            currentTable.rows = [...currentTable.rows, action.payload]
            state.tables = [...newTables, currentTable]
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
      deleteTable: (state, action) => {
          const deletingTable = action.payload
          state.connections = state.connections.filter((connection) => connection.source.id !== deletingTable?.id && 
          (connection.destination as TableConnectionType)?.id !== deletingTable?.id)
          state.tables = state.tables.filter((table) => table.id !== deletingTable?.id)
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
      updateCurrentConnection: (state, action) => {
          state.currentConnection = action.payload
      },
      deleteConnection: (state, action) => {
          const newConnections = state.connections.filter((connection) => connection.id !== action.payload.id)
          state.connections = [...newConnections]
          
          state.displayMenu.display = false
          state.history = [...state.history, {tables: state.tables, connections:state.connections}]
          state.historyStep += 1
          if (action.payload.id === state.currentConnection?.id) {
            state.currentConnection = null
          }
      },
      updateText: (state, action) => {
          const field = action.payload.field
          const newText = action.payload.text
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
                    editingTable.title = {style:state.defaultTextStyle, content: newText, id:textId,
                    updatedBy: action.payload.updatedBy}
                    state.tables = [...newTables, editingTable]
                    break
                case "key":
                    if (editingRow !== null) {
                        editingRow.key = {style:state.defaultTextStyle, content: newText, id: textId,
                            updatedBy: action.payload.updatedBy}
                        const newRows = [...rows]
                        newRows.splice(rowIndex, 1, editingRow)
                        editingTable.rows = newRows
                        state.tables = [...newTables, editingTable]
                        break
                    }
                case "value":
                    if (editingRow !== null) {
                        editingRow.value = {style:state.defaultTextStyle, content: newText, id: textId,
                            updatedBy: action.payload.updatedBy}
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
      updateTableWithHistoryStep: (state, action) => {
        const tables = state.tables.filter((table)=> table.id !== action.payload.id)
        state.tables = [...tables, action.payload]
        state.historyStep += 1
      },
      resetCurrentSelection: (state) => {
          state.currentTable = null
          state.currentRow = null
          state.currentConnection = null
      },
      updateDefaultConnectionOption: (state, action) => {
          state.defaultConnectionOption = action.payload
      },
      updateConnection: (state, action) => {
          const otherConnections = state.connections.filter(connection => connection.id !== action.payload.id)
          state.connections = [...otherConnections, action.payload]
          state.history = [...state.history, {tables: state.tables, connections:state.connections}]
          state.historyStep += 1
      },
      updateDefaultTextStyle: (state, action) => {
          state.defaultTextStyle = action.payload
      },

      increaseDefaultFontSize: (state) => {
          if (state.defaultTextStyle?.fontSize !== undefined) {
            state.defaultTextStyle.fontSize += 1
          }
          
      },
      decreaseDefaultFontSize: (state) => {
        if (state.defaultTextStyle?.fontSize !== undefined) {
            state.defaultTextStyle.fontSize -= 1
          }
      },
      increaseHistoryStep: (state) => {
          state.historyStep += 1
          const currentHistory = state.history[state.historyStep]
          state.tables = currentHistory.tables
          state.connections = currentHistory.connections
      },
      decreaseHistoryStep: (state) => {
        state.historyStep -= 1
        const currentHistory = state.history[state.historyStep]
        state.tables = currentHistory.tables
        state.connections = currentHistory.connections
    },
    addHistory: (state) => {
        state.history = [...state.history, {tables: state.tables, connections: state.connections}]
        state.historyStep += 1
    },
    updateCurrentRoom: (state, action) => {
        state.currentRoom = action.payload
    },
    setCurrentPermission: (state, action) => {
        state.currentPermission = action.payload
    }
    },
    
  })
  
  // Action creators are generated for each case reducer function
  export const {openMenu, closeMenu, addRow, updateEnabledItems, addTable, deleteTable,
                updateCurrentTable, updateCurrentRow, deleteRow, updateText, updateEditingField,
                resetEditingField, updateConnectionPreview, addConnection, updateTable,
                updateCurrentConnection, deleteConnection, resetCurrentSelection,
                updateDefaultConnectionOption, updateConnection, updateDefaultTextStyle,
                increaseDefaultFontSize, decreaseDefaultFontSize, setTables, setConnections,
                increaseHistoryStep, decreaseHistoryStep, addHistory, updateCurrentRoom,
                updateTableWithHistoryStep, setCurrentPermission} = canvasSlice.actions
  
  export default canvasSlice.reducer