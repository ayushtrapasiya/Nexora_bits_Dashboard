import React, { useEffect } from "react";
import styles from "./EditVariantsModal.module.css";
import { Controller, useForm } from "react-hook-form";
import axiosInstance from "../../../../api/axiosInstance";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../Context/AppContext";
import Loader from "../../../../Component/Loader/Loader";
import CustomDropdown from "../../../../CustomeComponent/CustomDropdown/CustomDropdown";

export default function EditVariantsModal({ isOpen, onClose, category, onUpdated, baseUrl }) {
  const { register, handleSubmit, reset , control } = useForm();
  const { loading, setloading } = useAppContext()
  useEffect(() => {
    if (category) {
      console.log('category: ', category);
      reset({
        title: category.title,
        displayname: category.departmentName?.trim(),
        status: category?.isActive,
      });
    }
  }, [category, reset]);

  const onSubmit = async (data) => {

    try {
      setloading(true)
      const payload = {
        updates: [
          {
            id: category._id,
            title: data.title,
            departmentName: data.displayname,
            rank: category.rank,
            isActive: data.status
          }
        ]
      };

      const response = await axiosInstance.put(
        `${baseUrl}/variants/update`,
        payload
      );
      toast.success("variants updated successfully!");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update variants!");
    } finally {
      setloading(false)
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} animate__animated animate__fadeIn`}>
        <div className={styles.modalHeader}>
          <h4><b>Edit Variants</b></h4>
          <button onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Name *</label>
              <input {...register("title", { required: true })} />
            </div>

            <div className={styles.field}>
              <label>Department Name *</label>
<Controller
  name="displayname"
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
        padding="10px"
      />
      {fieldState.error && (
        <span className="error">{fieldState.error.message}</span>
      )}
    </>
  )}
/>
              {/* <select
                {...register("displayname", {
                  required: "Department Name is required",
                })}
                className={`${styles.input} ${styles.dropdown} p-2`}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Size">Size</option>
                <option value="Quantity">Quantity</option>
                <option value="Portion">Portion</option>
              </select> */}
              
            </div>


            <div className={styles.checkboxField}>
              <input type="checkbox" {...register("status")} />
              <label>Status</label>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
      {loading && <Loader loading={loading} text="Updating Variants..."/>}
    </div>
  );
}
