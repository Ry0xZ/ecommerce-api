const { Router } = require('express');
const UserRepo = require('../repositories/user.repository');
const { sendResetEmail } = require('../services/mail.service');
const { issueResetLink, consumeResetToken, setNewPassword } = require('../utils/resetPassword');

const router = Router();

router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  const user = await UserRepo.findByEmail(email);

  if (user) {
    const url = await issueResetLink(user, process.env.APP_BASE_URL);
    await sendResetEmail(email, url);
  }

  res.json({ status: 'success', message: 'Si el email existe, se enviará un link.' });
});

router.post('/reset', async (req, res) => {
  const { email, token, newPassword } = req.body;

  const user = await consumeResetToken(email, token);
  if (!user)
    return res.status(400).json({ status: 'error', message: 'Token inválido/expirado' });

  await setNewPassword(user, newPassword);
  res.json({ status: 'success', message: 'Contraseña actualizada' });
});

module.exports = router;