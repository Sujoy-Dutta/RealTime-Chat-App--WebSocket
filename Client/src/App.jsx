import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {Container, Typography, TextField, Button, Stack} from "@mui/material"
import {io} from 'socket.io-client'

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  console.log("messages", messages);
  const socket = useMemo(()=> io("http://localhost:3000"), []);

  const handleSubmit =(e)=>{
    e.preventDefault();
    socket.emit('message', {message, room});
    setMessage("");
  }
 const joinRoomHandler=(e)=>{
  e.preventDefault();
  socket.emit('join-room', roomName);
  setRoomName("");
 }
  useEffect(()=>{
    socket.on('connect',()=>{
      setSocketId(socket.id);
      console.log("Connected", socket.id)
    });

    socket.on("receive-message",(data)=>{
      setMessages((messages)=>[...messages, data]);
    })

    // socket.on("welcome",(data)=>{
    //   console.log(data)
    // })

    return ()=>{
      socket.disconnect();
    }
  }, []);


  return (
    <Container maxWidth="sm">
    <Typography variant='h1' component="div" gutterBottom>
      Welcome to Socket.io
    </Typography>
    
    <Typography>
      {socketId}
    </Typography>

    <form onSubmit={joinRoomHandler}>
      <h5>Join Room</h5>
      <TextField value={roomName}  onChange={(e)=>setRoomName(e.target.value)} id='outlined-basic' label='Room Name' variant='outlined'/>
      <Button type='submit' variant="contained" color='primary'>Join</Button>
    </form>
    
    <form onSubmit={handleSubmit}>
      <TextField value={message}  onChange={(e)=>setMessage(e.target.value)} id='outlined-basic' label='Message' variant='outlined'/>
      <TextField value={room}  onChange={(e)=>setRoom(e.target.value)} id='outlined-basic' label='Room' variant='outlined'/>
      <Button type='submit' variant="contained" color='primary'>Send</Button>
    </form>
    <Stack>
      {messages.map((m,i)=> 
        <Typography key={i}>
          {m}
        </Typography>
      )
      }
    </Stack>
  </Container>
  )
}

export default App
