import { google } from 'googleapis';

export default async function handler(req, res) {
  // Google Calendar APIの設定
  const { calendarId = 'primary' } = req.query;
  const auth = new google.auth.GoogleAuth({
    // ここに認証情報を設定
  });
  const calendar = google.calendar({ version: 'v3', auth });

  const now = new Date();
  const twoWeeksLater = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));

  try {
    const { data } = await calendar.events.list({
      calendarId,
      timeMin: now.toISOString(),
      timeMax: twoWeeksLater.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = data.items.map((event) => ({
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
    }));

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}