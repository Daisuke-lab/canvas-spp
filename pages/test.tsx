import type { NextPage } from 'next'
import React, {useState, useRef} from 'react'
import SockJsClient from 'react-stomp';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
const SOCKET_URL = 'http://localhost:8000/ws-message';


const Test: NextPage = () => {

    const [message, setMessage] = useState<string>("you haven't got any message yet")
    const clientRef = useRef<typeof SockJsClient>()

    const onMessageReceived = (msg:any) => {
        console.log("you've received a new message")
        console.log(msg)
        setMessage(msg.message);
      }

    const onSubmit = (e:SubmitEvent) => {
        e.preventDefault();
        const value = e.target[0].value
        console.log(clientRef)
        clientRef.current.sendMessage("/app/hello",JSON.stringify({message:value}))

    }

    return (
        <div>
            <p>this is websocket test page</p>
            <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/greetings']}
        onConnect={console.log("Connected")}
        onDisconnect={console.log("Disconnected!")}
        onMessage={(msg:any) => onMessageReceived(msg)}
        debug={true}
        ref={clientRef}
      />
      <div>{message}</div>
      <form onSubmit={onSubmit}>
      <TextField id="filled-basic" label="Filled" variant="filled" />
      <Button variant="text" type="submit">Send</Button>
      </form>
        </div>)
}

export default Test