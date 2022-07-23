import * as Konva from "konva"
import React from "react"
import AnchorLocationType from "../../types/AnchorLocationType"
import ShapeType from "../../types/ShapeType"
import { BOTTOM, LEFT, RIGHT, TABLE, TOP } from "../constant"
import {defaultRowHeight} from "../components/ERDiagram"
export const anchorDistance = 20
export default function getAnchorPoint(targetRef:React.RefObject<Konva.default.Shape | Konva.default.Group>,
                                        location:AnchorLocationType) {
    const width = targetRef.current?.attrs.width * targetRef.current?.attrs.scaleX
    let height = targetRef.current?.attrs.height * targetRef.current?.attrs.scaleY
    const x = targetRef.current?.attrs.x
    const y = targetRef.current?.attrs.y
    if (targetRef.current?.attrs.name === TABLE) {
        const rowsLength = getRowsLength(targetRef as React.RefObject<Konva.default.Group>)
        height += rowsLength * defaultRowHeight * targetRef.current?.attrs.scaleY
    }

    
    switch(location) {
        case TOP:
            return  [x + (width/2), y - anchorDistance]
        case BOTTOM:
            return [x + (width/2), y + height + anchorDistance]
        case LEFT:
            return [x - anchorDistance, y + (height/2)]
        case RIGHT:
            return [x + width + anchorDistance, y + (height/2)]
        default:
            return [0,0]
    }
}

export function getRowsLength(targetRef:React.RefObject<Konva.default.Group>) {
    //groupがrowとなるのでそれをcountする。
    let rowsLength = 0
    const childrenLength = targetRef.current?.children?.length ?? 0
    const children:(Konva.default.Shape | Konva.default.Group)[] | undefined = targetRef.current?.children
    if (children !== undefined) {
        for (let i=0; i < childrenLength; i++) {
            const child = children[i]
            if (child.nodeType === "Group") {
                rowsLength += 1
            }
        }
    }

    return rowsLength - 1
    
}