const pg = require("pg");
const BaseError = require("./baseError");
const httpResponseCodes = require("./httpResponsCodes");
const httpResponsCodes = require("./httpResponsCodes");

class DBSaveError extends BaseError {
	constructor() {
		super(httpResponseCodes.SERVER_ERROR, "Could not save message in database");
	}
}

class DatabaseHandler {
	#credentials = null;

	constructor(conectionString) {
		if (!conectionString) {
			throw "Cant create database handler because connection string is missing";
		}
		this.#credentials = { conectionString, ssl: { rejectUnauthorized: false } };
	}

	async insertMessage(message) {
		const client = new pg.Client(this.credentials);
		let results = null;
		try {
			await client.connect();
			results = await client.query(
				'INSERT INTO "msg"("msg") VALUES($1) RETURNING "id"',
				[message]
			);

			if ((results.rowCount = 0)) {
				throw new DBSaveError();
			}

			results = results.rows[0].id;
			client.end();
		} catch (err) {
			client.end();
			results = err;
		}
		return results;
	}

	async selectMessage(messageId) {
		const client = new pg.Client(this.credentials);
		let results = null;
		try {
			await client.connect();
			results = await client.query('SELECT msg from "msg" where id=$1', [
				messageId,
			]);
			results = results.rows[0].msg;
			client.end();
		} catch (err) {
			client.end();
			results = err;
		}
		return results;
	}

	async updateMessage(messageId, message) {}
	async deleteMessage(messageId) {}
}
module.exports = DatabaseHandler;
