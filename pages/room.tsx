import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useRef, useEffect, useState } from 'react';
import useCanvas from '../src/hooks/useCanvas'
import CustomCanvas from '../src/components/CustomCanvas'
import dynamic from 'next/dynamic';
const Conva = dynamic(() => import('../src/components/Conva'), { ssr: false });
import { useAppSelector, useAppDispatch } from '../src/helpers/hooks'
//import Conva from "../src/components/Conva"
import NavBar from "../src/components/nav_bars/NavBar"
import {TableType,setTables, setConnections} from "../store/reducers/canvasReducer"
import backendAxios from '../src/helpers/axios';

interface Props {
  tables: TableType[]
  connections: ConnectionType[]
}
const Room: NextPage = (props) => {
  const {tables, connections} = props as Props
  const dispatch = useAppDispatch()
  dispatch(setTables(tables))
  dispatch(setConnections(connections))
  return (
    <div>
      <NavBar/>
      <Conva/>
    </div>
  )
}

export async function getServerSideProps(context:any) {
  let tables:TableType[] = []
  let connections:ConnectionType[] = []
  try {
    const res = await backendAxios.get("/api/v1/erDiagram")
    tables = res.data
  } catch(err) {
    console.log(err)
  }

  try {
    const res = await backendAxios.get("/api/v1/connection")
    console.log(res)
    connections = res.data
  } catch(err) {
    console.log(err)
  }

  return {
    props: {
      tables,
      connections
    },
  }
}

export default Home
