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

const Home: NextPage = () => {
  const dispatch = useAppDispatch()
  
  return (
    <div>
      <Conva/>
    </div>
  )
}

export default Home
