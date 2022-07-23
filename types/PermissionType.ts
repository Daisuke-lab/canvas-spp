import {NO_PERMISSION, OWNER, CAN_EDIT, CAN_READ} from "../src/constant"

export type PermissionType = typeof NO_PERMISSION | typeof OWNER | typeof CAN_EDIT | typeof CAN_READ

export default PermissionType