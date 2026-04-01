import React from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import useTransactions from './hooks/useTransactions';
import TransactionsTable from './components/Transactions/TransactionsTable';
import MonthlyRewardsTable from './components/MonthlyRewards/MonthlyRewardsTable';
import TotalRewardsTable from './components/TotalRewards/TotalRewardsTable';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  const { transactions, isLoading, error } = useTransactions();

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" role="status" />
        <span className="ms-2">Loading transactions...</span>
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <Container className="py-5">
        <header className="mb-5 text-center">
          <h1 className="display-4 fw-bold text-primary">Customer Rewards Program</h1>
          <p className="lead text-muted">Track transactions and earn points based on spending.</p>
        </header>

        {error?.hasError && <Alert variant="danger">{error.message}</Alert>}

        {!error?.hasError && (
          <Row className="g-4">
            <Col xs={12}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <TransactionsTable transactions={transactions} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white py-3"><h5 className="mb-0 fw-bold">User Monthly Rewards</h5></Card.Header>
                <Card.Body>
                  <MonthlyRewardsTable transactions={transactions} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white py-3"><h5 className="mb-0 fw-bold">Total Rewards</h5></Card.Header>
                <Card.Body>
                  <TotalRewardsTable transactions={transactions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </ErrorBoundary>
  );
}

export default App;