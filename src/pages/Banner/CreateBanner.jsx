import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styles from "./CreateBanner.module.css";
import CustomDropdown from "../../CustomeComponent/CustomDropdown/CustomDropdown";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";

const CreateBanner = () => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [type, setType] = useState("Single");
  const [images, setImages] = useState([]);
    const navigate = useNavigate()
  const [isScheduled, setIsScheduled] = useState(false);
  const selectedHour = watch("hours");
  const selectedMinute = watch("minutes");
  const selectedSecond = watch("seconds");

  // Image selection handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (type === "one") {
      setImages(files.slice(0, 1));
    } else {
      setImages((prev) => [...prev, ...files]);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Submit form
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("status", data.status);
      formData.append("sendTime", data.sendTime);
      formData.append("type", type);

      images.forEach((img) => {
        formData.append("images", img); // backend should accept "images" array
      });

      console.log("formData: ", formData);
      // Dummy API call
      //   await axios.post("/api/banner", formData, {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   });

      alert("Banner submitted successfully ✅");
      reset();
      setImages([]);
    } catch (error) {
      console.error("Error submitting banner:", error);
      alert("Failed to submit banner ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      {/* Upload Box */}
      
      <div
        className={styles.row}
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div style={{ width: "200px", display:"flex", gap:"10px" }}>
            <button className={styles.backBtn} onClick={() => navigate("/Allbanner")} type="button"><GoArrowLeft /> <span className="">Back</span></button>
          <CustomDropdown
            border="hsla(0, 91%, 54%, 1)"
            value={type}
            onChange={(val) => setType(val)}
            options={[
              { label: "Single", value: "Single" },
              { label: "Multiple", value: "Multiple" },
            ]}
            placeholder="Select type"
            isMultiple={false}
            padding="8px"
            openUp={false}
          />
         
        </div>

        <button type="submit" className={styles.addBtn}>
          Save Banner
        </button>
      </div>
      <div className={styles.uploadBox}>
        {images.length === 0 ? (
          <p className={styles.uploadText}>
            <span><FiUploadCloud size={"55px"} color="var(--red-color)" /></span> <br />
            Upload Image Here <br />
            (Jpg, png files supported only) <br />
            (Max File Size 10 MB)
          </p>
        ) : (
          <div className={styles.preview}>
            {images.map((img, i) => (
              <div key={i} className={styles.previewItem}>
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview-${i}`}
                  className={styles.previewImg}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeImage(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hidden Input + Custom Button */}
        <input
          type="file"
          id="fileInput"
          accept="image/png, image/jpeg"
          multiple={type === "Multiple"}
          onChange={handleImageChange}
          className={styles.fileInput}
        />
        <label htmlFor="fileInput" className={styles.customFileBtn}>
          Select File
        </label>
      </div>

      {/* Status + Send Time */}
      {/* <div className={styles.row}>
 
        <div className={styles.buttonGroup}>
          <button
            type="button"
            {...register("sendTime")}
            value="now"
            className={styles.btn}
            onClick={() => setIsScheduled(false)}
            style={{
              backgroundColor: !isScheduled ? "var(--red-color)" : "white",
              color: !isScheduled ? "white" : "black",
            }}
          >
            Now
          </button>
          <button
            type="button"
            {...register("sendTime")}
            value="schedule"
            className={styles.btn}
            style={{
              backgroundColor: isScheduled ? "var(--red-color)" : "white",
              color: isScheduled ? "white" : "black",
            }}
            onClick={() => setIsScheduled(true)}
          >
            Schedule
          </button>
        </div>
      </div> */}

      {/* Type Dropdown */}

      {/* {isScheduled && (
        <div className={styles.scheduleBox}>
          <div className={styles.inputGroup}>
            <label>Date: </label>
            <br />
            <input
              type="date"
              {...register("scheduleDate")}
              className={styles.input}
              style={{
                border: "1px solid var(--red-color)",
                borderRadius: "5px",
                padding: "5px",
              }}
            />
          </div>

          <div className={styles.timeRow}>
       
            <div className={styles.selectGroup}>
              <label>Hours:</label>
              <CustomDropdown
                border="hsla(0, 91%, 54%, 1)"
                value={selectedHour}
                onChange={(val) => setValue("hours", val)}
                options={Array.from({ length: 24 }, (_, i) => ({
                  label: (i + 1).toString().padStart(2, "0"), // 01, 02, ..., 24
                  value: i + 1, // value 1 to 24
                }))}
                placeholder="HH"
                isMultiple={false}
                padding="8px"
                openUp={true}
              />
            </div>

   
            <div className={styles.selectGroup}>
              <label>Minutes:</label>
              <CustomDropdown
                border="hsla(0, 91%, 54%, 1)"
                value={selectedMinute}
                onChange={(val) => setValue("minutes", val)}
                options={[...Array(60).keys()].map((m) => ({
                  label: (m + 1).toString().padStart(2, "0"), // 01, 02, ..., 60
                  value: m + 1, // 1 to 60
                }))}
                placeholder="MM"
                isMultiple={false}
                padding="8px"
                openUp={true}
              />
            </div>

      
            <div className={styles.selectGroup}>
              <label>Seconds:</label>

              <CustomDropdown
                border="hsla(0, 91%, 54%, 1)"
                value={selectedSecond}
                onChange={(val) => setValue("seconds", val)}
                options={[...Array(60).keys()].map((s) => ({
                  label: (s + 1).toString().padStart(2, "0"), // 01, 02, ..., 60
                  value: s + 1, // 1 to 60
                }))}
                placeholder="SS"
                isMultiple={false}
                padding="8px"
                openUp={true}
              />
            </div>
          </div>
        </div>
      )} */}

      {/* Submit */}
    </form>
  );
};

export default CreateBanner;
