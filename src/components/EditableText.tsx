import { AnyPtrRecord } from 'dns';
import React, {useRef, useEffect, useState} from 'react'
import { Stage, Layer, Shape, Transformer, Rect, Text, KonvaNodeComponent} from 'react-konva';;
import { Html } from 'react-konva-utils';
import CanvasText, {CanvasTextType} from './CanvasText'
import {RefType} from '../GlobalType'
import {createStyles} from '../helpers/createStyles'
interface Props {
    isSelected: boolean,
    onSelect: () => void, 
    stageRef: any,
    transformable: boolean,
    text: string,
    dispatch: any,
    field: string
}
function EditableText(props:Props) {
  //no typescript support
    const {text, dispatch, field} = props 
    const trRef = useRef() as any
    const textRef = React.useRef() as any
    const [canvasTextProps, setCanvasTextProps] = useState<CanvasTextType>({
      display: true,
      styles: {},
      text: text
    })

    useEffect(() => {
        if (props.isSelected) {
          // we need to attach transformer manually
          trRef?.current?.nodes([textRef.current]);
          //trRef?.current?.getLayer().batchDraw();
        }
      }, [props.isSelected]);



    const [recOptions, setRecOptions] = useState({
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        fill: 'red',
        id: 'rect1',
      });

    const onDragEnd = (e:any) => {
        setRecOptions({
            ...recOptions,
            x: e.target.x(),
            y: e.target.y()
        })

    }

    const onTransformEnd = (e:any) => {

            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = textRef?.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
  
            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            setRecOptions({
                ...recOptions,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            })
    }

    const onClick = (e:any) => {
      console.log('it clicked')
      console.log(props)
      if (props.isSelected) {
        textRef?.current?.hide()
        trRef?.current?.hide()
        const styles = createStyles(textRef, props.stageRef)
        setCanvasTextProps({
          ...canvasTextProps,
          styles,
          display: true})
      } else {
        console.log('onSelect')
        props.onSelect()
      }
    }




    return (
        <>
        <Text
        onClick={onClick}
        onTap={props.onSelect}
        ref={textRef}
        {...recOptions}
        draggable={props.transformable}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
        text={canvasTextProps.display?"":canvasTextProps.text}
        fontFamily='Calibri'
        fill='black'
      />
      <CanvasText {...canvasTextProps} setCanvasTextProps={setCanvasTextProps}
      dispatch={dispatch}
      field={field}
      textRef={textRef}
      trRef={trRef}/>
          {props.isSelected && props.transformable && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                // limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
          </>
    )
}

EditableText.defaultProps = {
  transformable: false,
  stageRef: null
}

export default EditableText
