import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../../Store/authSlice";
import logo from '../../assets/images/nexoraposs.png'
import personImg from '../../assets/images/SignUpPerson.png'
import { HiOutlineKey } from "react-icons/hi2";


export default function Login() {
  const baseUrl = import.meta.env.VITE_REACT_API_URL
  const [emailOrNumber, setEmailOrNumber] = useState("");
  const [passwordOtp, setPasswordOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // 🔹 Generate 16-char random ID
  const generateDeviceId = () => {
    return [...Array(16)]
      .map(() => Math.random().toString(36)[2])
      .join("");
  };

  // 🔹 On load, check localStorage for deviceId
  useEffect(() => {
    const storedId = localStorage.getItem("deviceId");
    const newId = generateDeviceId();
    if (!storedId) {
      // if no id exists → store new one
      localStorage.setItem("deviceId", newId);
      setDeviceId(newId);
    } else {
      // if exists, use stored one (ignore newly generated one)
      setDeviceId(storedId);
    }
  }, []);

  const isEmail = emailOrNumber.includes("@");
  const isNumber = /^\d+$/.test(emailOrNumber) && !isEmail;

  const handleSubmit = async () => {
   
    localStorage.setItem("SubAdmin" , "qdkdqw")
    localStorage.setItem("authToken" , "dqwqdw")
    localStorage.setItem("user" , "qwjqwd")
    localStorage.setItem("deviceId" , "qwdiuhqwd")
    navigate("/")
  };

  return (
    <>
      <div className={styles.container}>
        <img src={logo} alt="" className={`${styles.logo} animate__animated animate__fadeInDown`} />
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className={`${styles.left} animate__animated animate__fadeInLeft`}>
            <img src={personImg} alt="" className={styles.img} />
            <h1 className="mt-4"><b>Welcome!</b></h1>
          </div>

          <div className={`${styles.right} animate__animated animate__fadeIn`}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2>Sign In</h2>
              <div className={styles.inputwidth}>
                <label style={{ width: "30px" }}>With</label>
                <input
                  type="text"
                  placeholder="Email Or Number"
                  value={emailOrNumber}
                  maxLength={isNumber ? 10 : undefined}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (isNumber) {
                      value = value.replace(/\D/g, "").slice(0, 10);
                    }
                    setEmailOrNumber(value);
                  }}
                />
              </div>



              <div className={styles.inputWithIcon}>
                <HiOutlineKey className={styles.inputIcon} />
                <input
                  type={isNumber ? "tel" : "password"}
                  placeholder={isNumber ? (otpSent ? "Enter OTP" : "Send OTP") : "Password or OTP"}
                  value={passwordOtp}
                  maxLength={isNumber ? 6 : undefined}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (isNumber) value = value.replace(/\D/g, "").slice(0, 6);
                    setPasswordOtp(value);
                  }}
                />
              </div>

              <div className={styles.options}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" /> Remember Me
                </label>
                <span className={styles.resend}>Resend</span>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" disabled={loading}>
                {isNumber ? (otpSent ? "Verify OTP" : "Send OTP") : "Sign In"}
              </button>

              <p className={styles.contact}>
                New in Nexora POS? <a href="#"><b>Contact Us</b></a>
              </p>
            </form>
          </div>
        </div>

        <div className={`${styles.footer}`}>
          <span className={styles.leftFooter}>© 2025 <b>Nexora POS (Nexora Tech)</b></span>
          <span className={styles.rightFooter}>
            <a href="#">Privacy</a> | <a href="#">Terms & Conditions</a>
          </span>
        </div>


      </div>
      
    </>
  );
}
