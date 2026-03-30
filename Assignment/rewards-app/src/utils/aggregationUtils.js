import { getMonthYearKey } from "./dateUtils";
import { calculateRewards } from "./rewardCalculator";

export function aggregateMonthlyRewards(transactions) {
  return transactions?.reduce((accumulator, transaction) => {
    const { customerId, customerName, purchaseDate, price,productPurchased } = transaction;

    //compute reward points for th transaction
    const rewardPoints = calculateRewards(price);

    //Derive month/year information
    const { key, year, month, label } = getMonthYearKey(purchaseDate);

    const date = new Date(purchaseDate).toLocaleDateString();

    //Composite key ensures uniqueness
    const aggregateKey = `${customerName}-${key}`;

    //Initialize aggregation Object if not present
    if (!accumulator[aggregateKey]) {
      accumulator[aggregateKey] = {
        customerId,
        customerName,
        year,
        month,
        monthLabel: label,
        rewardPoints: 0,
        date,
        productPurchased,
        price
      };
    }

    // Accumalate reward points
    accumulator[aggregateKey].rewardPoints += rewardPoints;
    return accumulator;
  }, {});
}
// Aggregates total reward points per customer across all months.

export function aggregateTotalRewards(transactions) {
  const aggregatedMap = (transactions || []).reduce((accumulator, transaction) => {
    const { customerName, price } = transaction;

    // Calculate rewards for each transaction
    const rewardPoints = calculateRewards(price);

    // Initialize customer aggregation Object
    if (!accumulator[customerName]) {
      accumulator[customerName] = {
        customerName,
        rewardPoints: 0,
      };
    }

    // Accumulate reward points
    accumulator[customerName].rewardPoints += rewardPoints;

    // return the accumulator for the next iteration
    return accumulator;
  }, {});

  // Convert the Object keys { "C084": {...} } into a flat Array [{...}]
  return Object.values(aggregatedMap);
}




















