// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import db from '../models/db.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error('No email found'));

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    if (!user) {
      const newUserId = uuidv4();
      const res = await db.query(
        `INSERT INTO users (id, email)
         VALUES ($1, $2)
         RETURNING *`,
        [newUserId, email]
      );
      user = res.rows[0];
    }

    done(null, user);
  } catch (err) {
    console.error('Google auth error:', err);
    done(err);
  }
}));
