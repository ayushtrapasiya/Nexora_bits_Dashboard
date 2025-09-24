import React, { useEffect, useState } from "react";
import { LiaClockSolid } from "react-icons/lia";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { AiOutlineLineChart } from "react-icons/ai";
import { FiShoppingBag } from "react-icons/fi";

import { CiMobile2 } from "react-icons/ci";
import zomato from '../../assets/images/zomatoIcons.png'
import { PiArrowCircleRight } from "react-icons/pi";
import styles from "./Dashboard.module.css";
import StoreMetrics from "./Chart/StoreMetrics";
import LineChartgraph from "./Chart/LineChartgraph";
import { RiEBike2Line, RiRefreshLine, RiSmartphoneLine } from "react-icons/ri";
import { useAppContext } from "../../Context/AppContext";
import Loader from "../../Component/Loader/Loader";


export default function Dashboard() {

  const { loading, setloading } = useAppContext()

  const [data, setData] = useState({
    totalSales: { amount: 2199, orders: 7, icon: <AiOutlineLineChart />, color: "#ED1C24", bg: "#FBABAB" },
    pickup: { amount: 1000, orders: 5, icon: <FiShoppingBag />, color: "#6F42C1", bg: "#F2F0FD" },
    delivery: {
      amount: 1199, orders: 2, icon: <RiEBike2Line />
      , color: "#f5b700", bg: "#fff9e6"
    },
  });

  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  const titles = {
    totalSales: "Total Sales",
    pickup: "Pick Up",
    delivery: "Delivery",
  };

  const othertitles = { totalSales: "Total Sales", storeApp: "Store App", zomato: "Zomato", };

  const datas = {
    totalSales: { amount: 2199, orders: 7, icon: <AiOutlineLineChart />, color: "#ED1C24", bg: "#FBABAB" },
    storeApp: { amount: 1000, orders: 5, icon: <RiSmartphoneLine size={26} />, color: "#ecebff", bg: "#000" },
    zomato: { amount: 1199, orders: 2, color: "#f5b700", bg: "#E7EAEE" },
  };

  useEffect(() => {
    setloading(true)
    const fetchData = async () => {
      try {
        // const response = await axiosInstance.get(`${baseUrl}`);
        // setData(response.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setloading(false)
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className={styles.card}>
        {/* Top Row */}
        <div className={styles.topRow}>
          <div className={styles.left}>

            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z" fill="#646464" />
            </svg>


            <span>Order synced 33 Mins ago & POS synced 3 Mins ago.</span>
          </div>
          <div className={styles.right}>
            <select>
              <option>7th Aug</option>
              <option>8th Aug</option>
            </select>
            <button className={styles.refreshBtn}>
              <RiRefreshLine />
            </button>
          </div>
        </div>

        {/* Partition Row */}
        <div className={styles.metrics}>
          {Object.entries(data).map(([key, val]) => (
            <div className={styles.metricBox} key={key}>
              <div className={styles.titleRow}>
                <div className={styles.title}>
                  <h4>{titles[key] || key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                </div>
                <span
                  className={styles.iconCircle}
                  style={{ backgroundColor: val.bg, color: val.color }}
                >
                  {val.icon}
                </span>
              </div>

              <div className={styles.amount}>
                <span>
                  ₹ {val.amount.toLocaleString("en-IN")}
                </span>
              </div>



              <div className={styles.orders}>Total {val.orders} Orders</div>
            </div>
          ))}
        </div>
      </div>

      <StoreMetrics />

      <div className={styles.card}>
        {/* Top Row */}
        <div className={styles.topRow}>
          <div>
            <h1 className={styles.onlineOrder}><b>Online Orders</b></h1>
          </div>
          <div className={styles.right}>
            <select>
              <option>7th Aug</option>
              <option>8th Aug</option>
            </select>
            <button className={styles.refreshBtn}>
              <RiRefreshLine />
            </button>
          </div>
        </div>

        {/* Partition Row */}
        <div className={styles.metrics}>
          {Object.entries(datas).map(([key, val]) => (
            <div className={styles.metricBox} key={key}>
              <div className={styles.titleRow}>
                <div className={styles.title}>
                  <h4>{othertitles[key] || key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                </div>
                <span
                  className={styles.iconCircle}
                  style={{ backgroundColor: val.bg, color: val.color }}
                >
                  {key === "zomato" ? (
                    <img
                      src={zomato}
                      alt="Zomato"
                      className={styles.zomatoImg}
                    />
                  ) : (
                    val.icon
                  )}


                </span>
              </div>

              {/* Amount */}
              <div className={styles.amount}>₹ {val.amount.toLocaleString("en-IN")}</div>

              {key === "zomato" ? (
                <div className={styles.moreIcon}>
                  <div className={styles.orders} >Total {val.orders} Orders</div>
                  <span className={styles.forward}><PiArrowCircleRight /></span>
                </div>
              ) : (

                <div className={styles.orders}>Total {val.orders} Orders</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <LineChartgraph />

      {loading && <Loader loading={loading} text="Loading..."/>}
    </>
  );
}