import React, {useState, useEffect, useRef} from 'react'
import { Navbar, Container,Nav  } from 'react-bootstrap';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import styles from "../../../styles/Navbar.module.css"
import IconButton from '@mui/material/IconButton';

import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import Form from 'react-bootstrap/Form'
import dynamic from 'next/dynamic';
import Divider from '@mui/material/Divider';
import { useAppSelector, useAppDispatch } from '../../helpers/hooks'
import { updateDefaultTextStyle, increaseDefaultFontSize, decreaseDefaultFontSize,
increaseHistoryStep, decreaseHistoryStep} from '../../../store/reducers/canvasReducer';
import FontFamily from './FontFamily';
import Color from './Color';
const ConnectionTypeSelect = dynamic(() => import('../ConnectionTypeSelect'), { ssr: false });
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: "0px",
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: "40px",
    //width: "80px"
  }));


function EditingNavBar() {
    const defaultTextStyle = useAppSelector(state => state.canvases.defaultTextStyle)
    const historyStep = useAppSelector(state => state.canvases.historyStep)
    const history = useAppSelector(state => state.canvases.history)
    const editingTableIndex = useAppSelector(state => state.canvases.editingField?.tableIndex)
    const tables = useAppSelector(state => state.canvases.tables)
    const editingTable = editingTableIndex!==undefined?tables[editingTableIndex]:null 
    //const [fontSize, setFontSize] = useState<number>(defaultTextStyle.fontSize)
    const dispatch = useAppDispatch()
    const fontSizeRef = useRef() as any

    useEffect(() => {
        const input = fontSizeRef.current.getElementsByTagName("input")[0]
        input.value = defaultTextStyle.fontSize
    }, [defaultTextStyle.fontSize])





    const onIncreaseFontSize = () => {
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        dispatch(increaseDefaultFontSize())
        const input = fontSizeRef.current.getElementsByTagName("input")[0]
        input.value = parseInt(input.value) + 1 
        if (textarea !== null && editingTable !== null) {
            const scaleX = editingTable.scale.x
            const scaleY = editingTable.scale.y
            const fontScale = scaleX<scaleY?scaleX:scaleY
            textarea.style.fontSize = parseFloat(input.value)*fontScale + "px"
        }
    }

    const onDecreaseFontSize = () => {
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        dispatch(decreaseDefaultFontSize())
        const input = fontSizeRef.current.getElementsByTagName("input")[0]
        input.value = parseInt(input.value) - 1 
        if (textarea !== null && editingTable !== null) {
            const scaleX = editingTable.scale.x
            const scaleY = editingTable.scale.y
            const fontScale = scaleX<scaleY?scaleX:scaleY
            textarea.style.fontSize = parseFloat(input.value)*fontScale + "px"
        }
    }

    const onTextChange = (e:any) => {
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        dispatch(updateDefaultTextStyle({...defaultTextStyle, fontSize: parseInt(e.target.value)}))
        if (textarea !== null && editingTable !== null) {
            const scaleX = editingTable.scale.x
            const scaleY = editingTable.scale.y
            const fontScale = scaleX<scaleY?scaleX:scaleY
            textarea.style.fontSize = parseFloat(e.target.value) * fontScale + "px"
        }
    }

    const onBoldClick = () => {
        const newFontWeight = defaultTextStyle.fontWeight === "unset"?"bold":"unset"
        dispatch(updateDefaultTextStyle({...defaultTextStyle, fontWeight: newFontWeight}))
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        if (textarea !== null) {
            textarea.style.fontWeight = newFontWeight
        }
    }

    const onItalicClick = () => {
        const newFontStyle = defaultTextStyle.fontStyle === "unset"?"italic":"unset"
        dispatch(updateDefaultTextStyle({...defaultTextStyle, fontStyle: newFontStyle}))
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        if (textarea !== null) {
            textarea.style.fontStyle = newFontStyle
        }
    }

    const onUnderlineClick = () => {
        const newTextDecorationLine = defaultTextStyle.textDecorationLine === "underline"?"unset":"underline"
        dispatch(updateDefaultTextStyle({...defaultTextStyle, textDecorationLine: newTextDecorationLine})) 
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        if (textarea !== null) {
            textarea.style.textDecorationLine = newTextDecorationLine
        }
    }

    const onTextAlignClick = (textAlign:string) => {
        const newTextAlign = textAlign === defaultTextStyle.textAlign?"unset":textAlign
        dispatch(updateDefaultTextStyle({...defaultTextStyle, textAlign: newTextAlign}))
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        if (textarea !== null) {
            textarea.style.textAlign = newTextAlign
        }

    }

    const onUndo = () => {
        dispatch(decreaseHistoryStep())
    }
    const onRedo = () => {
        dispatch(increaseHistoryStep())
    }




  return (
    <Container className={styles.navOptionsContainer} style={{marginTop:"10px"}}>
        <Item className={styles.canvasOption}>
            <IconButton onClick={onUndo} disabled={historyStep === 0}>
        <ArrowBackIcon/>
        </IconButton>

        <IconButton onClick={onRedo} disabled={history.length === historyStep + 1 || history.length === 0}>
        <ArrowForwardIcon/>
        </IconButton>
        </Item>

        <Item className={styles.canvasOption}>
        <FontFamily/>
        </Item>

        <Item  className={styles.canvasOption}>
            <IconButton onClick={() => onDecreaseFontSize()}>
                <RemoveIcon/>
            </IconButton>
          <Input
          id="filled-required"
          type="number"
          defaultValue={defaultTextStyle.fontSize}
          style={{width:"60px"}}
          ref={fontSizeRef}
          onChange={onTextChange}
          endAdornment={<InputAdornment position="end">pt</InputAdornment>}
        />
            <IconButton onClick={() => onIncreaseFontSize()}>
                <AddIcon/>
            </IconButton>

        </Item>

        <Item  className={styles.canvasOption}>
        <IconButton color={defaultTextStyle.fontWeight==="bold"?"primary":"default"}
        onClick={() => onBoldClick()}>
            <FormatBoldIcon/>
        </IconButton>
        <IconButton color={defaultTextStyle.fontStyle==="italic"?"primary":"default"} 
        onClick={() => onItalicClick()}>
            <FormatItalicIcon/>
        </IconButton>
        <IconButton  color={defaultTextStyle.textDecorationLine==="underline"?"primary":"default"} 
        onClick={() => onUnderlineClick()}>
            <FormatUnderlinedIcon/>
        </IconButton>
        <Color/>
        </Item>
        <Item className={styles.canvasOption}>
        <IconButton onClick={() => onTextAlignClick("left")}
        color={defaultTextStyle.textAlign==="left"?"primary":"default"} >
            <FormatAlignLeftIcon/>
        </IconButton>
        <IconButton onClick={() => onTextAlignClick("center")}
        color={defaultTextStyle.textAlign==="center"?"primary":"default"}>
            <FormatAlignCenterIcon/>
        </IconButton>
        <IconButton onClick={() => onTextAlignClick("right")}
        color={defaultTextStyle.textAlign==="right"?"primary":"default"}>
            <FormatAlignRightIcon/>
        </IconButton>
        </Item>
        <Item  className={styles.canvasOption} style={{display:"flex"}}>
            <ConnectionTypeSelect direction="source"/>
            <Divider orientation="vertical" flexItem style={{height:"100%"}}/>
            <ConnectionTypeSelect direction="destination"/>
        </Item>
    </Container>
  )
}

export default EditingNavBar