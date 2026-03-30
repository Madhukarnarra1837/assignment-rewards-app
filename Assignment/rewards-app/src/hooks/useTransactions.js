import { useEffect, useState } from "react";
import { fetchTransactions } from "../services/transactionsService";
import { NO_ERROR,createError } from "../utils/errorUtils";

function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(NO_ERROR);

  useEffect(() => {
    let isMounted = true;
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTransactions();
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }
        if (isMounted) {
          setTransactions(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            createError({
              message: "Unable to load transactions.Please try again later",
              source: "TRANSACTION_API",
              details: err.message,
            }),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadTransactions();
    return () => {
      isMounted = false;
    };
  }, []);
  return {
    transactions,
    isLoading,
    error,
  };
}

export default useTransactions;
