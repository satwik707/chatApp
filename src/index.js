const express = require('express')
const path = require('path')
const http = require('http')
const app = express()
const socketio = require('socket.io')
const Filter = require('bad-words')
const publicDirectorypath = path.join(__dirname, '../public')
const {addusers,removeuser,getuser,getUsersinRoom}=require('./utils/users')
const {generateMessages, generateLocationMessages} = require('./utils/messages')
app.use(express.static(publicDirectorypath))
const server = http.createServer(app)

const io = socketio(server) //server is made bec it is req by socket here


io.on('connection', (socket) => {
    console.log('new websocket connection')
    
   socket.on('join',({username,room},callback)=>

   {  
        const id=socket.id
        const {user,error}= addusers({id,username,room})
        
        if(error)
        {
            return callback(error)
        }
    
       socket.join(user.room)     //socket has a function to join the room 
       socket.emit('message', generateMessages('admin','welcome ')) //generate function is fn made to take this string and return obj containing timestamp ,msg etc ..all that to be emitted
       socket.broadcast.to(user.room).emit('message', generateMessages('admin',`${user.username} has joined`)) //except the particular socket user everyone else will get the msg
       socket.emit('roomdata',{
           room:user.room,
           users:getUsersinRoom(user.room)
       })
       callback()

   })
    socket.on('sendmessage', (msg, callback) => //received from client to server    data received from client is taken callback
        {
            const user=getuser(socket.id)

            const filter = new Filter()
            if (filter.isProfane(msg)) {
                return callback('Abusive language not permitted')
            }
            io.to(user.room).emit('message', generateMessages(user.username,msg)) //sent from client to server  io to sent to all clients socket to just 1 client
            callback() //runs the client side emit callback
        })

    socket.on('disconnect', () => {
        const user=removeuser(socket.id)
       if(user)
       {
        io.to(user.room).emit('message', generateMessages('admin',`${user.username} has left`))
        io.to(user.room).emit('roomdata',{
            room:user.room,
           users: getUsersinRoom(user.room)
        })
        
       }
    })
    socket.on('sendlocation', (loc, callback) => {
        const user=getuser(socket.id)
        callback()
        const l = `https://google.com/maps?q=${loc[0]},${loc[1]}` //putting latitude and longitude into google maps link
        io.to(user.room).emit('locationMessage', generateLocationMessages(user.username,l))

    })

})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('server is up on', port)
})