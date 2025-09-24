import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import styles from "./EditAddon.module.css";
import { GoArrowLeft } from "react-icons/go";
import axiosInstance from "../../../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../Context/AppContext";
import Loader from "../../../../Component/Loader/Loader";
import CustomDropdown from "../../../../CustomeComponent/CustomDropdown/CustomDropdown";

export default function EditAddon() {
  const { loading, setloading } = useAppContext()
    const {id} = useParams()
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
const getdata = async () => {
  try {
    setloading(true)
    const res = await axiosInstance.get(`${baseUrl}/addon/details/${id}`);
    const data = res.data.data;
    const formData = {
      name: data.name || "",
      displayName: data.displayName || "",
      selectionType: data.selectionType || "",
      maxSelectionPerAddonAllowed: data.maxSelectionPerAddonAllowed || 1,
      minSelection: data.minSelection || 1,
      maxSelection: data.maxSelection || 1,
      items:  data.items.map((item) => ({
  name: item.name || "",
  price: item.price || "",
  attributes: item.attributes || "",
  isActive: item.isActive ?? true,
  status: item.isActive ? "true" : "false",  
})),
    };

    // Fill form
    reset(formData);
  } catch (error) {
    console.error("Error fetching addon details:", error);
  }finally{
    setloading(false)
  }
};
useEffect(() => {
  if (id) getdata();
}, [id]);
  const onSubmit = async (data) => {
  const transformedData = {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      isActive: item.status === "true", 
      status: undefined,  
    })),
    isActive: true,  
  };

  const payload = transformedData;
  // console.log('payload: ', payload);
    try {
      setloading(true)
      let res = await axiosInstance.put(`${baseUrl}/addon/update/${id}`, payload)
      toast.success("Addon Edit successfully!");
      handleClearAll()
      navigate("/menuDiscount/AllAddOn")
    } catch (e) {
      console.log(e)
    } finally {
      setloading(false)
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
             Edit& Save Changes
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

          {/* Addon Group Section */}

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
                {/* <select {...register(`items.${index}.attributes`)}>
                  <option value="">Select</option>
                  <option value="Veterinarian">Veterinarian</option>
                  <option value="General">General</option>
                </select> */}
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
      {/* {fieldState.error && (
        <span className={styles.error}>{fieldState.error.message}</span>
      )} */}
    </>
  )}
/>

              </div>
              <div className={styles.status}>
                {/* <select
                  className={`${styles.statusDropdown} `}
               
                  onChange={(e) => setValue(e.target.value)} // agar state se control kar rahe ho
                >
                  <option value="true" className={styles.active}>
                    Active
                  </option>
                  <option value="false" className={styles.inactive}>
                    Inactive
                  </option>
                </select> */}
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
                append({ name: "", price: "", attributes: "", status: "true"   })
              }
            >
              + Add New
            </button>
          </div>
        </form>
      </div>

      {loading && <Loader loading={loading} text="Updating Addon"/>}
    </>
  );
}
