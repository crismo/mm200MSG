const express = require("express");
let router = express.Router();

let messages = [];

router.post("/msg", (httpReq, httpRes, next) => {
	if (httpReq.body.msg) {
		let envelope = {
			id: Math.random().toString(32).slice(2),
			msg: httpReq.body.msg,
		};
		messages.push(envelope);
		httpRes.status(200).send(JSON.stringify({ id: envelope.id }));
	} else {
		httpRes.statusMessage = "missing body parameter ";
		httpRes.status(400).end();
	}

	next();
});

router.get("/msgs", (req, res, next) => {
	res.status(200).send(JSON.stringify(messages));
});

router.get("/msg/:id", (req, res, next) => {
	req.params.id;
	const envelope = messages.find((element) => element.id === req.params.id);
	if (envelope) {
		res.status(200).send(JSON.stringify(envelope));
	} else {
		res.statusMessage = "No such message ";
		res.status(404).end();
	}
});

router.delete("/msg/:id", (req, res, next) => {
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

router.put("/msg/:id", (req, res, next) => {
	const index = messages.findIndex((envelope) => envelope.id === req.params.id);
	if (index >= 0) {
		messages[index] = req.body.msg;
		res.status(200).end();
	} else {
		res.statusMessage = "No such message ";
		res.status(404);
	}
});

module.exports = router;
