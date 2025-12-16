const crypto = require('crypto');
const dayjs = require('dayjs');
const { createHash, isValidPassword } = require('./authUtils');
const UserRepo = require('../repositories/user.repository');

function hashToken(t) {
  return crypto.createHash('sha256').update(t).digest('hex');
}

async function issueResetLink(user, baseUrl) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expires = dayjs().add(1, 'hour').toDate();

  await UserRepo.setResetToken(user._id, tokenHash, expires);

  const url = `${baseUrl}/reset-password?token=${token}&email=${user.email}`;
  return url;
}

async function consumeResetToken(email, token) {
  const user = await UserRepo.findByEmail(email);
  if (!user) return null;

  const valid =
    user.resetTokenHash === hashToken(token) &&
    dayjs().isBefore(user.resetTokenExp);

  if (!valid) return null;

  return user;
}

async function setNewPassword(user, newPass) {
  if (await isValidPassword(user, newPass))
    throw new Error("No podés usar la misma contraseña anterior");

  const newHash = createHash(newPass);
  await UserRepo.updatePassword(user._id, newHash);
  await UserRepo.clearResetToken(user._id);
}

module.exports = { issueResetLink, consumeResetToken, setNewPassword };