import { AnyPtrRecord } from 'dns';
import React, {useRef, useEffect, useState} from 'react'
import { Stage, Layer, Shape, Transformer, Rect, Text, KonvaNodeComponent} from 'react-konva';;
import { Html } from 'react-konva-utils';
import CanvasText, {CanvasTextType} from './CanvasText'
import {createStyles} from '../helpers/createStyles'
import {updateEditingField, updateText} from '../../store/reducers/canvasReducer'
import { TextType, RowType } from '../../types';
import { v4 as uuid } from 'uuid';
import * as Konva from "konva"
import { RootState, AppDispatch } from '../../store/store';
import TableType from '../../types/TableType';
import { CAN_EDIT, OWNER } from '../constant';


interface Props {
    isSelected: boolean,
    stageRef: React.RefObject<Konva.default.Stage>,
    transformable: boolean,
    text: TextType,
    dispatch: AppDispatch,
    field: string,
    state: RootState,
    x: number,
    y: number,
    width: number,
    height: number,
    erDiagramRef: React.RefObject<Konva.default.Group>,
    row: RowType | null,
    table: TableType
}

function EditableText(props:Props) {
    const {text, dispatch, field, state, stageRef, x, y, width, height, erDiagramRef,
    row, table} = props
    const currentPermission = state.canvases.currentPermission
    const trRef = useRef<Konva.default.Transformer>(null)
    const textRef = useRef<Konva.default.Text>(null)
    const tables = state.canvases.tables
    const [canvasTextProps, setCanvasTextProps] = useState<CanvasTextType>({
      id: text.id,
      display: false,
      styles: {},
      text: text.content
    })


    useEffect(() => {
        if (props.isSelected) {
          // we need to attach transformer manually
          if (textRef.current !== null) {
            trRef?.current?.nodes([textRef.current]);
          }
          
          //trRef?.current?.getLayer().batchDraw();
        }
        setCanvasTextProps({
          ...canvasTextProps,
          text: text.content
        })
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
            if (node !== null) {
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
            
    }

    const onClick = (e:any) => {
      console.log("editableText clicked")
      console.log([OWNER, CAN_EDIT])
      if ([OWNER, CAN_EDIT].includes(currentPermission)) {
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
              text: text.content,
              styles,
              display: true})
            const tableIndex = tables.indexOf(table)
            const rowIndex = field !== "title"?table.rows.indexOf(row as RowType):null
            dispatch(updateEditingField({
              rowIndex,
              tableIndex,
              text,
              field: field,
              rows: table.rows
            }))
              break
        }
      } else {
        console.log("you do not have permission")
      }
      
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
        text={text.content}
        fontFamily={text.style?.fontFamily}
        fill={text.style?.color}
        fontStyle={`${text.style?.fontStyle} ${text.style?.fontWeight}`.replaceAll('unset', "")}
        fontSize={text.style?.fontSize !== undefined ?text.style?.fontSize:10}
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
          {props.isSelected && props.transformable && [OWNER, CAN_EDIT].includes(currentPermission) && (
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
  stageRef: null,
  x: 0,
  y: 0
}

export default EditableText
