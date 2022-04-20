import { StyleOutlined } from "@mui/icons-material";
import { TextStyleType, updateDefaultTextStyle } from "../../store/reducers/canvasReducer";
export const createStyles = (textRef, erDiagramRef, stageRef, dispatch) => {
    const styles:any = {}
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
    console.log(textRef.current)
    console.log(textRef.current.parent.scale())


    const rotation = erDiagramRef.current.rotation();
    var transform:string = '';
    transform += `scaleX(${scale.x})`
    transform += `scaleY(${scale.y})`
    if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
    }

    styles.transform = transform;
    insertIntoDefaultTextStyle(styles, dispatch)

    return styles

}

const insertIntoDefaultTextStyle = (styles:TextStyleType, dispatch:any) => {
    console.log("fontsize in createStyles::", styles.fontSize)
    const newDefaultTextStyle = {
        color: styles.color,
        fontWeight: styles.fontWeight,
        fontStyle: styles.fontStyle,
        fontSize: parseInt(styles.fontSize as string),
        fontFamily: styles.fontFamily,
        textDecorationLine: styles.textDecorationLine,
        textAlign: styles.textAlign
        }

    dispatch(updateDefaultTextStyle(newDefaultTextStyle))
}