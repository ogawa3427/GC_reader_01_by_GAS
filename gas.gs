//https://auto-worker.com/blog/?p=4323 + GPT
function doGet(e) {
  // アクセス可能なカレンダーのIDを指定して、Googleカレンダーを取得する
  let myCalendar = CalendarApp.getCalendarById(YOUR_CALENDAR_ID);
  let startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  let endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  endDate.setDate(startDate.getDate() + 7);
  let myEvents = myCalendar.getEvents(startDate, endDate);

  // JSTのタイムゾーンを指定
  let timeZone = 'Asia/Tokyo';
  let eventsDetails = myEvents.map(event => ({
    title: event.getTitle(),
    // Utilities.formatDate()を使用してJSTでフォーマット
    startTime: Utilities.formatDate(event.getStartTime(), timeZone, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    endTime: Utilities.formatDate(event.getEndTime(), timeZone, "yyyy-MM-dd'T'HH:mm:ss'Z'")
  }));

  return ContentService.createTextOutput(JSON.stringify(eventsDetails))
    .setMimeType(ContentService.MimeType.JSON);
}