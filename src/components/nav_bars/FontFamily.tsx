import React, { useRef } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useAppSelector, useAppDispatch } from '../../helpers/hooks'
import { updateDefaultTextStyle, increaseDefaultFontSize, decreaseDefaultFontSize} from '../../../store/reducers/canvasReducer';


function FontFamily() {
    const defaultTextStyle = useAppSelector(state => state.canvases.defaultTextStyle)
    const dispatch = useAppDispatch()
    const selectRef = useRef<typeof Select>()


    const handleChange = (event: SelectChangeEvent) => {
        console.log("handleChange")
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        const newDefaultTextStyle = {...defaultTextStyle, fontFamily: event.target.value}
        dispatch(updateDefaultTextStyle(newDefaultTextStyle))
        if (textarea !== null) {
            textarea.style.fontFamily = event.target.value
        }
    };

    const handleMouseOver = (e:any, fontFamily:string) => {
        console.log("handleMouseOver")
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        if (textarea !== null) {
            textarea.style.fontFamily = fontFamily
        }
    }

    const handleClose = (event: React.SyntheticEvent<Element, Event>)  => {
        console.log(selectRef?.current)
        //selectRef?.current?.addEventListener("mouseover", () => {});
        const target = event.target as HTMLTextAreaElement
        const newFont = target.dataset.value
        const textareas = document.getElementsByTagName('textarea')
        const textarea:null | HTMLTextAreaElement = textareas.length > 0?textareas[0]: null
        if (textarea !== null) {
            if (newFont === undefined) {
                textarea.style.fontFamily = defaultTextStyle.fontFamily as string
            } else {
                setTimeout(() => {
                    console.log("handleClose")
                    textarea.style.fontFamily = newFont
                    dispatch(updateDefaultTextStyle({...defaultTextStyle, fontFamily: newFont}))
                }, 500)
                
            }
        }

    }

  return (
    <FormControl variant="standard" sx={{ m: 0.5, minWidth: 30 }}>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={defaultTextStyle.fontFamily}
          onChange={handleChange}
          onClose={handleClose}
          ref={selectRef}
          label="font"
        >
            <MenuItem value="Arial" onMouseEnter={(e) => handleMouseOver(e,"Arial")}>Arial</MenuItem>
          <MenuItem value="Caribri" onMouseEnter={(e) => handleMouseOver(e,"Caribri")}>Caribri</MenuItem>
          <MenuItem value="cursive" onMouseEnter={(e) => handleMouseOver(e,"cursive")}>Cursive</MenuItem>
          <MenuItem value="fangsong" onMouseEnter={(e) => handleMouseOver(e,"fangsong")}>Fangsong</MenuItem>
          <MenuItem value="fantasy" onMouseEnter={(e) => handleMouseOver(e,"fantasy")}>Fantasy</MenuItem>
          <MenuItem value="monospace" onMouseEnter={(e) => handleMouseOver(e,"monospace")}>Monospace</MenuItem>
          <MenuItem value="serif" onMouseEnter={(e) => handleMouseOver(e,"serif")}>Serif</MenuItem>
        </Select>
      </FormControl>
  )
}

export default FontFamily