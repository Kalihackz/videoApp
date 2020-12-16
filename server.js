const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug:true
})

app.set("view engine","ejs");
app.use(express.static('public'));

app.use('/peerjs',peerServer);

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})
app.get('/exit',(req,res) => {
    res.render("exit",{});
})

app.get('/:room', (req, res) => {
    res.render("room",{roomId: req.params.room});
})



io.on('connection',socket =>{
    socket.on('join-room',(roomId,userId)=>{
        console.log(`${Object.keys(io.sockets.connected).length} clients connected`);
        io.emit('total',Object.keys(io.sockets.connected).length);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId);
        socket.on('message',data =>{
            io.to(roomId).emit('createMessage',data)
        });

        socket.on('disconnect', () => {
             socket.to(roomId).broadcast.emit('user-disconnected', userId)
             console.log(`${Object.keys(io.sockets.connected).length} clients connected`);
            io.emit('total',Object.keys(io.sockets.connected).length);
          })
    })
})

server.listen('127.0.0.1',process.env.PORT);
