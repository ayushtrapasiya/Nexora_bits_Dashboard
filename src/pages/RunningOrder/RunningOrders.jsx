import React, { useEffect, useState } from "react";
import styles from "./RunningOrders.module.css";
import { RiLoopRightLine } from "react-icons/ri";
import 'animate.css';
import { useAppContext } from "../../Context/AppContext";
import axiosInstance from "../../api/axiosInstance";

export default function RunningOrders() {
  const { loading, setloading } = useAppContext()

  const [data, setData] = useState({
    totalOrders: "05",
    totalAmount: 1200.25,
    boxes: [
      { title: "Pick Up", orders: 0, amount: 900.25 },
      { title: "Pick Up", orders: 0, amount: 900.25 },
      { title: "Pick Up", orders: 0, amount: 900.25 },
      { title: "Order yet to be marked ready", orders: 0, amount: 900.25 },
      { title: "Order yet to be picked up", orders: 0, amount: 900.25 },
      { title: "Order yet to be delivered", orders: 0, amount: 900.25 },
    ],
  });

  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  // const fetchData = async () => {
  //   try {
  //     setloading(true)
  //  const response = await axiosInstance.get(`${baseUrl}`);
  //     setData(response.data);
  //   } catch (err) {
  //     console.error("API error:", err);
  //   } finally {
  //     setloading(false)
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className={styles.runningOrders}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.runningBtn}>Running Orders</button>
        <button className={styles.refreshBtn}>
          <RiLoopRightLine />
        </button>
      </div>

      {/* Top 2 Boxes */}
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.topBox}>
            <h4>Total Order</h4>
            <p>
              {data.totalOrders}
            </p>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.topBox}>
            <h4>₹</h4>
            <p>
              {data.totalAmount.toLocaleString("en-IN")}
            </p>

          </div>
        </div>
      </div>

      {/* Grid Boxes */}
      <div className={styles.row} >
        {data.boxes.map((box, i) => (
          <div key={i} className={`${styles.col} animate__animated animate__fadeIn`}>
            <div className={styles.card}>
              <h5>{box.title}</h5>
              <p className={styles.gray}>Orders</p>
              <h3>{box.orders}</h3>
              <p className={styles.gray}>Estimated Total Amount</p>
              <h2>₹{box.amount}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
