import React, {useEffect, useState} from 'react'
import {ObjectType, RoomType, UserType} from '../../types'
import FormModal from './FormModal'
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TextField from '@mui/material/TextField';
import { useSession } from 'next-auth/react';
import Avatar from '@mui/material/Avatar';
import styles from '../../styles/ShareForm.module.css'
import Button from '@mui/material/Button';
import { useForm, useWatch, useFieldArray} from "react-hook-form";
import FormControl from '@mui/material/FormControl';
import { CustomSessionType } from '../../types/CustomSessionType';
import getAxios from '../helpers/getAxios';
import Alert from '@mui/material/Alert';
import { RESTRICTED, ANYONE_CAN_EDIT, ANYONE_CAN_READ, CAN_EDIT, CAN_READ, OWNER, NO_PERMISSION } from '../constant';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { mainTheme } from '../../themes/MainTheme';
import LinkIcon from '@mui/icons-material/Link';
import { useSnackbar } from 'notistack';
import { removeBlankAndNull } from '../helpers/formInputHelper';
import ShareStatusType from '../../types/ShareStatusType';
import { updateCurrentRoom, updateRoom } from '../../store/reducers/canvasReducer';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AddUserForm from './AddUserForm';
import MenuItem from '@mui/material/MenuItem';


interface Props {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormType {
  email: string,
  role: string,
  shareStatus: ShareStatusType
}
function ShareForm(props:Props) {

  const currentRoom = useAppSelector(state => state.canvases.currentRoom)
  const dispatch = useAppDispatch();

  const {open, setOpen} = props
  const { enqueueSnackbar } = useSnackbar();
  const { data: session} = useSession()
  const axios = getAxios(session as CustomSessionType | null)
  const title = "Let's share!"
  const formModalProps = {title, open, setOpen}
  const [users, setUsers] = useState<UserType[]>([])
  const [room, setRoom] = useState<RoomType |null>(currentRoom)
  const { register, handleSubmit, formState:{ errors }, control, reset, setValue } = useForm();
  useEffect(() => {
    const formDefaultValues = {
      email: "",
      role: 1,
      shareStatus: currentRoom?.shareStatus ?? RESTRICTED
    }
    Object.keys(formDefaultValues).map((key) => {
      setValue(key, formDefaultValues[key as keyof typeof formDefaultValues])
    })
    getUsers()
    setRoom(currentRoom)
  }, [open])

  const getUsers = async () => {
    try {
      const res = await axios.get(`/api/v1/user/room/${currentRoom?.id}`)
      console.log(res)
      setUsers(res.data)
    } catch (err) {
      console.log(err)
    }
  }
  const shareStatus = useWatch({
    control,
    name: "shareStatus",
  });


  


  const onUpdateRoom = async (data:any) => {
    let inputs = removeBlankAndNull(data) as ObjectType
    let endpoint = ""
    try {
      endpoint = `/api/v1/room/${currentRoom?.id}`
      inputs = {...room, shareStatus: inputs.shareStatus}
      const res = await axios.put(endpoint, inputs)
      console.log(res)
      updateCurrentRoom(res.data)
      dispatch(updateRoom(res.data))
      setOpen(false)
      
      
    } catch (err:any) {
      enqueueSnackbar(err?.response?.data?.message ?? "Sorry. Something went wrong.", { variant: "error" })
    }

  }

  const copyLink = () => {
    const origin = window.location.origin
    navigator.clipboard.writeText(`${origin}/rooms/${currentRoom?.id}`);
    enqueueSnackbar('Link copied', { variant: "success" });
  }


  const permissionChange = (e:SelectChangeEvent, user:UserType) => {
    let newRoom = {...room}
    const newPermission = parseInt(e.target.value)
    if (newRoom !== null) {
      newRoom.canEdit = newRoom?.canEdit?.filter(userId => userId!==user.id)
      newRoom.canRead = newRoom?.canRead?.filter(userId => userId !== user.id)
      newRoom.owners = newRoom?.owners?.filter(userId => userId !== user.id)


    
    switch (newPermission) {
      case CAN_EDIT:
        newRoom.canEdit = [...newRoom?.canEdit as string[], user.id]
        break;
      case CAN_READ:
        newRoom.canRead = [...newRoom?.canRead as string[], user.id]
        break;
      case OWNER:
        newRoom.owners = [...newRoom?.owners as string[], user.id]
      case NO_PERMISSION:
      default:
        break;
    }
    setRoom(newRoom as RoomType)
  }

  }


  return (
    <FormModal {...formModalProps} icon={<PeopleAltIcon color="primary"/>}>
      <AddUserForm/>
      <form onSubmit={handleSubmit(onUpdateRoom)}>
      <h4>Change Authority</h4>
      <div style={{overflow: "auto", maxHeight: "200px"}}>
      {users.map((user, index) => (
        <div className={styles.ownerContainer} key={`${currentRoom?.id}-user-${user?.id}`}>
        <div className={styles.ownerInfo}>
        <Avatar alt="Remy Sharp" src={user?.image ?? ""} />
          <span style={{marginLeft: "10px"}}>{user?.name}<br/>{user?.email}</span>
        </div>
        {currentRoom?.owners.includes(session?.id as string)?(
          <span style={{padding:"5px"}}>
            <FormControl sx={{ m: 0.01, minWidth: 100 }} size="small">
            <Select defaultValue={
                                  currentRoom?.owners.includes(user.id)?OWNER.toString():
                                  currentRoom?.canEdit.includes(user.id)?CAN_EDIT.toString():
                                  currentRoom?.canRead.includes(user.id)?CAN_READ.toString():
                                  NO_PERMISSION.toString()}
                    onChange={(e:SelectChangeEvent) => permissionChange(e, user)}
                    className={styles.selectContainer}>
              <MenuItem value={CAN_EDIT}>Editor</MenuItem>
              <MenuItem value={CAN_READ}>Reader</MenuItem>
              <MenuItem value={OWNER}>Owner</MenuItem>
              <MenuItem value={NO_PERMISSION}>No Permission</MenuItem>
            </Select>
            </FormControl>
          </span>):
          (
            <span style={{padding:"5px"}}>{
              currentRoom?.owners.includes(session?.id as string)?"Owner":
              currentRoom?.canEdit.includes(user.id)?"Editor":
              currentRoom?.canRead.includes(user.id)?"Reader":
              "Unknown"
            }
            </span>
          )}
        
        </div>
      ))}
      </div>
      


      
      <div className={styles.ownerContainer}>
      <div className={styles.ownerInfo}>
      <Avatar alt="Remy Sharp" sx={{ bgcolor: mainTheme.primary }}>
        {shareStatus===0?<LockIcon/>:<PublicIcon/>}
      </Avatar>
        <span style={{marginLeft: "10px"}}>
        <FormControl sx={{ m: 0.01, minWidth: 120 }} size="small" className={styles.selectContainer}>
        <Select defaultValue={currentRoom?.shareStatus ?? RESTRICTED} {...register("shareStatus")}
         className={styles.selectContainer}>
          <MenuItem value={RESTRICTED}>Restricted</MenuItem>
          <MenuItem value={ANYONE_CAN_EDIT}>Anyone can edit</MenuItem>
          <MenuItem value={ANYONE_CAN_READ}>Anyone can read</MenuItem>
        </Select>
      </FormControl>

      <br/>{shareStatus===RESTRICTED?"Only people with access can open with the link"
      :"Anyone on the Internet with the link can access"}</span>
      </div>
      </div>

      <div className={styles.buttonContainer}>
      <Button variant="outlined" startIcon={<LinkIcon/>} onClick={copyLink}>
        Copy link
      </Button>
      <Button variant="contained" style={{float: "right"}} type="submit">save</Button>
      </div>

      </form>
    </FormModal>
  )
}



export default ShareForm