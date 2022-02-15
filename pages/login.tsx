import React from 'react'
import googlePic from '../public/btn_google_signin_dark_focus_web@2x.png'
import Image from 'next/image'
import { signIn } from "next-auth/react"
function login() {
    const onClick = () => {
        console.log('it clicked')
    }
    return (
        <div>
            <button onClick={() => signIn("google")}>
            <Image
                    src={googlePic}
                    alt="Picture of the author"
                />
            </button>
        </div>
    )
}

export default login
