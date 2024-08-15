import http from "node:http";
import { app } from "./app.js";

const server = http.createServer(app);
server.listen(3333, () => console.log("HTTP Server Running"));
