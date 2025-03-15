import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "./App";

describe("AwesomeGIC Banking App", () => {
  // Initial rendering tests
  test("renders welcome message and initial balance", () => {
    render(<App />);
    expect(screen.getByText(/Welcome to AwesomeGIC Bank!/i)).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  test("renders action buttons", () => {
    render(<App />);
    expect(screen.getByText("Deposit")).toBeInTheDocument();
    expect(screen.getByText("Withdraw")).toBeInTheDocument();
    expect(screen.getByText("Print Statement")).toBeInTheDocument();
  });

  // Deposit functionality tests
  describe("Deposit functionality", () => {
    test("can make a successful deposit", async () => {
      render(<App />);
      
      // Click deposit button
      fireEvent.click(screen.getByText("Deposit"));
      
      // Enter amount
      const amountInput = screen.getByPlaceholderText("Amount");
      fireEvent.change(amountInput, { target: { value: "100" } });
      
      // Confirm deposit
      fireEvent.click(screen.getByText("Confirm"));
      
      // Check if balance updated
      expect(screen.getByText("$100.00")).toBeInTheDocument();
      
      // Check success message
      expect(screen.getByText("Thank you. $100.00 has been deposited to your account.")).toBeInTheDocument();
    });

    test("shows error for invalid deposit amount", () => {
      render(<App />);
      
      fireEvent.click(screen.getByText("Deposit"));
      const amountInput = screen.getByPlaceholderText("Amount");
      fireEvent.change(amountInput, { target: { value: "-50" } });
      fireEvent.click(screen.getByText("Confirm"));
      
      expect(screen.getByText("Please enter a valid amount")).toBeInTheDocument();
    });
  });

  // Withdrawal functionality tests
  describe("Withdrawal functionality", () => {
    test("can make a successful withdrawal", async () => {
      render(<App />);
      
      // First make a deposit
      fireEvent.click(screen.getByText("Deposit"));
      fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "100" } });
      fireEvent.click(screen.getByText("Confirm"));
      
      // Then make a withdrawal
      fireEvent.click(screen.getByText("Withdraw"));
      fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "50" } });
      fireEvent.click(screen.getByText("Confirm"));
      
      // Check if balance updated correctly
      expect(screen.getByText("$50.00")).toBeInTheDocument();
      
      // Check success message
      expect(screen.getByText("Thank you. $50.00 has been withdrawn.")).toBeInTheDocument();
    });

    test("prevents withdrawal exceeding balance", () => {
      render(<App />);
      
      // Try to withdraw without sufficient balance
      fireEvent.click(screen.getByText("Withdraw"));
      fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "100" } });
      fireEvent.click(screen.getByText("Confirm"));
      
      expect(screen.getByText("Insufficient balance")).toBeInTheDocument();
    });
  });

  // Transaction history tests
  describe("Transaction history", () => {
    test("shows transaction history correctly", async () => {
      render(<App />);
      
      // Make a deposit
      fireEvent.click(screen.getByText("Deposit"));
      fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "100" } });
      fireEvent.click(screen.getByText("Confirm"));
      
      // Make a withdrawal
      fireEvent.click(screen.getByText("Withdraw"));
      fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "30" } });
      fireEvent.click(screen.getByText("Confirm"));
      
      // Open statement
      fireEvent.click(screen.getByText("Print Statement"));
      
      // Check if transactions are listed
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByText(/\$100.00 \(Deposit\)/)).toBeInTheDocument();
      expect(within(dialog).getByText(/\$30.00 \(Withdrawal\)/)).toBeInTheDocument();
    });
  });
});
