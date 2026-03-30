# Customer Rewards Program

## Overview
This application calculates and displays reward points earned by customers based on theie transaction history. It supports transaction-level rewards, monthly aggregation, and total rewards using reusable UI Components.

## Reward Rules
- < $50:  0 points
- $50-$100: 1 points per dollar over $50
- > $100: 2 points per dollar over $100
- Decimal values are floored

## Data Assumptions
In the provided dataset, customerName represents the logical customer identity.
Although customerId is present, multiple IDs may correspond to the same name.
Aggregation is therefore performed based on the logical customer identity.

## Apllication Architecture
- Data is fetched from a mock API endpoint
- State an side-effects are managed via a custom hook
- Business logic id handled using pure utility functions
- UI rednering is done via resusable table components

## UI Features
- Transactions table with reward calculation
- Monthly rewards aggregation (month+year)
- Total rewards per customer
- Sorting, filtering, and pagination

## Error Handling & Logging
Errors are centrally logged using a logger utility and surfaced to the UI using
a consistent error state model. Errors are never silently swallowed.

## Testing
Tests focus on business logic correctness and UI rendering behavior, including aggregation, date handling, and table interactions

## Running the Application
npm install
npm start

Run tests:
npm test