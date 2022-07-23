import React, {useEffect, useState} from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import styles from '../../styles/RoomsPreview.module.css'
import {RoomType} from '../../types/RoomType'
import RoomPreview from './RoomPreview'
import backendAxios from '../helpers/getAxios';
import { useSession,getSession } from "next-auth/react"
import getAxios from '../helpers/getAxios';
import { CustomSessionType } from '../../types';
import { OWNED_BY_YOU, RECENT, RESTRICTED, STARRED } from '../constant';
import { useAppDispatch, useAppSelector } from '../helpers/hooks';
import { setRooms } from '../../store/reducers/canvasReducer';
import TabType from '../../types/TabType';

interface Props {
    tabName: TabType
}


function RoomsPreview(props:Props) {
    //const [rooms, setRooms] = useState<RoomType[] | null>(null)
    const {tabName} = props
    const { data: session } = useSession()
    const rooms = useAppSelector(state => state.canvases.rooms)
    const dispatch = useAppDispatch()
    const axios = getAxios(session as CustomSessionType | null)
    const currentUser = useAppSelector(state => state.users.currentUser)
    const DUMMY_STARRED_ROOM_IDS = "fafearerearearea"
    useEffect(() => {
        getRooms()
    }, [tabName, session])

    const getRooms = async () => {
        let endpoint;
        switch(tabName) {
            case RECENT:
                endpoint = `api/v1/history`
                break;
            case STARRED:
                const starredRoomIds = currentUser !== null && currentUser.starredRoomIds.length > 0 ? currentUser.starredRoomIds: DUMMY_STARRED_ROOM_IDS
                endpoint = `api/v1/room/list?id=${starredRoomIds}`
                break;
            case OWNED_BY_YOU:
                endpoint = `api/v1/room/list?owners=${session?.id}`
                break;
            default:
                endpoint = `api/v1/room/list?owners=${session?.id}`
        }
        try {
            const res = await axios.get(endpoint)
            console.log(res)
            dispatch(setRooms(res.data))
        } catch(err) {
            console.log(err)
            dispatch(setRooms([]))
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