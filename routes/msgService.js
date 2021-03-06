const express = require("express");
const DatabaseHandler = require("../modules/database");

const connectionString =
	process.env.DATABASE_URL ||
	"postgres://mm200:passord@localhost:5432/localmsg";

const db = new DatabaseHandler(connectionString);

let router = express.Router();
let messages = [];

router.post("/msg", async (httpReq, httpRes, next) => {
	if (httpReq.body.msg) {
		try {
			const res = await db.insertMessage(httpReq.body.msg);
			if (res instanceof Error) {
				httpRes.statusMessage = res.message || "dont know??";
				httpRes.status(res.statusCode ? res.statusCode : 500).end();
				console.error(res);
			} else {
				httpRes.status(200).send(JSON.stringify({ id: res }));
			}
		} catch (error) {
			console.error(error);
			httpRes.statusCode(500).end();
		}
	} else {
		httpRes.statusMessage = "missing body parameter ";
		httpRes.status(400).end();
	}

	next();
});

router.get("/msgs", (req, res, next) => {
	res.status(200).send(JSON.stringify(messages));
});

router.get("/msg/:id", async (req, res, next) => {
	const envelope = await db.selectMessage(req.params.id);
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
