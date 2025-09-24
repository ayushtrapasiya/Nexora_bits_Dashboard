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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isEmail) {
        if (!emailOrNumber.includes("@")) {
          setError("Please enter a valid email");
          toast.error("Please enter a valid email");
          setLoading(false);
          return;
        }
        if (!passwordOtp) {
          setError("Password is required for email login");
          toast.error("Password is required for email login");
          setLoading(false);
          return;
        }

        const res = await axios.post(`${baseUrl}/admin/login`, {
          email: emailOrNumber,
          password: passwordOtp,
          deviceId,
          fcmToken: "web-fcm-token",
          deviceType: "web",
        });
       const  id  = res.data.data.id
        if(id) {
          localStorage.setItem("user" , id)
        }
        const token = res.data?.data?.accessToken;
        if (token) {
          dispatch(setToken(token));
        }
        toast.success("Email Login Successful");
        navigate("/")
        // console.log("Email Login Success:", res.data);
      } else {
        if (!/^\d{10}$/.test(emailOrNumber)) {
          setError("Please enter a valid 10-digit mobile number");
          toast.error("Please enter a valid 10-digit mobile number");
          setLoading(false);
          return;
        }

        if (!otpSent) {
          const otplogin = await axios.post(`${baseUrl}/admin/login`, {
            contact: Number(emailOrNumber),
            deviceId,
            fcmToken: "web-fcm-token",
            deviceType: "web",
          });
          const token = otplogin.data?.data?.accessToken;
          // console.log('token: ', token);
          if (token) {
            dispatch(setToken(token)); // redux + localStorage me save
          }
          toast.success("Login request sent");

          const otpRes = await axios.post(`${baseUrl}/admin/send-otp`, {
            contact: Number(emailOrNumber),
          });
          toast.success("OTP Sent Successfully");
          // console.log("OTP Sent:", otpRes.data.data.otp);
          setOtpSent(true);
          setPasswordOtp(otpRes.data.data.otp); // autofill OTP (optional)
        } else {
          if (!/^\d{6}$/.test(passwordOtp)) {
            setError("OTP must be 6 digits");
            toast.error("OTP must be 6 digits");
            setLoading(false);
            return;
          }
          const verifyRes = await axios.post(`${baseUrl}/admin/verify-otp`, {
            contact: Number(emailOrNumber),
            otp: Number(passwordOtp),
          });
          toast.success("OTP Verified Successfully");
          navigate("/")
          // console.log("OTP Verified:", verifyRes.data);
        }
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
