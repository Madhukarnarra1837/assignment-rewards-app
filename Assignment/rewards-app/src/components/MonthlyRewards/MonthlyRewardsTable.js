import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { aggregateMonthlyRewards } from "../../utils/aggregationUtils";
import Table from '../common/Table';

const MonthlyRewardsTable = ({ transactions }) => {
  
  const data = useMemo(() => {
    //Group transactions into monthly using the utility function.
    const aggregatedData = aggregateMonthlyRewards(transactions);

    //Convert the object of objects into an array, sort it, and format for the Table.
    return Object.values(aggregatedData)
      // Sort primarily by Year, then by Month (numerical index).
      .sort((a, b) => a.year - b.year || a.month - b.month)
      .map((item) => ({
        // Create a unique ID for React keys by combining user ID and date info.
        id: `${item?.customerId}-${item?.year}-${item?.month}`, 
        customerId: item?.customerId,
        customer: item?.customerName,
        month: item?.monthLabel,
        year: item?.year,
        product: item?.productPurchased,
        price: item?.price,
        points: item?.rewardPoints,
        date: item?.date
      }));
  }, [transactions]); // only re-calculate if 'transactions' changes.

  // Define the table headers.
  const columns = [
    { key: "customerId", label: "CustomerId" },
    { key: "customer", label: "Name" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
    { key: "points", label: "Reward Points" },
  ];

  return (
    <>
      <h2>User Monthly Rewards</h2>
      {/* Only render the Table if there is data to show. 
        pageSize is set to 5 for the initial pagination view.
      */}
      {data?.length > 0 && <Table columns={columns} data={data} pageSize={5} />}
    </>
  );
};

// Ensure the parent component provides an array to avoid crashes.
MonthlyRewardsTable.propTypes = {
    transactions: PropTypes.array.isRequired
};

export default MonthlyRewardsTable;