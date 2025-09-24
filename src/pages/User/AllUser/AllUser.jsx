import React, { useEffect, useRef, useState } from 'react'
import styles from './AllUser.module.css'
import { Controller, useForm } from 'react-hook-form'
import CustomDropdown from '../../../CustomeComponent/CustomDropdown/CustomDropdown';
import { LuEye } from 'react-icons/lu';
import Tooltip from '../../../CustomeComponent/Tooltip/Tooltip';
import { useNavigate } from 'react-router-dom';
import AddUser from '../AddUser/AddUser';
import OTPVerification from '../OTPVerification/OTPVerification';
import axiosInstance from '../../../api/axiosInstance';
import EditUser from '../EditUser/EditUser';
import { useAppContext } from '../../../Context/AppContext';

import Pagination from '../../../Component/Pagination/Pagination';
import Loader from '../../../Component/Loader/Loader';
import { toast } from 'react-toastify';


export default function AllUser() {
  const { loading, setloading, totalItems, setTotalItems, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage } = useAppContext();
  const { register, handleSubmit, control } = useForm();

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [users, setUser] = useState([])
  const [showAddUser, setShowAddUser] = useState(false) //for adduser popup
  const [showOtp, setShowOtp] = useState(false); //for otp verification popup
  const [otpData, setOtpData] = useState({ email: "", otp: "" });
  // this state is use for edit user and pass data for fill the fileds 
  const [isEdited, setEditModalOpen] = useState(false)
  const [preeditdata, SetpreEditdata] = useState(null)
  //-------------------------------------------------------------
  const isFirstRender = useRef(true);
  const baseUrl = import.meta.env.VITE_REACT_API_URL


  async function getAllUser(data) {
     
  
        const { startDate, endDate, customerName, customerPhone, deviceType, OrderType, paymentType, orderStatus, greater } = data;
     
    try {
      setloading(true)

      let response = await axiosInstance.get(`${baseUrl}/admin-user/getAll`, { params: { page: currentPage, limit: itemsPerPage , search :customerName|| ''} });
      console.log('response: ', response);
      setUser(response.data.data.users)
      const total = response.data.data.totalCount;
      setTotalItems(total);
    } catch (e) {
      console.log(e)
    } finally {
      setloading(false)

    }

  }


  useEffect(() => {
    getAllUser()
  }, [currentPage, itemsPerPage])


  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    )
  };


  const toggleAll = () => {
    if (selectedRows.length === users.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(users.map((item) => item._id));
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleActionChange = async (e) => {
    try {
      if (
        (selectedAction === "Active" || selectedAction === "Inactive") &&
        selectedRows.length !== 0
      ) {
        try {
          setloading(true)
          await axiosInstance.put(`${baseUrl}/admin-user/active-inactive`, {
            ids: selectedRows,
            isActive: selectedAction === "Active" ? true : false,
          });
          getAllUser();
          setSelectedRows([]);
          toast.success("User Status Update Successfully");
        } catch (error) {
          console.log("error: ", error);
          toast.error("User Status Update faield");
        }
      } else if (selectedAction === "Remove" && selectedRows.length !== 0) {
        try {
          setloading(true);
             const DeleteRes = await axiosInstance.delete(`${baseUrl}/admin-user/delete`, {
        data: { ids: selectedRows }
      });
      toast.success("Successfully delete User")
      getAllUser()
          setSelectedRows([]);
          
        } catch (error) {
          console.log("efrror: ", error);
          toast.error("faild to Delete");
        } finally {
          setloading(false);
        }
      } else {
        
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false; // skip first render
        return;
      }
      handleActionChange();
    }, [selectedAction]);
  const onSubmit = async (data) => {
    getAllUser(data)
    console.log('data: ', data);
  }


  return (
    <>
      <div className={styles.Alluser}>
        <div className={styles.header}>
          <div>
            <button className={styles.runningBtn}>
              Total Users : 200
            </button>
            <button className={styles.csvBtn}>Export CSV</button>
          </div>

          <button className={styles.addBtn} onClick={() => setShowAddUser(true)} >+ Add New User</button>
        </div>
        <form className={styles.filterForm} onSubmit={handleSubmit(onSubmit)}>
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

            <div className={`${styles.formGroup} ${styles.phoneField}`}>
              <label>Customer Name</label>
              <input
                type="text"
                {...register("customerName")}
                placeholder="Name"
              />
            </div>
          </div>


          <div className={styles.row}>
            <div className={`${styles.formGroup}`}>
              <label>Customer Phone</label>
              <input
                type="text"
                {...register("customerPhone")}
                placeholder="Number"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Device Type</label>

              <Controller
                name="deviceType"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <CustomDropdown
                      placeholderColor="#667085"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "All", label: "All" },
                        { value: "android", label: "Android" },
                        { value: "ios", label: "Ios" },
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
            <div className={styles.formGroup}>
              <label>Order Type</label>
              <Controller
                name="OrderType"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <CustomDropdown
                      value={field.value}
                      placeholderColor="#667085"
                      onChange={field.onChange}
                      isMultiple={true}
                      options={[
                        { value: "All", label: "All" },
                        { value: "Dine In", label: "Dine In" },
                        { value: "Take Away", label: "Take Away" },
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
                        { value: "online", label: "Online" },
                        { value: "card", label: "Card" },
                        { value: "Wallet", label: "Wallet" },
                        { value: "Due", label: "Due" },

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
          <div className={styles.row}>
            <div className={`${styles.formGroup}`}>
              <label>Area Wise</label>
              <input
                type="text"
                {...register("orderStatus")}
                placeholder="Area Name"
              />
            </div>

            <div className={styles.formGroup}>
              <label>&nbsp;</label>
              <Controller
                name="greater"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <CustomDropdown
                      placeholderColor="#667085"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "=", label: "=" },
                        { value: ">", label: ">" },
                        { value: "<", label: "<" },
                      ]}
                      placeholder="="
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


            <div className={styles.areaWithButtons}>
              <button type="submit" className={styles.searchBtn}>Search</button>

              <div >
                <CustomDropdown
                  border="hsla(0, 91%, 54%, 1)"
                  value={selectedAction}
                  onChange={(val) => {
                    if (selectedRows.length === 0) {
                      toast.error(
                        "Please select at least one row before choosing an action"
                      );
                      return;
                    }
                    setSelectedAction(val);
                    setTimeout(() => {
                      setSelectedAction(null);
                    }, 100);
                  }}
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                    { label: "Remove", value: "Remove" },
                    { label: "Export CSV", value: "Export CSV" },

                  ]}
                  placeholder="Action"
                  isMultiple={false}
                  padding="9px"
                />
              </div>
            </div>
          </div>

        </form>

        <div className={styles.tableWrapper}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th style={{ width: "20px", paddingLeft: "17px" }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === users.length &&
                      users.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th>Customer No.</th>
                <th>Customer Name</th>
                <th>Total Spend</th>
                <th>Device</th>
                <th>
                  Last Order
                </th>
                <th>City</th>
                <th>User Created</th>

                <th>Status</th>
                <th></th>
                <th></th>

              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (users.map((cat) => (
                <tr key={cat._id}>
                  <td style={{ width: "20px" }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(cat?._id)}
                      onChange={() => toggleRow(cat?._id)}
                    />
                  </td>
                  <td>{1202}</td>
                  <td>
                    {cat.username}
                  </td>
                  <td>{cat.totalSpend}</td>
                  <td>
                    {cat.device}
                  </td>
                  <td>
                    {cat.lastOrder}
                  </td>

                  <td>
                    {cat.city}
                  </td>
                  <td>{formatDate(cat.createdAt)}</td>
                  <td
                    className={
                      cat.isActive === true ? styles.active : styles.inactive
                    }
                  >
                    {cat?.isActive === true ? "Active" : "InActive"}
                  </td>
                  <td style={{ padding: "0" }}>
                    <Tooltip text="View Detail" position="bottom" bg="black">

                      <div style={{ height: "20px" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.03613 12.322C1.96712 12.1146 1.96712 11.8904 2.03613 11.683C3.42313 7.51 7.36013 4.5 12.0001 4.5C16.6381 4.5 20.5731 7.507 21.9631 11.678C22.0331 11.885 22.0331 12.109 21.9631 12.317C20.5771 16.49 16.6401 19.5 12.0001 19.5C7.36213 19.5 3.42613 16.493 2.03613 12.322Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </Tooltip>
                  </td>

                  <td style={{ padding: "0" }}>

                    <Tooltip text="Edit User" position="bottom" bg="black">
                      <div
                        onClick={() => {
                          SetpreEditdata(cat);
                          setEditModalOpen(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"

                          // onClick={() => EditCoupon(coupon._id)}
                          style={{ height: "22px", marginLeft: "9px" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </div>
                    </Tooltip>
                  </td>


                  <td>

                  </td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {isEdited && <div className={styles.modalOverlay}>
        <div className={`${styles.modalBox}`} style={{ width: showOtp ? "500px" : "890px" }}>
          <EditUser
            data={preeditdata}
            onClose={() => {
              setEditModalOpen(false)
              setShowOtp(false)
            }}
            getAllUser={getAllUser}
          />

        </div>
      </div>}
      {showAddUser && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalBox}`} style={{ width: showOtp ? "500px" : "890px" }}>
            {!showOtp ? (
              <AddUser
                onClose={() => {
                  setShowAddUser(false)
                  setShowOtp(false)
                }}
                onSave={(data) => {
                  setOtpData(data);
                  setShowOtp(true);
                }}
              />
            ) : (
              <OTPVerification
                email={otpData.email}
                initialOtp={otpData.otp}
                onClose={() => {
                  setShowAddUser(false);
                  setShowOtp(false);
                }}

                onSuccess={() => {
                  setShowAddUser(false);
                  setShowOtp(false);
                  getAllUser();
                }}
                onVerify={(otp) => console.log("Entered OTP:", otp)}
                onResend={() => console.log("Resend OTP clicked")}
              />
            )}
          </div>
        </div>
      )}

      <Pagination currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(val) => {
          setItemsPerPage(val);
          setCurrentPage(1);
        }}
        label="User" />


      {loading && <Loader loading={loading} text='Loading User...' />}
    </>
  )
}


