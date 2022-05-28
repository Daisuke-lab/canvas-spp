import React, {useEffect, useState} from 'react'
import {RoomType} from '../../../types'
import FormModal from '../FormModal'
import { useAppSelector, useAppDispatch } from '../../helpers/hooks'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TextField from '@mui/material/TextField';
import { useSession } from 'next-auth/react';
import Avatar from '@mui/material/Avatar';
import styles from '../../../styles/ShareForm.module.css'
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useForm } from "react-hook-form";
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { CustomSessionType } from '../../../types/CustomSessionType';
import getAxios from '../../helpers/getAxios';
import Alert from '@mui/material/Alert';
import { CAN_EDIT, CAN_READ, OWNER } from '../../../types/PermissionType';



interface Props {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormType {
  email: string,
  role: string
}
function ShareForm(props:Props) {

  const currentRoom = useAppSelector(state => state.canvases.currentRoom)
  const [backendError, setBackendError] = useState<string>("")
  const {open, setOpen} = props
  useEffect(() => {
    setBackendError("")
  }, [open])
  const { data: session } = useSession()
  const axios = getAxios(session as CustomSessionType | null)
  const title = "Let's share!"
  const formModalProps = {title, open, setOpen}
  const { register, handleSubmit, formState:{ errors } } = useForm();
  const onSubmit = async (data:any) => {
    const inputs = data as FormType
    console.log({inputs})
    try {
      const res = await axios.post(`/api/v1/room/add_user/${currentRoom?.id}`, inputs)
      console.log(res)
    } catch (err:any) {
      
      setBackendError(err?.response?.data?.message)
    }
    
  }


  return (
    <FormModal {...formModalProps} icon={<PeopleAltIcon color="primary"/>}>
      <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl error={errors.email?true:false} fullWidth={true}>
      <TextField
              className="form-modal-field"
              style={{width:"100%"}}
              label="email"
              type="email"
              InputProps={{
                  endAdornment: (
                  <Select defaultValue="1" {...register("role")}>
                  <MenuItem value={CAN_EDIT}>As a Editor</MenuItem>
                  <MenuItem value={CAN_READ}>As a Reader</MenuItem>
                  <MenuItem value={OWNER}>As a Owner</MenuItem>
                  </Select>
              )}}
              variant="standard"
              {...register("email", { pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              required: true })}
              />
              <FormHelperText>{errors.email?"please make sure the input follows email format":""}</FormHelperText>
          </FormControl>
      <div className={styles.ownerContainer}>
      <div className={styles.ownerInfo}>
      <Avatar alt="Remy Sharp" src={session?.user?.image ?? ""} />
        <span style={{marginLeft: "10px"}}>{session?.user?.name}<br/>{session?.user?.email}</span>
      </div>
      <span style={{padding:"5px"}}>Owner</span>
      </div>
      <div className={styles.buttonContainer}>
      <Button variant="contained" style={{float: "right"}} type="submit">Add</Button>
      </div>
      {backendError!==""?
      <Alert severity="error" style={{marginTop: "10px"}}>{backendError}</Alert>
    :<></>}
      </form>
    </FormModal>
  )
}



export default ShareForm