import React, { useEffect, useRef, useState } from "react";
import styles from "./AllTaxes.module.css";
import { GoArrowLeft } from "react-icons/go";
import CustomDropdown from "../../../CustomeComponent/CustomDropdown/CustomDropdown";
import { TbCategoryFilled, TbReceiptTax } from "react-icons/tb";
import { useAppContext } from "../../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import Pagination from "../../../Component/Pagination/Pagination";
import { toast } from "react-toastify";
import Loader from "../../../Component/Loader/Loader";
import Tooltip from "../../../CustomeComponent/Tooltip/Tooltip";

export default function AllTaxes() {
  const { isSidebarOpen, loading, setloading, } = useAppContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);


  const isFirstRender = useRef(true);
  const [taxes, setTaxes] = useState([]);
  //pagination
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  async function GetAllTax() {
    try {
      setloading(true)

      let response = await axiosInstance.get(`${baseUrl}/tax/getAll`, {
        params: { page: currentPage, limit: itemsPerPage },
      });
      setTaxes(response.data.data.taxes);
      const total = response.data.data.totalCount;
      setTotalItems(total);
    } catch (e) {
      console.log(e);
    } finally {
      setloading(false)

    }
  }

  useEffect(() => {
    GetAllTax();
  }, [currentPage, itemsPerPage]);

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === taxes.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(taxes.map((item) => item?._id));
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
  const handleActionChange = async (e) => {
    console.log(
      'selectedAction === "Active" || selectedAction === "Inactive" && selectedRows.length !== 0: ',
      (selectedAction === "Active" || selectedAction === "Inactive") &&
      selectedRows.length !== 0
    );
    try {
      if (
        (selectedAction === "Active" || selectedAction === "Inactive") &&
        selectedRows.length !== 0
      ) {
        try {
          setloading(true)
          await axiosInstance.put(`${baseUrl}/tax/active-inactive`, {
            ids: selectedRows,
            isActive: selectedAction === "Active" ? true : false,
          });
          GetAllTax();
          setSelectedRows([]);
          toast.success("Tax Status Update Successfully");
        } catch (error) {
          console.log("error: ", error);
          toast.error("Tax Status Update faield");
        } finally {
          setloading(false)
        }
      } else if (selectedAction === "Remove" && selectedRows.length !== 0) {
        try {
          setloading(true)
          const DeleteRes = await axiosInstance.delete(`${baseUrl}/tax/delete`, {
            data: { ids: selectedRows }
          });
          toast.success("Tax delete Sucessfully")
          GetAllTax()
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


  return (
    <>
      <div className={styles.container}>
        <div
          className={`${styles.header} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarclose
            }`}
        >
          {/* Right Controls */}
          <div className={styles.rightControls}>
            <button className={styles.resetBtn}>Reset Bill No.</button>

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
              padding="9px"
            />

            <button
              onClick={() => navigate("/AddTax")}
              className={styles.addBtn}
            >
              + <span className="ms-1">Add Tax</span>
            </button>
          </div>
        </div>

        <div className={`${styles.tableWrapper}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === taxes.length && taxes.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th>Title</th>
                <th>Online Display Name</th>
                <th>Type</th>
                <th>Created On</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taxes.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(cat?._id)}
                      onChange={() => toggleRow(cat?._id)}
                    />
                  </td>
                  <td>{cat.title}</td>
                  <td>{cat.onlineDisplayName}</td>
                  <td>{cat.type}</td>

                  <td>{formatDate(cat.createdAt)}</td>
                  <td>{cat.amount ? cat.amount : '──'}</td>

                  <td
                    className={
                      cat.isActive === true ? styles.active : styles.inactive
                    }
                  >
                    {cat?.isActive === true ? "Active" : "Inactive"}
                  </td>
                  <td className="d-flex gap-2">
                    <div>

                      <Tooltip text="Edit Tax" position="top" bg="black">
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 24 24"
                          fill="none"
                          cursor={"pointer"}
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() =>
                            navigate(`/menuDiscount/EditTaxes/${cat._id}`)
                          }
                        >
                          <path
                            d="M16.862 4.487L18.549 2.799C18.9007 2.44733 19.3777 2.24976 19.875 2.24976C20.3723 2.24976 20.8493 2.44733 21.201 2.799C21.5527 3.15068 21.7502 3.62766 21.7502 4.125C21.7502 4.62235 21.5527 5.09933 21.201 5.451L10.582 16.07C10.0533 16.5984 9.40137 16.9867 8.685 17.2L6 18L6.8 15.315C7.01328 14.5986 7.40163 13.9467 7.93 13.418L16.862 4.487ZM16.862 4.487L19.5 7.125M18 14V18.75C18 19.3467 17.7629 19.919 17.341 20.341C16.919 20.763 16.3467 21 15.75 21H5.25C4.65326 21 4.08097 20.763 3.65901 20.341C3.23705 19.919 3 19.3467 3 18.75V8.25C3 7.65327 3.23705 7.08097 3.65901 6.65901C4.08097 6.23706 4.65326 6 5.25 6H10"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {taxes.length === 0 && (
            <div className="no-category-container">
              <div className="no-category-icon">
                <TbReceiptTax />
              </div>
              <br />
              <h2 className="no-category-text shine">No Taxes Found</h2>
              <p className="no-category-subtext">
                Try adding a new Taxes to get started!
              </p>
            </div>
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(val) => {
          setItemsPerPage(val);
          setCurrentPage(1);
        }}
        label="Taxes"
      />


      {loading && <Loader loading={loading} text="Loading Taxes..." />}
    </>
  );
}
