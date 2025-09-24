import React, { createContext, useContext, useState } from 'react'


const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    //pagination
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [loading, setloading] = useState(false)

    const [search, setsearch] = useState("")

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev)
    }

    return (
        <AppContext.Provider value={{ isSidebarOpen, toggleSidebar, loading, setloading, setsearch, search, totalItems, setTotalItems, currentPage, setCurrentPage, itemsPerPage, setItemsPerPage }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);