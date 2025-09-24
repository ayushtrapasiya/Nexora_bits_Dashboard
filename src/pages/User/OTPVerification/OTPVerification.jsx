import React, { useState } from "react";
import styles from "./OTPVerification.module.css";
import { MdEmail } from "react-icons/md";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import { useAppContext } from "../../../Context/AppContext";
import Loader from "../../../Component/Loader/Loader";

export default function OTPVerification({ email, initialOtp, onClose, onResend, onSuccess }) {
  const [otp, setOtp] = useState(
    initialOtp ? initialOtp.split("") : Array(6).fill("")
  );
  const { loading, setloading } = useAppContext()

  const baseUrl = import.meta.env.VITE_REACT_API_URL


  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto focus next
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       setloading(true)

      await axiosInstance.post(`${baseUrl}/admin-user/verifyOtp`, {
        email,
        otp: Number(otp.join("")),
      });
      toast.success("OTP Verified Successfully");
      onSuccess();
    } catch (err) {
      console.log('err: ', err);
      toast.error("Invalid OTP, please try again");
    }finally{
       setloading(false)

    }
  };

  return (
    <>
    <div className={styles.otpBox}>
      {/* Email Icon */}
      <div >
        <svg width="60" height="59" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4.5" y="4" width="48" height="48" rx="24" fill="#FA9696" />
          <rect x="4.5" y="4" width="48" height="48" rx="24" stroke="#FCBCBC" stroke-opacity="0.29" strokeWidth="8" />
          <path d="M38.5 22C38.5 20.9 37.6 20 36.5 20H20.5C19.4 20 18.5 20.9 18.5 22M38.5 22V34C38.5 35.1 37.6 36 36.5 36H20.5C19.4 36 18.5 35.1 18.5 34V22M38.5 22L28.5 29L18.5 22" stroke="#F41F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Title */}
      <h4 className={styles.title}>Please check your email.</h4>
      <p className={styles.subText}>
        We've sent a code to <span>{email}</span>
      </p>

      {/* OTP Inputs */}
      <form onSubmit={handleSubmit} className={styles.otpForm}>
        <div className={styles.otpInputs}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className={`${styles.otpInput} ${digit ? styles.filled : ""
                }`}
            />
          ))}
        </div>

        {/* Resend */}
        <p className={styles.resend}>
          Didn’t get a code?{" "}
          <button type="button" onClick={onResend}>
            Click to resend
          </button>
        </p>

        {/* Buttons */}
        <div className={styles.btnRow}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.verifyBtn}>
            Verify
          </button>
        </div>
      </form>
    </div>

{loading && <Loader loading={loading} text="Loading..."/>}
    
</>
  );
}
