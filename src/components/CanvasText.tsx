import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { Html } from 'react-konva-utils';
import styles from '../../styles/CanvasText.module.css'
import {updateText, updateEditingField, resetEditingField, updateCurrentRoom} from '../../store/reducers/canvasReducer'
import backendAxios from '../helpers/getAxios';
import { RootState, AppDispatch } from '../../store/store';
import * as Konva from "konva"
import { useSession } from 'next-auth/react';
import getAxios from '../helpers/getAxios';
import { CustomSessionType } from '../../types';
import { useAppSelector } from '../helpers/hooks';


export interface CanvasTextType {
    id: string,
    display: boolean,
    text: string,
    styles: any
}

interface Props extends CanvasTextType {
    setCanvasTextProps: React.Dispatch<React.SetStateAction<CanvasTextType>>,
    textRef: React.RefObject<Konva.default.Text>,
    trRef: React.RefObject<Konva.default.Transformer>,
    dispatch: AppDispatch,
    field: string,
    state: RootState,
    row: any,
    table: any
}
function CanvasText(props:Props) {

    const {field, dispatch, styles, state, row, table, textRef} = props
    const canvasText = {display:props.display, text:props.text, styles:props.styles, id: props.id}
    const editingField = state.canvases.editingField
    const currentRoom = state.canvases.currentRoom
    const {transform, ...textareaStyle} = styles
    const scales = transform?.split(/\(|\)/) ??[]
    const session = state.users.session
    const axios = getAxios(session as CustomSessionType | null)
    console.log(textRef.current?.getStage())

    
    let scaleX = null
    let scaleY = null
    let rotateZ = null
    for (let i=0; i < scales.length; i++) {
        const scale = scales[i]
        switch(scale) {
            case "scaleX":
                scaleX = parseFloat(scales[i+1])
            case "scaleY":
                scaleY = parseFloat(scales[i+1])
            case "rotateZ":
                rotateZ = scales[i+1]
        }
    }
    let fontScale = 1;
    if (scaleX !== null) {
        const width = parseFloat(textareaStyle.width?.replaceAll("px", ""))
        textareaStyle.width  = width*scaleX + "px"
    }
    if (scaleY !== null) {
        const height = parseFloat(textareaStyle.height?.replaceAll("px", ""))
        textareaStyle.height = height*scaleY + "px"
    }
    if (rotateZ !== null) {
        textareaStyle.transform = `rotateZ(${rotateZ})`
    }

    if (scaleX !== null && scaleY !== null) {
        fontScale = scaleX<scaleY?scaleX:scaleY
        const fontSize = parseFloat(textareaStyle.fontSize?.replace("px", ""))
        textareaStyle.fontSize = fontSize*fontScale + "px"

        if (scaleX > scaleY) {
            textareaStyle.transform += "scaleY(1)"
            const ratio = scaleX / scaleY
            textareaStyle.transform += `scaleX(${ratio})`
        } else {
            textareaStyle.transform += "scaleX(1)"
            const ratio =  scaleY /scaleX 
            textareaStyle.transform += `scaleY(${ratio})`
        }
    }
    
    const defaultTextStyle = state.canvases.defaultTextStyle
    const tables = state.canvases.tables
    const tableIndex = tables.indexOf(table)
    const rowIndex = field !== "title"?table.rows.indexOf(row):null
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const currentTable = state.canvases.currentTable
    const onKeyDown = async (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
        const keyCode = e.keyCode;
        if (keyCode === 13) {
            props.setCanvasTextProps({
                ...canvasText,
                display: false
            })

            try {
                dispatch(updateText({field, text:canvasText.text, tableIndex, rowIndex, rows: table.rows, id:props.id,
                updatedBy: session?.id}))
                dispatch(resetEditingField())
                props.textRef?.current?.show()
                props.trRef?.current?.show()
                const body = {
                    content: canvasText.text,
                    style: defaultTextStyle,
                    updatedBy: session?.id
                }
                const res = await axios.put(`/api/v1/text/${currentTable?.id}/${props.id}`, body)
                console.log(res)
                
            } catch(err) {
                console.log(err)
                props.textRef?.current?.hide()
                props.trRef?.current?.hide()
            }

            try {
                const newRoom = {...currentRoom, previewImg: textRef.current?.getStage()?.toDataURL()}
                const res = await axios.put(`/api/v1/room/${currentRoom?.id}`, newRoom)
                console.log(res)
                dispatch(updateCurrentRoom(newRoom))
              } catch (err) {
                console.log(err)
              }
        }
    }

    const display = () => {
        if (field !== editingField?.field) {
            return false
        } else if (editingField?.tableIndex !== tableIndex) {
            return false
        } else if (editingField?.rowIndex !== rowIndex) {
            return false
        }
        return true
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
            style={textareaStyle}
            onKeyDown={onKeyDown} 
            onChange={onChange}
            className={styles.canvasText}/>
            :<></>}
          </Html>
    )
}

export default CanvasText
