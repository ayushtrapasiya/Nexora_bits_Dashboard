import React from 'react'
import { Outlet } from 'react-router-dom'
import Router from './Router/Router'
import 'animate.css';
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <>
    {/* <ToastContainer/> */}
   <Router/>
   </>
  )
}
