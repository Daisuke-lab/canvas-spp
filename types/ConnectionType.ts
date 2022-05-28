import TableConnectionType from "./TableConnectionType"
import PointConnectionType from "./PointConnectionType"

export interface ConnectionType {
    source: TableConnectionType,
    destination: PointConnectionType | TableConnectionType,
    id: string,
    updatedBy: string
}

export default ConnectionType