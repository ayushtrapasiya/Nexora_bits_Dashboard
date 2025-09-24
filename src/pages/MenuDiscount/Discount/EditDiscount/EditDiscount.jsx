import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./EditDiscount.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import axiosInstance from "../../../../api/axiosInstance";
import { useAppContext } from "../../../../Context/AppContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCircleInfo } from "react-icons/fa6";
import { toast } from "react-toastify";
import Loader from "../../../../Component/Loader/Loader";
import Tooltip from "../../../../CustomeComponent/Tooltip/Tooltip";

export default function EditDiscount() {
  const { id } = useParams();
  // console.log('id: ', id);
  //   const { register, handleSubmit, reset, watch, setValue } = useForm({
  //     defaultValues: {
  //       orderType: ["Delivery", "Pick Up", "Dine In"],
  //       status: true,
  //     },
  //   });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      orderType: [],
      discountType: "",
      amount: "",
      maxDiscount: "",
      addDiscountOn: "",
      applicableOn: "",
      categories: [],
      items: [],
      applicableAmountMin: "",
      applicableAmountMax: "",
      validityFrom: "",
      validityTo: "",
      applicableTimeFrom: "",
      applicableTimeTo: "",
      applicableDays: [],
      validationType: "",
      isActive: false,
      termsAndConditions: "",
    },
  });
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const { loading, setloading } = useAppContext();
  const [startDate, setStartDate] = useState(null);
  const navigate = useNavigate();
  const [endDate, setendDate] = useState(null);

  //days status
  const [allDaysChecked, setAllDaysChecked] = useState(false);
  const [treeData, setTreeData] = useState([]);
  //categories radio dropdown
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  //item radio dropdown
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState({});

 


  useEffect(() => {
    const fetchDiscount = async () => {
      try {
      setloading(true);

        const res = await axiosInstance.get(
          `${baseUrl}/discount/get/${id}`
        );
        const data = res.data.data.discount;
        // console.log('data: ', data);
        const filters = res.data.data.filters;
        const filtersIds = res.data.data.filters;
        const allChildrenIds = [];
        filtersIds.forEach((category) => {
            category.children.forEach((child) => {
                allChildrenIds.push(child._id);
            });
        });

        // console.log("filters: ", );
        console.log(data)
        reset({
          title: data.title,
          orderType: data.orderType || [],
          discountType: data.discountType,
          amount: data.amount,
          maxDiscount: data.maxDiscount,
          addDiscountOn: data.addDiscountOn,
          applicableOn: data.applicableOn.toLowerCase(),
          categories: data.categories || [],
          items: allChildrenIds,
          applicableAmountMin: data.applicableAmountMin,
          applicableAmountMax: data.applicableAmountMax,
          // validityFrom: data.validityFrom,
          // validityTo: data.validityTo.split("T")[0],
          applicableTimeFrom: data.applicableTimeFrom,
          applicableTimeTo: data.applicableTimeTo,
          applicableDays: data.applicableDays || [],
          validationType: data.validationType,
          isActive: data.isActive,
          termsAndConditions: data.termsAndConditions,
        });
        
        setStartDate(data.validityFrom)
        setendDate(data.validityTo)
        console.log('data.validityFrom: ', data.validityFrom);

        setTreeData(filters);
        setSelected(allChildrenIds || []);
        setValue("items", allChildrenIds || []);

        setSelectedCategories(data.categories);
      } catch (err) {
        console.error("Error fetching discount:", err);
      }finally{
      setloading(false);

      }
    };

    fetchDiscount();
  }, [id]);

    const selectedDays = watch("applicableDays", []);

  // 🔹 Keep form value in sync when "All Days" is checked/unchecked
  useEffect(() => {
    if (allDaysChecked) {
      setValue("applicableDays", days, { shouldValidate: true });
    } else {
      // agar All Days uncheck kare to empty kar do
      setValue("applicableDays", selectedDays.filter((d) => days.includes(d)), {
        shouldValidate: true,
      });
    }
  }, [allDaysChecked]);
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
      setloading(true);

        const res = await axiosInstance.get(`${baseUrl}/discount/get/${id}`);
        const data = res.data.data.discount;
        const filters = res.data.data.filters;
        if(data.applicableDays[0] === "All Days"){
          setAllDaysChecked(true)
        }
        const allChildrenIds = [];
        (filters || []).forEach((category) => {
          (category.children || []).forEach((child) => {
            allChildrenIds.push(child._id);
          });
        });

        reset({
          title: data.title,
          orderType: data.orderType || [],
          discountType: data.discountType,
          amount: data.amount,
          maxDiscount: data.maxDiscount,
          addDiscountOn: data.addDiscountOn,
          applicableOn: data.applicableOn?.toLowerCase(),
          categories: data.categories || [],
          items: allChildrenIds,
          applicableAmountMin: data.applicableAmountMin,
          applicableAmountMax: data.applicableAmountMax,
          applicableTimeFrom: data.applicableTimeFrom,
          applicableTimeTo: data.applicableTimeTo,
          applicableDays: data.applicableDays || [],
          validationType: data.validationType,
          isActive: data.isActive,
          termsAndConditions: data.termsAndConditions,
        });

        // convert API values into Date objects
        setStartDate(data.validityFrom);
        setendDate(data.validityTo);

        setTreeData(filters);
        setSelected(allChildrenIds || []);
        setValue("items", allChildrenIds || []);
        setSelectedCategories(data.categories || []);
      } catch (err) {
        console.error("Error fetching discount:", err);
      }finally{
      setloading(false);

      }
    };

    fetchDiscount();
  }, [id]);

  useEffect(() => {
    if (treeData.length && selected.length) {
      let expandState = {};
      treeData.forEach((cat) => {
        const hasSelectedChild = cat.children.some((child) =>
          selected.includes(child._id)
        );
        if (hasSelectedChild) {
          expandState[cat._id] = true;
        }
      });
      setExpanded(expandState);
    //   console.log("Auto expanded:", expandState);
    }
  }, [treeData, selected]);

  const onSubmit = async (data) => {
        let finalDays = [];

    if (allDaysChecked) {
      finalDays = ["All Days"]; // all days
    } else {
      finalDays = data.applicableDays || []; // only selected
    }

    console.log("Form Data:", data);
    const payload = {
      title: data.title,
      orderType: data.orderType || [], // array
      discountType: data.discountType, // string
      amount: Number(data.amount), // number
      maxDiscount: Number(data.maxDiscount), // number
      addDiscountOn: data.addDiscountOn, // string
      applicableOn:
        data.applicableOn.charAt(0).toUpperCase() + data.applicableOn.slice(1), 
      categories: data.categories || [], // array
      items: data.items || [], // array
      applicableAmountMin: Number(data.applicableAmountMin), // number
      applicableAmountMax: Number(data.applicableAmountMax), // number
      validityFrom: startDate, // date string
      validityTo: endDate, // date string
      applicableTimeFrom: data.applicableTimeFrom, // string (HH:mm)
      applicableTimeTo: data.applicableTimeTo, // string (HH:mm)
      applicableDays:finalDays,
      validationType: data.validationType, // string
      isActive: Boolean(data.isActive), // boolean
      termsAndConditions: data.termsAndConditions || "", // string
    };
    console.log("payload: ", payload);
    try {
      setloading(true);
      let post = await axiosInstance.put(
        `${baseUrl}/discount/update/${id}`,
        payload
      );
      toast.success("Successfully Created Discount");
      navigate("/menuDiscount/AllDiscount")
      reset();
    } catch (e) {
      console.log(e);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
      setloading(true);

        const res = await axiosInstance.get(
          `${baseUrl}/discount/categories-list`
        );
        setCategories(res.data.data);
        const itemres = await axiosInstance.get(
          `${baseUrl}/discount/menu-list`
        );
        setTreeData(itemres.data.data);
        console.log("res: ", res);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }finally{
      setloading(false);

      }
    };

    fetchCategories();
  }, []);

  const applicableOn = watch("applicableOn");

  const handleCategoryChange = (id) => {
    let updated = [...selectedCategories];
    if (updated.includes(id)) {
      updated = updated.filter((c) => c !== id);
    } else {
      updated.push(id);
    }
    setSelectedCategories(updated);
    setValue("categories", updated); 
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
      setValue("categories", []);
    } else {
      const allIds = categories.map((c) => c._id);
      console.log("allIds: ", allIds);
      setSelectedCategories(allIds);
      setValue("categories", allIds);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const handleCategoryTreeChange = (cat) => {
    let updated = [...selected];
    const childIds = cat.children.map((c) => c._id);

    const allChildrenSelected = childIds.every((id) => updated.includes(id));

    if (allChildrenSelected) {
      // unselect all children
      updated = updated.filter((id) => !childIds.includes(id));
    } else {
      // select all children
      updated = [...new Set([...updated, ...childIds])];
    }

    setSelected(updated);
    setValue("items", updated); 
  };


  const handleChildChange = (parent, child) => {
    let updated = [...selected];

    if (updated.includes(child._id)) {
      updated = updated.filter((id) => id !== child._id);
    } else {
      updated.push(child._id);
    }

    setSelected(updated);
    setValue("items", updated);
  };

  // Collect all item IDs (for Select All)
  const getAllNodes = (nodes) => {
    let result = [];
    nodes.forEach((n) => {
      if (n.children && n.children.length > 0) {
        result = [...result, ...n.children.map((c) => c._id)];
      }
    });
    return result;
  };


  const handleSelectAllItems = () => {
    const allItems = getAllNodes(treeData);
    if (selected.length === allItems.length) {
      setSelected([]);
      setValue("items", []);
    } else {
      setSelected(allItems);
      setValue("items", allItems);
    }
  };
  // Days options
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <>
      <div className={styles.wrapper}>
        {loading && <Loader loading={loading} text="Updating Disocunt..."/>}
        {/* Header Row */}
        <div className={styles.header}>
          <button
            className={`${styles.backBtn}`}
            onClick={() => navigate("/menuDiscount/AllDiscount")}
          >
            <GoArrowLeft /> Back
          </button>
          <div>
            <button
              type="button"
              className={styles.cancelbtn}
              onClick={() => reset()}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="discountForm"
              className={styles.submitbtn}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          id="discountForm"
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Title */}
          <div className={`row mb-3 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Title *</label>
            <div className="col-md-6 col-sm-8">
              <input
                type="text"
                className={styles.inputField}
                {...register("title", { required: true })}
              />
            </div>
          </div>

         

          {/* Order Type - 3 Checkboxes */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Order Type *</label>
            <div className="col-md-6 col-sm-8 d-flex gap-3">
              <label>
                <input
                  type="checkbox"
                  value="Delivery"
                  {...register("orderType")}
                  defaultChecked
                />{" "}
                Delivery
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Pick Up"
                  {...register("orderType")}
                  defaultChecked
                />{" "}
                Pick Up
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Dine In"
                  {...register("orderType")}
                  defaultChecked
                />{" "}
                Dine In
              </label>
            </div>
          </div>

          {/* Discount Type - 3 Radio */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Discount Type *</label>
            <div className="col-md-6 col-sm-8 d-flex gap-3">
              <label>
                <input
                  type="radio"
                  value="percentage"
                  {...register("discountType")}
                />{" "}
                Percentage
              </label>
              <label>
                <input
                  type="radio"
                  value="flat"
                  {...register("discountType")}
                />{" "}
                Fixed
              </label>
            </div>
          </div>

          {/* Amount */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Amount (%) *</label>
            <div className="col-md-6 col-sm-8">
              <input
                type="number"
                className={styles.inputField}
                {...register("amount", { required: true })}
              />
            </div>
          </div>

          {/* Allow max discount */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Allow max discount</label>
            <div className="col-md-6 col-sm-8 d-flex align-items-center gap-2">
              <input
                type="number"
                className={styles.inputField}
                {...register("maxDiscount")}
              />
            </div>

            <div className="col-1">
                 <Tooltip text="Leave blank if you want it for whole day." position="right" bg="black">
              <FaCircleInfo className={styles.infoIcon} />
              </Tooltip>
            </div>
          </div>

          {/* Add Discount On - 3 Radio */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Add Discount On</label>
            <div className="col-md-6 col-sm-8 d-flex gap-3">
              <label>
                <input
                  type="radio"
                  value="Core"
                  {...register("addDiscountOn")}
                />{" "}
                Add On Core
              </label>
              <label>
                <input
                  type="radio"
                  value="Total"
                  {...register("addDiscountOn")}
                />{" "}
                Add On Total
              </label>
            </div>
          </div>

          {/* Applicable On - 3 Radio */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Applicable On</label>
            <div className="col-md-6 col-sm-8 d-flex gap-3">
              <label>
                <input type="radio" value="all" {...register("applicableOn")} />{" "}
                All
              </label>
              <label>
                <input
                  type="radio"
                  value="categories"
                  {...register("applicableOn")}
                />{" "}
                Categories
              </label>
              <label>
                <input
                  type="radio"
                  value="items"
                  {...register("applicableOn")}
                />{" "}
                Items
              </label>
            </div>
          </div>
     
          {applicableOn === "categories" && (
            <div className={styles.dropdownBox}>
              <h5 className="fw-bold mb-3">Categories</h5>
              <div className={`${styles.categoryItem} ${styles.root}`}>
                <input
                  type="checkbox"
                  checked={selectedCategories.length === categories.length}
                  onChange={handleSelectAll}
                />
                <label>
                  <b>Select All</b>
                </label>
              </div>

              <div className={styles.categoryList}>
                {/* Individual categories */}
                {categories.map((cat) => (
                  <div key={cat} className={styles.categoryItem}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => handleCategoryChange(cat._id)}
                    />
                    <label>{cat.title}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If Items Selected */}
          {applicableOn === "items" && (
            <div className={styles.dropdownBox}>
              <h5 className="fw-bold mb-3">Items</h5>

              {/* Select All */}
              <div className={`${styles.Items}`}>
                <div className={styles.root}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={
                        selected.length === getAllNodes(treeData).length &&
                        selected.length > 0
                      }
                      onChange={handleSelectAllItems}
                    />
                    <b>Select All</b>
                  </label>
                </div>
              </div>

              {/* Render Tree */}
              <div className={styles.treeList}>
                {treeData.map((cat) => (
                  <div key={cat._id} className={styles.treeGroup}>
                    <div className={styles.treeItem}>
                      {/* Expand/Collapse Button */}
                      <span
                        className={styles.expandBtn}
                        onClick={() => toggleExpand(cat._id)}
                      >
                        {cat.children.length > 0 ? (
                          expanded[cat._id] ? (
                            "−"
                          ) : (
                            "+"
                          )
                        ) : (
                          <span className={styles.dot}></span>
                        )}
                      </span>

                      {/* Checkbox + Label */}
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={
                            cat.children.length > 0 &&
                            cat.children.every((child) =>
                              selected.includes(child._id)
                            )
                          }
                          indeterminate={
                            cat.children.some((child) =>
                              selected.includes(child._id)
                            ) &&
                            !cat.children.every((child) =>
                              selected.includes(child._id)
                            )
                          }
                          onChange={() => handleCategoryTreeChange(cat)}
                        />
                        {cat.displayName || cat.title}
                      </label>
                    </div>

                    {/* Children */}
                    {expanded[cat._id] && (
                      <div className={styles.subTree}>
                        {cat.children.map((child) => (
                          <div key={child._id} className={styles.treeItem}>
                            <label className={styles.checkboxLabel}>
                              <input
                                type="checkbox"
                                checked={selected.includes(child._id)}
                                onChange={() => handleChildChange(cat, child)}
                              />
                              {child.displayName || child.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applicable Amount - Two Inputs */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3 mt-3">Applicable Amount</label>
            <div className="col-md-6 col-sm-8 d-flex gap-3">
              <div className="w-50">
                <small>Minimum (≥)</small>
                <input
                  type="number"
                  className={styles.inputField}
                  {...register("applicableAmountMin")}
                />
              </div>
              <div className="w-50">
                <small>Maximum (≤)</small>
                <input
                  type="number"
                  className={styles.inputField}
                  {...register("applicableAmountMax")}
                />
              </div>
            </div>

            <div className="col-1 ">
                 <Tooltip text="Leave blank if you want it for whole day." position="right" bg="black">
              <FaCircleInfo className="mt-4" />
              </Tooltip>
            </div>
          </div>

          {/* Discount Validity - Two Date Inputs */}
             <div className={`row mb-4 ${styles.formRow}`}>
      <label className="col-lg-2 col-sm-3 mt-3">Discount Validity</label>
      <div className="col-md-6 col-sm-8 d-flex gap-3">
        {/* Start Date */}
        <div className="w-50">
          <small>Start Date</small>
          <DatePicker
            selected={startDate}
            shouldCloseOnSelect={true}
            onChange={(date) => setStartDate(date)}
            placeholderText="dd/mm/yyyy"
            todayButton={
              <div className={styles.footerBtns}>
                <span onClick={() => setStartDate(new Date())}>Today</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setStartDate(null);
                  }}
                >
                  Clear
                </span>
              </div>
            }
            dateFormat="dd/MM/yyyy"
            className={styles.inputField}
            calendarClassName={styles.customCalendar}
            onChangeRaw={(e) => {
              const val = e.target.value;
              if (!val) {
                setStartDate(null);
                return;
              }
              const [d, m, y] = val.split("/");
              if (d && m && y) {
                const parsed = new Date(`${y}-${m}-${d}`);
                if (!isNaN(parsed.getTime())) setStartDate(parsed);
              }
            }}
            dayClassName={(date) => {
              if (!(startDate instanceof Date) || isNaN(startDate.getTime())) return undefined;
              return date.getDate() === startDate.getDate() &&
                date.getMonth() === startDate.getMonth() &&
                date.getFullYear() === startDate.getFullYear()
                ? styles.selectedDate
                : undefined;
            }}
          />
        </div>

        {/* End Date */}
        <div className="w-50">
          <small>End Date</small>
          <DatePicker
            selected={endDate}
            shouldCloseOnSelect={true}
            onChange={(date) => setendDate(date)}
            placeholderText="dd/mm/yyyy"
            todayButton={
              <div className={styles.footerBtns}>
                <span onClick={() => setendDate(new Date())}>Today</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setendDate(null);
                  }}
                >
                  Clear
                </span>
              </div>
            }
            dateFormat="dd/MM/yyyy"
            className={styles.inputField}
            calendarClassName={styles.customCalendar}
            onChangeRaw={(e) => {
              const val = e.target.value;
              if (!val) {
                setendDate(null);
                return;
              }
              const [d, m, y] = val.split("/");
              if (d && m && y) {
                const parsed = new Date(`${y}-${m}-${d}`);
                if (!isNaN(parsed.getTime())) setendDate(parsed);
              }
            }}
            dayClassName={(date) => {
              if (!(endDate instanceof Date) || isNaN(endDate.getTime())) return undefined;
              return date.getDate() === endDate.getDate() &&
                date.getMonth() === endDate.getMonth() &&
                date.getFullYear() === endDate.getFullYear()
                ? styles.selectedDate
                : undefined;
            }}
          />
        </div>
      </div>
    </div>
          {/* Applicable Time - Two Time Inputs */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Applicable Time</label>
            <div className="col-md-6 col-sm-8 d-flex gap-3">
                <input
                    type="time"
                    className={styles.inputField}
                    {...register("applicableTimeFrom")}
                />
                <input
                    type="time"
                    className={styles.inputField}
                    {...register("applicableTimeTo")}
                />
            </div>
          </div>

          {/* Days - All days checkbox + 7 days */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Days *</label>
            <div className="col-md-6 col-sm-8 d-flex flex-wrap gap-3">
              <label>
                <input
                  type="checkbox"
                  checked={allDaysChecked}
                  onChange={() => setAllDaysChecked(!allDaysChecked)}
                  
                />{" "}
                
                All Days
              </label>
              {!allDaysChecked &&
                days.map((day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      value={day}
                      {...register("applicableDays")}
                    />{" "}
                    {day}
                  </label>
                ))}
            </div>
          </div>
          {/* Validation - 2 Radio with description */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Validation *</label>

            <div className="col-md-6 col-sm-8 d-flex flex-column gap-3">
              <div className={styles.validationOption}>
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="radio"
                    value="NoCode"
                    {...register("validationType")}
                  />
                  <span className={styles.validationTitle}>
                    Without Code Without Validation
                  </span>
                </label>
                <div className={styles.validationDesc}>
                  Check this option if you want to give a discount even without
                  entering code details. Validation of the code will not be
                  done.
                </div>
              </div>

              <div className={styles.validationOption}>
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="radio"
                    value="AssignCoupon"
                    {...register("validationType")}
                  />{" "}
                  <span className={styles.validationTitle}>
                    Manual Validation
                  </span>
                </label>
                <div className={styles.validationDesc}>
                  Check this option if you want to give a discount with entering
                  code details. Validation of the code will not be done.
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className={`row mb-4 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Status</label>
            <div className="col-md-6 col-sm-8">
              <label>
                <input type="checkbox" {...register("isActive")} /> Active
              </label>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className={`row mb-3 ${styles.formRow}`}>
            <label className="col-lg-2 col-sm-3">Terms & Conditions</label>
            <div className="col-md-6 col-sm-8">
              <textarea
                className={styles.inputField}
                rows="4"
                {...register("termsAndConditions")}
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
