export const CAN_EDIT = 0
export const CAN_READ =1
export const OWNER = 2
export const NO_PERMISSION = 3

export type PermissionType = typeof NO_PERMISSION | typeof OWNER | typeof CAN_EDIT | typeof CAN_READ

export default PermissionType