const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
require('dotenv').config()
const cors = require('cors')
const ConnectDB = require('./DataBase')

const app = express()
const server=http.createServer(app)
const io = new Server(server);


// Middlewares
app.use(cors())
app.use(express.json())
// Routes


const PORT= process.env.PORT
server.listen(PORT,()=>{
    console.log(`server listen on port ${PORT}`)
    ConnectDB();
})

