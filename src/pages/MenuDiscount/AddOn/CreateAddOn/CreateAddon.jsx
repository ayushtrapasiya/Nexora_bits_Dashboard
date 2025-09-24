import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import styles from "./CreateAddOn.module.css";
import { GoArrowLeft } from "react-icons/go";
import axiosInstance from "../../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../Context/AppContext";
import Loader from "../../../../Component/Loader/Loader";
import CustomDropdown from "../../../../CustomeComponent/CustomDropdown/CustomDropdown";

export default function CreateAddon() {
  const { loading, setloading } = useAppContext()

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_REACT_API_URL;

  const { register, control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      displayName: "",
      selectionType: "",
      maxSelectionPerAddonAllowed: 1,
      minSelection: 1,
      maxSelection: 1,
      items: [
        { name: "", price: "", attributes: "", isActive: true },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // const onSubmit = async (data) => {
  //   console.log("Form Data:", data);

  //   const payload = [data];
  //   console.log('payload: ', payload);

  //   // try {
  //   //   setloading(true)
  //   //   let res = await axiosInstance.post(`${baseUrl}/addon/create`, payload)
  //   //   toast.success("Addon created successfully!");
  //   //   handleClearAll()
  //   //   navigate("/menuDiscount/AllAddOn")
  //   // } catch (e) {
  //   //   console.log(e)
  //   // } finally {
  //   //   setloading(false)
  //   // }
  // };

const onSubmit = async (data) => {
  // console.log("Raw Form Data:", data);

  //  Transform items: status -> isActive
  const transformedData = {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      isActive: item.status === "true", // convert string "true"/"false" → boolean
      status: undefined, // remove status field
    })),
    isActive: true, // addon group itself should be active
  };

  const payload = [transformedData];
 

  try {
    setloading(true);
    await axiosInstance.post(`${baseUrl}/addon/create`, payload);
    toast.success("Addon created successfully!");
    handleClearAll();
    navigate("/menuDiscount/AllAddOn");
  } catch (e) {
    console.log(e);
  } finally {
    setloading(false);
  }
};



  function handleClearAll() {
    reset({
      name: "",
      displayName: "",
      selectionType: "",
      maxSelectionPerAddonAllowed: 1,
      minSelection: 1,
      maxSelection: 1,
      items: [
        { name: "", price: "", attributes: "", isActive: true },
      ],
    });
  }

  return (
    <>
      <div className={styles.container}>
        {/* Sticky Header */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate("/menuDiscount/AllAddOn")}><GoArrowLeft /> <span className="ms-2">Back</span></button>
          <div className={styles.headerRight}>
            <button className={styles.cancelBtn} onClick={handleClearAll}>Cancel</button>
            <button className={styles.saveBtn} onClick={handleSubmit(onSubmit)}>
              Save Changes
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* First Row */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Name*</label>
              <input {...register("name")} />
            </div>
            <div className={styles.formGroup}>
              <label>Online Display Name</label>
              <input {...register("displayName")} />
            </div>
            <div className={styles.formGroup}>
              <label>Addon Item Selection</label>
             
              <Controller
  name="selectionType"
  control={control}
  rules={{ required: "Selection type is required" }}
  render={({ field, fieldState }) => (
    <>
      <CustomDropdown
        value={field.value}
        onChange={field.onChange}
        options={[
          { value: "single", label: "Allow Single selection" },
          { value: "multiple", label: "Allow Multiple selection" },
        ]}
        placeholder="Select"
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
          </div>

          {/* Second Row */}
          <div className={styles.row}>
            <div className={`${styles.formGroup} ${styles.smallInput}`}>
              <label>Max Selection Per Addon Allowed</label>
              <input type="number" {...register("maxSelectionPerAddonAllowed", { valueAsNumber: true })} />
            </div>
            <div className={`${styles.formGroup} ${styles.smallInput}`}>
              <label>Addon Min</label>
              <input type="number" {...register("minSelection", { valueAsNumber: true })} />
            </div>
            <div className={`${styles.formGroup} ${styles.smallInput}`}>
              <label>Addon Max</label>
              <input type="number" {...register("maxSelection", { valueAsNumber: true })} />
            </div>
          </div>

    

          <h4 className={styles.sectionTitle}>Addon Group Item Details</h4>

          {fields.map((item, index) => (
            <div key={item.id} className={styles.addonRow}>
              <div className={styles.formGroup}>
                <label>Name*</label>
                <input {...register(`items.${index}.name`)} />
              </div>
              <div className={styles.formGroup}>
                <label>Price*</label>
                <input
                  type="number"
                  {...register(`items.${index}.price`, { valueAsNumber: true })}
                  defaultValue={30}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Attributes*</label>

                <Controller
  name={`items.${index}.attributes`}
  control={control}
  rules={{ required: "Attribute is required" }}
  render={({ field, fieldState }) => (
    <>
      <CustomDropdown
        value={field.value}
        onChange={field.onChange}
        options={[
          { value: "Veterinarian", label: "Veterinarian" },
          { value: "General", label: "General" },
        ]}
        placeholder="Select"
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
              <div className={styles.status}>
         
<Controller
  name={`items.${index}.status`}   // <- yahan change kiya
  control={control}
  rules={{ required: "Status is required" }}
  render={({ field, fieldState }) => (
    <>
      <CustomDropdown
        value={field.value}
        onChange={field.onChange}
        options={[
          { value: "true", label: "Active" },
          { value: "false", label: "Inactive" },
        ]}
        placeholder="Select"
        border="#c5c8d4"
        padding="9px"
      />
      {fieldState.error && (
        <span className={styles.error}>{fieldState.error.message}</span>
      )}
    </>
  )}
/>

                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => remove(index)} // agar react-hook-form use kar rahe ho
                >

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.deleteIcon}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <div className={styles.addmorebtn}>
            <button
              type="button"
              className={styles.addBtn}
              onClick={() =>
append({ name: "", price: "", attributes: "", status: "true" })
              }
            >
              + Add New
            </button>
          </div>
        </form>
      </div>

      {loading && <Loader loading={loading} text="Create Addons"/>}
    </>
  );
}
