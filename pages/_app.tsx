
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store/store'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}:AppProps) {
  return (
    <Provider  store={store}>
    <SessionProvider session={session}>
      <Component {...pageProps}  store={store} />

    </SessionProvider>
    </Provider>
  )
}

// const Redux = () => {
//   type RootState = ReturnType<typeof store.getState>
//   type AppDispatch = typeof store.dispatch


//   const useAppDispatch = () => useDispatch<AppDispatch>()
//   const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// }