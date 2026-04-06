import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import * as api from './services/transactionsService';

// 1. Mock the module
jest.mock('./services/transactionsService');

test('renders app and loads data', async () => {
  // 2. Setup the mock response
  // IMPORTANT: Added 'id' to match Table.js <tr key={row.id}> requirement
  const mockData = [
    {
      transactionId: "TXN-001",
      customerName: "Emma Davis",
      purchaseDate: "2024-01-01",
      productPurchased: "Monitor",
      price: 100,
    }
  ];
  
  api.fetchTransactions.mockResolvedValue(mockData);

  render(<App />);
  
  // 3. Search for the name actually present in your mock data
  // We use findByText to wait for the loading spinner to disappear
  // Change this line in App.test.js:
const customerNames = await screen.findAllByText(/Emma Davis/i);
expect(customerNames[0]).toBeInTheDocument();

  // 4. Verify that the empty state message is gone
  expect(screen.queryByText(/No records found/i)).not.toBeInTheDocument();
  
  // 5. Optional: Verify other details in the row
  expect(screen.getByText("Monitor")).toBeInTheDocument();
});