import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "./EditUser.module.css";
import { Underline } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import { useAppContext } from "../../../Context/AppContext";
import Loader from "../../../Component/Loader/Loader";

export default function EditUser({ onClose, onSave, data, getAllUser }) {
    const { loading, setloading, setsearch, search } = useAppContext()
  const id = data._id;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  useEffect(() => {
    reset({
      username: data.username,

      email: data.email,
      contact: Number(data.contact),
      password: data.password,
    });
  }, [data]);

  const onSubmit = async (data) => {
    const payload = {
      username: data.username,

      email: data.email,
      contact: Number(data.contact),
      password: data.password,
    };

    try {
        setloading(true)
      let post = await axiosInstance.put(
        `${baseUrl}/admin-user/update/${id}`,
        payload
      );
      toast.success("User Updated Sucessfully");
      getAllUser();
      onClose();
      reset();
    } catch (e) {
        toast.success("User Updated Failed");
      console.log(e);
    }finally{
        setloading(false)
    }
  };

  return (
    <>
      <div className={styles.modalHeader}>
        <h5>Edit Customer</h5>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>
      <hr style={{ margin: "10px 0" }} />

      <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
        {/* Row 1 (3 inputs) */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>First Name*</label>
            <input
              type="text"
              {...register("username", { required: "username Name is required" })}
            />
            {errors.username && (
              <p className={styles.errorText}>{errors.username.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Mobile Number*</label>
            <input
              type="text"
              {...register("contact", {
                required: "Mobile Number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit number",
                },
              })}
            />
            {errors.mobile && (
              <p className={styles.errorText}>{errors.mobile.message}</p>
            )}
          </div>
        </div>

        {/* Row 2 (2 inputs + buttons inside) */}
        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Email ID*</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className={styles.errorText}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Password*</label>
            <input
              type="password"
              {...register("password", { required: "Last Name is required" })}
            />
            {errors.lastName && (
              <p className={styles.errorText}>{errors.lastName.message}</p>
            )}
          </div>

          {/* Wallet + info icon inside input field */}
          {/* <div className={styles.formGroup}>
            <label>Add Wallet Amount*</label>
            <div className={styles.inputWithIcon}>
              <input
                type="number"
                {...register("wallet", {
                  required: "Wallet amount is required",
                  min: { value: 0, message: "Wallet amount cannot be negative" },
                })}
              />
              <span
                title="Enter initial wallet balance"
                className={styles.infoIcon}
              >
                <BsInfoCircle />
              </span>
            </div>
            {errors.wallet && (
              <p className={styles.errorText}>{errors.wallet.message}</p>
            )}

          </div> */}

          {/* Buttons */}
          <div className={styles.btnRow}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              Edit Customer
            </button>
          </div>
        </div>
      </form>
      {loading && <Loader text="Loading..."/>}
    </>
  );
}
