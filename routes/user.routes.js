import express from 'express';
import passport from 'passport';
import { signup, login, logout, getMe, googleCallback } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Email/Password authentication
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// Debug route to check OAuth callback URL (remove in production)
router.get('/google/debug', (req, res) => {
  const apiUrl = (process.env.API_URL || 'http://localhost:8000').trim().replace(/\/+$/, '');
  const callbackURL = `${apiUrl}/api/v1/user/google/callback`;
  res.json({
    message: 'Google OAuth Configuration',
    apiUrl: process.env.API_URL || 'NOT SET (using default: http://localhost:8000)',
    callbackURL: callbackURL,
    note: 'Make sure this EXACT URL is added in Google Cloud Console as Authorized redirect URI'
  });
});

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth?error=google_auth_failed',
  }),
  googleCallback
);

export default router;
