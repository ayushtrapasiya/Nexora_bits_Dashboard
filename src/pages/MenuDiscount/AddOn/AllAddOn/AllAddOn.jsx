import React, { useEffect, useRef, useState } from "react";
import { RxDoubleArrowDown } from "react-icons/rx";
import { HiChevronDoubleUp } from "react-icons/hi2";
import CustomDropdown from "../../../../CustomeComponent/CustomDropdown/CustomDropdown";
import styles from './AllAddon.module.css'
import { IoSearch } from 'react-icons/io5'
import { FaCaretDown } from 'react-icons/fa'
import { useAppContext } from '../../../../Context/AppContext'
import axiosInstance from '../../../../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Pagination from "../../../../Component/Pagination/Pagination";
import EditAddon from "../EditAddon/EditAddon";
import { TbReceiptTax } from "react-icons/tb";
import { BiExtension } from "react-icons/bi";
import Loader from "../../../../Component/Loader/Loader";
import Tooltip from "../../../../CustomeComponent/Tooltip/Tooltip";

export default function AllAddOn() {
  const { loading, setloading, search, setsearch, isSidebarOpen } =
    useAppContext();
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState(null);
  const [filter, setfilter] = useState(null);
  const [action, setAction] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandRow, setExpandRow] = useState(null);
  const isFirstRender = useRef(true);
  //pagination
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // test
  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  const [categories, setCategories] = useState([]);

  async function getAllData() {
    setloading(true);
    try {
      let response = await axiosInstance.get(`${baseUrl}/addon/getAll`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: search,
          isActive:
            filter === "Active" ? true : filter === "Inactive" ? false : null,
        },
      });
      setCategories(response.data.data.addOn);
      const total = response.data.data.totalCount;
      setTotalItems(total);
    } catch (e) {
      console.log(e);
      toast.error("failed to load AddOns");
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    getAllData();
  }, [search, itemsPerPage, currentPage, filter]);

  const toggleExpand = (id) => {
    setExpandRow(expandRow === id ? null : id);
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
      setSelectedRows(categories.map((item) => item.id));
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
          setloading(true);
          await axiosInstance.put(`${baseUrl}/addon/active-inactive`, {
            ids: selectedRows,
            isActive: selectedAction === "Active" ? true : false,
          });
          getAllData();
          setSelectedRows([]);
          toast.success("Addon Status Update Successfully");
        } catch (error) {
          console.log("error: ", error);
          toast.error("Addon Status Update failed");
        } finally {
          setloading(false);

        }
      } else if (selectedAction === "Remove" && selectedRows.length !== 0) {
        try {
          setloading(true);
          const DeleteRes = await axiosInstance.delete(
            `${baseUrl}/addon/delete`,
            {
              data: { ids: selectedRows },
            }
          );
          toast.success("Addon Delete Sucessfully");
          getAllData();
          setSelectedRows([]);
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
          className={`${styles.header} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarclose
            } `}
        >
          <div className={styles.leftControls}>
            {/* Search Box with Icon */}
            <div className={`${styles.searchWrapper}`}>
              <IoSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search..."
                className={styles.search}
                onChange={(e) => setsearch(e.target.value)}
              />
            </div>

            <div className={styles.dropdownWrapper}>
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
                padding="12px"
              />
            </div>

            <div className={styles.dropdownWrapper}>
              <CustomDropdown
                border="hsla(0, 91%, 54%, 1)"
                value={filter}
                onChange={(val) => {
                  setfilter(val);
                }}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
                placeholder="All"
                isMultiple={false}
                padding="12px"
              />
            </div>
            <button className={styles.updateBtn}>Update Rank</button>
          </div>

          <button
            onClick={() => navigate("/menuDiscount/CreateAddon")}
            className={styles.addBtn}
          >
            + <span className="ms-1">Add New Addon Group</span>
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedRows.length === categories.length}
                    onChange={toggleAll}
                  />
                </th>
                <th>Name *</th>
                <th></th>
                <th>Online Display Name</th>
                {/* <th>Rank</th> */}
                <th>Status</th>
                <th>Created</th>
                <th>Modified</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <React.Fragment key={cat._id}>
                  {/* Main Row */}
                  <tr
                    className={expandRow === cat._id ? styles.expandedRow : ""}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(cat._id)}
                        onChange={() => toggleRow(cat._id)}
                      />
                    </td>
                    <td>{cat.name}</td>
                    <td>
                      <span
                        className={styles.expandIcon}
                        onClick={() => toggleExpand(cat._id)}
                      >
                        {expandRow === cat._id ? (
                          <HiChevronDoubleUp />
                        ) : (
                          <RxDoubleArrowDown />
                        )}
                      </span>
                    </td>
                    <td>{cat.displayName}</td>
                    {/* <td>{cat.rank}</td> */}
                    <td
                      className={
                        cat.isActive === true ? styles.active : styles.inactive
                      }
                    >
                      {cat.isActive === true ? "Active" : "Inactive"}
                    </td>
                    <td>{formatDate(cat.createdAt)}</td>
                    <td>{formatDate(cat.updatedAt)}</td>
                    <td>

                      <div
                        className={styles.editBtn}
                      //  onClick={() => {
                      //   setSelectedCategory(cat);
                      //   setEditModalOpen(true);
                      // }}
                      >
                        <Tooltip text="Edit Addon" position="top" bg="black">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                            onClick={() =>
                              navigate(`/menuDiscount/EditAddon/${cat._id}`)
                            }
                            style={{ height: "24px" }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </Tooltip>
                      </div>

                    </td>
                  </tr>

                  {/* Expandable Row */}
                  {expandRow === cat._id && (
                    <tr>
                      <td colSpan={9} className={styles.expandCell}>
                        <table className={styles.innerTable}>
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Price</th>
                              <th>Attributes</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cat.items && cat.items.length > 0 ? (
                              cat.items.map((item, i) => (
                                <tr key={i}>
                                  <td>{item.name}</td>
                                  <td>₹ {item.price}</td>
                                  <td>{item.attributes}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                  No items found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && (
          <div className="no-category-container">
            <div className="no-category-icon">
              <BiExtension />
            </div>
            <br />
            <h2 className="no-category-text shine">No Addons Found</h2>
            <p className="no-category-subtext">
              Try adding a new Addons to get started!
            </p>
          </div>
        )}
      </div>


      {loading && <Loader loading={loading} text="Loading Addons..." />}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(val) => {
          setItemsPerPage(val);
          setCurrentPage(1);
        }}
        label="Addons"
      />
    </>
  );
}
