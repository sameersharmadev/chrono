import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
}));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: false,
}), (req, res) => {
  const user = req.user;

  if (!user || !user.email) {
    console.error(' No email found in Google profile:', user);
    return res.status(500).send('Google account has no email associated.');
  }

  const token = jwt.sign({
    id: user.id,
    email: user.email,
    name: user.name,
  }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return res.redirect(redirectUrl);
});

export default router;
