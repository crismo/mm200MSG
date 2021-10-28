const {Users, User} = require("./users")
const encrypt = require("./crypto")

const users = new Users();
user.createDummyUsers();

const basicAuth = function (req, res, next) {

// INFO : https://en.wikipedia.org/wiki/Basic_access_authentication 

	let authorizationHeader = req.headers["authorization"];

	if (!authorizationHeader) {
		// If there is no authorization header the client has not done a proper request.
		res.status(401).end(); // We respond by telling the client that it has not been authenticated as of yet. (this brakes with basic auth since we are not setting the header)
	} else {
		let credentials = authorizationHeader.split(" ")[1]; // We know that the header value starts with Basic and then a space. Annything following that space will be the credentials from the client.
		let rawData = Buffer.from(credentials, "base64"); // At the moment the the credentials are in a base 64 encoded format, so we must do a transformative step.
		credentials = rawData.toLocaleString().split(":"); // We know that the username and password are delimited by a :. Spliting on : gives us an array wit username at pos 0 and password at pos 1.

		let username = credentials[0].trim();
		let password = credentials[1].trim();

		let user =  users.getUser(username, password); //find the user in the Database

		if (user) {
			// There was a user in the database with the correct username and password
			// This is where we are diverging from the basic authentication standard. by creating a token for the client to use in all later corespondanse.
      
			let token =encrypt(JSON.stringify( { id: user.id, username: user.name })); // Standarden for tokens https://jwt.io/ 
      
			res
				.status(200)
				.send({
					auth: token,
					user: {
						id: user.id,
						name: user.name,
					},
				})
				.end(); // Send token and authenticated user to client.
		} else {
			// The request did not have valid credentials.
			res.status(401).end(); // We respond by telling the client that it has not been authenticated as of yet.
		}
	}
};

module.exports = basicAuth;
