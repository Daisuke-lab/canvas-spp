import { addTable, updateTable, deleteTable, updateTableWithHistoryStep, addConnection, deleteConnection, updateConnection } from '../../store/reducers/canvasReducer';
import { RootState, AppDispatch } from '../../store/store';
import {MessageType, TableType, ConnectionType} from "../../types"
export default function reflectConnectionChange(state:RootState, dispatch:AppDispatch, msg:MessageType<ConnectionType>) {
    const connection = msg.data;
    const session = state.users.session



    switch(msg.method) {
        case "create":
            dispatch(addConnection(connection))
            break
        case "update":
            dispatch(updateConnection(connection))
            break
        case "delete":
            dispatch(deleteConnection(connection))
            break
        default:
            return;
            
    }
    

}