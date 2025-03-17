import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MdLogout, MdDynamicFeed, MdDoubleArrow, MdFeed } from "react-icons/md";
import './index.css';
import ActionButton from './components/ActionButton';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  const handleOpen = (actionType) => {
    setAction(actionType);
    setAmount("");
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showMessage = (message, severity = "error") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleTransaction = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showMessage("Please enter a valid amount");
      return;
    }

    if (action === "withdraw" && numAmount > balance) {
      showMessage("Insufficient balance");
      return;
    }

    const newTransaction = {
      date: new Date(),
      amount: action === "deposit" ? numAmount : -numAmount,
      balance: action === "deposit" ? balance + numAmount : balance - numAmount
    };

    setTransactions([...transactions, newTransaction]);
    setBalance(newTransaction.balance);
    setOpenDialog(false);
    showMessage(
      `Thank you. $${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} has been ${action === "deposit" ? "deposited to your account" : "withdrawn"}.`,
      "success"
    );
  };

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, height: "100vh" }}>
      <Stack spacing={3}>
        {/* Header Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: "#8A5E25",
              fontWeight: "bold",
              fontSize: {
                xs: "1.5rem",
                sm: "2rem"
              },
              maxWidth: "70%"
            }}
          >
            Welcome to AwesomeGIC Bank!
          </Typography>

          <ActionButton
            elevation={0}
            padding={0}
            gap={0}
            icon={<MdLogout />}
            iconSize="2em"
            title="Quit"
            hoverEffect={false}
            onClick={() => alert("Thank you for banking with AwesomeGIC Bank. Have a nice day!")}
          />
        </Box>

        {/* Balance Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 0,
            borderLeft: "6px solid #8A5E25",
            backgroundColor: '#fff'
          }}
        >
          <Typography variant="subtitle1" color="text.secondary">
            Account Balance
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              fontSize: {
                xs: "2rem",
                sm: "3rem"
              },
              fontWeight: "bold",
              mt: 1
            }}
          >
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        </Paper>

        <Typography variant="h6" color="text.secondary">
          What would you like to do?
        </Typography>

        {/* Action Buttons Grid */}
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: {
            xs: "1fr",            // Full width on mobile (<600px)
            sm: "repeat(2, 1fr)", // Two columns on small screens (≥600px)
            md: "repeat(3, 1fr)", // Three columns on medium screens (≥900px)
            lg: "repeat(4, 1fr)"  // Four columns on large screens (≥1200px)
          },
          gap: 2 
        }}>
          <ActionButton
            icon={<MdDynamicFeed />}
            iconSize="2em"
            iconColor="#8A5E25"
            title="Deposit"
            subtitle="Add funds"
            onClick={() => handleOpen("deposit")}
          />

          <ActionButton
            icon={<MdDoubleArrow />}
            iconSize="2em"
            iconColor="#8A5E25"
            title="Withdraw"
            subtitle="Take out funds"
            onClick={() => handleOpen("withdraw")}
          />

          <ActionButton
            icon={<MdFeed />}
            iconSize="2em"
            iconColor="#8A5E25"
            title="Print Statement"
            subtitle="Get account statement"
            onClick={() => handleOpen("statement")}
          />
        </Box>

        {/* Transaction Dialog */}
        <Dialog 
          open={openDialog && action !== "statement"} 
          onClose={handleClose}
          slotProps={{
            paper: {
              sx: { 
                borderRadius: 4,
                width: "100%",
                maxWidth: "400px"
              }
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            {action === "deposit" ? "Deposit" : "Withdraw"}
          </DialogTitle>
          <DialogContent sx={{ pt: "8px !important" }}>
            <TextField
              autoFocus
              fullWidth
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              variant="standard"
              slotProps={{
                input: {
                  sx: { 
                    fontSize: "1.5rem",
                    "&::before": { display: "none" },
                    "&::after": { display: "none" }
                  }
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={handleClose}
              sx={{ 
                color: "text.primary",
                textTransform: "none",
                "&:hover": { bgcolor: "#F7F0E8" },
                borderRadius: 4
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleTransaction}
              sx={{ 
                color: "#8A5E25",
                textTransform: "none",
                "&:hover": { bgcolor: "#F7F0E8" },
                borderRadius: 4
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Statement Dialog */}
        <Dialog
          open={openDialog && action === "statement"}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: { borderRadius: 4 }
            }
          }}
        >
          <DialogTitle>Account Statement</DialogTitle>
          <DialogContent>
            {transactions.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.date.getTime()}>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell align="right">
                          ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {transaction.amount < 0 ? " (Withdrawal)" : " (Deposit)"}
                        </TableCell>
                        <TableCell align="right">
                          ${transaction.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
            : (
              <Typography variant="subtitle1" align="center" color="text.secondary">
                No transactions yet
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleClose}
              sx={{
                color: "#8A5E25",
                textTransform: "none",
                "&:hover": { bgcolor: "#F7F0E8" },
                borderRadius: 4
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            elevation={16}
            sx={{ 
              width: "100%",
              borderRadius: 10,
              alignItems: "center",
              "& .MuiAlert-message": {
                flex: 1
              }
            }}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={handleSnackbarClose}
                sx={{
                  position: "relative",
                  top: "-2px",
                  "&:hover": { bgcolor: "transparent" }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
}

export default App;