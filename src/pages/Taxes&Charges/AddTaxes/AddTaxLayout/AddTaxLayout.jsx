import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./AddTaxLayout.module.css";

export default function AddTaxLayout() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      {/* Top Card Selector */}
      <div className={styles.cardContainer}>
        <NavLink
          to="custom"
          className={({ isActive }) => isActive ? styles.activeCard : styles.card}
        >
          <h4>Custom Tax</h4>
          <p>GST, VAT, Platform Tax, Corporate Tax, etc.</p>
        </NavLink>

        <NavLink
          to="delivery"
          className={({ isActive }) => isActive ? styles.activeCard : styles.card}
        >
          <h4>Delivery Charges & Discounts</h4>
          <p>Only For Delivery</p>
        </NavLink>
      </div>

      {/* Nested form load hoga */}
      <div className={styles.formWrapper}>
        <Outlet />
      </div>
    </div>
  );
}
