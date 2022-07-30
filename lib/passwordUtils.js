const bcrypt = require('bcryptjs');

function genPassword(password) {
  return bcrypt.hashSync(password,10)
}

function validPassword(password, hash) {
  return bcrypt.compareSync(password, hash)
}

module.exports = { genPassword, validPassword };
