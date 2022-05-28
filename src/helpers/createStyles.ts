import { StyleOutlined } from "@mui/icons-material";
import {updateDefaultTextStyle } from "../../store/reducers/canvasReducer";
import TextStyleType from "../../types/TextStyleType";
import * as Konva from "konva"
import { AppDispatch } from "../../store/store";
export const createStyles = (textRef:React.RefObject<Konva.default.Text>,
                             erDiagramRef:React.RefObject<Konva.default.Group>,
                             stageRef:React.RefObject<Konva.default.Stage>,
                             dispatch:AppDispatch) => {
    const styles:any = {}
    if (textRef.current !== null && stageRef.current !== null && erDiagramRef.current!== null) {
        const textPosition = textRef.current.absolutePosition();


    // so position of textarea will be the sum of positions above:
    const  areaPosition = {
        x: stageRef.current.container().offsetLeft + textPosition.x,
        y: stageRef.current.container().offsetTop + textPosition.y,
    };

    
    styles.position = 'absolute';
    // styles.top = stageRef.current.container().offsetLeft + 'px';
    // styles.left = stageRef.current.container().offsetTop + 'px';
    styles.top = textPosition.y + 'px';
    styles.left = textPosition.x + 'px';
    styles.width = textRef.current.width() - textRef.current.padding() * 2 + 'px';
    styles.height = textRef.current.height() - textRef.current.padding() * 2 + 5 + 'px';
    styles.fontSize = textRef.current.fontSize() + 'px';
    styles.border = 'none';
    styles.padding = '0px';
    styles.margin = '0px';
    styles.overflow = 'hidden';
    styles.background = 'none';
    styles.fontWeight = textRef.current.attrs?.fontStyle.includes("bold")?"bold":"unset"
    styles.fontStyle = textRef.current.attrs?.fontStyle.includes("italic")?"italic":"unset"
    styles.outline = 'none';
    styles.textDecorationLine = textRef.current.attrs?.textDecoration
    styles.resize = 'none';
    styles.lineHeight = textRef.current.lineHeight();
    styles.fontFamily = textRef.current.fontFamily();
    styles.transformOrigin = 'left top';
    styles.textAlign = textRef.current.align();
    styles.color = textRef.current.fill();
    const scale = erDiagramRef.current.scale();


    const rotation = erDiagramRef.current.rotation();
    var transform:string = '';
    transform += `scaleX(${scale.x})`
    transform += `scaleY(${scale.y})`
    if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
    }

    styles.transform = transform;
    insertIntoDefaultTextStyle(styles, dispatch)
    }
    

    return styles

}

const insertIntoDefaultTextStyle = (styles:any, dispatch:any) => {
    const newDefaultTextStyle = {
        color: styles.color,
        fontWeight: styles.fontWeight,
        fontStyle: styles.fontStyle,
        fontSize: parseInt(styles.fontSize.replaceAll("px", "")),
        fontFamily: styles.fontFamily,
        textDecorationLine: styles.textDecorationLine,
        textAlign: styles.textAlign
        }

    dispatch(updateDefaultTextStyle(newDefaultTextStyle))
}