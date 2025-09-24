import React, { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import styles from "./Edititem.module.css";
import { FaCaretDown, FaRegStar } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import axiosInstance from "../../../../api/axiosInstance";
import CustomDropdown from "../../../../CustomeComponent/CustomDropdown/CustomDropdown";

import { useAppContext } from "../../../../Context/AppContext";
import Loader from "../../../../Component/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import UploadPopup from "../AddItem/UploadPopup/UploadPopup";
import { toast } from "react-toastify";

function Edititem() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_REACT_API_URL;
  const { loading, setloading } = useAppContext();
  const [Addons, setAddonslist] = useState([]);
  const { id } = useParams();
  const [variantlist, setvariantlist] = useState([]);
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
  const { register, control, watch, handleSubmit, setValue, reset } = useForm({
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
useEffect(() => {
  const subscription = watch((values, { name, type }) => {
    const items = values.items;
    if (!items) return;

    items.forEach((item, index) => {
      if (item.showVariation && (!item.variations || item.variations.length === 0)) {
        setValue(`items.${index}.variations`, [{ variation: "", price: "" }], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
  });

  return () => subscription.unsubscribe();
}, [watch, setValue]);

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });
  const getmenudetail = async () => {
    const getmenu = await axiosInstance.get(`${baseUrl}/menu/details/${id}`);
    const data = getmenu.data.data;
    const formData = {
      items: [
        {
          name: data.name || "",
          shortCode: data.shortCode || "",
          onlineName: data.displayName || "",
          category: data.categoryId || "",
          price: data.price || "",
          description: data.description || "",
          dietary: data.dietary || "",
          pickup: data.pickup || false,
          delivery: data.delivery || false,
          onlineExpose: data.onlineExpose || false,
          showVariation: data.isVariant || false,
          showAddon: data.isAddon || false,
          variations: data.variants?.map((v) => ({
            variation: v.variantId,
            price: v.price,
          })) || [{ variation: "", price: "" }],
          addons: data.addIds?.map((a) => ({
            addon: typeof a === "object" ? a._id : a,
          })) || [{ addon: "" }],
          nutrition: {
            kcal: data.calories || "",
            proteins: data.proteins || "",
            fats: data.fats || "",
            carbs: data.carbs || "",
            sugar: data.sugar || "",
          },
          additional: {
            sellingPrice: data.sellingPrice || "",
            ratings: data.ratings || "",
          },
        },
      ],
    };

    setUploadedImages({
      0: data.imageUrl || [], // agar ek hi item hai toh index 0
    });
    reset(formData);
  };
  useState(() => {
    getmenudetail();
    
  }, [id , reset]);

  const variantsandcategorylist = async () => {
    try {
      setloading(true);
      const variantres = await axiosInstance.get(
        `${baseUrl}/menu/variants-list`
      );
      console.log("variantres: ", variantres.data.data);
      setvariantlist(variantres.data.data);
      const categoryres = await axiosInstance.get(
        `${baseUrl}/menu/categories-list`
      );
      const AddOns = await axiosInstance.get(`${baseUrl}/menu/addon-list`);
      console.log("AddOns: ", AddOns);
      setAddonslist(AddOns.data.data);
      setcategorylist(categoryres.data.data);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setloading(false);
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
  const onSubmit = async (formValues) => {
    // console.log('formValues: ', formValues);
    try {
      setloading(true);
      const payload = {
        ids : [id],
        body : {name: formValues.items[0].name,
        shortCode: formValues.items[0].shortCode,
        displayName: formValues.items[0].onlineName,
        categoryId: formValues.items[0].category,
        price: formValues.items[0].price,
        description: formValues.items[0].description,
        dietary: formValues.items[0].dietary,
        type: "string",
        isVariant: formValues.items[0].showVariation,
        isAddon: formValues.items[0].showAddon,
        isActive: true,
        ...(formValues.items[0].showVariation && {
          variants: formValues.items[0].variations.map((v) => ({
            variantId: v.variation,
            price: +v.price,
          })),
        }),
        addIds: formValues.items[0].addons.map((a) => a.addon),
        calories: formValues.items[0].nutrition.kcal,
        proteins: formValues.items[0].nutrition.proteins,
        fats: formValues.items[0].nutrition.fats,
        carbs: formValues.items[0].nutrition.carbs,
        sugar: formValues.items[0].nutrition.sugar,
        sellingPrice: formValues.items[0].additional.sellingPrice,
        ratings: formValues.items[0].additional.ratings,
        imageUrl: uploadedImages[0] || [],}
      };

      console.log("payload: ", payload);
      const response = await axiosInstance.put(
        `${baseUrl}/menu/update-many`,
        payload
      );
      console.log("response: ", response);
      setUploadedImages([]);
      toast.success("Menu Updated Successfully");
      navigate("/menuDiscount/itemlist");
      if (reset) reset();
    } catch (error) {
      console.error("Error creating menu:", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      {/* === Header Save Buttons === */}
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {loading && <Loader text="Updating Item..." loading={loading}/>}
        <div className={styles.header}>
          <div className={styles.actions}>
            <button
              className={`${styles.btn} ${styles.exitBtn}`}
              type="button"
              onClick={() => navigate("/menuDiscount/itemlist")}
            >
              Save & Exit
            </button>
            <button type="submit" className={`${styles.btn} ${styles.menuBtn}`}>
              Save & Edit Menu Items
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

              <div className={styles.row}>
                <input
                  {...register(`items.${itemIndex}.name`)}
                  onChange={(e) => setItemname(e.target.value)}
                />
                <input {...register(`items.${itemIndex}.shortCode`)} />
                <input {...register(`items.${itemIndex}.onlineName`)} />
                <Controller
                  name={`items.${itemIndex}.category`}
                  control={control}
                  defaultValue={""}
                  render={({ field }) => {
                    const options = categorylist.map((v) => ({
                      label: v.title,
                      value: v._id,
                    }));

                    return (
                      <CustomDropdown
                        options={options}
                        placeholder="Select"
                        value={field.value}
                        onChange={field.onChange}
                        isMultiple={false} 
                      />
                    );
                  }}
                />

                <input
                  type="number"
                  {...register(`items.${itemIndex}.price`)}
                />
                <input {...register(`items.${itemIndex}.description`)} />
                <Controller
                  control={control}
                  name={`items.${itemIndex}.dietary`}
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
                    />
                  )}
                />

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

              <div className={`${styles.section}`}>
                {showAddon && (
                  <div>
                    <h5>Add AddOns</h5>
                    <div className={styles.variationRow}>
                      <div className={styles.dropdownWrapper}>
                        <CustomDropdown
                          options={Addons.map((a) => ({
                            value: a._id,
                            label: a.name,
                          }))}
                          isMultiple={true}
                          placeholder="Select AddOns"
                       
                          value={(watch(`items.${itemIndex}.addons`) || []).map(
                            (a) => a.addon
                          )}
                          onChange={(val) => {
                            const ids = Array.isArray(val)
                              ? val.map((id) => ({ addon: id }))
                              : [];
                            setValue(`items.${itemIndex}.addons`, ids, {
                              shouldValidate: true,
                            });
                          }}
                        />
                        {/* hidden field taaki form state track kare */}
                        <input
                          type="hidden"
                          {...register(`items.${itemIndex}.addons`)}
                        />
                      </div>
                    </div>
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
                    onClick={() => openUploadPopup(itemIndex)}
                  >
                     {uploadedImages?.[0]?.length && <span className={styles.imgcount}>{uploadedImages?.[0]?.length || 0}</span>}
                    Upload Image
                  </button>
                  
                  {itemIndex > 0 && (
                    <button
                      type="button"
                      className={styles.couponBtn}
                      onClick={() => removeItem(itemIndex)}
                    >
                      Remove Item
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {isOpen && (
          <UploadPopup
            onClose={() => setIsOpen(false)}
            itemname={itemname}
            itemIndex={currentItemIndex}
            onUploadSuccess={handleUploadSuccess}
            existingImages={uploadedImages[currentItemIndex] || []}
          />
        )}
      </form>
    </>
  );
}
export default Edititem;
