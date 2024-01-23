const express = require("express");
const { Server } = require("socket.io");

const {createServer} = require("http")


const app = express();
const server= createServer(app);

const io= new Server(server,{
    cors:{
        origin:'*',
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.get('/',(req,res)=>{
    res.send("Hello World!")
})

io.on("connection",(socket)=>{
    console.log("User Connected!", socket.id);
    // socket.emit("welcome", "Welcome to the server");
    // socket.broadcast.emit("welcome", `${socket.id} joined the server.`)

    socket.on("message", ({room, message})=>{
        console.log({room, message});
        //socket.broadcast.emit("receive-message", data);
        io.to(room).emit("receive-message", message);
    });

    socket.on("join-room", (room)=>{
        socket.join(room);
        console.log(`user joined room ${room}`)
    })

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", socket.id);
    })
})

server.listen(3000,()=>{
    console.log("Server is running on port 3000")
})