import React, {useEffect, useState} from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import styles from '../../styles/RoomsPreview.module.css'
import {RoomType} from '../../types/RoomType'
import RoomPreview from './RoomPreview'
import backendAxios from '../helpers/getAxios';
import { useSession,getSession } from "next-auth/react"
import getAxios from '../helpers/getAxios';
import { CustomSessionType } from '../../types';

interface Props {
    type: "recent" | "starred" | "recommended"
}
const room = {
    title: "Test Title",
    previewImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5bBPoxV61LcgYmwLhno1_pw_xIM6gDyYHeg&usqp=CAU",
    starred: false,
    created_at: new Date(),
    updated_at: new Date()

}

function RoomsPreview(props:Props) {
    const [rooms, setRooms] = useState<RoomType[] | null>(null)
    const { data: session } = useSession()
    const axios = getAxios(session as CustomSessionType | null)
    useEffect(() => {
        getRooms()
    }, [])

    const getRooms = async () => {
        try {
            const res = await axios.get(`api/v1/room/list/${session?.id}`)
            console.log(res)
            setRooms(res.data)
        } catch(err) {
            console.log(err)
            setRooms([])
        }
    }
    return (
        <div className={styles.roomPreviewContainer}>
            {rooms !== null?
            rooms.length > 0?
            (<>
            {rooms.map((room, index) => (
                <>
                <RoomPreview room={room}/>
                </>
            ))}
            </>):
            (<>
            <h5>You don&apos;t have any documents yet.</h5>
            </>)
            :
            <div className={styles.circleContainer}>
            <CircularProgress />
            </div>
            }
        </div>
    )
}

export default RoomsPreview