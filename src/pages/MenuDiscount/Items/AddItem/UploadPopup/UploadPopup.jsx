 import React, { useEffect, useState } from "react";
import styles from "./UploadPopup.module.css";
import { FaFileImage, FaTimes } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import axiosInstance from "../../../../../api/axiosInstance";
import { toast } from "react-toastify";
import { useAppContext } from "../../../../../Context/AppContext";
import Loader from "../../../../../Component/Loader/Loader";


export default function UploadPopup({ onClose ,itemname, itemIndex, onUploadSuccess,  existingImages = [] }) {
    const baseUrl = import.meta.env.VITE_REACT_API_URL
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
   const { loading, setloading } = useAppContext()
  console.log('files: ', files);

    useEffect(() => {
    if (existingImages.length > 0) {
      // purani images ko initial state me daal dena
      const mapped = existingImages.map((url) => ({
        // console.log('url: ', url);
        file: null,
        name: url.name,
        size: "existing",
        progress: 100,
        status: "success",
        previewUrl: url, 
      }));
      setFiles(mapped);
    }
  }, [existingImages]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + "MB",
      progress: 0,
      status: checkImageValidation(file),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
 
    newFiles.forEach((f) => {
      if (f.status === "success") {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setFiles((prev) =>
            prev.map((fileObj) =>
              fileObj.name === f.name ? { ...fileObj, progress } : fileObj
            )
          );
          if (progress >= 100) clearInterval(interval);
        }, 200);
      }
    });
  };

  const checkImageValidation = (file) => {
    // NOTE: demo ke liye
    if (file.name.includes("1")) return "success";
    return "error";
  };

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  // Upload button click handler with API integration
  const uploadFiles = async () => {
    try {
        setloading(true)
      setUploading(true);
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f.file));
      formData.append("placeName", "menu/images");
      const res = await axiosInstance.post(`${baseUrl}/media/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        //   onUploadProgress: (e) => {
        //       const percent = Math.round((e.loaded * 100) / e.total);
        //       setFiles((prev) =>
        //         prev.map((f) => ({ ...f, progress: percent, status: "uploading" }))
        //     );
        // },
    });
      const urls = res.data.data|| [];
      onUploadSuccess(itemIndex, urls);  
      setUploading(false);
      toast.success("Image Uploded Successfully")
      onClose();
    } catch (error) {
      console.error("Upload Error:", error);
      setUploading(false);
    }
    finally{
        setloading(false)
    }
  };

  return (
    <div className={styles.popup}>
        {loading && <Loader loading={loading} />}
      <div className={styles.container}>
        <h2 className={styles.title}>{itemname}</h2>
        <p className={styles.subtitle}>Item Image Size : 393x393 px</p>

        <div className={styles.uploadBox}>
          <input
            type="file"
            multiple
            className={styles.fileInput}
            onChange={handleFileChange}
          />
          <FiUploadCloud fontSize={"50px"} className={styles.fileicon}/>
          <div className="text-start">
          <p>Select a file or drag and drop here</p>
          <span className={styles.hint}>
            JPG, PNG or GIF file size no more than 10MB
          </span>
          </div>
          <button className={styles.selectBtn}>SELECT FILE</button>
        </div>

        <div className={styles.fileList}>
          {files.map((f) => (
            <div key={f.name} className={styles.fileRow}>
                <FaFileImage  color="red" fontSize={"25px"}/> &nbsp;
              <div className={styles.fileInfo}>
                {/* &nbsp; */}
                <span className={styles.fileName}>{f.name}</span>
                {f.status === "success" ? (
                  <span className={styles.success}>
                    Success – your image looks great!
                  </span>
                ) : (
                  <span className={styles.error}>
                    Error: Image must be 393x393px
                  </span>
                )}
              </div>
              <span className={styles.fileSize}>{f.size}</span>
              <button
                className={styles.removeBtn}
                onClick={() => removeFile(f.name)}
              >
                <FaTimes />
              </button>
              {f.status === "success" && f.progress < 100 && (
  <div className={styles.progressBarWrapper}>
    <div
      className={styles.progressBar}
      style={{ width: `${f.progress}%` }}
    ></div>
  </div>
)}
</div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={uploading}>
            Cancel
          </button>
          <button className={styles.uploadBtn} onClick={uploadFiles} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
