import { CustomSessionType } from "../../types";
import RoomType from "../../types/RoomType";
import { ANYONE_CAN_EDIT, ANYONE_CAN_READ, CAN_EDIT, CAN_READ, NO_PERMISSION, OWNER } from "../constant";


export default function getCurrentPermission(room:RoomType | null, currentSession:CustomSessionType | null) {
    console.log(typeof room)
    // when it's undefined, it's still loading
    if (currentSession === undefined || room === undefined) {
        return undefined
    }
    if (room === null) {
        return undefined
    }

    if (room.shareStatus === ANYONE_CAN_EDIT) {
        return CAN_EDIT
    } else if (room.shareStatus === ANYONE_CAN_READ) {
        return CAN_READ
    }

    if (currentSession === null && typeof room === "object") {
        return NO_PERMISSION
    }

    if (currentSession !== null) {
        if (room.owners.includes(currentSession?.id)) {
            return OWNER
        }else if (room.canEdit.includes(currentSession?.id)) {
            return CAN_EDIT
        } else if (room.canRead.includes(currentSession?.id)) {
            return CAN_READ
        }
    }
    
    
    return NO_PERMISSION
}

export function canEdit(room:RoomType, currentSession:CustomSessionType){
    if (room.shareStatus === ANYONE_CAN_EDIT) {
        return true
    }
    if (room.canEdit.includes(currentSession?.id)) {
        return true
    }
    if (room.owners.includes(currentSession?.id)) {
        return true
    }
    return false
}