 const {
  scrypt,
  createCipheriv
} = require('crypto');

function encrypt(data){
 
  const algorithm = 'aes-192-cbc';
  const password = 'Password used to generate key';

  const key = scryptSync(password, 'salt', 64, { N: 1024 });
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted
}


module.exports = encrypt