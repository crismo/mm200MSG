const createHash = require("crypto")
const hash = createHash('sha256');

class User{
  constructor(username, psw){
    this.id = Math.random().toString(32).slice(1); // bad random id. reprecents what the DB would auto generate. 
    this.username = username;
    this.password = hash.update(psw + "random_SecretStuff").digest('hex');
  }
}

class Users{
  constructor(){
    this.users = []; // This reprecents a database of some sort. 
  }

  function getUser(username, password){
    const user = new User(username, password);
    const found = this.user.find(u => u.username === user.username && u.password === u.password)
    return found
  }

  function createDummyUsers{

    this.users.push(new User("Test","passord"));
    this.users.push(new User("Test2","annet passord"));


  }

}

module.exports = {User,Users}