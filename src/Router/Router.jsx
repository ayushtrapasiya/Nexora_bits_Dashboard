import React from "react";
import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import Layout from "../Component/Layout/Layout";
import Dashboard from "../pages/Dashboard/Dashboard";
import RunningOrders from "../pages/RunningOrder/RunningOrders";
import AllOrder from "../pages/AllOrder/AllOrder";
import MenuDiscountLayout from "../pages/MenuDiscount/MenuDiscountLayout";
import ItemsLayout from "../pages/MenuDiscount/Items/ItemsLayout";
import Itemlist from "../pages/MenuDiscount/Items/ItemList/Itemlist";
import AllCategory from "../pages/MenuDiscount/Category/AllCategory/AllCategory";
import AddCategory from "../pages/MenuDiscount/Category/AddCategory/AddCategory";
import Addvariants from "../pages/MenuDiscount/Variants/Addvariants/Addvariants";
import Allvariants from "../pages/MenuDiscount/Variants/AllVariants/Allvariants";
import Login from "../pages/Login/Login";
import ProtectedRoute from "../Component/ProtectedRoute/ProtectedRoute";
import AddItem from "../pages/MenuDiscount/Items/AddItem/AddItem";
import CreateAddon from "../pages/MenuDiscount/AddOn/CreateAddOn/CreateAddon";
import AllAddOn from "../pages/MenuDiscount/AddOn/AllAddOn/AllAddOn";
import Edititem from "../pages/MenuDiscount/Items/Edittem/Edititem";
import EditAddon from "../pages/MenuDiscount/AddOn/EditAddon/EditAddon";
import AddDiscount from "../pages/MenuDiscount/Discount/AddDiscount/AddDiscount";
import AllDiscount from "../pages/MenuDiscount/Discount/AllDiscount/AllDiscount";
import AllTaxes from "../pages/Taxes&Charges/AllTaxes/AllTaxes";
import CustomTax from "../pages/Taxes&Charges/AddTaxes/CustomTax/CustomTax";
import EditDiscount from "../pages/MenuDiscount/Discount/EditDiscount/EditDiscount";
import EditTaxes from "../pages/Taxes&Charges/EditTaxes/EditTaxes";
import AllUser from "../pages/User/AllUser/AllUser";
import AddUser from "../pages/User/AddUser/AddUser";
import CreateBanner from "../pages/Banner/CreateBanner";
import Allbanner from "../pages/Banner/AllBanner/Allbanner";
import Billing from "../SubAdminPages/Billing/Billing";

export default function Router() {
  const subAdmin = localStorage.getItem("SubAdmin"); // 👈 check

  // 🔹 Routes for Admin (full access)
  const adminRoutes = [
    { path: "/", element: <Dashboard /> },
    { path: "/RunningOrder", element: <RunningOrders /> },
    { path: "/All-order", element: <AllOrder /> },
    { path: "/AllUser", element: <AllUser /> },
    { path: "/AddUser", element: <AddUser /> },
    { path: "/CreateBanner", element: <CreateBanner /> },
    { path: "/Allbanner", element: <Allbanner /> },
    { path: "/Taxes", element: <AllTaxes /> },
    { path: "/AddTax", element: <CustomTax /> },

    {
      path: "/menuDiscount",
      element: <MenuDiscountLayout />,
      children: [
        { index: true, element: <Navigate to="itemLayout" replace /> },
        { path: "itemLayout", element: <ItemsLayout /> },
        { path: "itemlist", element: <Itemlist /> },
        { path: "AddItem", element: <AddItem /> },
        { path: "Allcategory", element: <AllCategory /> },
        { path: "Addcategory", element: <AddCategory /> },
        { path: "AddVariant", element: <Addvariants /> },
        { path: "AllVariant", element: <Allvariants /> },
        { path: "CreateAddon", element: <CreateAddon /> },
        { path: "AllAddOn", element: <AllAddOn /> },
        { path: "Edititem/:id", element: <Edititem /> },
        { path: "EditAddon/:id", element: <EditAddon /> },
        { path: "AddDiscount", element: <AddDiscount /> },
        { path: "AllDiscount", element: <AllDiscount /> },
        { path: "EditDiscount/:id", element: <EditDiscount /> },
        { path: "EditTaxes/:id", element: <EditTaxes /> },
      ],
    },
  ];

  // 🔹 Routes for SubAdmin (limited)
  const subAdminRoutes = [
    { path: "/", element: <Billing /> }, // here you call it Billing in sidebar
    { path: "/RunningOrder", element: <RunningOrders /> },
    { path: "/All-order", element: <AllOrder /> },
    { path: "/AllUser", element: <AllUser /> },
    { path: "/wallet", element: <div>Wallet Page</div> }, // 👈 replace with actual Wallet component
    { path: "/report", element: <div>Report Page</div> }, // 👈 replace with actual Report component
    { path: "/push-notification", element: <div>Push Notification Page</div> },
    { path: "/myaccount", element: <div>My Account Page</div> },
    { path: "/help", element: <div>Help Page</div> },
  ];

  let routes = createHashRouter([
    {
      path: "/Adminlogin",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: subAdmin ? subAdminRoutes : adminRoutes,
    },
  ]);

  return <RouterProvider router={routes} />;
}
