import React, { useState } from "react";
import styles from "./Billing.module.css";
import { FaCircleXmark } from "react-icons/fa6";
import { HiOutlineAdjustmentsVertical } from "react-icons/hi2";
export default function Billing() {
  const [activeItem, setActiveItem] = useState(null);
  const [billItems, setBillItems] = useState([
    { id: 1, name: "Nutty Fruity Delight", qty: 1, price: 189.52, variants: "Regular (65ML)", addons: "Corn" },
    { id: 2, name: "Mango Shake", qty: 2, price: 120.0, variants: "Large", addons: "Extra Sugar" },
    { id: 3, name: "Green Salad", qty: 1, price: 99.99, variants: "Medium", addons: "Olives" },
    { id: 3, name: "Green Salad", qty: 1, price: 99.99, variants: "Medium", addons: "Olives" },
    { id: 3, name: "Green Salad", qty: 1, price: 99.99, variants: "Medium", addons: "Olives" },
    { id: 3, name: "Green Salad", qty: 1, price: 99.99, variants: "Medium", addons: "Olives" },
    { id: 3, name: "Green Salad", qty: 1, price: 99.99, variants: "Medium", addons: "Olives" },
    { id: 3, name: "Green Salad", qty: 1, price: 99.99, variants: "Medium", addons: "Olives" },
  ]);

  const [activeCategory, setActiveCategory] = useState("Salad");
 const [active, setActive] = useState("UPI"); // default active

  const methods = ["Cash", "Card", "UPI", "Due", "Wallet"];

  const increaseQty = (id) =>
    setBillItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item))
    );

  const decreaseQty = (id) =>
    setBillItems((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    );

  const total = billItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h6 className="mt-4 mx-2">Categories</h6>
        <ul>
          {["Salad", "Juices", "Shakes"].map((cat) => (
            <li
              key={cat}
              className={activeCategory === cat ? styles.active : ""}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <div className={styles.main}>
        {/* Fixed Search bar */}
        <div className={styles.searchBox}>
          <div>
          <input type="text" placeholder="Search Item" color="red"/>
          <span></span>
          </div>
          <button className={styles.filterBtn}><HiOutlineAdjustmentsVertical size={"30px"}/></button>
        </div>

        {/* Scrollable Items */}
        <div className={styles.itemsGrid}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className={styles.itemCard}>
              <p>{activeCategory} Item {i + 1}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Section */}
      <div className={styles.billing}>
        <button className={styles.pickupBtn}>Pick Up</button>
        <div className={styles.billHeader}>
          <p>Bill No.: <strong>000034</strong></p>
        </div>
        <div className={styles.billInfo}>
          <input type="text" placeholder=" Name :" />
          <input type="text" placeholder=" Mobile No :" />
          <input type="email" placeholder=" Email ID :" />
        </div>

        <div className={styles.billTable}>
          <div className={styles.billHeadRow}>
            <span>ITEMS</span><span>QTY.</span><span>PRICE</span>
          </div>
          <div className={styles.billItemsList}>
            {billItems.map((item) => (
              <div key={item.id} style={{borderBottom:"1px solid black"}}>
                <div className={styles.billRow}>
                  <span className={styles.itemName}><span className={styles.remove}><FaCircleXmark  size={"15px"}color="var(--red-color)"/> </span>{item.name}</span>
                  <span className={styles.qtyBtns}>
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span style={{width:"40px" , height:"20px"  , border:"1px solid #000000", borderRadius:"2px", display:"flex",justifyContent:"center",alignItems:"center"}}>{item.qty}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </span>
                  <span>₹ {(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div className={styles.variants}>
                  <p>Variants: <span>{item.variants}</span></p>
                  <p>AddOns: <span>{item.addons}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.total}>
          <p>Total: <strong>₹ {total.toFixed(2)}</strong></p>
        </div>

         <div className={styles.payment}>
      {methods.map((method) => (
        <button
          key={method}
          className={active === method ? styles.active : ""}
          onClick={() => setActive(method)}
        >
          {method}
        </button>
      ))}
    </div>

        <div className={styles.paidCheck}>
          <input type="checkbox" /> It’s Paid
        </div>

        <div className={styles.actions}>
          <button>Save</button>
          <button>Save & Print</button>
          <button>KOT</button>
          <button>KOT & Print</button>
        </div>
      </div>
    </div>
  );
}
