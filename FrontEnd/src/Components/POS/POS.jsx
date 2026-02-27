import { Outlet } from "react-router-dom";
import "./POS.css";

export default function POS() {
    return (
        <div className="pos-layout">
            <Outlet />
        </div>
    );
}
