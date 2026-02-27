import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCustomerCalendar, saveMilkEntry } from "./vendorApi";
import "./Vendor.css";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function VendorMilkCalendar() {
  const { customerId } = useParams();
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [entries, setEntries] = useState([]);
  const [customerName, setCustomerName] = useState("");
const [milkType, setMilkType] = useState(""); // optional, future-ready


  useEffect(() => {
    fetchCalendar();
  }, [month, year]);

  const fetchCalendar = async () => {
    const res = await getCustomerCalendar(customerId, month, year);
    
      setCustomerName(res.data.customerName || "");
  setMilkType(res.data.milkType || ""); // optional
    console.log(customerName);
    

    const normalized = res.data.entries.map((e) => {
      const d = new Date(e.date);
      return {
        day: d.getDate(),
        litres: e.amountML / 1000,
      };
    });

    setEntries(normalized);
  };

  const getEntry = (day) => entries.find((e) => e.day === day);

  const handleClick = async (day) => {
    const selected = new Date(year, month - 1, day);
    if (selected > today) return alert("Future date not allowed");

    const existing = getEntry(day);
    const value = prompt(
      "Enter milk in litres",
      existing ? existing.litres : ""
    );

    if (!value) return;


const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

   await saveMilkEntry({
  customerId,
  date: dateStr,   // ✅ PURE local date
  amount: Number(value),
  unit: "l",
});

    fetchCalendar();
  };

    // const data = res.data;
    // const name = data.name;
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDay = new Date(year, month - 1, 1).getDay();
  return (
    <div className="vendor-calendar">
       <div className="calendar-header">
  <h1 className="customer-name">
    {customerName || "Customer"}
  </h1>

  {milkType && (
    <p className="milk-type">
      Milk Type: <strong>{milkType}</strong>
    </p>
  )}
</div>

      <h2>
        {new Date(year, month - 1).toLocaleString("default", {
          month: "long",
        })}{" "}
        {year}
      </h2>

      <div className="vc-grid">
        {days.map((d) => (
          <div key={d} className="vc-head">{d}</div>
        ))}

        {[...Array(startDay)].map((_, i) => (
          <div key={`e-${i}`} />
        ))}

        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const entry = getEntry(day);

          return (
            <div
              key={day}
              className={`vc-cell ${entry ? "filled" : ""}`}
              onClick={() => handleClick(day)}
            >
              <div className="vc-day">{day}</div>
              {entry && <div className="vc-litres">{entry.litres} L</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
