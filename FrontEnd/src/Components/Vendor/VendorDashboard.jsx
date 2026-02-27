import { useEffect, useState } from "react";
import {
  getAreas,
  getSubareas,
  getVendorCustomers,
} from "./vendorApi";
import { useNavigate } from "react-router-dom";
import "./Vendor.css";

export default function VendorDashboard() {
  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [area, setArea] = useState("");
  const [subarea, setSubarea] = useState("");
  const [customers, setCustomers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAreas().then((res) => setAreas(res.data.areas));
  }, []);

  const handleAreaChange = async (id) => {
    setArea(id);
    setSubarea("");
    setCustomers([]);
    const res = await getSubareas(id);
    setSubareas(res.data.subareas);
  };

  const fetchCustomers = async () => {
    if (!area || !subarea) return;
    const res = await getVendorCustomers(area, subarea);
    setCustomers(res.data.customers);
  };

  //   console.log(customers,"inside")

  return (
    <div className="vendor-page">
      <h1 className="vendor-title">Vendor Dashboard</h1>

      <div className="vendor-filters-card">
        <div className="filter-group">
          <label>Area</label>
          <select value={area} onChange={(e) => handleAreaChange(e.target.value)}>
            <option value="">Select Area</option>
            {areas.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Subarea</label>
          <select value={subarea} onChange={(e) => setSubarea(e.target.value)}>
            <option value="">Select Subarea</option>
            {subareas.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button className="fetch-btn" onClick={fetchCustomers}>
          Fetch Customers
        </button>
      </div>

      <div className="customer-list-card">
        {customers.length === 0 ? (
          <p className="empty-text">No customers found</p>
        ) : (
          customers.map((c) => (
            <div
              key={c._id}
              className="customer-item"
              onClick={() => navigate(`/vendor/customer/${c._id}`)}
            >
              <div className="customer-name">{c.name}</div>
              <div className="customer-mobile">{c.mobile}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );

}
