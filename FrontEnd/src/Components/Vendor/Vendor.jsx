import { Outlet } from "react-router-dom";
import Logout from "../Common/Logout";
import "./Vendor.css";

export default function Vendor() {
  return (
    <div className="vendor-layout">
      <div className="vendor-header">
        <h2 className="vendor-header-title">🚚 Vendor Portal</h2>
        <Logout />
      </div>
      <Outlet />
    </div>
  );
}
