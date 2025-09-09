//? calling the global packages
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const cors = require("cors");
const ConnectDB = require("./DataBase");
const cookieParser = require("cookie-parser");
//?Calling Routes
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const messageRouter = require("./routes/message.route");
const chatRouter = require("./routes/chat.route");
const Auth = require("./middlewares/Auth");
const { initializeSocket, initilaizeIo } = require("./utils/socketsLogic");

//?Servers Intialization
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

//?Global  Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());

//? init the io before ant route to make it global in the controller and the routes (for emiters)
initilaizeIo(io);

//? Routes
app.use("/api/auth", authRouter);
app.use(Auth);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);
app.use("/api/chat", chatRouter);

//? init the socket setup
initializeSocket(io);
//? Http server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`server listen on port ${PORT}`);
  ConnectDB();
});
