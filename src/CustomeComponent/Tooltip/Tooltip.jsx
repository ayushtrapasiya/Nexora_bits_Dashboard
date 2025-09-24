import React from "react";
import styles from "./Tooltip.module.css";

export default function Tooltip({ children, text, position = "top", bg = "black" }) {
  return (
    <div className={styles.tooltip}>
      {children}
      <span
        className={`${styles.tooltiptext} ${styles[position]}`}
        style={{ backgroundColor: bg }}
      >
        {text}
      </span>
    </div>
  );
}
