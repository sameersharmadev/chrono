import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';

import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import subtaskRoutes from './routes/subtaskRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import './config/passport.js'; 

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://chrono.sameersharma.me'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/stats', statsRoutes); 
app.use('/api/reminders', reminderRoutes); 
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is working');
});

export default app;
