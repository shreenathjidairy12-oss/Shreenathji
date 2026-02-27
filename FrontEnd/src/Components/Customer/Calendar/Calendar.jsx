// Calendar.jsx
import React from "react";
import { generateCalendarMatrix } from "../utils/dateUtils";
import CalendarCell from "./CalendarCell";
// import "./../../Customer.css";
import "../Customer.css";


const weekdayHeaders = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Calendar = ({ year, month, dailyEntries = [] }) => {
  const weeks = generateCalendarMatrix(year, month);
  const today = new Date();

  // helper to find entry for a given day number
  const findEntry = (d) => {
    if (!dailyEntries) return null;
    // dailyEntries contain ISO date strings
    return dailyEntries.find((e) => {
      const dt = new Date(e.date);
      return dt.getFullYear() === year && dt.getMonth() + 1 === month && dt.getDate() === d;
    });
  };

  return (
    <table className="cd-table" role="grid">
      <thead>
        <tr>
          {weekdayHeaders.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, wi) => (
          <tr key={wi}>
            {week.map((day, di) => {
              const entry = day ? findEntry(day) : null;
              const isToday =
                day &&
                today.getFullYear() === year &&
                today.getMonth() + 1 === month &&
                today.getDate() === day;
              return <CalendarCell key={di} day={day} entry={entry} isToday={isToday} />;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Calendar;
