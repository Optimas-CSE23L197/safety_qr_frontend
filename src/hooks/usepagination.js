/**
 * usePagination Hook
 * Manages page, pageSize, and provides helpers for table pagination.
 *
 * Usage:
 *   const { page, pageSize, setPage, setPageSize, paginationProps } = usePagination();
 */

import { useState, useCallback } from "react";
import { PAGINATION } from "../utils/constants.js";

/**
 * @param {object} options
 * @param {number} options.initialPage
 * @param {number} options.initialPageSize
 */
const usePagination = ({
  initialPage = PAGINATION.DEFAULT_PAGE,
  initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
} = {}) => {
  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const setPage = useCallback((newPage) => {
    setPageState(newPage);
  }, []);

  const setPageSize = useCallback((newSize) => {
    setPageSizeState(newSize);
    setPageState(1); // Reset to first page when page size changes
  }, []);

  const reset = useCallback(() => {
    setPageState(initialPage);
    setPageSizeState(initialPageSize);
  }, [initialPage, initialPageSize]);

  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Query params to pass to API
  const queryParams = {
    page,
    page_size: pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage,
    setPageSize,
    setTotal,
    reset,
    queryParams,
    // Props to spread on <TablePagination> component
    paginationProps: {
      page,
      pageSize,
      total,
      totalPages,
      onPageChange: setPage,
      onPageSizeChange: setPageSize,
    },
  };
};

export default usePagination;
