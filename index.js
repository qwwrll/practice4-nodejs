import express from "express";
import { EventEmitter } from "events";
import chalk from "chalk";
import logger from "./logger.js";

const app = express();
const emitter = new EventEmitter();
const PORT = 3000;

emitter.on("newRequest", (url) => {
    console.log(chalk.blue(`[Event] New request received: ${url}`));
});

app.get("/", (req, res) => {
    emitter.emit("newRequest", req.url);
    logger.emit("log", {
        level: "info",
        message: "GET / accessed"
    });

    res.send("Chalk + EventEmitter + Express!");
});

app.get("/info", (req, res) => {
    emitter.emit("newRequest", req.url);
    logger.emit("log", {
        level: "info",
        message: "GET /info accessed"
    });

    res.send("Information page logged in green color!");
});

app.get("/error-demo", (req, res) => {
    logger.emit("log", {
        level: "error",
        message: "Test error message"
    });

    res.status(500).send("This is a test error.");
});

app.use((req, res) => {
    logger.emit("log", {
        level: "warning",
        message: `Unknown route requested: ${req.url}`
    });

    res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
    logger.emit("log", {
        level: "info",
        message: `Server started successfully: http://localhost:${PORT}`
    });
});