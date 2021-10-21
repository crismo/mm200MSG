const express = require("express");
const server = express();
const port = process.env.PORT || 8080;

server.set("port", port);
server.use(express.static("public"));
server.use(express.json());

let messages = [];

function log(req, res, next) {
	console.log(req.originalUrl);
	next();
}

server.use(log);

server.post("/msg", (httpReq, httpRes, next) => {
	if (httpReq.body.msg) {
		let envelope = {
			id: Math.random().toString(32).slice(2),
			msg: httpReq.body.msg,
		};
		messages.push(envelope);
		httpRes.status(200).send(JSON.stringify({ id: envelope.id }));
	} else {
		httpRes.statusMessage = "missing body parameter ";
		httpRes.status(400);
	}

	next();
});

server.get("/msg/:id", (req, res, next) => {
	req.params.id;
	const envelope = messages.find((element) => element.id === req.params.id);
	if (envelope) {
		res.status(200).send(JSON.stringify(envelope));
	} else {
		res.statusMessage = "No such message ";
		res.status(404).end();
	}
});

server.delete("/msg/:id", (req, res, next) => {
	const index = messages.findIndex((envelope) => envelope.id === req.params.id);
	if (index >= 0) {
		console.log(messages);
		messages.splice(index, 1);
		console.log(messages);
		res.status(200).end();
	} else {
		res.statusMessage = "No such message ";
		res.status(404).end();
	}
});

server.put("/msg/:id", (req, res, next) => {
	const index = messages.findIndex((envelope) => envelope.id === req.params.id);
	if (index >= 0) {
		messages[index] = req.body.msg;
		res.status(200).end();
	} else {
		res.statusMessage = "No such message ";
		res.status(404);
	}
});

server.listen(server.get("port"), function () {
	console.log("server running", server.get("port"));
});
