import * as Konva from "konva"
import React from "react"
import AnchorLocationType from "../../types/AnchorLocationType"
import { anchorDistance } from "./getAnchorPoint"
import { BOTTOM, LEFT, RIGHT, TOP } from "../constant"


export default function getMarginalLinePoints(targetRef:React.RefObject<Konva.default.Shape>, location:AnchorLocationType) {
    const width = targetRef.current?.attrs.width * targetRef.current?.attrs.scaleX
    const height = targetRef.current?.attrs.height * targetRef.current?.attrs.scaleY
    const x = targetRef.current?.attrs.x
    const y = targetRef.current?.attrs.y

    switch(location) {
        case TOP:
            return  [x - anchorDistance, y - anchorDistance, x + width + anchorDistance, y - anchorDistance]
        case BOTTOM:
            return [x - anchorDistance, y + height + anchorDistance, x + width + anchorDistance, y + height + anchorDistance]
        case LEFT:
            return [x - anchorDistance, y - anchorDistance, x - anchorDistance, y + anchorDistance]
        case RIGHT:
            return [x + width + anchorDistance, y - anchorDistance, x + width + anchorDistance, y + anchorDistance]
        default:
            return [0,0]
    }

}
