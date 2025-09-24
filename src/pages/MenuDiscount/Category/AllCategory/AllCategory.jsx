import React, { useEffect, useRef, useState } from "react";
import styles from "./AllCategory.module.css";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axiosInstance";
import { toast } from "react-toastify";
import EditCategoryModal from "../EditCategoryModal/EditCategoryModal";
import { useAppContext } from "../../../../Context/AppContext";
import { TbCategoryFilled } from "react-icons/tb";
import Loader from "../../../../Component/Loader/Loader";
import CustomDropdown from "../../../../CustomeComponent/CustomDropdown/CustomDropdown";
import Tooltip from "../../../../CustomeComponent/Tooltip/Tooltip";
import Pagination from "../../../../Component/Pagination/Pagination";

export default function AllCategory() {
  const [selectedAction, setSelectedAction] = useState(null);
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const { loading, setloading, search, setsearch, isSidebarOpen } = useAppContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [action, setAction] = useState("");
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const isFirstRender = useRef(true);
  const [filter, setfilter] = useState(null)


  //pagination
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  async function CategoryList() {
    try {
      setloading(true);
      const response = await axiosInstance.get(`${baseUrl}/categories/getAll`, {
        params: { page: currentPage, limit: itemsPerPage, search: search, isActive: filter === "Active" ? true : filter === "Inactive" ? false : null },

      });
      // console.log(response)
      const data = response.data.data.categories;
      setCategories(data);
      const total = response.data.data.totalCount;
      setTotalItems(total)

    } catch (error) {
      console.log("error: ", error);
      toast.error("failed to load category");
    } finally {
      setloading(false);
    }
  }
  useEffect(() => {
    CategoryList();
  }, [search, currentPage, itemsPerPage]);

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
  const handleActionChange = async (e) => {
    try {

      if (
        (selectedAction === "Active" || selectedAction === "Inactive") &&
        selectedRows.length !== 0
      ) {
        try {
          setloading(true);
          await axiosInstance.put(`${baseUrl}/categories/active-inactive`, {
            ids: selectedRows,
            isActive: selectedAction === "Active" ? true : false,
          });
          CategoryList();
          setSelectedRows([]);

          toast.success("Category Status Update Successfully");
        } catch (error) {
          console.log("error: ", error);
          toast.error("Category Status Update faield");
        } finally {
          setloading(false);

        }
      } else if (selectedAction === "Remove" && selectedRows.length !== 0) {
        try {
          setloading(true)
          const DeleteRes = await axiosInstance.delete(`${baseUrl}/categories/delete`, {
            data: { ids: selectedRows }
          });
          toast.success("Category delete Sucessfully")
          CategoryList()
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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // skip first render
      return;
    }
    CategoryList()
  }, [filter]);

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

        <div className={`${styles.header}  ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarclose} `}>
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
                ]}
                placeholder="Action"
                isMultiple={false}
                padding="12px"
              />
            </div>

            <div className={`${styles.dropdownWrapper}`}>
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
            <button className={`${styles.updateBtn}`}>Update Rank</button>
          </div>

          <button
            onClick={() => navigate("/menuDiscount/Addcategory")}
            className={styles.addBtn}
          >
            + <span className="ms-1">Add New Category</span>
          </button>
        </div>

        {/* Table Section */}
        <div
          className={`${styles.tableWrapper} `}
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
                <th>Name *</th>
                <th>Online Display Name</th>
                <th>Rank</th>
                <th>Status</th>
                <th>Created</th>
                <th>Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody >
              {categories.map((cat) => (
                <tr key={cat._id} onClick={() => toggleRow(cat?._id)}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(cat?._id)}
                      onChange={() => toggleRow(cat?._id)}
                    />
                  </td>
                  <td>{cat.title}</td>
                  <td>{cat.displayName}</td>
                  <td>{cat.rank}</td>
                  <td
                    className={
                      cat.isActive === true ? styles.active : styles.inactive
                    }
                  >
                    {cat?.isActive === true ? "Active" : "InActive"}
                  </td>
                  <td>{formatDate(cat.createdAt)}</td>
                  <td>{formatDate(cat.updatedAt)}</td>
                  <td>
                    <Tooltip text="Edit Category" position="bottom" bg="black">
                      <div
                        className={styles.editBtn}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setEditModalOpen(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                          onClick={() => EditCoupon(coupon._id)}
                          style={{ height: "24px" }}
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
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="no-category-container">
              <div className="no-category-icon">
                <TbCategoryFilled />
              </div>
              <br />
              <h2 className="no-category-text shine">No Categories Found</h2>
              <p className="no-category-subtext">
                Try adding a new category to get started!
              </p>
            </div>
          )}
        </div>
        <EditCategoryModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          category={selectedCategory}
          onUpdated={CategoryList}
          baseUrl={baseUrl}
        />
      </div>

      {loading && <Loader loading={loading} text="Loading Categories..." />}

      <Pagination currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(val) => {
          setItemsPerPage(val);
          setCurrentPage(1);
        }}
        label="Categories" />
    </>
  );
}
