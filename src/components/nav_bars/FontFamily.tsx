import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useAppSelector, useAppDispatch } from '../../helpers/hooks'
import { updateDefaultTextStyle, increaseDefaultFontSize, decreaseDefaultFontSize} from '../../../store/reducers/canvasReducer';


function FontFamily() {
    const defaultTextStyle = useAppSelector(state => state.canvases.defaultTextStyle)
    const dispatch = useAppDispatch()


    const handleChange = (event: SelectChangeEvent) => {
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
        console.log(e)
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        if (textarea !== null) {
            textarea.style.fontFamily = fontFamily
        }
    }

    const handleClose = (event: React.SyntheticEvent<Element, Event>)  => {
        const newFont = event.target.dataset.value
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        if (textarea !== null) {
            if (newFont === undefined) {
                textarea.style.fontFamily = defaultTextStyle.fontFamily
            } else {
                textarea.style.fontFamily = newFont
                dispatch(updateDefaultTextStyle({...defaultTextStyle, fontFamily: newFont}))
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
          label="font"
        >
            <MenuItem value="Arial" onMouseOver={(e) => handleMouseOver(e,"Arial")}>Arial</MenuItem>
          <MenuItem value="Caribri" onMouseOver={(e) => handleMouseOver(e,"Caribri")}>Caribri</MenuItem>
          <MenuItem value="cursive" onMouseOver={(e) => handleMouseOver(e,"cursive")}>Cursive</MenuItem>
          <MenuItem value="fangsong" onMouseOver={(e) => handleMouseOver(e,"fangsong")}>Fangsong</MenuItem>
          <MenuItem value="fantasy" onMouseOver={(e) => handleMouseOver(e,"fantasy")}>Fantasy</MenuItem>
          <MenuItem value="monospace" onMouseOver={(e) => handleMouseOver(e,"monospace")}>Monospace</MenuItem>
          <MenuItem value="serif" onMouseOver={(e) => handleMouseOver(e,"serif")}>Serif</MenuItem>
        </Select>
      </FormControl>
  )
}

export default FontFamily