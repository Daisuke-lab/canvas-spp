import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import dynamic from 'next/dynamic';
import {useEffect} from 'react'
//import type { RootState, AppDispatch } from '../../store/store'

//const store = dynamic(() => import('../../store/store'), { ssr: false });
import store from '../../store/store'
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch


export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
