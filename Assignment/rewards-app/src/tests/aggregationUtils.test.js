import { aggregateMonthlyRewards, aggregateTotalRewards } from "../utils/aggregationUtils";
import * as rewardCalculator from "../utils/rewardCalculator";
import * as dateUtils from "../utils/dateUtils";

// Mock the dependencies to control the output
jest.mock("../utils/rewardCalculator");
jest.mock("../utils/dateUtils");

describe("Aggregation Utilities", () => {
  const mockTransactions = [
    {
      customerId: "C1",
      customerName: "John Doe",
      purchaseDate: "2023-12-01",
      price: 120,
      productPurchased: "Monitor"
    },
    {
      customerId: "C1",
      customerName: "John Doe",
      purchaseDate: "2023-12-15",
      price: 100,
      productPurchased: "Mouse"
    },
    {
      customerId: "C2",
      customerName: "Jane Smith",
      purchaseDate: "2023-11-01",
      price: 50,
      productPurchased: "Keyboard"
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock behavior for reward calculator: returns price as points for easy math
    rewardCalculator.calculateRewards.mockImplementation((price) => price);
    
    // Default mock for date utils
    dateUtils.getMonthYearKey.mockImplementation((date) => {
      const d = new Date(date);
      const month = d.getMonth();
      const year = d.getFullYear();
      return {
        key: `${month}-${year}`,
        year,
        month,
        label: "Dec 2023"
      };
    });
  });

  describe("aggregateMonthlyRewards", () => {
    test("accumulates rewards for the same customer in the same month", () => {
      const result = aggregateMonthlyRewards(mockTransactions);
      const keys = Object.keys(result);

      // Should have 2 keys: John-Dec and Jane-Nov (mocked as Dec for simplicity)
      expect(keys).toHaveLength(2);
      
      // John Doe had 120 + 100 points
      const johnKey = "John Doe-11-2023"; // Dec is index 11
      expect(result[johnKey].rewardPoints).toBe(220);
      expect(result[johnKey].customerName).toBe("John Doe");
    });

    test("handles null or undefined transactions gracefully", () => {
      expect(aggregateMonthlyRewards(null)).toBeUndefined();
      expect(aggregateMonthlyRewards(undefined)).toBeUndefined();
    });

    test("correctly uses data from dateUtils and rewardCalculator", () => {
      aggregateMonthlyRewards([mockTransactions[0]]);
      expect(rewardCalculator.calculateRewards).toHaveBeenCalledWith(120);
      expect(dateUtils.getMonthYearKey).toHaveBeenCalledWith("2023-12-01");
    });
  });

  describe("aggregateTotalRewards", () => {
    test("returns an array of total rewards per customer", () => {
      const result = aggregateTotalRewards(mockTransactions);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);

      const john = result.find(r => r.customerName === "John Doe");
      const jane = result.find(r => r.customerName === "Jane Smith");

      expect(john.rewardPoints).toBe(220);
      expect(jane.rewardPoints).toBe(50);
    });

    test("handles empty transaction array", () => {
      const result = aggregateTotalRewards([]);
      expect(result).toEqual([]);
    });

    test("handles null input by defaulting to empty array", () => {
      const result = aggregateTotalRewards(null);
      expect(result).toEqual([]);
    });
  });
});