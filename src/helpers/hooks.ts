import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import dynamic from 'next/dynamic';
import {useEffect} from 'react'
//import type { RootState, AppDispatch } from '../../store/store'

//const store = dynamic(() => import('../../store/store'), { ssr: false });
import store, {AppDispatch, RootState} from '../../store/store'



export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
