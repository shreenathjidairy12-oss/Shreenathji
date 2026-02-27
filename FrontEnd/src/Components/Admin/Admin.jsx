// import React from "react";

// const Admin = () => {
//   return <div>Admin Page</div>;
// };

// export default Admin;


import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./Admin.css";

// import "";

export default function Admin() {
  return (
    <div className="admin-layout">
      <Navbar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
