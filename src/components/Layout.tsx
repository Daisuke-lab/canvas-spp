import React, {useState} from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import Avatar from '@mui/material/Avatar';
import { useSession, signIn, signOut } from "next-auth/react"
import LoginModal from './LoginModal';


function Layout(props:any) {

    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { data: session } = useSession()
    const [open, setOpen] = useState<boolean>(false)
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAuth(event.target.checked);
    };
  
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            style={{zIndex: 10}}
            
          >
            <ArchitectureIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ER-Diagram simplified
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                style={{zIndex: 10}}
              >
                {session?.user?.image !== undefined ? (
                  <Avatar alt="Remy Sharp" src={session?.user?.image ?? ""} />)
                  :(<AccountCircle />)}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {session !== null?
                <MenuItem onClick={() => signOut()}>Sign Out</MenuItem>
                :<MenuItem onClick={() => setOpen(true)}>Sign In</MenuItem>}
              </Menu>
              {open?<LoginModal open={open} setOpen={setOpen}/>:<></>}
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Layout