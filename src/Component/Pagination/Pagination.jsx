import React from 'react'
import './Pagination.css'
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

export default function Pagination({ currentPage, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange, label }) {

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const start = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      <div className=" col-12 d-flex align-items-center mt-3 position-fixed p-2 ps-4 bottom-0" style={{ background: " #ebebeb" }} >

        <div className="paginationInfo">
          <span>Showing {end} Of {totalItems} {label}</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              onItemsPerPageChange(Number(e.target.value))
            }}
            className="dropdown"
          >
            {[5, 10, 20, 50, 100]?.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div className="paginationControls">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="pageBtn"
            disabled={currentPage === 1}
          >
            <FaCircleChevronLeft />
          </button>

          <span className="pageNumber">{currentPage}</span>

          <button
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            className="pageBtn"
            disabled={currentPage >= totalPages}
          >
            <FaCircleChevronRight />
          </button>
        </div>

      </div >
    </>
  )
}
