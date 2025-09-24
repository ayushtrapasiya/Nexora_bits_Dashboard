import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ItemsLayout.module.css";
import { SiZomato } from "react-icons/si";
import { PiForkKnifeBold } from "react-icons/pi";
import { AiOutlineMobile } from "react-icons/ai";
import { FiShoppingBag } from "react-icons/fi";
import swiggyLogo from "../../../assets/images/Swiggy.jpg";
import zomatoLogo from "../../../assets/images/zomatoimg.png"
import { TbWorld } from "react-icons/tb";

export default function ItemsLayout() {
  const navigate = useNavigate();
  const menus = [
    { name: "Base Menu", path: "/menuDiscount/itemlist", icon: <PiForkKnifeBold /> },
    { name: "Application", path: "application", icon: <AiOutlineMobile /> },
    { name: "Parcel Store", path: "parcel-store", icon: <FiShoppingBag /> },
    { name: "Zomato", path: "zomato", imgSrc: zomatoLogo },
    { name: "Swiggy", path: "swiggy", imgSrc: swiggyLogo },
    { name: "Website", path: "website", icon: <TbWorld /> },
  ];

  return (
    <div className={styles.grid}>
      {menus.map((menu, i) => (
        <div
          key={i}
          onClick={() => navigate(menu.path)}
          className={`${styles.card}`}
        >
          <div className={styles.iconWrapper}>
            {menu.icon && (
              <div className={styles.iconCircle}>
                <span className={`${styles.iconSize}`}>{menu.icon}</span>
              </div>
            )}
            {menu.imgSrc && (
              <div className={styles.iconCircle}>
                <img src={menu.imgSrc} alt={menu.name} className={styles.imgIcon} />
              </div>
            )}
          </div>
          <h3 className={styles.title}>{menu.name}</h3>
        </div>
      ))}
    </div>
  );
}
