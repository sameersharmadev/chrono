import app from './app.js';
import { startReminderJob } from './jobs/reminderJob.js';

const PORT = process.env.PORT || 5000;

setInterval(() => {
  fetch('https://chronoapi.sameersharma.me/api/ping')
    .then(res => res.text())
    .then(data => console.log('Keep-alive ping response:', data))
    .catch(err => console.error('Keep-alive ping failed:', err));
}, 14 * 60 * 1000);

app.get('/api/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startReminderJob();
});
