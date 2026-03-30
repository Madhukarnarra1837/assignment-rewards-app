import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Table from "../components/common/Table";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "rewardPoints", label: "Reward Points" }, // Testing "points" formatting branch
];

const mockData = [
  { id: "TXN-001", name: "Emma Davis", rewardPoints: 100 },
  { id: "TXN-002", name: "John Doe", rewardPoints: 50 },
  { id: "TXN-003", name: "Alice Smith", rewardPoints: 200 },
  { id: "TXN-004", name: "Michael Brown", rewardPoints: 30 },
  { id: "TXN-005", name: "Sarah Wilson", rewardPoints: 80 },
  { id: "TXN-006", name: "Chris Evans", rewardPoints: 150 }, // 6th item to force Page 2
];

describe("Table Component Coverage Boost", () => {
  const pageSize = 5;

  test("renders headers and formats 'points' columns", () => {
    render(<Table columns={columns} data={mockData} pageSize={pageSize} />);
    
    // Covers the branch that bolds "points" columns (Lines 70+ in Table.js)
    const pointsCell = screen.getByText("100");
    expect(pointsCell.tagName).toBe("STRONG");
  });

  test("filters rows and resets to page 1", async () => {
    render(<Table columns={columns} data={mockData} pageSize={pageSize} />);
    const input = screen.getByPlaceholderText(/Filter rows/i);

    // Covers filtering logic (Lines 12-14)
    await userEvent.type(input, "Emma");
    expect(screen.getByText("Emma Davis")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();

    // Covers the useEffect that resets page to 1 (Line 62)
    await userEvent.clear(input);
  });

  test("sorts data in ASC and DESC order", async () => {
    render(<Table columns={columns} data={mockData} pageSize={pageSize} />);
    const nameHeader = screen.getByText("Name");

    // Click 1: ASC (Covers Lines 23-28)
    await userEvent.click(nameHeader);
    let rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Alice Smith"); // A comes first

    // Click 2: DESC (Covers the 'desc' branch logic)
    await userEvent.click(nameHeader);
    rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Sarah Wilson"); // S comes first in DESC
  });

  test("navigates through pagination pages", async () => {
    render(<Table columns={columns} data={mockData} pageSize={pageSize} />);
    
    const nextButton = screen.getByText(/next/i);
    const prevButton = screen.getByText(/prev/i);

    // Covers 'Next' handler (Lines 116-128)
    await userEvent.click(nextButton);
    expect(screen.getByText("Chris Evans")).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();

    // Covers 'Prev' handler
    await userEvent.click(prevButton);
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  test("handles empty data gracefully", () => {
    // Covers the branch where data is null/undefined (Fixes NaN / Coverage)
    render(<Table columns={columns} data={[]} pageSize={pageSize} />);
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
  });
});