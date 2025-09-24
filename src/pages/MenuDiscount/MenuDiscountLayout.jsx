import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import styles from "./MenuDiscountLayout.module.css";
import { useAppContext } from "../../Context/AppContext";

export default function MenuDiscountLayout() {
    const location = useLocation();
    const { isSidebarOpen } = useAppContext();

    return (
        <div className={styles.wrapper}>
            {/* Header Tabs */}
            <div className={`${styles.tabs} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed} `}>
                <NavLink
                    to="/menuDiscount/itemLayout"
                    end={false}
                    className={({ isActive }) =>
                        (isActive || location.pathname.startsWith("/menuDiscount/item")) ||
                            location.pathname.startsWith("/menuDiscount/AddItem")
                            ? `${styles.tab} ${styles.active}`
                            : styles.tab
                    }
                >
                    Items
                </NavLink>
                <NavLink
                    to="/menuDiscount/Allcategory"
                    className={({ isActive }) =>
                        (isActive ||
                            location.pathname.startsWith("/menuDiscount/Allcategory") ||
                            location.pathname.startsWith("/menuDiscount/Addcategory"))
                            ? `${styles.tab} ${styles.active}`
                            : styles.tab
                    }
                >
                    Category
                </NavLink>
                <NavLink
                    to="/menuDiscount/AllVariant"
                    className={({ isActive }) =>
                        (isActive ||
                            location.pathname.startsWith("/menuDiscount/AddVariant") ||
                            location.pathname.startsWith("/menuDiscount/AllVariant"))
                            ? `${styles.tab} ${styles.active}`
                            : styles.tab
                    }
                >
                    Variants
                </NavLink>
                <NavLink
                    to="/menuDiscount/AllAddOn"
                    className={({ isActive }) =>
                        (isActive ||
                            location.pathname.startsWith("/menuDiscount/CreateAddon") ||
                            location.pathname.startsWith("/menuDiscount/AllAddOn"))
                            ? `${styles.tab} ${styles.active}`
                            : styles.tab
                    }
                >
                    Addons
                </NavLink>
                <NavLink 
                    to="/menuDiscount/AllDiscount"
                    className={({ isActive }) =>
                        (isActive ||
                             location.pathname.startsWith("/menuDiscount/AddDiscount") ||
                             location.pathname.startsWith("/menuDiscount/EditDiscount/:id") ||
                            location.pathname.startsWith("/menuDiscount/AllDiscount"))
                            ? `${styles.tab} ${styles.active}`
                            : styles.tab
                    }
                >
                    Discount
                </NavLink>
            </div>
            {/* Content Area */}
            <div className={styles.content}>
                <Outlet />
            </div>
        </div >
    );
}
