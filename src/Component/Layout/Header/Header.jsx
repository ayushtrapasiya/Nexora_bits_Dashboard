import React from 'react';
import { useAppContext } from '../../../Context/AppContext';
import styles from "./Header.module.css";
import logo from '../../../assets/images/header_nexoraposs.png';
import { PiSignOutBold } from 'react-icons/pi';
import { IoSettingsOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from 'react-icons/io';
import axiosInstance from '../../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearToken } from '../../../Store/authSlice';
import { toast } from 'react-toastify';
import Tooltip from '../../../CustomeComponent/Tooltip/Tooltip';

export default function Header() {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const dispatch = useDispatch() 
  const navigate =  useNavigate()
  const { toggleSidebar } = useAppContext();
async function logOut(){
  const userId = localStorage.getItem("user");
  const deviceId = localStorage.getItem("deviceId");
  try {
    const logres  =  await axiosInstance.post(`${baseUrl}/admin/logout` ,{
userId,
deviceId
    })
    // localStorage.removeItem("deviceId")
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
dispatch(clearToken())
toast.success("Admin LogOut Successfully")
    navigate("/Adminlogin")
  } catch (error) {
    console.log('error: ', error);
    
  }
}
  return (
    <header className={styles.header}>
      {/* Left Section */}
      <div className={styles.left}>

        <button className={styles.toggleBtn} onClick={toggleSidebar}>☰</button>
        <img src={logo} alt="Nexora Bites" className={styles.logo} />
        <button className={styles.tempBtn}>135 Degrees</button>

        {/* Search fields */}
        <div className={styles.searchWrapper}>
          <IoSearchOutline className={styles.searchIcon} />
          <input type="text" placeholder="Bill No." className={styles.search} />
        </div>

        <div className={styles.searchWrapper}>
          <IoSearchOutline className={styles.searchIcon} />
          <input type="text" placeholder="KOT No." className={styles.search} />
        </div>

        <div className={styles.right}>
             <Tooltip text="Notification" position="bottom" bg="black">
          <IoMdNotificationsOutline className={styles.icon} />
          </Tooltip>
             <Tooltip text="setting" position="bottom" bg="black">
          <IoSettingsOutline className={styles.icon} />
          </Tooltip>
             <Tooltip text="Log Out" position="bottom" bg="black">
          <PiSignOutBold className={styles.icon} onClick={logOut}/>
          </Tooltip>
        </div>
      </div>



    </header>
  );
}