
export interface RoomType {
    id: string,
    title: string,
    previewImg: string,
    createdAt: Date,
    updatedAt: Date,
    starred: boolean,
    shareStatus?: "anyEdit" | "anyRead" | "specifiedRead" | "specifiedEdit",
    canRead?: string[],
    canEdit?: string[],
    ownerId: string 
}

export default RoomType