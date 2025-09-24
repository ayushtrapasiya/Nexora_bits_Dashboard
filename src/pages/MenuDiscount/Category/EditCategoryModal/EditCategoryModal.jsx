import React, { useEffect } from "react";
import styles from "./EditCategoryModal.module.css";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../../api/axiosInstance";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../Context/AppContext";
import Loader from "../../../../Component/Loader/Loader";

export default function EditCategoryModal({ isOpen, onClose, category, onUpdated, baseUrl }) {
  const { register, handleSubmit, reset } = useForm();

  const { loading, setloading } = useAppContext();
  //  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  useEffect(() => {
    if (category) {
      reset({
        title: category.title,
        displayname: category.displayName,
        status: category.isActive,
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
            displayName: data.displayname,
            rank: category.rank,
            isActive: data.status
          }
        ]
      };
      const response = await axiosInstance.put(
        `${baseUrl}/categories/update`,
        payload
      );

      toast.success("Category updated successfully!");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category!");
    } finally {
      setloading(false)

    }
  };

  if (!isOpen) return null;

  return (
    <>
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h4><b>Edit Category</b></h4>
          <button onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Name *</label>
              <input {...register("title", { required: true })} />
            </div>

            <div className={styles.field}>
              <label>Online Display Name</label>
              <input {...register("displayname", { required: true })} />
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
    </div>


{loading && <Loader loading={loading} text="Updating Category..."/>}
    </>

  );
}
