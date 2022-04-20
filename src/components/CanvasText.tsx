import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { Html } from 'react-konva-utils';
import styles from '../../styles/CanvasText.module.css'
import {updateText, updateEditingField, resetEditingField} from '../../store/reducers/canvasReducer'
import backendAxios from '../helpers/axios';
export interface CanvasTextType {
    id: string,
    display: boolean,
    text: string,
    styles: any
}

interface Props extends CanvasTextType {
    setCanvasTextProps: React.Dispatch<React.SetStateAction<CanvasTextType>>,
    textRef: any,
    trRef: any,
    dispatch: any,
    field: string,
    state: any,
    row: any,
    table: any
}
function CanvasText(props:Props) {
    const {field, dispatch, styles, state, row, table} = props
    const canvasText = {display:props.display, text:props.text, styles:props.styles, id: props.id}
    const editingField = state.canvases.editingField
    const defaultTextStyle = state.canvases.defaultTextStyle
    const tables = state.canvases.tables
    const tableIndex = tables.indexOf(table)
    const rowIndex = field !== "title"?table.rows.indexOf(row):null
    const textareaRef = React.useRef() as React.LegacyRef<HTMLElement<textarea>>;
    const currentTable = state.canvases.currentTable
    const onKeyDown = async (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
        const keyCode = e.keyCode;
        if (keyCode === 13) {
            props.setCanvasTextProps({
                ...canvasText,
                display: false
            })

            try {
                dispatch(updateText({field, text:canvasText.text, tableIndex, rowIndex, rows: table.rows, id:props.id}))
                dispatch(resetEditingField())
                props.textRef?.current?.show()
                props.trRef?.current?.show()
                const body = {
                    content: canvasText.text,
                    style: defaultTextStyle
                }
                console.log({content: canvasText.text})
                const res = await backendAxios.put(`/api/v1/text/${currentTable?.id}/${props.id}`, body)
                console.log(res.data)
                
            } catch(err) {
                console.log(err)
                props.textRef?.current?.hide()
                props.trRef?.current?.hide()
            }
        }
    }

    const display = () => {
        let show = true
        if (field !== editingField?.field) {
            show = false
        } else if (editingField?.tableIndex !== tableIndex) {
            show = false
        } else if (editingField?.rowIndex !== rowIndex) {
            show = false
        }
        return show
    }

    
    useEffect(() => {
        if (!display()) {
            props.textRef?.current?.show()
            props.trRef?.current?.show()
        } else {
            props.textRef?.current?.hide()
            props.trRef?.current?.hide()
        }
    }, [editingField])



    const onChange = (event:React.ChangeEvent<HTMLTextAreaElement>) => {
        const currentValue = event.currentTarget.value
        props.setCanvasTextProps({
            ...canvasText,
            text: currentValue,
        })
        dispatch(updateEditingField({...editingField, field, text: currentValue, tableIndex: tableIndex,
        rowIndex: rowIndex}))
    }
    return (
        <Html
        divProps={
            {style:{
                transform: "none"
            }}
        }
          >
            {display()?<textarea 
            defaultValue={props.text}
            ref={textareaRef}
            style={styles}
            onKeyDown={onKeyDown} 
            onChange={onChange}
            className={styles.canvasText}/>
            :<></>}
          </Html>
    )
}

export default CanvasText
