import React, { ReactElement } from 'react'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import styles from '../../styles/FormModal.module.css'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Icon from '@mui/material/Icon';
import ArchitectureIcon from '@mui/icons-material/Architecture';


interface Props{
    open: boolean,
    children: any,
    title:string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    icon?: ReactElement
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    maxHeight: "500px",
    bgcolor: 'background.paper',
    overflow: "auto",
    boxShadow: 24,
    p: 4,
  }  as const;
function FormModal(props:Props) {
    const {open, setOpen, title,icon} = props
    return (
        <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        onClose={() => setOpen(false)}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div>
            <IconButton className={styles.closeIcon} onClick={() => setOpen(false)}>
              <CloseIcon/>
            </IconButton>
            <h1 className={styles.formTitle}><span style={{marginRight: "10px"}}>
            {icon}</span><span>{props.title}</span></h1>
            {props.children}
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
    )
}
FormModal.defaultProps = {
  icon: <ArchitectureIcon />
};
export default FormModal