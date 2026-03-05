import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Components/Login/Login";
import Admin from "./Components/Admin/Admin";
import AdminLanding from "./Components/Admin/AdminLanding";
import Vendor from "./Components/Vendor/Vendor";
import VendorDashboard from "./Components/Vendor/VendorDashboard";
import VendorMilkCalendar from "./Components/Vendor/VendorMilkCalendar";
import Customer from "./Components/Customer/Customer";
import ProtectedRoute from "./Components/ProtectedRoute";
import POS from "./Components/POS/POS";

import DailySummary from "./Components/Admin/pages/DailySummary";
import Billing from "./Components/Admin/pages/Billing";
import AddCustomer from "./Components/Admin/pages/AddCustomer";
import AddVendor from "./Components/Admin/pages/AddVendor";
import AddArea from "./Components/Admin/pages/AddArea";
import SetMilkPrice from "./Components/Admin/pages/SetMilkPrice";

// POS Components (to be created)
import POSProducts from "./Components/POS/POSProducts";
import POSCart from "./Components/POS/POSCart";
import POSBills from "./Components/POS/POSBills";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        {"just check"}
        {/* SHOPKEEPER - Landing Page */}
        <Route
          path="/shopkeeper"
          element={
            <ProtectedRoute allowedRoles={['shopkeeper']}>
              <AdminLanding />
            </ProtectedRoute>
          }
        />

        {/* SHOPKEEPER - Milk Business Routes */}
        <Route
          path="/shopkeeper/milk"
          element={
            <ProtectedRoute allowedRoles={['shopkeeper']}>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route path="daily-summary" element={<DailySummary />} />
          <Route path="billing" element={<Billing />} />
          <Route path="add-customer" element={<AddCustomer />} />
          <Route path="add-vendor" element={<AddVendor />} />
          <Route path="add-area" element={<AddArea />} />
          <Route path="set-milk-price" element={<SetMilkPrice />} />
        </Route>

        {/* SHOPKEEPER - POS Routes */}
        <Route
          path="/shopkeeper/pos"
          element={
            <ProtectedRoute allowedRoles={['shopkeeper']}>
              <POS />
            </ProtectedRoute>
          }
        >
          <Route path="products" element={<POSProducts />} />
          <Route path="cart" element={<POSCart />} />
          <Route path="bills" element={<POSBills />} />
        </Route>

        {/* VENDOR - Protected Routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <Vendor />
            </ProtectedRoute>
          }
        >
          <Route index element={<VendorDashboard />} />
          <Route
            path="customer/:customerId"
            element={<VendorMilkCalendar />}
          />
        </Route>

        {/* CUSTOMER - Protected Routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <Customer />
            </ProtectedRoute>

          }
        />

      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
