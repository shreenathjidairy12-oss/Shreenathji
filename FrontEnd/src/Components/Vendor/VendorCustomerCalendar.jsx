import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getCustomerCalendar,
    saveMilkEntry,
} from "./vendorApi";
import Calendar from "../Customer/Calendar/Calendar"; // reuse customer calendar
import "./Vendor.css";

export default function VendorCustomerCalendar() {
    const { customerId } = useParams();
    const today = new Date();

    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [entries, setEntries] = useState([]);

    const loadCalendar = async () => {
  const res = await getCustomerCalendar(customerId, month, year);

  const normalized = res.data.entries.map((e) => {
    const d = new Date(e.date);

    // normalize date to local YYYY-MM-DD
    const localDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    )
      .toISOString()
      .split("T")[0];

    return {
      date: localDate,
      litres: e.amountML / 1000,   // ✅ litres (NOT amount)
      vendor: e.vendor || "",      // ✅ required by CalendarCell
    };
  });

  setEntries(normalized);
};


    useEffect(() => {
        loadCalendar();
    }, [month, year]);

    const onDateClick = async (date, existingAmount) => {
        if (date > today) return;

        const amount = prompt(
            "Enter milk (in liters)",
            existingAmount || ""
        );
        if (!amount) return;

        await saveMilkEntry({
            customerId,
            date,
            amount: Number(amount),
            unit: "l",
        });

        loadCalendar();
    };

    return (
        <Calendar
            month={month}
            year={year}
            entries={entries}
            onDateClick={onDateClick}
            disableFuture
        />
    );
}
