import {ONE, MANY, ONE_OR_MANY, ONLY_ONE, ZERO_OR_MANY, ZERO_OR_ONE, NORMAL} from "../src/constant"


export type ConnectionOptionType = typeof ONE | typeof MANY | typeof ONE_OR_MANY | typeof ONLY_ONE | typeof ZERO_OR_MANY | typeof ZERO_OR_ONE | typeof NORMAL

export default ConnectionOptionType