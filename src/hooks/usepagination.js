/**
 * usePagination — derive paginated slice + page controls from a data array.
 *
 * Usage:
 *   const { page, setPage, paginated, totalPages } = usePagination(filteredData, 10);
 */

import { useState, useMemo, useEffect } from "react";

export default function usePagination(data = [], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  // Reset to page 1 whenever data length changes (filter applied)
  useEffect(() => {
    setPage(1);
  }, [data.length]);

  const paginated = useMemo(
    () => data.slice((page - 1) * pageSize, page * pageSize),
    [data, page, pageSize],
  );

  return { page, setPage, paginated, totalPages };
}
