import React, {useState} from 'react'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { SketchPicker } from 'react-color';
import { useAppSelector, useAppDispatch } from '../../helpers/hooks'
import { updateConnections, updateDefaultConnectionOption, updateDefaultTextStyle } from '../../../store/reducers/canvasReducer';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CloseIcon from '@mui/icons-material/Close';


function Color() {
    const [open, setOpen] = useState<boolean>(false)
    const defaultTextStyle = useAppSelector(state => state.canvases.defaultTextStyle)
    const dispatch = useAppDispatch()

    const handleTooltipClose = (e:any) => {
        console.log(e)
        setOpen(false);
      };
    
      const handleTooltipOpen = () => {
        setOpen(true);
      };

    const handleChange = (color:any) => {
        //setColor(color.hex)
        const textareas = document.getElementsByTagName('textarea')
        const textarea = textareas.length > 0?textareas[0]: null
        if (textarea !== null) {
            textarea.style.color = color.hex
        }
        dispatch(updateDefaultTextStyle({...defaultTextStyle, color: color.hex}))
      };

  return (
    <Tooltip
    PopperProps={{
      disablePortal: true,
    }}
    onClose={handleTooltipClose}
    open={open}
    disableFocusListener
    disableHoverListener
    disableTouchListener
    title={
        <React.Fragment>
            <IconButton style={{float:"right"}} onClick={handleTooltipClose}>
            <CloseIcon />
            </IconButton>
          <SketchPicker 
          color={defaultTextStyle.color}
          onChange={handleChange}
          />
        </React.Fragment>
      }
  >
    <IconButton onClick={handleTooltipOpen} style={{color: defaultTextStyle.color}}>
        <FormatColorTextIcon/>
    </IconButton>
  </Tooltip>
  )
}

export default Color