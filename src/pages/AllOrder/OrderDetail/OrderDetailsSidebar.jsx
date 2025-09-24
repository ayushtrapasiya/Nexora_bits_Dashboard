import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./OrderDetailsSidebar.module.css";

export default function OrderDetailsSidebar({ orderId, onClose }) {
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Example static data (replace later with API)
        setOrderDetails({
            id: orderId,
            customerName: "Aditya",
            phone: "+919624917829",
            address: "Ambli, Ahmedabad India",
            orderType: "Delivery(App)",
            billingUser: "biller",
            serverIp: "192.168.1.61",
            orderRef: "2658 [swiggy-24142673282]",
            grandTotal: 130,
            tax: 5.98,
            discount: 100,
            status: "Printed",
            printed: "Yes (1 time) (21 Aug 2025 18:36:07)",
            paid: "Yes",
            notes: "Send cutlery",
            paymentVia: "App",
            couponCode: "SIXER100",
            items: [
                { name: "Liver Detox - ABC Detox Juice [300 ml]", qty: 2, price: 149, total: 298 },
                { name: "Discount Coupon", qty: "", price: "", total: 100 },
                { name: "CGST @2.5%", qty: "", price: "", total: 6.70 },
                { name: "SGST @2.5%", qty: "", price: "", total: 6.70 },
                { name: "Container Charge", qty: "", price: "", total: 15.00 },
                { name: "Grand Total", qty: "", price: "", total: 130.00 }
            ]
        });
    }, [orderId]);

    if (!orderDetails) return null;
    return (
        <div className={styles.sidebarOverlay}>
            <div className={`${styles.sidebar} ${styles.open} animate__animated animate__fadeInRight`}>
                {/* Header */}
                <div className={styles.header}>
                    <h4><b>Order Details</b></h4>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className={styles.contentWrapper}>
                    {/* Order Info */}
                    <div className={styles.detailsTableWrapper}>
                        <table className={styles.detailsTable}>
                            <tbody>
                                <tr>
                                    <td><b>Order No.:</b> {orderDetails.id}</td>
                                    <td><b>Billing User:</b> {orderDetails.billingUser} (Server IP: {orderDetails.serverIp})</td>
                                    <td><b>Customer Name:</b> {orderDetails.customerName}</td>
                                </tr>
                                <tr>
                                    <td><b>Customer Number:</b> {orderDetails.phone}</td>
                                    <td><b>Address:</b> {orderDetails.address}</td>
                                    <td><b>Order Type:</b> {orderDetails.orderType}</td>
                                </tr>
                                <tr>
                                    <td><b>Order Ref:</b> {orderDetails.orderRef}</td>
                                    <td><b>Grand Total:</b> ₹{orderDetails.grandTotal}</td>
                                    <td><b>Tax:</b> ₹{orderDetails.tax}</td>
                                </tr>
                                <tr>
                                    <td><b>Discount:</b> ₹{orderDetails.discount}</td>
                                    <td><b>Order Status:</b> {orderDetails.status}</td>
                                    <td><b>Printed:</b> {orderDetails.printed}</td>
                                </tr>
                                <tr>
                                    <td><b>Paid:</b> {orderDetails.paid}</td>
                                    <td><b>Payment Via:</b> {orderDetails.paymentVia}</td>
                                    <td><b>Coupon Code:</b> {orderDetails.couponCode}</td>
                                </tr>
                                <tr> <td colSpan="3"> <b>Customer Notes:</b> {orderDetails.notes} </td> </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Order Items */}
                    <div className={styles.orderItemsWrapper}>
                        <h3 className={styles.orderItemsTitle}>Order Items</h3>
                        <div className={styles.detailsTableWrapper}>
                            <table className={styles.orderItemsTable}>
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Quantity</th>
                                        <th>Unit Price (₹)</th>
                                        <th>Total Price (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.items?.map((item, index) => {
                                        if (item.qty && item.price) {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{item.qty}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.total}</td>
                                                </tr>
                                            );
                                        }


                                        return (
                                            <tr key={index}>
                                                <td></td>
                                                <td colSpan={2}>{item.name} : </td>
                                                <td>₹{item.total}</td>
                                            </tr>
                                        );
                                    })}

                                    {/* Grand Total */}
                                    <tr>
                                        <td></td>
                                        <td colSpan={2}><b>Grand Total</b></td>
                                        <td><b>{orderDetails.grandTotal}</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
