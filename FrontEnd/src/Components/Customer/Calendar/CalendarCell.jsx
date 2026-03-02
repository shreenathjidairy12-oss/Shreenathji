import React from "react";
import "../Customer.css";

const CalendarCell = ({ day, entry, isToday }) => {
  if (!day) return <td className="cd-empty" />;

  const classes = [
    "cd-cell",
    isToday ? "cd-today" : "",
    entry ? "cd-has-milk" : ""
  ].join(" ");

  return (
    <td className={classes}>
      <div className="cd-daynum">{day}</div>

      {entry && (
        <div className="cd-milk-info">
          <div className="cd-milk-litres">{entry.litres} L</div>
          <div className="cd-milk-vendor">{entry.vendor}</div>
        </div>
      )}
    </td>
  );
};

export default CalendarCell;