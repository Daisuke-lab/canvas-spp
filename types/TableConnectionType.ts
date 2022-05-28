import AnchorLocationType from './AnchorLocationType'
import ConnectionOptionType from './ConnectionOptionType'


export interface TableConnectionType {
    id: string,
    anchorLocation: AnchorLocationType,
    connectionOption: ConnectionOptionType
}
export default TableConnectionType