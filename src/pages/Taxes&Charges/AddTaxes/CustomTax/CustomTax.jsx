import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./CustomTax.module.css";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axiosInstance from "../../../../api/axiosInstance";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../Context/AppContext";
import Loader from "../../../../Component/Loader/Loader";

export default function CustomTax() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { loading, setloading } = useAppContext();

  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const [activeCard, setActiveCard] = useState("customTax");
  const [deliveryTaxType, setDeliveryTaxType] = useState("kilometer");
  const onSubmit = async (data) => {
    let payload = {};

    if (activeCard === "customTax") {
      payload = {
        title: data.title,
        onlineDisplayName: data.onlineDisplayName,
        orderType: data.orderType,
        type: "CustomTax",
        taxType: data.taxType === "percentage" ? "Percentage" : "Fixed",
        amount: data.amount,
        isActive: true,
      };
    }

    if (activeCard === "delivery") {
      payload = {
        title: data.title,
        onlineDisplayName: data.onlineDisplayName,
        orderType: data.orderType || ["Delivery"],
        type: "DeliveryCharge",
        applicableAmountMin: data.applicableAmountMin,
        applicableAmountMax: data.applicableAmountMax,
        deliveryChargeType:
          deliveryTaxType === "kilometer" ? "Kilometer" : "Fixed",
        perKilometer:
          deliveryTaxType === "kilometer"
            ? Number(data.perKilometer)
            : undefined,
        deliveryAmount: Number(data.deliveryAmount),
        isActive: true,
      };
    }

    try {
      setloading(true)
      let post = await axiosInstance.post(`${baseUrl}/tax/create`, payload);
      toast.success("Tax Create Succesfully")
      navigate("/Taxes")
    } catch (e) {
      console.log(e)
    } finally {
      setloading(false)
    }
    reset()

    console.log("Final Payload:", payload);
    // axios.post("/api/endpoint", payload)
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
        {/* Top Buttons */}
        <div className={styles.topButtons}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate("/Taxes")}
          >
            <GoArrowLeft /> <span className="ms-2">Back</span>
          </button>

          <div>
            <button type="button" className={styles.cancelBtn}>
              Cancel
            </button>
            &nbsp;&nbsp;
            <button type="submit" className={styles.saveBtn}>
              Save Changes
            </button>
          </div>
        </div>

        {/* Card Selector */}
        <div className={`row ${styles.cardWrapper}`}>
          <div
            className={`col-md-4 ${styles.card} ${activeCard === "customTax" ? styles.activeCard : ""
              }`}
            onClick={() => setActiveCard("customTax")}
          >
            <div className={styles.iconWrapper}>
              {activeCard === "customTax" ? (
                <FaCheckCircle className={styles.activeIcon} />
              ) : (
                <span className={styles.emptyCircle}></span>
              )}
            </div>
            <div className={styles.cardContent}>
              <h5 className="mb-1 fw-bold">Custom Tax</h5>
              <p className="mb-0 small">
                (GST, VAT, Platform Tax, Corporate Tax, Etc.)
              </p>
            </div>
          </div>

          <div
            className={`col-md-4 ${styles.card} ${activeCard === "delivery" ? styles.activeCard : ""
              }`}
            onClick={() => setActiveCard("delivery")}
          >
            <div className={styles.iconWrapper}>
              {activeCard === "delivery" ? (
                <FaCheckCircle className={styles.activeIcon} />
              ) : (
                <span className={styles.emptyCircle}></span>
              )}
            </div>
            <div className={styles.cardContent}>
              <h5 className="mb-1 fw-bold">Delivery Charges & Discounts</h5>
              <p className="mb-0 small">(Only For Delivery)</p>
            </div>
          </div>
        </div>

        {/* Fields - Custom Tax */}
        {activeCard === "customTax" && (
          <div className="mt-4 ms-4">
            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3">Title*</label>
              <div className="col-md-6 col-sm-8">
                <input
                  type="text"
                  className={styles.inputField}
                  {...register("title", { required: true })}
                />
              </div>
            </div>

            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3">Online Display Name</label>
              <div className="col-md-6 col-sm-8">
                <input
                  type="text"
                  className={styles.inputField}
                  {...register("onlineDisplayName")}
                />
              </div>
            </div>

            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3">Order Type*</label>
              <div className="col-md-6 col-sm-8 d-flex gap-3">
                <label>
                  <input
                    type="checkbox"
                    value="Delivery"
                    defaultChecked
                    {...register("orderType")}
                  />{" "}
                  Delivery
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Pick Up"
                    {...register("orderType")}
                  />{" "}
                  Pick Up
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Dine In"
                    {...register("orderType")}
                  />{" "}
                  Dine In
                </label>
              </div>
            </div>

            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3">Tax Type*</label>
              <div className="col-md-6 col-sm-8 d-flex gap-3">
                <label>
                  <input
                    type="radio"
                    value="percentage"
                    defaultChecked
                    {...register("taxType")}
                  />{" "}
                  Percentage
                </label>
                <label>
                  <input type="radio" value="fixed" {...register("taxType")} />{" "}
                  Fixed
                </label>
              </div>
            </div>

            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3">Amount(%) *</label>
              <div className="col-md-6 col-sm-8">
                <input
                  type="number"
                  className={styles.inputField}
                  {...register("amount")}
                />
              </div>
            </div>
          </div>
        )}

        {/* Fields - Delivery Charges */}
        {activeCard === "delivery" && (
          <div className="mt-4 ms-4">
            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3">Title *</label>
              <div className="col-md-6 col-sm-8">
                <input
                  type="text"
                  className={styles.inputField}
                  {...register("title")}
                />
              </div>
            </div>

            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3">Online Display Name</label>
              <div className="col-md-6 col-sm-8">
                <input
                  type="text"
                  className={styles.inputField}
                  {...register("onlineDisplayName")}
                />
              </div>
            </div>

            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3">Order Type *</label>
              <div className="col-md-6 col-sm-8">
                <label>
                  <input
                    type="checkbox"
                    value="Delivery"
                    defaultChecked
                    {...register("orderType")}
                  />{" "}
                  Delivery
                </label>
              </div>
            </div>

            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3 mt-3">Applicable Amount</label>
              <div className="col-md-6 col-sm-8 d-flex gap-3">
                <div className="w-50">
                  <small>Minimum (≥)</small>
                  <input
                    type="number"
                    className={styles.inputField}
                    {...register("applicableAmountMin")}
                  />
                </div>
                <div className="w-50">
                  <small>Maximum (≤)</small>
                  <input
                    type="number"
                    className={styles.inputField}
                    {...register("applicableAmountMax")}
                  />
                </div>
              </div>
            </div>

            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3">Tax Type *</label>
              <div className="col-md-6 col-sm-8 d-flex gap-3">
                <label>
                  <input
                    type="radio"
                    value="kilometer"
                    checked={deliveryTaxType === "kilometer"}
                    onChange={() => setDeliveryTaxType("kilometer")}
                  />{" "}
                  Kilometer
                </label>
                <label>
                  <input
                    type="radio"
                    value="fixed"
                    checked={deliveryTaxType === "fixed"}
                    onChange={() => setDeliveryTaxType("fixed")}
                  />{" "}
                  Fixed
                </label>
              </div>
            </div>

            {deliveryTaxType === "kilometer" && (
              <div className={`row mb-4 ${styles.formRow}`}>
                <label className="col-lg-2 col-sm-3">Per Kilometer *</label>
                <div className="col-md-6 col-sm-8">
                  <input
                    type="number"
                    className={styles.inputField}
                    {...register("perKilometer")}
                  />
                </div>
              </div>
            )}

            <div className={`row mb-4 ${styles.formRow}`}>
              <label className="col-lg-2 col-sm-3">Amount (₹) *</label>
              <div className="col-md-6 col-sm-8">
                <input
                  type="number"
                  className={styles.inputField}
                  {...register("deliveryAmount")}
                />
              </div>
            </div>
          </div>
        )}
      </form>

      {loading && <Loader loading={loading} text="Uploading Tax..." />}
    </>
  );
}
