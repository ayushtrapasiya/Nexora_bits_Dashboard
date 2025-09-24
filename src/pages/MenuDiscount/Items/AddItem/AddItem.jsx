import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import styles from "./AddItem.module.css";
import { FaCaretDown, FaRegStar } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import axiosInstance from "../../../../api/axiosInstance";
import CustomDropdown from "../../../../CustomeComponent/CustomDropdown/CustomDropdown";
import UploadPopup from "./UploadPopup/UploadPopup";
import { useAppContext } from "../../../../Context/AppContext";
import Loader from "../../../../Component/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoArrowLeft } from "react-icons/go";

function AddItem() {
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const { loading, setloading } = useAppContext()
  const navigate = useNavigate()
  const [variantlist, setvariantlist] = useState([]);
  const [Addons, setAddonslist] = useState([]);
  const [uploadedImages, setUploadedImages] = useState({});
  const [itemname, setItemname] = useState("");
  const [categorylist, setcategorylist] = useState([]);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [currentItemIndex, setCurrentItemIndex] = useState(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const { register, control, watch, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      items: [
        {
          name: "",
          shortCode: "",
          onlineName: "",
          category: "",
          price: "",
          description: "",
          dietary: "",
          pickup: false,
          delivery: false,
          onlineExpose: false,
          showVariation: false,
          showAddon: false,
          variations: [{ variation: "", price: "" }],
          addons: [{ addon: "" }],
          nutrition: { kcal: "", proteins: "", fats: "", carbs: "", sugar: "" },
          additional: { sellingPrice: "", ratings: "" },
        },
      ],
    },
  });


  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });

  const variantsandcategorylist = async () => {
    try {
      setloading(true)
      const variantres = await axiosInstance.get(
        `${baseUrl}/menu/variants-list`
      );
      console.log("variantres: ", variantres.data.data);
      setvariantlist(variantres.data.data);
      const categoryres = await axiosInstance.get(
        `${baseUrl}/menu/categories-list`
      );
      const AddOns = await axiosInstance.get(
        `${baseUrl}/menu/addon-list`
      );
      setAddonslist(AddOns.data.data)
      setcategorylist(categoryres.data.data);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setloading(false)
    }
  };
  useEffect(() => {
    variantsandcategorylist();
  }, []);

  const openUploadPopup = (index) => {
    setCurrentItemIndex(index);
    setIsOpen(true);
  };
  const handleUploadSuccess = (index, urls) => {
    setUploadedImages((prev) => ({
      ...prev,
      [index]: urls,
    }));
  };
  function onopenpopup(index) {
    if (itemname) {

      openUploadPopup(index)
    } else {
      toast.error("Please Fill Name First")
    }
  }
  const onSubmit = async (formValues) => {
    console.log('formValues: ', formValues);
    try {
      setloading(true)
      const payload = formValues.items.map((item, index) => ({
        name: item.name,
        shortCode: item.shortCode,
        displayName: item.onlineName,
        categoryId: item.category,
        price: item.price,
        description: item.description,
        dietary: item.dietary,
        type: "string",
        isVariant: item.showVariation,
        isAddon: item.showAddon,
        isActive: true,
        ...(item.showVariation && {
          variants: item.variations.map((v) => ({
            variantId: v.variation,
            price: +v.price,
          })),
        }),

        addIds: item.addons.flatMap((a) => a.addon || []),
        calories: item.nutrition.kcal,
        proteins: item.nutrition.proteins,
        fats: item.nutrition.fats,
        carbs: item.nutrition.carbs,
        sugar: item.nutrition.sugar,
        sellingPrice: item.additional.sellingPrice,
        ratings: item.additional.ratings,
        imageUrl: uploadedImages[index] || [],
      }));

      console.log("payload: ", payload);
      const response = await axiosInstance.post(
        `${baseUrl}/menu/create`,
        payload
      );
   setUploadedImages([]);  
   toast.success("Item Created Successfully")
   navigate("/menuDiscount/itemlist")
    if (reset) reset();  
      setUploadedImages([]);
    } catch (error) {
      console.error("Error creating menu:", error);
    } finally {
      setloading(false)
    }
  };

  return (
    <>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {loading && <Loader loading={loading} text="Create Item..."/>}
        <div className={styles.header}>
                 <button className={styles.backBtn} onClick={() => navigate("/menuDiscount/itemlist")}><GoArrowLeft /> <span className="">Back</span></button>
          <div className={styles.actions}>
             

            <button className={`${styles.btn} ${styles.exitBtn}`} type="button" onClick={() => navigate("/menuDiscount/itemlist")}>
              Save & Exit
            </button>
            <button type="submit" className={`${styles.btn} ${styles.menuBtn}`}>
              Save & Add Menu Items
            </button>
          </div>
        </div>

        {itemFields.map((item, itemIndex) => {
          const showVariation = watch(`items.${itemIndex}.showVariation`);
          const showAddon = watch(`items.${itemIndex}.showAddon`);
          const variations = watch(`items.${itemIndex}.variations`) || [];
          const addons = watch(`items.${itemIndex}.addons`) || [];

          return (
            <div key={item.id} className={styles.itemBlock}>
              {/* === Label Row (Pink) === */}
              <div className={`${styles.row} ${styles.labelRow}`}>
                <label>Name*</label>
                <label>Short Code*</label>
                <label>Online Display Name</label>
                <label>Category*</label>
                <label>Price*</label>
                <label>Description</label>
                <label>Dietary</label>
                <label>Order Type</label>
                <label>Variation</label>
                <label>Addon</label>
              </div>

              {/* === Input Row === */}
              <div className={styles.row}>
                <input
                  {...register(`items.${itemIndex}.name`, { required: "Name is required" })}
                  onChange={(e) => setItemname(e.target.value)}
                  className={`${errors?.items?.[itemIndex]?.name ? styles.errorInput : ""}`}
                />

                <input {...register(`items.${itemIndex}.shortCode`, { required: "shortCode is required" })}
                  className={`${errors?.items?.[itemIndex]?.shortCode ? styles.errorInput : ""}`} />
                <input {...register(`items.${itemIndex}.onlineName`, { required: "onlineName is required" })}
                  className={`${errors?.items?.[itemIndex]?.onlineName ? styles.errorInput : ""}`} />
                <Controller
                  name={`items.${itemIndex}.category`}
                  control={control}
                  rules={{ required: "Category is required" }}
                  defaultValue={""}
                  render={({ field }) => {

                    const options = categorylist.map((v) => ({
                      label: v.title,
                      value: v._id,
                    }));
                    return (
                      <CustomDropdown
                        options={options}
                        placeholder="Select "
                        value={field.value}
                        onChange={field.onChange}
                        isMultiple={false} 
                        className={`${errors?.items?.[itemIndex]?.category ? styles.errorInput : ""}`} 
                        padding={"9px"}
                      />
                    );
                  }}
                />

                <input
                  type="number"
                  {...register(`items.${itemIndex}.price`, { required: "price is required" })}
                  className={`${errors?.items?.[itemIndex]?.price ? styles.errorInput : ""}`}
                />
                <input {...register(`items.${itemIndex}.description`, { required: "description is required" })}
                  className={`${errors?.items?.[itemIndex]?.description ? styles.errorInput : ""}`} />
                <Controller
                  control={control}
                  name={`items.${itemIndex}.dietary`}
                  rules={{ required: "dietary is required" }}
                  render={({ field }) => (
                    <CustomDropdown
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { label: "Veg", value: "veg" },
                        { label: "Non-Veg", value: "nonveg" },
                      ]}
                      placeholder="Select Dietary"
                      isMulti={false}
                      padding={"9px"}
                      className={`${errors?.items?.[itemIndex]?.dietary ? styles.errorInput : ""}`}
                    />
                  )}
                />

                {/* Order type inline checkboxes (aligned properly) */}
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      {...register(`items.${itemIndex}.pickup`)}
                    />
                    <span>Pick Up</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      {...register(`items.${itemIndex}.delivery`)}
                    />
                    <span>Delivery</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      {...register(`items.${itemIndex}.onlineExpose`)}
                    />
                    <span>Online Expose</span>
                  </label>
                </div>

                <input
                  type="checkbox"
                  {...register(`items.${itemIndex}.showVariation`)}
                />
                <input
                  type="checkbox"
                  {...register(`items.${itemIndex}.showAddon`)}
                />
              </div>

              <div className={styles.section}>
                {showVariation && (
                  <div>
                    <h5>Add Variation</h5>
                    {variations.map((_, vIndex) => (
                      <div key={vIndex}>
                        <div className={styles.variationRow}>
                          <div className={styles.dropdownWrapper}>
                            <CustomDropdown
                              options={variantlist.map((variant) => ({
                                value: variant._id,
                                label: variant.title,
                              }))}
                              placeholder="Select Variation"
                              value={watch(
                                `items.${itemIndex}.variations.${vIndex}.variation`
                              )}
                              onChange={(val) =>
                                setValue(
                                  `items.${itemIndex}.variations.${vIndex}.variation`,
                                  val
                                )
                              }
                            />

                            <input
                              type="hidden"
                              {...register(
                                `items.${itemIndex}.variations.${vIndex}.variation`
                              )}
                            />
                          </div>
                          <input
                            {...register(
                              `items.${itemIndex}.variations.${vIndex}.price`
                            )}
                            placeholder="Price"
                            className="w-100"
                          />
                          {vIndex !== 0 && (
                            <button
                              type="button"
                              className={styles.removeBtn}
                              onClick={() => {
                                const updated = variations.filter(
                                  (_, i) => i !== vIndex
                                );
                                setValue(
                                  `items.${itemIndex}.variations`,
                                  updated
                                );
                              }}
                            >
                              <IoCloseOutline />
                            </button>
                          )}
                          {vIndex === variations.length - 1 && (
                            <button
                              type="button"
                              className={styles.addBtn}
                              onClick={() =>
                                setValue(`items.${itemIndex}.variations`, [
                                  ...variations,
                                  { variation: "", price: "" },
                                ])
                              }
                            >
                              + Add Variation
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Addons */}
              <div className={'ms-3'}>
                {showAddon && (
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "600", marginTop: "10px" }}>Add AddOn</h5>

                    {addons.map((_, vIndex) => (
                      <div key={vIndex}>
                        <div className={styles.variationRow}>
                          <div className={styles.dropdownWrapper}>
                            <CustomDropdown
                              options={Addons.map((addons) => ({
                                value: addons._id,
                                label: addons.name,
                              }))}
                              isMultiple={true}
                              placeholder="Select AddOns"
                              value={watch(`items.${itemIndex}.addons.${vIndex}.addon`)}
                              onChange={(val) =>
                                setValue(`items.${itemIndex}.addons.${vIndex}.addon`, val)
                              }

                            />



                            {/* 🔴 earlier you had variations path here by mistake */}
                            <input
                              type="hidden"
                              {...register(`items.${itemIndex}.addons.${vIndex}.addon`)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* === Nutritional Value Section === */}
              <div className={styles.section}>
                <h5>Add Nutritional Value</h5>
                <div className={styles.variationRow}>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      placeholder="Calories"
                      {...register(`items.${itemIndex}.nutrition.kcal`)}
                    />
                    <span className={styles.inputUnit}>kcal</span>
                  </div>

                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      placeholder="Proteins"
                      {...register(`items.${itemIndex}.nutrition.proteins`)}
                    />
                    <span className={styles.inputUnit}>grams</span>
                  </div>

                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      placeholder="Fats"
                      {...register(`items.${itemIndex}.nutrition.fats`)}
                    />
                    <span className={styles.inputUnit}>grams</span>
                  </div>

                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      placeholder="Carbs"
                      {...register(`items.${itemIndex}.nutrition.carbs`)}
                    />
                    <span className={styles.inputUnit}>grams</span>
                  </div>

                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      placeholder="Sugar"
                      {...register(`items.${itemIndex}.nutrition.sugar`)}
                    />
                    <span className={styles.inputUnit}>grams</span>
                  </div>
                </div>
              </div>

              {/* === Additional Section === */}
              <div className={styles.section}>
                <h5>Add Additional (Optional)</h5>
                <div className={styles.variationRow}>
                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      placeholder="Selling Price"
                      {...register(
                        `items.${itemIndex}.additional.sellingPrice`
                      )}
                    />
                    <span className={styles.inputUnit}>₹</span>
                  </div>

                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      placeholder="Ratings"
                      {...register(`items.${itemIndex}.additional.ratings`)}
                    />
                    <span className={styles.inputUnit}>
                      <FaRegStar />
                    </span>
                  </div>

                  <button
                    type="button"
                    className={styles.uploadBtn}
                    onClick={() => onopenpopup(itemIndex)}
                  >
                    {uploadedImages?.[0]?.length && <span className={styles.imgcount}>{uploadedImages?.[0]?.length || 0}</span>}
                    
                    Upload Image
                  </button>
                  {itemIndex > 0 && <button type="button" className={styles.couponBtn} onClick={()=>removeItem(itemIndex)}>
                  Delete
                  </button>}

                </div>
              </div>
            </div>
          );
        })}
        {isOpen && (
          <UploadPopup onClose={() => setIsOpen(false)} itemname={itemname} itemIndex={currentItemIndex} onUploadSuccess={handleUploadSuccess}
          />
        )}
        <button
          type="button"
          className={styles.addMoreBtn}
          onClick={() =>
            appendItem({
              name: "",
              shortCode: "",
              onlineName: "",
              category: "",
              price: "",
              description: "",
              dietary: "",
              pickup: false,
              delivery: false,
              onlineExpose: false,
              showVariation: false,
              showAddon: false,
              variations: [{ variation: "", price: "" }],
              addons: [{ addon: "" }],
              nutrition: {
                kcal: "",
                proteins: "",
                fats: "",
                carbs: "",
                sugar: "",
              },
              additional: { sellingPrice: "", ratings: "" },
            })
          }
        >
          + Add More
        </button>
      </form>
    </>
  );
}
export default AddItem;

