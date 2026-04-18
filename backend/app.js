// const express=require("express");
// const app=express();
// const http=require("http");
// const cors=require("cors");
// const {Server}=require("socket.io");

// app.use(cors());

// const server =http.createServer(app);


// const io=new Server(server,{
//     cors:{
//         origin:'http://localhost:5173',
//         methods:['GET','POST']
//     }
// })

// io.on("connection",(socket)=>{
//     console.log(`connection final ID:${socket.id}`)
//     socket.on("send_message",(data)=>{
//         console.log(data)
//         socket.broadcast.emit('receive_message',data)
//     })
// })


// server.listen(8000,()=>{
//     console.log("server run on 8000 port");
// })

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log(" Message:", data);

   
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(` User disconnected: ${socket.id}`);
  });
});

server.listen(8000, () => {
  console.log(" Server running on port 8000");
});