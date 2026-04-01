import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { calculateRewards } from "../../utils/rewardCalculator";
import Table from "../common/Table";
import "./TransactionTable.css";
import { Card } from "react-bootstrap";

/**
 * TransactionsTable Component
 * A table component that displays raw transaction data with built-in date range filtering and validation.
 * - **Date Range Filtering:** Users can filter transactions between "From" and "To" dates.
 * - **Input Validation:** Ensures both dates are selected and that the start date is not after the end date.
 * - **Reward Integration:** Automatically calculates reward points for each transaction row.
 * - **State Management:** Decouples input state (`startInput`) from applied filter state (`appliedFilters`) to trigger updates only on button click.
 * * @component
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.transactions - The raw array of transaction objects from the API/mock.
 * @returns {React.ReactElement} A card-wrapped table with date filter controls.
 */

function TransactionsTable({ transactions }) {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({ start: "", end: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleApply = () => {
    // 1. New Validation: Check if dates are missing
    if (!startInput || !endInput) {
      setErrorMessage("Please select both 'From' and 'To' dates.");
      return;
    }

    // 2. Logic Validation: Check if Start is after End
    if (new Date(startInput) > new Date(endInput)) {
      setErrorMessage("End date cannot be before start date.");
      return;
    }

    setErrorMessage("");
    setAppliedFilters({ start: startInput, end: endInput });
  };

  const handleReset = () => {
    setStartInput("");
    setEndInput("");
    setAppliedFilters({ start: "", end: "" });
    setErrorMessage("");
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (!txn?.purchaseDate) return false;

      const txnTime = new Date(txn.purchaseDate).getTime();

      if (appliedFilters.start) {
        const start = new Date(appliedFilters.start).getTime();
        if (txnTime < start) return false;
      }

      if (appliedFilters.end) {
        const end = new Date(appliedFilters.end);
        end.setHours(23, 59, 59, 999);
        if (txnTime > end.getTime()) return false;
      }

      return true;
    });
  }, [transactions, appliedFilters]);

  const data = useMemo(() => {
    return filteredTransactions.map((txn) => ({
      id: txn?.transactionId,
      transactionId: txn?.transactionId,
      customerName: txn?.customerName,
      purchaseDate: new Date(txn.purchaseDate).toLocaleDateString(),
      product: txn.productPurchased,
      price: `$${txn.price}`,
      rewardPoints: calculateRewards(txn.price),
    }));
  }, [filteredTransactions]);

  const columns = [
    { key: "transactionId", label: "Id" },
    { key: "customerName", label: "Customer" },
    { key: "purchaseDate", label: "Date (mm/dd/yyyy)" },
    { key: "product", label: "Product" },
    { key: "price", label: "Price" },
    { key: "rewardPoints", label: "Points" },
  ];

  const dateRangeMessage = `No transactions found between ${startInput} and ${endInput}`;

  return (
    <div className="transactions-container">
      <div className="table-header">
        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center flex-wrap border-0 shadow-none">
          {/* Left Side: Title */}
          <h5 className="mb-0 fw-bold text-dark" style={{ border: "none" }}>
            Transactions
          </h5>

          {/* Right Side: Filters */}
          <div className="filter-wrapper position-relative">
            <div className="filter-group d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <label className="mb-0 small fw-semibold text-muted">
                  From
                </label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  style={{ width: "auto" }}
                  value={startInput}
                  onChange={(e) => {
                    setStartInput(e.target.value);
                    setErrorMessage("");
                  }}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <label className="mb-0 small fw-semibold text-muted">To</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  style={{ width: "auto" }}
                  value={endInput}
                  onChange={(e) => {
                    setEndInput(e.target.value);
                    setErrorMessage("");
                  }}
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary btn-sm px-3 fw-bold"
                  onClick={handleApply}
                >
                  Apply
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Error Message Tooltip */}
            {errorMessage && (
              <span
                className="error-tooltip bg-danger text-white px-2 py-1 rounded small position-absolute"
                style={{
                  top: "110%",
                  right: "0",
                  zIndex: 10,
                  fontSize: "11px",
                }}
              >
                {errorMessage}
              </span>
            )}
          </div>
        </Card.Header>
      </div>
      <Card.Body>
        <Table
          columns={columns}
          data={data}
          noDataMessage={startInput || endInput ? dateRangeMessage:"No records found matching your criteria."}
          pageSize={5}
        />
      </Card.Body>
    </div>
  );
}

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default TransactionsTable;
