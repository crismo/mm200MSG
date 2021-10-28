const express = require("express");
const Logger = require("./modules/utils");
const server = express();
const msgService = require("./routes/msgService.js");
const port = process.env.PORT || 8080;
const cryptoKey = process.env.CRYPTO_KEY || "ikke live. lokal";

const logger = Logger(["/msg", "/msgs"]);

server.set("port", port);
server.use(express.static("public"));
server.use(express.json());
server.use(logger);
server.use(msgService);

server.on("uncaughtException", function (err) {});

server.listen(server.get("port"), function () {
	console.log("server running", server.get("port"));
});
