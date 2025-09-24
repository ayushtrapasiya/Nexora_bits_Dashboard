
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../Context/AppContext";
import Loader from "../../Component/Loader/Loader";
import styles from "./AllOrder.module.css";
import CountUp from "react-countup";
import { Controller, useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import { LuEye } from "react-icons/lu";
import OrderDetailsSidebar from "./OrderDetail/OrderDetailsSidebar";
import CustomDropdown from "../../CustomeComponent/CustomDropdown/CustomDropdown";
export default function AllOrder() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();
  const { loading } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleViewDetails = (id) => {
    setSelectedOrderId(id);
  };

  const closeSidebar = () => {
    setSelectedOrderId(null);
  };

  const isAllSelected =
    orders.length > 0 && selectedOrders.length === orders.length;

  const handleCheckboxChange = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    // reset();
  };

  useEffect(() => {
    const dummyOrders = [
      {
        id: 2202,
        customerName: "Kalpit Nathwani",
        address:
          "Marvel Society, South Bopal, Bopal, Ahmedabad, Ahmedabad India",
        items: "Quinoa Pomegranate Salad [300gm]",
        orderType: "Delivery",
        subType: "App",
        grandTotal: 281.0,
        roundOff: -0.46,
        payment: "Online",
        status: "Completed",
      },
      {
        id: 2203,
        customerName: "Ramesh Sharma",
        address: "Satellite Road, Ahmedabad, India",
        items: "Paneer Butter Masala [500gm]",
        orderType: "Pickup",
        subType: "Phone",
        grandTotal: 520.0,
        roundOff: 0,
        payment: "Cash",
        status: "Pending",
      },
    ];

    setOrders(dummyOrders);
  }, []);

  return (
    <>
      <div className={styles.AllOrder}>
        {/* Header Section */}
        <div className={styles.header}>
          <button className={styles.runningBtn}>
            Grand Total : ₹{" "}
            <CountUp start={0} end={5898} duration={1.5} decimal={2} />
          </button>
          <button className={styles.csvBtn}>Export CSV</button>
        </div>

        {/* Filter Form */}
        <form className={styles.filterForm} onSubmit={handleSubmit(onSubmit)}>
          {/* First Row */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Start Date</label>
              <input
                 type="datetime-local"
                {...register("startDate")}
                placeholder="Start Date"
              />
            </div>
            <div className={styles.formGroup}>
              <label>End Date</label>
              <input
                  type="datetime-local"
                {...register("endDate")}
                placeholder="End Date"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Order ID</label>
              <input type="text" {...register("orderId")} placeholder="ID" />
            </div>
            <div className={styles.formGroup}>
              <label>Customer Name</label>
              <input
                type="text"
                {...register("customerName")}
                placeholder="Name"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.phoneField}`}>
              <label>Customer Phone</label>
              <input
                type="text"
                {...register("customerPhone")}
                placeholder="Number"
              />
            </div>
            <div className={styles.formGroup}>
              <label>All Order Type</label>

              <Controller
                name="allOrderType"
                control={control}
                //={{ required: "Order type is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <CustomDropdown
                      placeholderColor="#667085"
                      value={field.value}
                      isMultiple={true}

                      onChange={field.onChange}
                      options={[
                        { value: "Pick Up", label: "Pick Up" },
                        { value: "Delivery", label: "Delivery" },
                      ]}
                      placeholder="Select Order Type"
                      border="#ddd"
                      padding="9px"
                    />
                    {fieldState.error && (
                      <span className={styles.error}>
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Sub Order Type</label>
              <Controller
                name="subOrderType"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <CustomDropdown
                      value={field.value}
                      placeholderColor="#667085"
                      onChange={field.onChange}
                      isMultiple={true}
                      options={[
                        { value: "Take Away", label: "Take Away" },
                        { value: "Delivery (App)", label: "Delivery (App)" },
                        { value: "Zomato", label: "Zomato" },
                        { value: "Swiggy", label: "Swiggy" },
                      ]}
                      placeholder="Select Sub Order Type"
                      border="#ddd"
                      padding="9px"
                    />
                    {fieldState.error && (
                      <span className={styles.error}>
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className={styles.formGroup}>
              <label>All Payment Type</label>
              <Controller
                name="paymentType"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <CustomDropdown
                      placeholderColor="#667085"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "All", label: "All" },
                        { value: "cash", label: "Cash" },
                        { value: "card", label: "Card" },
                        { value: "Wallet", label: "Wallet" },
                        { value: "Due Payment", label: "Due Payment" },
                        { value: "Online", label: "Online" },
                      ]}
                      placeholder="Select Payment Type"
                      border="#ddd"
                      padding="9px"
                    />
                    {fieldState.error && (
                      <span className={styles.error}>
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Third Row */}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.phoneField}`}>
              <label>Order Status</label>
              <input
                type="text"
                {...register("orderStatus")}
                placeholder="Number"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Other Status</label>
              <Controller
                name="otherStatus"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <CustomDropdown
                      placeholderColor="#667085"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "All", label: "All" },
                        { value: "Saved", label: "Saved" },
                        { value: "Printed", label: "Printed" },
                        { value: "Cancelled", label: "Cancelled" },
                      ]}
                      placeholder="Select Order Status"
                      border="#ddd"
                      padding="9px"
                    />
                    {fieldState.error && (
                      <span className={styles.error}>
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className={styles.formGroup}>
              <label>&nbsp;</label>
              <input type="text" {...register("equal")} placeholder="=" />
            </div>
            <div className={styles.formGroup}>
              <label>Grand Total</label>
              <Controller
                name="grandTotal"
                control={control}
                //={{ required: "Payment type is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <CustomDropdown
                      value={field.value}
                      onChange={field.onChange}
                      placeholderColor="#667085ff"

                      options={[
                        { value: "less500", label: "Less than 500" },
                        { value: "more500", label: "More than 500" },
                      ]}
                      placeholder="Select grand total"
                      border="#ddd"
                      padding="9px"
                    />
                    {fieldState.error && (
                      <span className={styles.error}>
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Fourth Row */}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.phoneField}`}>
              <label>GSTIN</label>
              <Controller

                name="gstin"
                control={control}
                //={{ required: "GSTIN selection is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <CustomDropdown
                      placeholderColor="#667085"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                      placeholder="All"
                      border="#ddd"
                      padding="9px"
                    />
                    {fieldState.error && (
                      <span className={styles.error}>
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className={styles.formGroup}>
              <label>&nbsp;</label>
              <button type="submit" className={styles.searchBtn}>
                Search
              </button>
            </div>
          </div>
        </form>

        <div className={styles.tableWrapper}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: "110px" }}>Order No.</th>
                <th style={{ width: "250px" }}>Customer Name</th>
                <th>Items</th>
                <th>Order Type</th>
                <th style={{ whiteSpace: "nowrap" }}>
                  Grand Total <b>[Round Off]</b>
                </th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleCheckboxChange(order.id)}
                    />
                  </td>
                  <td>{order.id}</td>
                  <td>
                    {order.customerName} <br />[{order.address}]
                  </td>
                  <td>{order.items}</td>
                  <td>
                    {order.orderType} <b>({order.subType})</b>
                  </td>
                  <td>
                    {order.grandTotal.toFixed(2)}{" "}
                    <b>[{order.roundOff.toFixed(2)}]</b>
                  </td>
                  <td>{order.payment}</td>
                  <td
                    className={
                      order.status === "Completed"
                        ? styles.completed
                        : styles.pending
                    }
                  >
                    {order.status}
                  </td>
                  <td>
                    <button
                      className={styles.eyeBtn}
                      onClick={() => handleViewDetails(order.id)}
                    >
                      <LuEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrderId && (
        <OrderDetailsSidebar orderId={selectedOrderId} onClose={closeSidebar} />
      )}

      {loading && <Loader loading={loading} text="Loading Ordes.."/>}
    </>
  );
}
