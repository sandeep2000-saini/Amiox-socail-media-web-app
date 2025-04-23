import React from "react";
import { Outlet } from "react-router-dom";
import FloatNavBar from "../components/Navbar/FloatNavBar";

const MainLayout = () => {
    return (
        <div>
            
            <div>
            <Outlet />
            </div>
            <div><FloatNavBar/></div>
        </div>
    )
}

export default MainLayout;