import React from 'react';
import styles from './Layout.module.css';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../../Context/AppContext';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import { ToastContainer } from 'react-toastify';

export default function Layout() {
  const { isSidebarOpen } = useAppContext();
  const location = useLocation();

  const noScrollPages = ["/menuDiscount/itemlist", "/menuDiscount/Allcategory", "/menuDiscount/AllVariant", "/menuDiscount/AllDiscount", "/menuDiscount/AllAddOn"];
  const isNoScroll = noScrollPages.includes(location.pathname);

  return (
    <div className={`${styles.layout} ${isNoScroll ? styles.noScroll : ""}`}>
      {/* Toast + Header */}
      <ToastContainer style={{ zIndex: 999999 }} autoClose={1500} />
      <Header />

      {/* Sidebar + Content */}
      <div className={styles.mainWrapper}>
        <Sidebar />

        <div
          className={`${styles.pageContent} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
            }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
