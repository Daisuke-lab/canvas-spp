import { addTable, updateTable, deleteTable, updateTableWithHistoryStep } from '../../store/reducers/canvasReducer';
import { RootState, AppDispatch } from '../../store/store';
import {MessageType, TableType} from "../../types"
export default function reflectTableChange(state:RootState, dispatch:AppDispatch, msg:MessageType<TableType>) {
    const table = msg.data;
    const session = state.users.session

    // if (table.updatedBy === session?.id) {
    //     return;
    // }


    switch(msg.method) {
        case "create":
            dispatch(addTable(table))
            break
        case "update":
            console.log("you are on update")
            dispatch(updateTableWithHistoryStep(table))
            break
        case "delete":
            dispatch(deleteTable(table))
            break
        default:
            return;
            
    }
    

}