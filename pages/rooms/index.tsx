import React, { useEffect } from 'react'
import type { NextPage } from 'next'
import Layout from '../../src/components/Layout'
import RoomsTabs from '../../src/components/RoomsTabs'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import getAxios from '../../src/helpers/getAxios'
import { useRouter } from 'next/router'
import { useSession,getSession } from "next-auth/react"
import { RoomType, UserType } from '../../types';
import { getToken } from "next-auth/jwt"
import {CustomSessionType} from "../../types"
import { RESTRICTED } from '../../src/constant';
import { setCurrentUser } from '../../store/reducers/userReducer';
import { useAppDispatch } from '../../src/helpers/hooks';
const secret = process.env.NEXTAUTH_SECRET

interface Props {
  user: UserType | null
}
const Rooms: NextPage = (props) =>  {
  const {user} = props as Props
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const axios = getAxios(session as CustomSessionType | null)
  useEffect(() => {
    dispatch(setCurrentUser(user))
  }, [])

  const onCreate = async () => {
    const room = {
        title: "Untitled",
        owners: [session?.id],
        canEdit: [],
        canRead: [],
        shareStatus: RESTRICTED
    }
    try {
        const res = await axios.post("/api/v1/room", room)
        console.log(res)
        router.push(`/rooms/${res.data.id}`)
    } catch(err) {
        console.log(err)
    }
}

  return (
    <>
    <Layout/>
    <h1>Welcome, {session?.user?.name}!</h1>
    <Button variant="contained" startIcon={<AddIcon />} 
    style={{fontWeight: "bold", marginBottom: "20px"}}
    onClick={onCreate}>
        New
      </Button>
    <RoomsTabs/>
    </>
    
  )
}
export async function getServerSideProps(context:any) {
  const session = await getSession(context)
  const axios = getAxios(session as CustomSessionType | null)
  let user:UserType | null= null
  try {
    const res = await axios.get(`/api/v1/user/${session?.id}`)
    user = res.data
  } catch (err) {
    console.log(err)
  }
  
  return {
    props:{
      user
    }
  }

}
export default Rooms