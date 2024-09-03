import { Server } from "socket.io";

export function setupSocketAPI(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? false
          : ["http://localhost:5173"],
      methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("subscribe", (boardId) => {
      socket.join(boardId);
      console.log(`Client subscribed to board: ${boardId}`);
    });

    socket.on("unsubscribe", (boardId) => {
      socket.leave(boardId);
      console.log(`Client unsubscribed from board: ${boardId}`);
    });

    socket.on("board-updated", (board) => {
      socket.to(board.id).emit("board-updated", board);
      socket.to("workspace").emit("workspace-updated", board);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
}