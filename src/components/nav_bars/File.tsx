import React from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from "../../../styles/Navbar.module.css"
function File() {
const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMouseOver = (e:React.MouseEvent) => {
  }

  const onSave = () => {
      
  }
  return (
    <>
    <Button
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className={styles.navButton}
      >
        File
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>New</MenuItem>
        <MenuItem onClick={handleClose}>Save</MenuItem>
        <MenuItem onClick={handleClose}>Duplicate</MenuItem>
        <MenuItem onClick={handleClose}>Assign Status</MenuItem>
        <MenuItem onClick={handleClose}>Import</MenuItem>
        <MenuItem onClick={handleClose} onMouseOver={handleMouseOver}>Export</MenuItem>
      </Menu>
    </>
  )
}

export default File