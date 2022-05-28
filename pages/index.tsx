import type { NextPage } from 'next'
import React, {useState} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import background from "../public/homepage.jpg"
import styles from '../styles/Home.module.css'
import Layout from "../src/components/Layout"
import ColorButton from '../src/components/ColorButton'
import { yellow } from '@mui/material/colors';

import LoginModal from "../src/components/LoginModal"

const Home: NextPage = () => {

    const [open, setOpen] = useState<boolean>(false)
    return (
      <>
      <Layout/>

        <div>
        <div
        className={styles.background}>        
      <Image
        src={background}
        layout="fill"
        
        objectFit="cover"
        alt="background"
        //
      />
      </div>

      <div className={styles.titleContainer}>
      
      <h1 className={styles.titleText}>
          Here&apos;s an easy way to 
          <br/><span>make ER-Diagram</span>
      </h1>
      <ColorButton
      className={styles.startButton}
      color={yellow}
      label="Start Now"
      onClick={() => setOpen(true)}
      />
      </div>
      {open?<LoginModal open={open} setOpen={setOpen}/>:<></>}
    </div>
    </>)

}


export default Home