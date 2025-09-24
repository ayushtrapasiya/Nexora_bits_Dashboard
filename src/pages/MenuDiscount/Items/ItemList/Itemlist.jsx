import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { FaCaretDown } from "react-icons/fa";
import axiosInstance from "../../../../api/axiosInstance";

import { IoFastFood, IoSearch } from "react-icons/io5";
import ItemDetails from "../ItemDetail/ItemDetails";
import { useAppContext } from "../../../../Context/AppContext";
import styles from "./Itemlist.module.css";
import CustomDropdown from "../../../../CustomeComponent/CustomDropdown/CustomDropdown";
import Loader from "../../../../Component/Loader/Loader";
import { toast } from "react-toastify";
import Tooltip from "../../../../CustomeComponent/Tooltip/Tooltip";
import Pagination from "../../../../Component/Pagination/Pagination";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";


export default function ItemList() {
  const { isSidebarOpen } = useAppContext();
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [categorylist, setcategorylist] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [items, setItems] = useState([]);
  const { setsearch, search, loading, setloading, totalItems, setTotalItems, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage } = useAppContext();



  const isFirstRender = useRef(true);
  const getmenudetail = async (value) => {
    const formData = {
      ids: selectedRows,
      body:
      {
        ...(value === "Remove Variations" && { variants: [], isVariant: false }),
        ...(value === "Remove Addons" && { addIds: [], isAddon: false }),
        ...(value === "Remove Images" && { imageUrl: [] })
      },
    };

    return formData;
  };
  async function GetAllItem() {
    try {
      setloading(true);
      const response = await axiosInstance.get(`${baseUrl}/menu/list`, {
        params: { page: currentPage, limit: itemsPerPage, categoryId: activeCategory, search: search },
      });

      const total = response.data.data.totalCount;
      setTotalItems(total);
      const categoryres = await axiosInstance.get(
        `${baseUrl}/menu/categories-list`
      );
      setcategorylist(categoryres.data.data);
      setItems(response.data.data.menus || []);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setloading(false);
    }
  }


  const handleActionChange = async () => {
    if (!selectedAction || selectedRows.length === 0) return;

    try {
      setloading(true);
      const actions = {
        Active: async () => {
          await axiosInstance.put(`${baseUrl}/menu/active-inactive`, {
            ids: selectedRows,
            isActive: true,
          });
          toast.success("Items activated successfully");
        },
        Inactive: async () => {
          await axiosInstance.put(`${baseUrl}/menu/active-inactive`, {
            ids: selectedRows,
            isActive: false,
          });
          toast.success("Items deactivated successfully");
        },
        "Remove Items": async () => {
          setloading(true);
          await axiosInstance.delete(`${baseUrl}/menu/delete`, {
            data: { ids: selectedRows },
          });
          toast.success("Items deleted successfully");
          setloading(false);
        },
        "Remove Variations": async () => {
          const data = await getmenudetail("Remove Variations");
          await axiosInstance.put(`${baseUrl}/menu/update-many`, data);
          toast.success("Variations removed successfully");
        },
        "Remove Addons": async () => {
          const data = await getmenudetail("Remove Addons");
          await axiosInstance.put(`${baseUrl}/menu/update-many`, data);
          toast.success("Addons removed successfully");
        },
        "Remove Images": async () => {
          const data = await getmenudetail("Remove Images");
          await axiosInstance.put(`${baseUrl}/menu/update-many`, data);
          toast.success("Images removed successfully");
        },
      };


      if (actions[selectedAction]) {
        await actions[selectedAction]();
        GetAllItem();
        setSelectedRows([]);
      }
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Something went wrong while performing action");

    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // skip first render
      return;
    }
    handleActionChange();
  }, [selectedAction]);
  useEffect(() => {
    GetAllItem();
  }, [activeCategory, search, currentPage, itemsPerPage]);


  const bothSidebarsOpen = isSidebarOpen && sidebarOpen;


  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === items.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(items.map((item) => item._id));
    }
  };

  // On icon click
  const handleViewDetails = (id) => {
    setSelectedItem(id);
    setShowDetails(true);
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

  return (
    <>
      <div className={styles.container}>

        <div
          className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
            }`}
        >
          <button

            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen && <span>Categories</span>}
            <FiMenu size={20} />
          </button>
          <ul className={styles.sidebarList}>
            {categorylist.map((cat, i) => (
              <li
                key={i}
                className={`${styles.sidebarItem} ${sidebarOpen && activeCategory === cat._id
                  ? styles.activeItem
                  : ""
                  }`}
                onClick={() => setActiveCategory(cat._id)}
              >
                {sidebarOpen && cat.title}{" "}
              </li>
            ))}{" "}
          </ul>
        </div>

        <div
          className={`${styles.mainContent} 
`}
        >
          <div
            className={`${styles.header} 
  ${isSidebarOpen ? styles.isopensidebar : styles.isclosesidebar} 
  ${bothSidebarsOpen ? styles.bothOpen : ""}`}
          >
            <div className={styles.leftControls}>
              <div className={styles.searchWrapper}>
                <IoSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.search}
                  onChange={(e) => setsearch(e.target.value)}
                />
              </div>
              <div style={{ width: "150px" }}>
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
                    { label: "Remove Items", value: "Remove Items" },
                    { label: "Remove Variations", value: "Remove Variations" },
                    { label: "Remove Addons", value: "Remove Addons" },
                    { label: "Remove Images", value: "Remove Images" },
                  ]}
                  placeholder="Action"
                  isMultiple={false}
                  padding="9px"
                />
              </div>

              <button className={styles.saveBtn}>Save</button>
            </div>

            <button
              onClick={() => navigate("/menuDiscount/AddItem")}
              className={styles.addBtn}
            >
              + <span className="ms-1">Add Items</span>
            </button>
          </div>

          {/* Table */}
          <div className={`
    ${styles.tableContainer}
    ${!isSidebarOpen && window.innerWidth <= 950 ? styles.sidebarClosedTable : ""}
    ${sidebarOpen ? styles.componentSidebarOpen : ""}
  `}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === items.length && items.length > 0
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Name *</th>
                  <th>Short Code *</th>
                  <th>Online Display Name</th>
                  <th>Price *</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody >
                {items.map((item) => (
                  <tr key={item._id} onClick={() => toggleRow(item._id)} style={{ marginTop: "400px" }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item._id)}
                        onChange={() => toggleRow(item._id)}
                      />
                    </td>
                    <td className={styles.cell}>{item?.name}</td>
                    <td className={styles.cell}>{item?.shortCode}</td>
                    <td className={styles.cell}>{item?.displayName}</td>
                    <td className={styles.cell}>₹ {item?.price}</td>
                    <td className={styles.cell}>{item?.description}</td>
                    <td>
                      {item.imageUrl ? (
                        <img

                          src={item?.imageUrl?.[0]}
                          alt={"NoImage"}
                          width="40"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="d-flex gap-1">
                      <Tooltip text="Item Detail" position="bottom" bg="black">
                        <div title="Item Detail">
                          {/* View details */}
                          <svg

                            width="23"
                            height="23"
                            viewBox="0 0 24 24"
                            fill="none"
                            cursor={"pointer"}
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => handleViewDetails(item._id)}
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
                        </div>{" "}
                      </Tooltip>
                      <Tooltip text="Edit Item" position="top" bg="black">
                        <div>
                          {" "}
                          <svg
                            width="23"
                            height="23"
                            viewBox="0 0 24 24"
                            fill="none"
                            cursor={"pointer"}
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() =>
                              navigate(`/menuDiscount/Edititem/${item._id}`)
                            }
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
                        </div>{" "}
                      </Tooltip>
                      <div>
                        {" "}
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          cursor={"pointer"}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {" "}
                          <path
                            d="M8.25 7.5V6.108C8.25 4.973 9.095 4.01 10.226 3.916C10.599 3.886 10.974 3.859 11.349 3.836M15.75 18H18C18.5967 18 19.169 17.7629 19.591 17.341C20.0129 16.919 20.25 16.3467 20.25 15.75V6.108C20.25 4.973 19.405 4.01 18.274 3.916C17.9 3.88498 17.5256 3.85831 17.151 3.836M17.151 3.836C17.009 3.3767 16.7226 2.97493 16.3357 2.68954C15.9489 2.40414 15.4808 2.25011 15 2.25H13.5C13.0192 2.25011 12.5511 2.40414 12.1643 2.68954C11.7774 2.97493 11.492 3.3767 11.35 3.836C11.285 4.046 11.25 4.269 11.25 4.5V5.25H17.25V4.5C17.25 4.269 17.216 4.046 17.151 3.836ZM15.75 18.75V16.875C15.75 15.9799 15.3944 15.1215 14.7615 14.4885C14.1285 13.8556 13.2701 13.5 12.375 13.5H10.875C10.5766 13.5 10.2905 13.3815 10.0795 13.1705C9.86853 12.9595 9.75 12.6734 9.75 12.375V10.875C9.75 9.97989 9.39442 9.12145 8.76149 8.48851C8.12855 7.85558 7.27011 7.5 6.375 7.5H5.25M6.75 7.5H4.875C4.254 7.5 3.75 8.004 3.75 8.625V20.625C3.75 21.246 4.254 21.75 4.875 21.75H14.625C15.246 21.75 15.75 21.246 15.75 20.625V16.5C15.75 14.1131 14.8018 11.8239 13.114 10.136C11.4261 8.44821 9.13695 7.5 6.75 7.5Z"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />{" "}
                        </svg>
                      </div>
                      {/* Add your edit/delete icons here */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {items.length === 0 && (
            <div className="no-category-container">
              <div className="no-category-icon">
                <IoFastFood />
              </div>
              <br />
              <h2 className="no-category-text shine">No Items Found</h2>
              <p className="no-category-subtext">
                Try adding a new Item to get started!
              </p>
            </div>
          )}
        </div>
      </div>


      {showDetails &&

        <ItemDetails
          show={showDetails}
          onHide={() => setShowDetails(false)}
          id={selectedItem}
        />
      }



      <div className=" col-12 d-flex align-items-center mt-3 position-fixed p-2 ps-4 bottom-0" style={{ background: " #ebebeb", marginLeft: sidebarOpen ? "220px" : "59px" }} >
        <div className="paginationInfo">
          <span>Showing {items.length} Of {totalItems} Items</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="dropdown"
          >
            {[5, 10, 20, 50, 100]?.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div className="paginationControls">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="pageBtn"
            disabled={currentPage === 1}
          >
            <FaCircleChevronLeft />
          </button>

          <span className="pageNumber">{currentPage}</span>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(totalItems / itemsPerPage) ? prev + 1 : prev
              )
            }
            className="pageBtn"
            disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
          >
            <FaCircleChevronRight />
          </button>
        </div>
      </div>


      {loading && <Loader loading={loading} text="Loading Items..." />}

    </>
  );
}
