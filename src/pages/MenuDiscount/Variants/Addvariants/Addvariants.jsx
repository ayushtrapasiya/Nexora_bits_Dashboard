import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import styles from "./AddVariants.module.css";

import { FaCaretDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../Context/AppContext";
import Loader from "../../../../Component/Loader/Loader";
import 'animate.css';
import { GoArrowLeft } from 'react-icons/go';
import CustomDropdown from '../../../../CustomeComponent/CustomDropdown/CustomDropdown';
import axiosInstance from '../../../../api/axiosInstance';

export default function Addvariants() {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const navigate = useNavigate();
  const { loading, setloading } = useAppContext()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      categories: [{ name: "", displayName: "", status: true }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "categories",
  });

  const onSubmit = async (data) => {
    const payload = data.categories.map((cat) => ({
      title: cat.name,
      departmentName: cat.displayName,
      isActive: cat.status
    }));

    try {
      setloading(true)
      const res = await axiosInstance.post(`${baseUrl}/variants/create`, payload);
      toast.success("Variant created successfully!");
      navigate("/menuDiscount/AllVariant");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setloading(false)
    }
  };


  function resetform() {
    reset({
      categories: [{ name: "", displayName: "", status: false }],
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>

      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/menuDiscount/AllVariant")}><GoArrowLeft /> <span className="ms-2">Back</span></button>
        <div className={styles.headerRight}>
          <button className={styles.cancelBtn} onClick={resetform} type='button'>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSubmit(onSubmit)}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Title */}
      <h2 className={styles.title}>Add New Variants</h2>

      {/* Dynamic Fields */}
      {fields.map((item, index) => (
        <div key={item.id} className={styles.categoryBox}>
          <div className={styles.fieldRow}>
            {/* Name */}
            <div className={`${styles.field} `}>
              <label className={styles.label}>Name*</label>
              <input
                {...register(`categories.${index}.name`, {
                  required: "Name is required",
                })}
                className={styles.input}
              />
              {errors.categories?.[index]?.name && (
                <p className={styles.errorMsg}>
                  {errors.categories[index].name.message}
                </p>
              )}
            </div>

            {/* Department Name */}
            <div className={styles.field}>
              <label className={styles.label}>Department Name *</label>
              {/* <div className={styles.dropdownWrapper}>
                <select
                  {...register(`categories.${index}.displayName`, {
                    required: "Department Name is required",
                  })}
                  className={`${styles.input} ${styles.dropdown}`}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Size">Size</option>
                  <option value="Quantity">Quantity</option>
                  <option value="Portion">Portion</option>
                </select>
              

              </div> */}
              <div className={styles.dropdownWrapper}>
  <Controller
    name={`categories.${index}.displayName`}
    control={control}
    rules={{ required: "Department Name is required" }}
    render={({ field, fieldState }) => (
      <>
        <CustomDropdown
          options={[
            { value: "Size", label: "Size" },
            { value: "Quantity", label: "Quantity" },
            { value: "Portion", label: "Portion" },
          ]}
          placeholder="Select"
          value={field.value}
          onChange={field.onChange}
          border="#c5c8d4"
          padding="9px"
        />
        {fieldState.error && (
          <span className={styles.error}>{fieldState.error.message}</span>
        )}
      </>
    )}
  />
</div>
              {errors.categories?.[index]?.displayName && (
                <p className={styles.errorMsg}>
                  {errors.categories[index].displayName.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className={styles.statusWrapper}>
              <input
                type="checkbox"
                {...register(`categories.${index}.status`)}
                className={styles.checkbox}
              />
              <label>Status</label>
            </div>


          </div>
        </div>
      ))}
      {loading && <Loader text='Create Variants...'/>}

      <button
        type="button"
        onClick={() =>
          append({ name: "", displayName: "", status: true })
        }
        className={styles.addMoreBtn}
      >
        + Add More
      </button>
    </form>
  );
}
