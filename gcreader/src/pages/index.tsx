import React, { useEffect, useState } from "react";
import Tile from "../components/Tile";
import { format, addDays } from 'date-fns';
import styles from './index.module.css';

interface Event {
  title: string;
  startTime: string;
  endTime: string;
}

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      const response = await fetch('/api/call');
      const events = await response.json();
      console.log('Upcoming Events:', events);
      setEvents(events);
      setIsLoading(false);
    }

    fetchEvents();
  }, []);

  // 今日から1週間の日付を生成する関数
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i <= 7; i++) {
      dates.push(format(addDays(new Date(), i), 'yyyy-MM-dd'));
    }
    return dates;
  };

  // イベントを日付ごとにグループ化する関数
  const groupEventsByDate = (events: Event[]) => {
    const timeZone = 'Asia/Tokyo'; // JSTのタイムゾーンを指定
    const grouped = events.reduce((acc, event) => {
      // UTCの日時をJSTに変換する必要がなくなったため、直接JSTで日時を扱う
      const eventDate = new Date(event.startTime);
      const date = format(eventDate, 'yyyy-MM-dd'); // 日付部分を取得
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as Record<string, Event[]>);
  
    // 今日から1週間の日付ごとに空の配列を確保
    const weekDates = generateWeekDates();
    weekDates.forEach(date => {
      if (!grouped[date]) {
        grouped[date] = [];
      }
    });
  
    return grouped;
  };

  const groupedEvents = groupEventsByDate(events);

  // どこにも属さないイベントを格納する配列
  const ungroupedEvents = events.filter(event => {
    const date = event.startTime.split('T')[0];
    return !groupedEvents.hasOwnProperty(date);
  });

  return (
    <div className={styles.container}>
      <h1>Upcoming Events</h1>
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        <>
          {Object.entries(groupedEvents).map(([date, events]) => (
            <div className={styles['events-group']} key={date}>
              <h2>{date}</h2>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <Tile key={index} title={event.title} start={event.startTime} end={event.endTime} />
                ))
              ) : (
                <p>イベントはありません</p>
              )}
            </div>
          ))}
          {ungroupedEvents.length > 0 && (
            <div className={styles['events-group']}>
              <h2>未分類のイベント</h2>
              {ungroupedEvents.map((event, index) => (
                <Tile key={index} title={event.title} start={event.startTime} end={event.endTime} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Index;