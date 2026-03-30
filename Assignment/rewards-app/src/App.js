import logo from './logo.svg';
import './App.css';
import useTransactions from './hooks/useTransactions';
import TransactionsTable from './components/Transactions/TransactionsTable';
import MonthlyRewardsTable from './components/MonthlyRewards/MonthlyRewardsTable';
import TotalRewardsTable from './components/TotalRewards/TotalRewardsTable';
import ErrorMessage from './components/common/ErrorMessage';

function App() {
  // Fetch data and UI States from custom hook
  const {transactions, isLoading, error} = useTransactions();

  //show loading state only when data is actively being fetched
  if(isLoading){
    return(
      <div className='loader'>
        Loading transactions...
      </div>
    )
  }
  return (
    <div className="app-container">
      <h1>Customer Rewards Program</h1>
      <ErrorMessage error={error}/>

      {/* Render tables only when there is no error */}
      {!(error.hasError) &&(
        <>
        <TransactionsTable transactions={transactions}/>
        <MonthlyRewardsTable transactions={transactions}/>
        <TotalRewardsTable transactions={transactions}/>
        </>
      ) 
      }
    </div>
  );
}

export default App;
