
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

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}:AppProps) {
  return (
    <Provider  store={store}>
    <SessionProvider session={session}>
      <Auth>
        <Component {...pageProps}  store={store} />
      </Auth>
    </SessionProvider>
    </Provider>
  )
}

function Auth({ children }:any) {
  const { data: session, status } = useSession()
  const dispatch = useDispatch()
  //dispatch(updateSession(session))
  const isUser = !!session?.accessToken
  const [noAuth, setNoAuth] = useState<boolean>(false)
  const noAuthPages = ["/"]
  const router = useRouter()
  useEffect(() => {
    const isNoAuth = noAuthPages.includes(window.location.pathname)
    setNoAuth(isNoAuth)
    if (status === "loading") return // Do nothing while loading
    if (!isUser &&!isNoAuth) {signIn()} // If not authenticated, force log in
    if (noAuth && isUser) {router.push('/rooms')}
  }, [isUser, status])


  if (isUser || noAuth) {
    return children
  }

  return <div style={{textAlign: "center", marginTop: "100px"}}>
          <CircularProgress style={{width: "70px", height: "70px"}}/>
          </div>
}

