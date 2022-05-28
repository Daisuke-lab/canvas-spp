import React from 'react'
import type { NextPage } from 'next'
import Layout from '../../src/components/Layout'
import RoomsTabs from '../../src/components/RoomsTabs'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import getAxios from '../../src/helpers/getAxios'
import { useRouter } from 'next/router'
import { useSession,getSession } from "next-auth/react"
import { RoomType } from '../../types';
import { getToken } from "next-auth/jwt"
import {CustomSessionType} from "../../types"
const secret = process.env.NEXTAUTH_SECRET

const Rooms: NextPage = (props) =>  {
  const router = useRouter()
  const { data: session } = useSession()
  const axios = getAxios(session as CustomSessionType | null)
  console.log(session)
  //console.log(document.cookie)

  const onCreate = async () => {
    const room = {
        title: "Untitled",
        starred: false,
        ownerId: session?.id,
        canEdit: [session?.id]
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
  const token = await getToken({ req:context.req, secret })
  const session = await getSession({req:context.req})
  
  return {
    props:{}
  }

}
export default Rooms