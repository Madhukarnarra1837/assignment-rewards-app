import {render, screen} from '@testing-library/react';
import TransactionsTable from '../TransactionsTable';

const mockTransactions = [
    {
        transactionId: 'TXN-1',
        customerId: 'C1',
        customerName: 'Sarah Wilson',
        productPurchased: 'Bag',
        price:120,
        purchaseDate:'2024-01-15'
    }
]

test('renders transaction row', () =>{
    render(<TransactionsTable transactions={mockTransactions}/>);

    expect(screen.getByText('Sarah Wilson')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
})