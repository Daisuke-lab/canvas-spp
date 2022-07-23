import React from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { RESTRICTED, ANYONE_CAN_EDIT, ANYONE_CAN_READ, CAN_EDIT, CAN_READ, OWNER, NO_PERMISSION } from '../constant';
import { useForm, useWatch, useFieldArray} from "react-hook-form";
import { useSnackbar } from 'notistack';
import { removeBlankAndNull } from '../helpers/formInputHelper';
import { updateCurrentRoom, updateRoom } from '../../store/reducers/canvasReducer';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import FormHelperText from '@mui/material/FormHelperText';
import styles from '../../styles/ShareForm.module.css'
import {CustomSessionType, ObjectType, RoomType, UserType} from '../../types'
import Button from '@mui/material/Button';
import getAxios from '../helpers/getAxios';
import { useSession } from 'next-auth/react';


function AddUserForm() {
    const currentRoom = useAppSelector(state => state.canvases.currentRoom)
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { data: session} = useSession()
    const axios = getAxios(session as CustomSessionType | null)
    const { register, handleSubmit, formState:{ errors }, control, reset, setValue } = useForm();
    const onAddUser = async (data:any) => {
        let inputs = removeBlankAndNull(data) as ObjectType
        try {
            const endpoint = `/api/v1/room/add_user/${currentRoom?.id}`
            console.log(inputs)
            const res = await axios.post(endpoint, inputs)
            console.log(res)
            dispatch(updateCurrentRoom(res.data))
            dispatch(updateRoom(res.data))
            enqueueSnackbar("the user successfully added!", { variant: "success" })
        } catch(err:any) {
          console.log(err)
          enqueueSnackbar(err?.response?.data?.message ?? "Sorry. Something went wrong.", { variant: "error" })
          
        }
      }

    const validateEmail = (email:string) => {
        if (email === "") {
            return true
        } else {
            const pattern =  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
            return email.match(pattern) !== null
        }
    
    }

    const email = useWatch({
        control,
        name: "email"
      })

    return (
    <form onSubmit={handleSubmit(onAddUser)}>
        <h4>New User</h4>
      <FormControl error={errors.email?true:false} fullWidth={true}>
      <TextField
              className="form-modal-field"
              style={{width:"100%"}}
              label="email"
              type="email"
              InputProps={{
                  endAdornment: (
                  <Select defaultValue={1} {...register("role")}>
                  <MenuItem value={CAN_EDIT}>As an Editor</MenuItem>
                  <MenuItem value={CAN_READ}>As a Reader</MenuItem>
                  <MenuItem value={OWNER}>As an Owner</MenuItem>
                  </Select>
              )}}
              variant="standard"
              {...register("email", { validate: validateEmail,
              required: false })}
              />
              <FormHelperText>{errors.email?"please make sure the input follows email format":""}</FormHelperText>
          </FormControl>
          
          <div className={styles.buttonContainer}>
          <Button variant="contained" style={{float: "right"}} type="submit" disabled={email===""}>add user</Button>
          </div>
          </form>
  )
}

export default AddUserForm