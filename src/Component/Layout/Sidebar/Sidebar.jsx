import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useAppContext } from "../../../Context/AppContext";
import { CgArrowTopRight } from "react-icons/cg";
import { MdOutlineDashboard } from "react-icons/md";
import {
  RiDiscountPercentLine,
  RiExchangeFundsLine,
  RiFileChartLine,
  RiFileImageLine,
  RiGlobalLine,
  RiLineChartLine,
  RiNotification3Line,
  RiShoppingBag3Line,
  RiStore2Line,
  RiUserCommunityLine,
  RiUserSettingsLine,
  RiWindow2Line,
} from "react-icons/ri";
import { LuClock3 } from "react-icons/lu";
import { TbToggleLeftFilled, TbWorld } from "react-icons/tb";
import { BiHelpCircle, BiWallet, BiWindowAlt } from "react-icons/bi";
import { IoArrowBack } from "react-icons/io5";

export default function Sidebar() {
  const subAdmin  = localStorage.getItem("SubAdmin");
  
  const { isSidebarOpen } = useAppContext();
  const location = useLocation();

  // state init: agar current path menuDiscount ke under hai toh true
  const [isMenuDiscountMode, setIsMenuDiscountMode] = useState(
    localStorage.getItem("isMenuDiscountMode") === "true" ||
    location.pathname.startsWith("/menuDiscount")
  );

  // sync with localStorage on change
  useEffect(() => {
    localStorage.setItem("isMenuDiscountMode", isMenuDiscountMode);
  }, [isMenuDiscountMode]);

  // agar path change hota hai toh isMenuDiscountMode ko update karo

  useEffect(() => {
    if (location.pathname.startsWith("/menuDiscount")) {
      setIsMenuDiscountMode(true);
    } else if (location.pathname === "/") {
      //  Dashboard pe aane par hamesha normal mode
      setIsMenuDiscountMode(false);
    }
  }, [location.pathname]);


  const checkActive = (currentPath, basePath, extraPaths = []) => {
    if (basePath === "/") {
      return currentPath === "/"; // dashboard/back to billing only active on exact "/"
    }
    if (currentPath === basePath) return true;          // exact match
    if (currentPath.startsWith(basePath + "/")) return true; // sub-routes
    if (extraPaths.includes(currentPath)) return true;  // custom extra paths
    return false;
  };


  const menuItems = [
   
    { label: "Dashboard", icon: <MdOutlineDashboard />, path: "/" },
    { label: "Running Orders", icon: <LuClock3 />, path: "/RunningOrder" },
    { label: "All Orders", icon: <RiShoppingBag3Line />, path: "/All-order" },
    { label: "Online Orders", icon: <RiGlobalLine />, path: "/online-orders" },
    { label: "KOT", icon: <RiWindow2Line />, path: "/kot" },
    { label: "Profit & Loss", icon: <RiLineChartLine />, path: "/profit-loss" },

    { label: "Menu & Discounts", icon: <RiDiscountPercentLine />, path: "/menuDiscount" },
    { label: "Menu On/Off", icon: <TbToggleLeftFilled />, path: "/toggleonoff" },
    { label: "Taxes & Charges", icon: <RiExchangeFundsLine />, path: "/Taxes", extraPaths: ["/AddTax"] },

    { label: "Users", icon: <RiUserCommunityLine />, path: "/AllUser", extraPaths: ["/AddUser"] },
    { label: "Wallet Management", icon: <BiWallet />, path: "/wallet" },
    { label: "Reports", icon: <RiFileChartLine />, path: "/report" },
    { label: "Push Notification", icon: <RiNotification3Line />, path: "/push-notification" },
    { label: "Banner Management", icon: <RiFileImageLine />, path: "/Allbanner" },
    { label: "Outlet Activity", icon: <RiStore2Line />, path: "/outlet" },
    { label: "My Account", icon: <RiUserSettingsLine />, path: "/myaccount" },
    { label: "Need A Help?", icon: <BiHelpCircle />, path: "/help" },
  ];
 
  const subAdminMenuItems = [
  { label: "Billing", icon: <MdOutlineDashboard />, path: "/" }, 
  { label: "Running Orders", icon: <LuClock3 />, path: "/RunningOrder" },
  { label: "All Orders", icon: <RiShoppingBag3Line />, path: "/All-order" },
  { label: "KOT", icon: <RiWindow2Line />, path: "/kot" },
  { label: "Users", icon: <RiUserCommunityLine />, path: "/AllUser" },
  { label: "Wallet Management", icon: <BiWallet />, path: "/wallet" },
  { label: "Reports", icon: <RiFileChartLine />, path: "/report" },
  { label: "Push Notification", icon: <RiNotification3Line />, path: "/push-notification" },
  { label: "My Account", icon: <RiUserSettingsLine />, path: "/myaccount" },
  { label: "Need A Help?", icon: <BiHelpCircle />, path: "/help" },
];
  const baseItems = subAdmin ? subAdminMenuItems : menuItems;
  const filteredItems = isMenuDiscountMode
    ? [
      { label: "Back to Billing", icon: <IoArrowBack />, path: "/" },
      menuItems.find((m) => m.label === "Menu & Discounts"),
      menuItems.find((m) => m.label === "Menu On/Off"),
      menuItems.find((m) => m.label === "Taxes & Charges"),
    ].filter(Boolean)
    : baseItems;

  return (
    <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
      <ul>
        {filteredItems.map((item) => {
          const isActive = checkActive(location.pathname, item.path, item.extraPaths || []);

          return (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`${styles.menuItem} ${isActive ? styles.activeLink : ""}`}
                onClick={() => {
                  if (item.label === "Menu & Discounts") setIsMenuDiscountMode(true);
                  if (item.label === "Back to Billing") setIsMenuDiscountMode(false);
                }}
              >
                <span className={styles.icon}>{item.icon}</span>
                {isSidebarOpen && (
                  <>
                    <span>{item.label}</span>
                    {item.label === "Menu & Discounts" && (
                      <span className={styles.dropdownArrow}>
                        <CgArrowTopRight />
                      </span>
                    )}
                  </>
                )}
              </Link>
            </li>
          );
        })}

      </ul>
    </aside>
  );
}
