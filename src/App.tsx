import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { addDays, format, subYears } from 'date-fns';
import './App.css';

const STORAGE_KEY = 'workout-heatmap-data';

function getToday() {
  return format(new Date(), 'yyyy-MM-dd');
}

function getYearAgo() {
  return format(subYears(new Date(), 1), 'yyyy-MM-dd');
}

function loadWorkoutData(): string[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveWorkoutData(days: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
}

const App: React.FC = () => {
  const [workoutDays, setWorkoutDays] = useState<string[]>([]);

  useEffect(() => {
    setWorkoutDays(loadWorkoutData());
  }, []);

  useEffect(() => {
    saveWorkoutData(workoutDays);
  }, [workoutDays]);

  const startDate = getYearAgo();
  const endDate = getToday();

  // Generate all days in the range
  const numDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  const allDays = Array.from({ length: numDays + 1 }, (_, i) => format(addDays(new Date(startDate), i), 'yyyy-MM-dd'));

  const values = allDays.map(date => ({
    date,
    count: workoutDays.includes(date) ? 1 : 0,
  }));

  const handleClick = (value: { date: string }) => {
    if (!value?.date) return;
    setWorkoutDays(prev =>
      prev.includes(value.date)
        ? prev.filter(d => d !== value.date)
        : [...prev, value.date]
    );
  };

  return (
    <div className="App">
      <h2>Workout Tracker</h2>
      <p>Click a day to toggle workout status. Data is saved locally.</p>
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          classForValue={value => {
            if (!value) return 'color-empty';
            return value.count ? 'color-workout' : 'color-empty';
          }}
          onClick={handleClick}
          showWeekdayLabels
        />
      </div>
    </div>
  );
};

export default App;
