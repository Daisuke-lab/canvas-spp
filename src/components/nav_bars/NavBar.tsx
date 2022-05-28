import React, {ChangeEvent, useState} from 'react'
import { Navbar, Container,Nav  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import styles from "../../../styles/Navbar.module.css"
import EditingNavBar from './EditingNavBar'
import File from './File'
import Input from '@mui/material/Input';
import { Room } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../helpers/hooks'
import backendAxios from '../../helpers/getAxios';
import { useSession } from 'next-auth/react';
import getAxios from '../../helpers/getAxios';
import { CustomSessionType } from '../../../types';
import Button from '@mui/material/Button';
import ShareForm from './ShareForm';
import { CAN_EDIT, OWNER } from '../../../types/PermissionType';



function NavBar() {

  
  const currentRoom = useAppSelector(state => state.canvases.currentRoom)
  const currentPermission = useAppSelector(state => state.canvases.currentPermission)
  const canEdit = [CAN_EDIT, OWNER].includes(currentPermission)
  const initialTitle = currentRoom !== null && currentRoom?.title !== undefined?currentRoom?.title:"Untitled"
  const { data: session } = useSession()
  const axios = getAxios(session as CustomSessionType | null)
  const [shareOpen, setShareOpen] = useState<boolean>(false) 
  const onKeyDown = async (e:React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = e.keyCode;
    const target = e.target as HTMLInputElement
    if (keyCode === 13) {
      const newRoom = {
        ...currentRoom,
        title: target.value
      }
      try {
        const res = await axios.put(`/api/v1/room/${currentRoom?.id}`, newRoom)
        console.log(res)
        target.blur()
      } catch (err) {
        console.log(err)
      }
    }
  }
  return (
    <>
  <Navbar bg="dark" variant="dark" className={styles.navBar}>
    <Container className={styles.navBarContainer}>
          <ArchitectureIcon className={styles.navBarIcon}/>
      <Input
          defaultValue={initialTitle}
          className={styles.titleInput}
          onKeyDown={onKeyDown}
          disabled={!canEdit}
        />
    </Container>
    <Container className={styles.navOptionsContainer}>
      <Nav.Item className={styles.navOption}>
          <File/>
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          Edit
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          Select
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          View
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          Insert
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          <Button className={styles.navButton} onClick={() => setShareOpen(true)}>
            Share
          </Button>
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          Help
      </Nav.Item>
    </Container>
    <EditingNavBar/>
  </Navbar>
  <ShareForm open={shareOpen} setOpen={setShareOpen} />
</>
  )
}

export default NavBar