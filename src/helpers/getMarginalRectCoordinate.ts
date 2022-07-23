import * as Konva from "konva"
import React from "react"
import AnchorLocationType from "../../types/AnchorLocationType"
import { anchorDistance } from "./getAnchorPoint"
import { BOTTOM, LEFT, RIGHT, TOP } from "../constant"


export default function getMarginalRectCoordinate(targetRef:React.RefObject<Konva.default.Shape>, location:AnchorLocationType) {
    const width = targetRef.current?.attrs.width * targetRef.current?.attrs.scaleX
    const height = targetRef.current?.attrs.height * targetRef.current?.attrs.scaleY
    const x = targetRef.current?.attrs.x
    const y = targetRef.current?.attrs.y

    switch(location) {
        case TOP:
            return  {x: x - anchorDistance, y: y - anchorDistance, width: width + anchorDistance*2, height: anchorDistance}
        case BOTTOM:
            return {x:x - anchorDistance, y:y + height, width:width + anchorDistance*2, height:anchorDistance}
        case LEFT:
            return {x:x - anchorDistance, y, width:anchorDistance, height}
        case RIGHT:
            return {x:x + width, y, width:anchorDistance, height}
        default:
            return {x:0,y:0,width:0, height:0}
    }

}

