import { ANYONE_CAN_EDIT, ANYONE_CAN_READ, RESTRICTED } from "../src/constant"
import ShareStatusType from "./ShareStatusType"


export interface RoomType {
    id: string,
    title: string,
    previewImg: string,
    createdAt: Date,
    updatedAt: Date,
    shareStatus: ShareStatusType
    canRead: string[],
    canEdit: string[],
    owners: string[] 
}

export default RoomType