import React from "react";
import LeftSettingSideBar from "../../components/Navbar/leftSettingSideBar";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const SettingLayout = () => {
  const {user} = useSelector(store => store.auth);
  return (
    <>
    <div className=" flex w-full pt-[30px] px-[100px] justify-between h-16" style={{position:"fixed", }}>
      <Link to={`/profile/${user?.id}`}><span className="text-[20px] ml-[190px]" style={{cursor:"pointer"}}> Back </span></Link>
      <span className="text-[25px] font-bold">Settings</span>
    </div>

    <div className="flex">
      <LeftSettingSideBar />
        <div className="flex-1">
        <Outlet/>
        </div>
      </div>

      </>
  );
};

export default SettingLayout;
