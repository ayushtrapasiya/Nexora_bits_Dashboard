import React, { useEffect, useRef, useState } from 'react'
import styles from './AllDiscount.module.css'
import { TbCategoryFilled, TbRosetteDiscount } from 'react-icons/tb';
import { FaCaretDown } from 'react-icons/fa';
import CustomDropdown from '../../../../CustomeComponent/CustomDropdown/CustomDropdown';
import { IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft } from 'react-icons/go';
import { useAppContext } from '../../../../Context/AppContext';
import axios from 'axios';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'react-toastify';
import Tooltip from '../../../../CustomeComponent/Tooltip/Tooltip';
import Loader from '../../../../Component/Loader/Loader';
import Pagination from '../../../../Component/Pagination/Pagination';

export default function AllDiscount() {
  const navigate = useNavigate()
  const { loading, setloading, isSidebarOpen } = useAppContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const isFirstRender = useRef(true)
  //pagination
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  async function GetallDiscount() {

    try {
      setloading(true)
      const response = await axiosInstance.get(`${baseUrl}/discount/getAll`,
        { params: { page: currentPage, limit: itemsPerPage } }
      )

      setCategories(response.data.data.discounts)

      const total = response.data.data.totalCount;
      setTotalItems(total);

    } catch (error) {
      console.log('error: ', error);

    } finally {
      setloading(false)
    }
  }
  useEffect(() => {
    GetallDiscount()

  }, []);

  const handleActionChange = async (e) => {

    try {
      if (
        (selectedAction === "Active" || selectedAction === "Inactive") &&
        selectedRows.length !== 0
      ) {
        try {
      setloading(true);

          await axiosInstance.put(`${baseUrl}/discount/active-inactive`, {
            ids: selectedRows,
            isActive: selectedAction === "Active" ? true : false,
          });
          GetallDiscount();
          setSelectedRows([]);

          toast.success("Discount Status Update Successfully");
        } catch (error) {
          console.log("error: ", error);
          toast.error("Discount Status Update failed");
        }finally{
      setloading(false);
          
        }
      } else if (selectedAction === "Remove" && selectedRows.length !== 0) {
        try {
          setloading(true)
          const DeleteRes = await axiosInstance.delete(`${baseUrl}/discount/delete`, {
            data: { ids: selectedRows }
          });
          toast.success("Discount delete Sucessfully")
          GetallDiscount()
          setSelectedRows([])
          // console.log('DeleteRes: ', DeleteRes);
        } catch (error) {
          console.log("error: ", error);
          toast.error("failed to Delete");
        } finally {
          setloading(false);
        }
      } else {
        // toast.error("Please select row first")
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


  async function getData() {
    try {
      setloading(true);

      let response = await axiosInstance.get(`${baseUrl}`);
      console.log('response: ', response.data.data);
    } catch (e) {
      console.log(e)
    }finally{
      setloading(false);

    }

  }

  useEffect(() => {
    getData()
  }, [itemsPerPage, currentPage])

  useEffect(() => {
    const header = document.querySelector(`.${styles.header}`);

    if (!header) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${header.offsetHeight}px`
      );
    };

    // Run once
    updateHeight();

    // Observe size change
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(header);

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);


  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };




  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === categories.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(categories.map((item) => item?._id));
    }
  };





  return (
    <>

      <div className={styles.container}>


        <div className={`${styles.header} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarclose}`}>

          {/* Right Controls */}
          <div className={styles.rightControls}>
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
              ]}
              placeholder="Action"
              isMultiple={false}
              padding="10px"
            />
            <button
              onClick={() => navigate("/menuDiscount/AddDiscount")}
              className={styles.addBtn}
            >
              + <span className="ms-1">Add Discount</span>
            </button>
          </div>
        </div>


        <div
          className={`${styles.tableWrapper}`}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === categories.length &&
                      categories.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th>Title</th>
                <th>Type</th>
                <th>Add On</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(cat?._id)}
                      onChange={() => toggleRow(cat?._id)}
                    />
                  </td>
                  <td>{cat.title}</td>
                  

                  <td>{cat.discountType}</td>

                  <td>{cat.applicableOn}</td>
                  <td>{cat.amount}</td>

                  <td
                    className={
                      cat.isActive === true ? styles.active : styles.inactive
                    }
                  >
                    {cat?.isActive === true ? "Active" : "Inactive"}
                  </td>
                  <td className="d-flex gap-2">
                    <div>
                      <Tooltip text="View details" position="top" bg="black">

                        {/* View details */}
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 24 24"
                          fill="none"
                          cursor={"pointer"}
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => handleViewDetails(item)}
                        >
                          {" "}
                          <path
                            d="M9 12H12.75M9 15H12.75M9 18H12.75M15.75 18.75H18C18.5967 18.75 19.169 18.5129 19.591 18.091C20.0129 17.669 20.25 17.0967 20.25 16.5V6.108C20.25 4.973 19.405 4.01 18.274 3.916C17.9 3.88498 17.5256 3.85831 17.151 3.836M17.151 3.836C17.2174 4.05109 17.2501 4.27491 17.25 4.5C17.25 4.69891 17.171 4.88968 17.0303 5.03033C16.8897 5.17098 16.6989 5.25 16.5 5.25H12C11.586 5.25 11.25 4.914 11.25 4.5C11.25 4.269 11.285 4.046 11.35 3.836M17.151 3.836C16.868 2.918 16.012 2.25 15 2.25H13.5C13.0192 2.25011 12.5511 2.40414 12.1643 2.68954C11.7774 2.97493 11.492 3.3767 11.35 3.836M11.35 3.836C10.974 3.859 10.6 3.886 10.226 3.916C9.095 4.01 8.25 4.973 8.25 6.108V8.25M8.25 8.25H4.875C4.254 8.25 3.75 8.754 3.75 9.375V20.625C3.75 21.246 4.254 21.75 4.875 21.75H14.625C15.246 21.75 15.75 21.246 15.75 20.625V9.375C15.75 8.754 15.246 8.25 14.625 8.25H8.25ZM6.75 12H6.758V12.008H6.75V12ZM6.75 15H6.758V15.008H6.75V15ZM6.75 18H6.758V18.008H6.75V18Z"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />{" "}
                        </svg>{" "}
                      </Tooltip>
                    </div>{" "}
                    <div>
                      <Tooltip text="Edit Discount" position="top" bg="black">
                        {" "}
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 24 24"
                          fill="none"
                          cursor={"pointer"}
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => navigate(`/menuDiscount/EditDiscount/${cat._id}`)}
                        >
                          {" "}
                          <path
                            d="M16.862 4.487L18.549 2.799C18.9007 2.44733 19.3777 2.24976 19.875 2.24976C20.3723 2.24976 20.8493 2.44733 21.201 2.799C21.5527 3.15068 21.7502 3.62766 21.7502 4.125C21.7502 4.62235 21.5527 5.09933 21.201 5.451L10.582 16.07C10.0533 16.5984 9.40137 16.9867 8.685 17.2L6 18L6.8 15.315C7.01328 14.5986 7.40163 13.9467 7.93 13.418L16.862 4.487ZM16.862 4.487L19.5 7.125M18 14V18.75C18 19.3467 17.7629 19.919 17.341 20.341C16.919 20.763 16.3467 21 15.75 21H5.25C4.65326 21 4.08097 20.763 3.65901 20.341C3.23705 19.919 3 19.3467 3 18.75V8.25C3 7.65327 3.23705 7.08097 3.65901 6.65901C4.08097 6.23706 4.65326 6 5.25 6H10"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />{" "}
                        </svg>{" "}
                      </Tooltip>
                    </div>

                    <div className='mt-1'>
                      {" "}
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {" "}

                        <path d="M15.5 2V2.75M15.5 5.75V6.5M15.5 9.5V10.25M15.5 13.25V14M6.5 8.75H11.75M6.5 11H9.5M2.375 1.25C1.754 1.25 1.25 1.754 1.25 2.375V5.401C1.70675 5.66398 2.08612 6.04267 2.34992 6.49895C2.61371 6.95522 2.7526 7.47296 2.7526 8C2.7526 8.52704 2.61371 9.04478 2.34992 9.50105C2.08612 9.95733 1.70675 10.336 1.25 10.599V13.625C1.25 14.246 1.754 14.75 2.375 14.75H19.625C20.246 14.75 20.75 14.246 20.75 13.625V10.599C20.2933 10.336 19.9139 9.95733 19.6501 9.50105C19.3863 9.04478 19.2474 8.52704 19.2474 8C19.2474 7.47296 19.3863 6.95522 19.6501 6.49895C19.9139 6.04267 20.2933 5.66398 20.75 5.401V2.375C20.75 1.754 20.246 1.25 19.625 1.25H2.375Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />{" "}
                      </svg>{" "}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories?.length === 0 && (
            <div className="no-category-container">
              <div className="no-category-icon">
                <TbRosetteDiscount />
              </div>
              <br />
              <h2 className="no-category-text shine">No Discount Found</h2>
              <p className="no-category-subtext">
                Try adding a new discount to get started!
              </p>
            </div>
          )}
        </div>

      </div>


      <Pagination currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(val) => {
          setItemsPerPage(val);
          setCurrentPage(1);
        }}
        label="Discount" />

      {loading && <Loader loading={loading} text="Loading Discount..." />}
    </>
  )
}
