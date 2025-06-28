import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import subtaskRoutes from './routes/subtaskRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/stats', statsRoutes);



app.get('/', (req, res) => {
    res.send('API is working');
  });
  
export default app;
