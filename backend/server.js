import app from './app.js';
import { startReminderJob } from './jobs/reminderJob.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startReminderJob();
});
