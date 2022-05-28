import React, {useState} from 'react'
import FormModal from './FormModal'
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import {CustomSessionType, RoomType} from '../../types'
import { useRouter } from 'next/router'
import { WindowSharp } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import getAxios from '../helpers/getAxios';



interface Props {
    room: RoomType,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
function DeleteForm(props:Props) {
    const {room, open, setOpen} = props
    const title = "Are you sure?"
    const [input, setInput] = useState<string>('')
    const router = useRouter()
    const { data: session } = useSession()
    const axios = getAxios(session as CustomSessionType | null)

    const formModalProps = {title, open, setOpen}
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const onClick = async () => {
        try {
            const res = await axios.delete(`/api/v1/room/${room.id}`)
            window.location.replace("/rooms")
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <FormModal {...formModalProps}>
            <p>Please type「delete me」to delete {room.title}</p>
            <div style={{textAlign: "center"}}>
            <Input placeholder="delete me" onChange={onChange}/>
            </div>
            <div className="form-modal-button-container">
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" disabled={input!=="delete me"}
            onClick={onClick}>Delete</Button>
            </div>
        </FormModal>
    )
}

export default DeleteForm
