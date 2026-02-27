// CalendarCell.jsx
import React from "react";
// import "./../../Customer.css";
// import "../Customer.css";
import "../Customer.css";



const CalendarCell = ({ day, entry, isToday }) => {
  if (!day) return <td className="cd-empty" />;

  return (
    <td className={isToday ? "cd-cell cd-today" : "cd-cell"} title={entry ? `${entry.vendor} — ${entry.litres} L` : ""}>
      <div className="cd-daynum">{day}</div>

      {entry ? (
        <div className="cd-dayinfo">
          <div className="cd-litres">{entry.litres} L</div>
          {/* vendor hidden by default; shown on hover via CSS tooltip */}
          <div className="cd-vendor" aria-hidden="true">{entry.vendor}</div>
        </div>
      ) : null}
    </td>
  );
};

export default CalendarCell;
