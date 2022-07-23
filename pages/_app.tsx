
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store/store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import '../styles/globals.css'
import React, {useEffect, useState} from 'react'
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios"
import { updateSession } from "../store/reducers/userReducer"
import { SnackbarProvider} from 'notistack';


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}:AppProps) {
  return (
    <Provider  store={store}>
    <SessionProvider session={session}>
    <SnackbarProvider maxSnack={3}>
      <Auth>
        <Component {...pageProps}  store={store} />
      </Auth>
      </SnackbarProvider>
    </SessionProvider>
    </Provider>
  )
}

function Auth({ children }:any) {
  const { data: session, status } = useSession()
  const dispatch = useDispatch()
  //dispatch(updateSession(session))
  console.log(session)
  const isUser = !!session?.accessToken && session != null
  const [noAuth, setNoAuth] = useState<boolean>(false)
  const router = useRouter()
  useEffect(() => {
    const isNoAuth = isNoAuthPage(window.location.pathname)
    setNoAuth(isNoAuth)
    if (status === "loading") return // Do nothing while loading
    if (!isUser &&!isNoAuth) {signIn()} // If not authenticated, force log in
    if (noAuth && isUser && !isRoomPage(window.location.pathname)) {router.push('/rooms')}
  }, [isUser, status])


  if (isUser || noAuth) {
    return children
  }

  return <div style={{textAlign: "center", marginTop: "100px"}}>
          <CircularProgress style={{width: "70px", height: "70px"}}/>
          </div>
}

const isRoomPage = (pathname:string) => {
  const regex = /rooms\/*/
  if (pathname === "/rooms") {
    return false
  } else if (pathname.match(regex) !== null) {
    return true
  }
  return false
}

const isNoAuthPage = (pathname:string) => {
  if (isRoomPage(pathname)) {
    return true
  }
  const noAuthPages = ["/"]
  if (noAuthPages.includes(pathname)) {
    return true
  }
  return false 
}

