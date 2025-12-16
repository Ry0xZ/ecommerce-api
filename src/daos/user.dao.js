const User = require('../models/User');

class UserDAO {
  findByEmail(email) {
    return User.findOne({ email });
  }

  findById(id) {
    return User.findById(id);
  }

  updatePassword(id, newHash) {
    return User.findByIdAndUpdate(id, { password: newHash });
  }

  setResetToken(id, tokenHash, exp) {
    return User.findByIdAndUpdate(id, {
      resetTokenHash: tokenHash,
      resetTokenExp: exp
    });
  }

  clearResetToken(id) {
    return User.findByIdAndUpdate(id, {
      $unset: { resetTokenHash: 1, resetTokenExp: 1 }
    });
  }
}

module.exports = new UserDAO();