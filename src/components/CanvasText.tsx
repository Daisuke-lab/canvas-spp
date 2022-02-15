import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { Html } from 'react-konva-utils';
import styles from '../../styles/CanvasText.module.css'
import {updateText} from '../../store/reducers/canvasReducer'
export interface CanvasTextType {
    display: boolean,
    text: string,
    styles: any
}

interface Props extends CanvasTextType {
    setCanvasTextProps: React.Dispatch<React.SetStateAction<CanvasTextType>>,
    textRef: any,
    trRef: any,
    dispatch: any,
    field: string
}
function CanvasText(props:Props) {
    const {field, dispatch} = props
    const canvasText = {display:props.display, text:props.text, styles:props.styles}
    const textareaRef = React.useRef() as React.LegacyRef<HTMLElement<textarea>>;
    const onKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
        const keyCode = e.keyCode;
        if (keyCode === 13) {
            props.setCanvasTextProps({
                ...canvasText,
                display: false
            })
            dispatch(updateText({field, text:canvasText.text}))
            props.textRef?.current?.show()
            props.trRef?.current?.show()
        }
    }

    useEffect(() => {
        console.log("useEffect")
        if (textareaRef?.current !== undefined && textareaRef?.current !== null) {
            console.log("you are here")
            //textareaRef.current.style.height = 'auto';
            //textareaRef.current.style.height = textareaRef?.current.scrollHeight + 3 + 'px';
        }
    },[props.display])

    const onChange = (event:React.ChangeEvent<HTMLTextAreaElement>) => {
        const currentValue = event.currentTarget.value
        props.setCanvasTextProps({
            ...canvasText,
            text: currentValue,
        })
    }
    return (
        <Html
            divProps={{
              style: {
                margin:0,
                padding: 0
              },
            }}
          >
            {props.display?<textarea 
            defaultValue={props.text}
            ref={textareaRef}
            onKeyDown={onKeyDown} 
            onChange={onChange} 
            style={props.styles}
            className={styles.canvasText}/>
            :<></>}
          </Html>
    )
}

export default CanvasText
