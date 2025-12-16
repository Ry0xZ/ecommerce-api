const userDAO = require('../daos/user.dao');

class UserRepository {
  findByEmail(email) {
    return userDAO.findByEmail(email);
  }

  findById(id) {
    return userDAO.findById(id);
  }

  updatePassword(id, hash) {
    return userDAO.updatePassword(id, hash);
  }

  setResetToken(id, tokenHash, exp) {
    return userDAO.setResetToken(id, tokenHash, exp);
  }

  clearResetToken(id) {
    return userDAO.clearResetToken(id);
  }
}

module.exports = new UserRepository();