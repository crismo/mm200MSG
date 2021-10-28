const pg = require("pg");
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
