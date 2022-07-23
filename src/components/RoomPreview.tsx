import React, {useState} from 'react'
import {RoomType} from '../../types/RoomType'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import styles from '../../styles/RoomPreview.module.css'
import StarIcon from '@mui/icons-material/Star';
import { yellow } from '@mui/material/colors';
import Button from '@mui/material/Button';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import {dateFormatter} from '../helpers/dateFormatter'
import backendAxios from '../helpers/getAxios';
import ColorButton from './ColorButton';
import { useRouter } from 'next/router'
import DeleteForm from './DeleteForm';
import { useSession } from 'next-auth/react';
import { useAppSelector, useAppDispatch } from '../helpers/hooks'
import getAxios from '../helpers/getAxios';
import { CustomSessionType, UserType } from '../../types';
import ShareForm from "./ShareForm"
import { updateCurrentRoom, updateRoom } from '../../store/reducers/canvasReducer';
import { setCurrentUser } from '../../store/reducers/userReducer';


interface Props {
    room: RoomType
}

function RoomPreview(props:Props) {
    const {room} = props
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
    const [shareOpen, setShareOpen] = useState<boolean>(false)
    const router = useRouter()
    const { data: session } = useSession()
    const user = session?.user as UserType
    const dispatch = useAppDispatch()
    const axios = getAxios(session as CustomSessionType | null)
    const currentUser = useAppSelector(state => state.users.currentUser)
    const onStarred = async (add:boolean) => {
        console.log({add})
        
        try {
            let res;
            if (add) {
                res = await axios.put(`/api/v1/user/add_star/${room.id}`)
            } else {
                res = await axios.put(`/api/v1/user/remove_star/${room.id}`)
            }
            console.log(res)
            dispatch(setCurrentUser(res.data))
        } catch(err) {
            console.log(err)
        }
    }

    const onShare = () => {
        dispatch(updateCurrentRoom(room))
        setShareOpen(true)
    }



    

    
    return (
        <Card sx={{ width: 400 }}>

        <div className={styles.imageContainer}>
            <IconButton onClick={() => onStarred(!currentUser?.starredRoomIds?.includes(room.id))}>
                {currentUser?.starredRoomIds?.includes(room.id)?
                <StarIcon color="inherit" style={{color: yellow[700]}}/>
                :<StarBorderIcon color="inherit" style={{color: yellow[700]}}/>
                }
                
            </IconButton>
            <CardMedia
                component="img"
                height="200"
                width="300"
                image={room.previewImg !== null?room.previewImg:"/default_diagram.png"}
                alt={room.title}
            />
        </div>
            

        <CardContent>
            
            <Typography variant="h5" color="text.primary" className={styles.titleText}>
            <ArchitectureIcon/>{room.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                last edited: {dateFormatter(room.updatedAt)}
            </Typography>
        </CardContent>
        <CardActions style={{justifyContent: "space-between"}}>
            <ColorButton label="Open" color={yellow} onClick={() => router.push(`/rooms/${room.id}`)}/>
            <div>
            <IconButton aria-label="share" onClick={onShare}>
                <PeopleIcon/>
            </IconButton>
            <IconButton aria-label="delete" onClick={() => setDeleteOpen(true)}>
                <DeleteIcon/>
            </IconButton>
            </div>
        </CardActions>
        <DeleteForm room={room} open={deleteOpen} setOpen={setDeleteOpen}/>
        <ShareForm open={shareOpen} setOpen={setShareOpen} />
        </Card>
    )
}

export default RoomPreview