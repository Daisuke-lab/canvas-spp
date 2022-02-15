export const createStyles = (textRef, stageRef) => {
    const styles:any = {}
    const textPosition = textRef.current.absolutePosition();

    // so position of textarea will be the sum of positions above:
//     const  areaPosition = {
//         x: stageRef.current.container().offsetLeft + textPosition.x,
//         y: stageRef.current.container().offsetTop + textPosition.y,
//     };

//    // textarea.value = textRef.current.text();
//    console.log(areaPosition)
   console.log(textPosition)
    styles.position = 'absolute';
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
    styles.outline = 'none';
    styles.resize = 'none';
    styles.lineHeight = textRef.current.lineHeight();
    styles.fontFamily = textRef.current.fontFamily();
    styles.transformOrigin = 'left top';
    styles.textAlign = textRef.current.align();
    styles.color = textRef.current.fill();


    const rotation = textRef.current.rotation();
    var transform:string = '';
    if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
    }

    styles.transform = transform;

    return styles

}