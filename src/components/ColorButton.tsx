import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import React, {useState} from 'react'
 
interface Props {
    color: any,
    label: string,
    style?: any,
    className?: string,
    href?: string,
    type?: "button" | "submit" | "reset" | undefined
    onClick?: any,
    disabled: boolean
}
const ColorButton = (props:Props) => {
    const {style, className} = props;
    const CustomButton = styled(Button)(({ theme }) => ({
        color: props.color[50],
        border: `1px solid ${props.color[500]}`,
        
        backgroundColor: props.disabled?"lightgrey":props.color[700],
        '&:hover': {
          backgroundColor: props.color[800],
          border: `1px solid ${props.color[600]}`
        },
      }))
    return (
        <CustomButton
        variant="outlined" onClick={() => props.onClick()} href={props.href}
        className={className} style={style}
        type={props.type}
        disabled={props.disabled}
        >{props.label}
        </CustomButton>
    )
}

ColorButton.defaultProps = {
  disabled: false,
  style: {},
  className: ""
};
 
export default ColorButton 