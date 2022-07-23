import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Conva = dynamic(() => import('../../src/components/Conva'), { ssr: false });
import { useAppSelector, useAppDispatch } from '../../src/helpers/hooks'
//import Conva from "../src/components/Conva"
import NavBar from "../../src/components/nav_bars/NavBar"
import {setTables, setConnections, updateCurrentRoom, setCurrentPermission} from "../../store/reducers/canvasReducer"
import {CustomSessionType, TableType} from '../../types'
import backendAxios from '../../src/helpers/getAxios';
import { useRouter } from 'next/router'
import {RoomType} from '../../types/RoomType'
import SockJsClient from 'react-stomp';
import {MessageType} from "../../types"
import { getSession, useSession } from "next-auth/react"
import getAxios from '../../src/helpers/getAxios';
import reflectTableChange from '../../src/helpers/reflectTableChange';
import reflectConnectionChange from '../../src/helpers/reflectConnectionChange';
import ErrorDialog from "../../src/components/ErrorDialog"
import { CAN_EDIT, CAN_READ, NO_PERMISSION, OWNER } from '../../src/constant';
import hasAccessToRoom from '../../src/helpers/hasAccessToRoom';
import getCurrentPermission from '../../src/helpers/getCurrentPermission';
import PermissionType from '../../types/PermissionType';


interface Props {
  tables: TableType[]
  connections: ConnectionType[],
  currentRoom: RoomType,
  permission: PermissionType
}
const SOCKET_URL = 'http://localhost:8000/ws-message';


const Room: NextPage = (props) => {
  const {tables, connections, currentRoom} = props as Props
  const state = useAppSelector(state => state)
  const [errorText, setErrorText] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const handleCloseRef = useRef<() => void>(null)
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const clientRef = useRef<typeof SockJsClient>()
  const router = useRouter()
  const {id:roomId} = router.query
  const { data: session } = useSession()
  const currentPermission = useAppSelector(state => state.canvases.currentPermission)
  let handleClose = () => {
    setErrorDialogOpen(false)
    if (currentPermission === NO_PERMISSION) {
      //router.push("/rooms")
    }
  }

  

  useEffect(() => {
    const permission = getCurrentPermission(currentRoom, session as null | CustomSessionType)
    console.log(currentRoom)
    console.log(session)
    console.log({permission})
    switch(permission) {
      case CAN_READ:
        setTitle("Warning")
        setErrorText("your access level to this room is limited. You can't edit the content.")
        setErrorDialogOpen(true)
        break;
      case NO_PERMISSION:
        setTitle("Permission Error / Not Found")
        setErrorText("you don't have any permission to this room or the room does not exist.")
        setErrorDialogOpen(true)
        break;
      default:
        break;
    }
    dispatch(setCurrentPermission(permission))
  }, [session, currentRoom])


  useEffect(() => {
    dispatch(updateCurrentRoom(currentRoom))
    dispatch(setTables(tables))
    dispatch(setConnections(connections))
  }, [])

  

    const onMessageReceived = (msg:MessageType<any>) => {
        console.log("you've received a new message")
        console.log(msg)
        
        switch (msg.dataType) {
          case "ERDiagram":
            reflectTableChange(state, dispatch, msg)
            //helperで。dispatch, msg, state
          case "Connection":
            reflectConnectionChange(state, dispatch, msg)
        }
      }

  
  return (
    <div>
      <NavBar/>
      {currentPermission !== NO_PERMISSION && currentPermission !== undefined?
      <Conva/>:<></>}
      <SockJsClient
        url={SOCKET_URL}
        topics={[`/user/${roomId}/erDiagrams`, `/user/${roomId}/connections`]}
        // onConnect={console.log("Connected")}
        // onDisconnect={console.log("Disconnected!")}
        onMessage={(msg:any) => onMessageReceived(msg)}
        //debug={true}
        ref={clientRef}
      />
      <ErrorDialog open={errorDialogOpen} setOpen={setErrorDialogOpen} text={errorText} handleClose={handleClose}
      title={title}/>
    </div>
  )
}

export async function getServerSideProps(context:any) {
  const session = await getSession(context)
  console.log({session})
  const axios = getAxios(session as CustomSessionType | null)
  const roomId = context.params.id
  let tables:TableType[] = []
  let connections:ConnectionType[] = []
  let currentRoom:RoomType | null = null

  try {
    const res = await axios.get(`/api/v1/room/${roomId}`)
    currentRoom = res.data
  } catch (err) {
    console.log(err)
  }
  try {
    const res = await axios.get(`/api/v1/erDiagram/list/${roomId}`)
    tables = res.data
  } catch(err) {
    console.log(err)
  }

  try {
    const res = await axios.get(`/api/v1/connection/list/${roomId}`)
    connections = res.data
  } catch(err) {
    console.log(err)
  }

  // if (!hasAccessToRoom(currentRoom, session as CustomSessionType | null)) {
  //   return { redirect: {permanent: false,
  //     destination: '/'} }
  // }
  
  return {
    props: {
      tables,
      connections,
      currentRoom
    },
  }
}

export default Room
