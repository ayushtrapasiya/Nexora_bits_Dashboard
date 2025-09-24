import React, { useEffect, useState } from "react";
import styles from "./ItemDetails.module.css";
import axiosInstance from "../../../../api/axiosInstance";
import { useAppContext } from "../../../../Context/AppContext";
import Loader from "../../../../Component/Loader/Loader";

export default function ItemDetails({ show, onHide, id }) {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const { loading, setloading } = useAppContext()
  const [item, setItemdetail] = useState([])


  async function getDetails() {
    try {
      setloading(true)
      let response = await axiosInstance.get(`${baseUrl}/menu/details/${id}`)
      console.log('response: ', response.data.data);


      setItemdetail(response.data.data)
    } catch (e) {
      console.log(e)
    }finally{
      setloading(false)
    }

  }

  useEffect(() => {
    if (show && id) {
      getDetails(id);
    }
  }, [show, id])

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalBox} animate__animated animate__fadeIn`}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h4><b>Item Details</b></h4>
          <button className={styles.closeBtn} onClick={onHide}>✕</button>
        </div>

        {/* ===== Main Table ===== */}
        <div className={styles.detailTableWrap}>
          <table className={styles.detailTable}>
            <tbody>
              <tr>
                <th>Name</th>
                <td>{item.name}</td>
                <th>Short Code</th>
                <td>{item.shortCode}</td>
              </tr>

              <tr>
                <th>Expose This Items In</th>
                <td>{item.orderType}</td>
                <th>Online Display Name</th>
                <td>{item.displayName}</td>
              </tr>

              <tr>
                <th>MRP</th>
                <td>₹ {item.price}</td>
                <th>Selling Price</th>
                <td>₹ {item.sellingPrice}</td>
              </tr>

              <tr>
                <th>Minimum Preparation Time</th>
                <td>-</td>
                <th>Dietary</th>
                <td>{item.dietary}</td>
              </tr>

              <tr>
                <th>Nutritional Value</th>
                <td colSpan={3}>
                  {`Yes ( Calories ${item?.calories} kcal, Proteins ${item?.proteins} grams, Fats ${item?.fats} grams, Carbs ${item?.carbs} grams, Sugar ${item?.sugar} grams )`}
                </td>
              </tr>

              <tr>
                <th>Item Description</th>
                <td colSpan={3}>
                  {item.description}
                </td>
              </tr>
              <tr>
                <th>Item Image</th>
                <td><div className={styles.imageBox}>Item Image</div></td>
                <th>Zomato Image</th>
                <td><div className={styles.imageBox}>Zomato Image</div></td>
              </tr>
              <tr>
                <th>Swiggy Image</th>
                <td><div className={styles.imageBox}>Swiggy Image</div></td>
                <th>Website Image</th>
                <td><div className={styles.imageBox}>Website Image</div></td>
              </tr>

              {/* Status */}
              <tr>
                <th>Status</th>
                <td>
                  <span className={item.isActive === true ? styles.statusActive : styles.statusInactive}>Active</span>
                </td>
                <th>Default Ratings</th>
                <td>{item.ratings}</td>
              </tr>

              {/* ===== Platform Wise Price ===== */}
              <tr>
                <td colSpan={4}>
                  <div className={`${styles.sectionCard}`}>
                    <div className={styles.sectionHeader}>Platform Wise Price</div>
                    <div className={styles.sectionTableWrap}>
                      <table className={styles.sectionTable}>
                        <thead>
                          <tr>
                            <th>Platform</th>
                            <th>Price</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Pick Up</td>
                            <td className={styles.tdRight}>₹ {item.price}</td>
                            <td>
                              <span className={`${styles.statusPill} ${styles.statusActive}`}>Active</span>
                            </td>
                          </tr>
                          <tr>
                            <td>Zomato</td>
                            <td className={styles.tdRight}>₹ {item.price}</td>
                            <td>
                              <span className={`${styles.statusPill} ${styles.statusActive}`}>Active</span>
                            </td>
                          </tr>
                          <tr>
                            <td>Swiggy</td>
                            <td className={styles.tdRight}>₹ {item.price}</td>
                            <td>
                              <span className={`${styles.statusPill} ${styles.statusInactive}`}>Inactive</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Variations + Addons side by side */}
              <tr>
                <td colSpan={4}>
                  <div className={styles.flexTables}>
                    {/* Variations */}
                    <div className={styles.sectionCard}>
                      <div className={styles.sectionHeader}>Variations</div>
                      <div className={styles.sectionTableWrap}>
                        <table className={styles.sectionTable}>
                          <thead>
                            <tr>
                              <th>Variation Name</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(item.variations?.length ? item.variations : [
                              { name: "Regular", price: 199 },
                              { name: "Large", price: 280 }
                            ]).map((v, i) => (
                              <tr key={i}>
                                <td>{v.name}</td>
                                <td className={styles.tdRight}>₹ {v.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Addons */}
                    <div className={styles.sectionCard}>
                      <div className={styles.sectionHeader}>Item Addons</div>
                      <div className={styles.sectionTableWrap}>
                        <table className={styles.sectionTable}>
                          <thead>
                            <tr>
                              <th>Addons Group Name</th>
                              <th>Total Addons Items</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(item.addons?.length ? item.addons : [
                              { groupName: "Exotic Veggie’s", total: 4 },
                              { groupName: "Pump it Up", total: 4 }
                            ]).map((a, i) => (
                              <tr key={i}>
                                <td>{a.groupName}</td>
                                <td className={styles.tdRight}>{a.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {loading && <Loader loading={loading} text="Loading Details..."/>}
    </div>
  );
}
