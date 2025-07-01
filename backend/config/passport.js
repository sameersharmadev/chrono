import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import db from '../models/db.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  console.log('🔍 Full Google profile:', JSON.stringify(profile, null, 2));

  try {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value || null;

    if (!email) return done(new Error('No email found in Google profile'));

    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    let user;

    if (existingUser.rows.length > 0) {
      user = existingUser.rows[0];
    } else {
      const newUserId = uuidv4();
      const insertRes = await db.query(
        `INSERT INTO users (id, email)
         VALUES ($1, $2)
         RETURNING *`,
        [newUserId, email]
      );

      user = insertRes.rows[0];
    }

    return done(null, user);
  } catch (err) {
    console.error('❌ Error during Google OAuth DB logic:', err);
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
