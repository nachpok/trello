import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { authRoutes } from "./api/auth/auth.routes.js";
import { userRouter } from "./api/user/user.routes.js";
import { boardRouter } from "./api/board/board.routes.js";
import { setupSocketAPI } from "./services/socket.service.js";
import { setupAsyncLocalStorage } from "./middlewares/setupAls.middleware.js";
const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5174",
    "http://localhost:5174",
    "https://www.pyello.com",
  ],
  credentials: true,
};
//config
app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "200kb" }));

app.all("*", setupAsyncLocalStorage);

//Routes
app.use("/api/boards", boardRouter);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);

app.get("/**", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});
const io = setupSocketAPI(server);
app.set("io", io);

const port = 3030;
server.listen(port, () => {
  console.log(`Server listening on port http://127.0.0.1:${port}`);
});
