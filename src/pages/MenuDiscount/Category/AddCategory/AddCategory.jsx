import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "./AddCategory.module.css";
import { toast } from "react-toastify";
import { IoRemoveCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../Component/Loader/Loader";
import { useAppContext } from "../../../../Context/AppContext";
import { GoArrowLeft } from "react-icons/go";
import axiosInstance from "../../../../api/axiosInstance";
// import { useNavigate } from "react-router-dom"; // Uncomment if you want actual navigation

export default function AddCategory() {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const navigate = useNavigate();
  const { loading, setloading } = useAppContext()
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      categories: [{ name: "", displayName: "", status: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  const onSubmit = async (data) => {

    try {
      setloading(true)
      // Transform data as per API requirement
      const payload = data.categories.map((cat) => ({
        title: cat.name,
        displayName: cat.displayName,
        isActive: cat.status
      }));

      const response = await axiosInstance.post(`${baseUrl}/categories/create`, payload);
      // console.log("API Response:", response.data);
      toast.success("Categories created successfully!");

      resteform()
      navigate("/menuDiscount/Allcategory")
    } catch (error) {
      console.error("Error creating categories:", error);
      toast.error("Failed to create categories!");
    } finally {
      setloading(false)
    }
  };

  function resteform() {
    reset({
      categories: [{ name: "", displayName: "", status: true }],
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      {/* Top Buttons */}
      <div className={styles.topButtons}>
        {/* Back Button */}
        <button className={styles.backBtn} onClick={() => navigate("/menuDiscount/Allcategory")}><GoArrowLeft /> <span className="ms-2">Back</span></button>


        <div>
          <button type="button" className={styles.cancelBtn} onClick={resteform}>
            Cancel
          </button>
          &nbsp;&nbsp;
          <button type="submit" className={styles.saveBtn}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Title */}
      <h2 className={styles.title}>Add New Category</h2>

      {/* Dynamic Fields */}
      {fields.map((item, index) => (
        <div key={item.id} className={styles.categoryBox}>
          <div className={styles.fieldRow}>
            {/* Name */}
            <div className={styles.field}>
              <label className={styles.label}>Name*</label>
              <input
                {...register(`categories.${index}.name`, { required: true })}
                className={styles.input}
              />
            </div>

            {/* Online Display Name */}
            <div className={styles.field}>
              <label className={styles.label}>Online Display Name</label>
              <input
                {...register(`categories.${index}.displayName`)}
                className={styles.input}
              />
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

          {index !== 0 && <button
            type="button"
            className={styles.deleteBtn}
            onClick={() => remove(index)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.deleteIcon}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>}

        </div>
      ))}
      {loading && <Loader loading={loading} text="Create Category..."/>}
      {/* Add More Button */}
      <button
        type="button"
        onClick={() => append({ name: "", displayName: "", status: true })}
        className={styles.addMoreBtn}
      >
        + Add More
      </button>
    </form>
  );
}
