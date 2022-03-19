import { AnchorLocationType } from "../../store/reducers/canvasReducer"

export const getR = (anchorLocation:AnchorLocationType, width:number, height:number) => {
    const r = "bottom" === anchorLocation?Math.sqrt((width/2)**2 + (height)**2)
    :anchorLocation==="top"?(width/2)
    :anchorLocation==="left"?height/2
    :Math.sqrt((width)**2 + (height/2)**2)

    return r
}

export const getRotation = (anchorLocation:AnchorLocationType, width:number, r:number, originalRotation:number) => {
    const rotation = "top"===anchorLocation?originalRotation
    :"right"===anchorLocation?originalRotation + Math.acos(width / r) * (180 / Math.PI)
    :"bottom"===anchorLocation?originalRotation + Math.acos((width /2) / r) * (180 / Math.PI)
    :originalRotation + 90

    return rotation
}