import { CustomSessionType } from "../../types";
import RoomType from "../../types/RoomType";
import { ANYONE_CAN_EDIT, ANYONE_CAN_READ, CAN_EDIT, RESTRICTED } from "../constant";


export default function hasAccessToRoom(room:RoomType | null, currentSession:CustomSessionType | null) {
    if (room === null) {
        return false
    }
    if (currentSession === null) {
        return false
    }
    if ([ANYONE_CAN_EDIT, ANYONE_CAN_READ].includes(room.shareStatus)) {
        return true
    } else if (room.shareStatus === RESTRICTED) {
        if (room.canEdit.includes(currentSession?.id)) {
            return true
        } else if (room.canRead.includes(currentSession?.id)) {
            return true
        }
    }
    return false
}