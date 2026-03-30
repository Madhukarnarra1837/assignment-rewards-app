import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { calculateRewards } from "../../utils/rewardCalculator";
import Table from "../common/Table";

function TransactionsTable({ transactions }) {
  const data = useMemo(() => {
    return transactions?.map((txn) => ({
      id: txn?.transactionId, // required unique key for Table
      transactionId:txn?.transactionId,
      customerName: txn?.customerName,
      purchaseDate: new Date(txn.purchaseDate).toLocaleDateString(),
      product: txn.productPurchased,
      price: `$${txn.price}`,
      rewardPoints: calculateRewards(txn.price),
    }));
  }, [transactions]);

  const columns = [
    { key: "transactionId", label: "Transaction Id" },
    { key: "customerName", label: "Customer Name" },
    { key: "purchaseDate", label: "Purchase Date" },
    { key: "product", label: "Product Purchased" },
    { key: "price", label: "Price" },
    { key: "rewardPoints", label: "Reward Points" },
  ];
  return (
    <>
      <h2>Transactions</h2>
      <Table columns={columns} data={data} pageSize={5} />
    </>
  );
}

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default TransactionsTable;
