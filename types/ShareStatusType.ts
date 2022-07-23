
import {RESTRICTED, ANYONE_CAN_READ, ANYONE_CAN_EDIT} from "../src/constant"

export type ShareStatusType = typeof RESTRICTED | typeof ANYONE_CAN_EDIT | typeof ANYONE_CAN_READ

export default ShareStatusType