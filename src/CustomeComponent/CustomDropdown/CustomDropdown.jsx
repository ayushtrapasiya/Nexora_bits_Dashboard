import React, { useState, useRef, useEffect } from "react";
import styles from "./CustomDropdown.module.css";
import { FaCaretDown, FaChevronDown, FaTimes } from "react-icons/fa";

export default function CustomDropdown({
  placeholderColor,
  options = [],
  placeholder = "Select...",
  isMultiple = false,
  value = isMultiple ? [] : null,
  onChange,
  border,
    openUp = false ,
  padding
}) {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleSelect = (option) => {
  if (isMultiple) {
    if (value.includes(option.value)) {
      onChange(value.filter((v) => v !== option.value));
    } else {
      onChange([...value, option.value]);
    }
  } else {
    if (value === option.value) { 
      onChange(null);
    } else {
      onChange(option.value);
    }
    setIsOpen(false);
  }
};


  const handleRemove = (val) => {
    onChange(value.filter((v) => v !== val));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.header} style={{border: `1px solid ${border}`, padding:`${padding}`}} onClick={toggleDropdown}>
        {isMultiple ? (
          <div className={styles.selectedContainer}>
            {value.length > 0 ? (
              value.map((val) => {
                const option = options.find((o) => o.value === val);
                return (
                  <span key={val} className={styles.selectedItem} >
                    <span >{option?.label}</span>
                    <FaTimes
                      className={styles.removeIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(val);
                      }}
                    />
                  </span>
                );
              })
            ) : (
              <span className={styles.placeholder} style={{color :`${placeholderColor}`}}>{placeholder}</span>
            )}
          </div>
        ) : (
          <span className={styles.singleSelected}>
            {options.find((o) => o.value === value)?.label || (
              <span className={styles.placeholder} style={{color :`${placeholderColor}`}}>{placeholder}</span>
            )}
          </span>
        )}
        <FaCaretDown className={styles.icon} />
      </div>
      {isOpen && (
        <div
        className={`${styles.list} ${openUp ? styles.openUp : ""}`}
        >
        
  
{options.map((option) => (
  <React.Fragment key={option._id || option.value}>
    <label className={styles.option}>
      {isMultiple && (
        <input
        className={styles.customechekbox}
          type="checkbox"
          checked={value.includes(option.value)}
          onChange={() => handleSelect(option)}
        />

      )}
      <span
        className={
          (!isMultiple && value === option.value) ||
          (isMultiple && value.includes(option.value))
            ? styles.activeOption
            : ""
        }
        onClick={() => handleSelect(option)}
      >
        {option.label}
      </span>
    </label>
    <hr className="m-0" />
  </React.Fragment>
))}
  </div>
      )}
    </div>
  );
}



 