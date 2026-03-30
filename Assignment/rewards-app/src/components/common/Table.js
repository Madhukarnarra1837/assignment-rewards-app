import React, { useMemo, useState,useEffect } from "react";
import PropTypes from "prop-types";
import "./Table.css";
const Table = React.memo(({ columns, data, pageSize }) => {
  const [sortConfig, setSortConfig] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  //Filter rows based on global search text
  const filteredData = useMemo(() => {
    if (!filterText) return data;
    return data?.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(filterText.toLowerCase()),
      ),
    );
  }, [data, filterText]);

  //Sort rows based on current sort configuration
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const { key, direction } = sortConfig;

    return [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Reset to page 1 whenever the user types in the filter
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText]);

  //Paginate sorted data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData?.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

const totalPages = Math.max(1, Math.ceil((filteredData?.length || 0) / pageSize));

  const handleSort = (columnKey) => {
    setSortConfig((prev) =>
      prev && prev.key === columnKey
        ? {
            key: columnKey,
            direction: prev.direction === "asc" ? "desc" : "asc",
          }
        : { key: columnKey, direction: "asc" },
    );
  };

  return (
    <div className="table-wrappr">
      <input
        className="table-filter"
        placeholder="Filter rows..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <table className="table">
        <thead>
          <tr>
            {columns?.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                className="sortable-header"
              >
                <div className="header-content">
                  <span className="label-text">{column?.label}</span>
                  <span className="sort-icon">
                    {sortConfig?.key === column.key
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "⇅"}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((row) => (
            <tr key={row.id}>
              {columns?.map((column) => (
                <td key={column.key}>
                  {column.key.toLowerCase().includes("points") ? (
                    <strong
                      style={{
                        color: "#2b6cb0",
                        backgroundColor: "#ebf8ff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {row[column.key]}
                    </strong>
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          prev
        </button>

        <span>
          {" "}
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
});

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
};

Table.defaultProps = {
  pageSize: 5,
};

export default Table;
