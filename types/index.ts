import * as alt from "./AnchorLocationType"
import * as clt from './ConnectionOptionType'
import * as rt from "./RoomType"
import * as tst from './TextStyleType'
import * as tt from './TextType'
import * as rowt from "./RowType"
import * as tct from "./TableConnectionType"
import * as pct from "./PointConnectionType"
import * as ct from "./ConnectionType"
import * as mt from "./MessageType"
import * as pt from "./PermissionType"
import * as lt from "./LocationType"
import * as st from "./ShapeType"
import * as sst from "./ShareStatusType"
import * as ot from "./ObjectType"
import * as tab_t from "./TabType"
import * as ut from "./UserType"

export type RoomType = rt.RoomType;
export type ConnectionOptionType = clt.ConnectionOptionType
export type TextStyleType = tst.TextStyleType
export type TextType = tt.TextType
export type RowType = rowt.RowType
export type AnchorLocationType = alt.AnchorLocationType
export type TableConnectionType = tct.TableConnectionType
export type PointConnectionType = pct.PointConnectionType
export type ConnectionType = ct.ConnectionType
export type TableType = import("./TableType").TableType
export type MessageType<T> = mt.MessageType<T>
export type CustomSessionType = import("./CustomSessionType").CustomSessionType
export type PermissionType = pt.PermissionType
export type LocationType = lt.LocationType
export type ShapeType = st.ShapeType
export type ShareStatusType = sst.ShareStatusType
export type ObjectType = ot.ObjectType
export type TabType = tab_t.TabType
export type UserType = ut.UserType
