import { AnyPtrRecord } from 'dns';
import React, {useRef, useEffect, useState} from 'react'
import { Stage, Layer, Shape, Transformer, Rect, Text, KonvaNodeComponent} from 'react-konva';;
import { Html } from 'react-konva-utils';
import CanvasText, {CanvasTextType} from './CanvasText'
import {RefType} from '../GlobalType'
import {createStyles} from '../helpers/createStyles'
import {updateEditingField, updateText, TextStyleType, TextType} from '../../store/reducers/canvasReducer'
import uuid from 'react-uuid'
interface Props {
    isSelected: boolean,
    stageRef: any,
    transformable: boolean,
    text: TextType,
    dispatch: any,
    field: string,
    state: any,
    x: number,
    y: number,
    width: number,
    height: number,
    erDiagramRef: any,
    row: any,
    table: any
}

function EditableText(props:Props) {
    const {text, dispatch, field, state, stageRef, x, y, width, height, erDiagramRef,
    row, table} = props
    const trRef = useRef() as any
    const textRef = React.useRef() as any
    const tables = state.canvases.tables
    const [canvasTextProps, setCanvasTextProps] = useState<CanvasTextType>({
      display: false,
      styles: {},
      text: text.text
    })
    console.log(text)


    useEffect(() => {
        if (props.isSelected) {
          // we need to attach transformer manually
          trRef?.current?.nodes([textRef.current]);
          //trRef?.current?.getLayer().batchDraw();
        }
      }, [props.isSelected]);



    const [textOptions, setTextOptions] = useState({
        x,
        y,
        width,
        height,
      });

    const onDragEnd = (e:any) => {
        setTextOptions({
            ...textOptions,
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
            setTextOptions({
                ...textOptions,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            })
    }

    const onClick = (e:any) => {
      console.log('it clicked in EditableText')
      switch (e.evt.detail) {
        case 1:
          //props.onSelect(e)
          break
        case 2:
          textRef?.current?.hide()
          trRef?.current?.hide()
          const styles = createStyles(textRef, erDiagramRef, stageRef, dispatch)
          setCanvasTextProps({
            ...canvasTextProps,
            styles,
            display: true})
          const tableIndex = tables.indexOf(table)
          const rowIndex = field !== "title"?table.rows.indexOf(row):null
          dispatch(updateEditingField({
            rowIndex,
            tableIndex,
            text,
            field: field,
            rows: table.rows
          }))
            break
      }
      // if (props.isSelected) {
      //   textRef?.current?.hide()
      //   trRef?.current?.hide()
      //   const styles = createStyles(textRef, stageRef)
      //   setCanvasTextProps({
      //     ...canvasTextProps,
      //     styles,
      //     display: true})
      // } else {
      //   console.log('onSelect')
      //   props.onSelect()
      // }
    }



    return (
        <>
        <Text
        onClick={onClick}
        ref={textRef}
        {...textOptions}
        draggable={props.transformable}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
        text={text.text}
        fontFamily={text.style?.fontFamily}
        fill={text.style?.color}
        fontStyle={`${text.style?.fontStyle} ${text.style?.fontWeight}`.replaceAll('unset', "")}
        fontSize={text.style?.fontSize}
        textDecoration={text.style?.textDecorationLine}
        align={text.style?.textAlign}
      />
      <CanvasText {...canvasTextProps} setCanvasTextProps={setCanvasTextProps}
      dispatch={dispatch}
      field={field}
      state={state}
      textRef={textRef}
      trRef={trRef}
      row={row}
      table={table}
      />
          {props.isSelected && props.transformable && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                console.log(newBox)
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
  stageRef: null,
  x: 0,
  y: 0
}

export default EditableText
