// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// "use client";
// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   Box,
//   Grid,
//   Typography,
//   Paper,
//   Button,
//   Card,
//   CardContent,
//   Stack,
//   IconButton,
//   Avatar,
//   InputAdornment,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Divider,
//   Chip,
//   Select,
// } from "@mui/material";
// import {
//   Receipt,
//   Description,
//   Add,
//   Delete,
//   Payment,
//   DateRange,
//   BusinessCenter,
// } from "@mui/icons-material";
// import {
//   useCreateExpenseMutation,
//   useGetSingleExpenseQuery,
//   useUpdateExpenseMutation,
// } from "../../../redux/api/expense";
// import TASDatepicker from "../../../components/form/Datepicker";
// import TASForm from "../../../components/form/Form";
// import TASInput from "../../../components/form/Input";
// import TASTextarea from "../../../components/form/Textarea";
// import { useTenantDomain } from "../../../hooks/useTenantDomain";
// import { useGetAllInvoicesQuery } from "../../../redux/api/invoice";
// import ExpenseAutoComplete from "./ExpenseAutoComplete";
// import Loading from "../../../components/Loading/Loading";
// import TASSelect from "../../../components/form/Select";
// import { paymentMethods } from "../../../constant";

// const ExpenseForm = ({ id }) => {
//   const navigate = useNavigate();
//   const tenantDomain = useTenantDomain();
//   const [filterType, setFilterType] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const limit = 10;
//   const [expenseItems, setExpenseItems] = useState([{ name: "", amount: 0 }]);

//   const { data: singleExpense, isLoading } = useGetSingleExpenseQuery({
//     tenantDomain,
//     id,
//   });

//   const [createExpense] = useCreateExpenseMutation();
//   const [updateExpense] = useUpdateExpenseMutation();

//   const { data: allInvoices } = useGetAllInvoicesQuery({
//     tenantDomain,
//     limit,
//     page: currentPage,
//     searchTerm: filterType,
//     isRecycled: false,
//   });

//   const invoiceOption = useMemo(() => {
//     if (!allInvoices?.data?.invoices) return [];
//     return allInvoices.data.invoices.map((invoice) => ({
//       label: `${invoice.invoice_no} - ${invoice.Id}`,
//       _id: invoice._id,
//     }));
//   }, [allInvoices?.data?.invoices]);

//   useEffect(() => {
//     if (singleExpense?.data) {
//       setExpenseItems(
//         singleExpense.data.expense_items.map((item) => ({
//           name: item.name || "",
//           amount: item.amount || 0,
//         })) || [{ name: "", amount: 0 }]
//       );
//     }
//   }, [singleExpense]);

//   const defaultValues = useMemo(() => {
//     if (id && singleExpense?.data) {
//       let selectedInvoiceId = null;
//       if (singleExpense.data.invoice_id) {
//         selectedInvoiceId =
//           typeof singleExpense.data.invoice_id === "object"
//             ? singleExpense.data.invoice_id._id
//             : singleExpense.data.invoice_id;
//       }

//       return {
//         date: singleExpense.data.date,
//         invoice_id: selectedInvoiceId,
//         invoiceCost: singleExpense.data.invoiceCost ?? 0,
//         payment_method: singleExpense.data.payment_method || "Bkash",
//         accountNumber: singleExpense.data.accountNumber || "",
//         transactionNumber: singleExpense.data.transactionNumber || "",
//         note: singleExpense.data.note || "",
//         item: singleExpense.data.expense_items.map((expenseItem, index) => ({
//           name: expenseItem.name || "",
//           amount: expenseItem.amount?.toString() || "0",
//         })),
//       };
//     }

//     return {
//       date: new Date(),
//       invoice_id: null,
//       invoiceCost: 0,
//       payment_method: "Bkash",
//       accountNumber: "",
//       transactionNumber: "",
//       note: "",
//       item: [{ name: "", amount: "0" }],
//     };
//   }, [id, singleExpense?.data, invoiceOption]);

//   // Handle expense items
//   const addExpenseItem = () => {
//     setExpenseItems([...expenseItems, { name: "", amount: 0 }]);
//   };

//   const removeExpenseItem = useCallback(
//     (index) => {
//       if (expenseItems.length > 1) {
//         setExpenseItems((prev) => prev.filter((_, i) => i !== index));
//       }
//     },
//     [expenseItems.length]
//   );


//   // Fixed: Use index instead of id
//   const handleExpenseItemChange = (index, field, value) => {
//     setExpenseItems((prevItems) =>
//       prevItems.map((item, i) =>
//         i === index ? { ...item, [field]: value } : item
//       )
//     );
//   };

//   // Calculate total expense amount
//   const totalExpenseAmount = expenseItems.reduce(
//     (sum, item) => sum + (Number(item.amount) || 0),
//     0
//   );

//   const handleSubmit = async (data, reset) => {
//     const cleanedExpenseItems = data?.item?.map((item) => ({
//       name: item.name,
//       amount: Number(item.amount),
//     }));

//     const formattedDate =
//       data.date instanceof Date
//         ? data.date.toISOString().split("T")[0]
//         : data.date;

//     const expenseData = {
//       date: formattedDate,
//       invoice_id: data.invoice_id || "",
//       invoiceCost: Number(data.invoiceCost) || 0,
//       expense_items: cleanedExpenseItems,
//       payment_method: data.payment_method,
//       accountNumber: data.accountNumber || "",
//       transactionNumber: data.transactionNumber || "",
//       note: data.note || "",
//     };

//     const toastId = toast.loading(
//       id ? "Updating Expense..." : "Creating Expense..."
//     );

//     try {
//       let res;
//       if (id) {
//         res = await updateExpense({
//           tenantDomain,
//           id,
//           ...expenseData,
//         }).unwrap();
//       } else {
//         res = await createExpense({
//           tenantDomain,
//           expenseInfo: expenseData,
//         }).unwrap();
//       }

//       toast.update(toastId, {
//         render:
//           res.message || `Expense ${id ? "updated" : "created"} successfully!`,
//         type: "success",
//         isLoading: false,
//         autoClose: 3000,
//       });

//       navigate("/dashboard/expense-list");
//       reset();
//     } catch (error) {
//       toast.update(toastId, {
//         render:
//           `Error ${id ? "updating" : "creating"} expense: ` +
//           (error?.data?.message || error?.message || "Something went wrong!"),
//         type: "error",
//         isLoading: false,
//         autoClose: 3000,
//       });
//     }
//   };

//   const inputStyle = {
//     "& .MuiOutlinedInput-root": {
//       borderRadius: 2,
//       "&:hover .MuiOutlinedInput-notchedOutline": {
//         borderColor: "#3b82f6",
//       },
//       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//         borderColor: "#3b82f6",
//         borderWidth: 2,
//       },
//     },
//   };

//   if (isLoading) {
//     return <Loading />;
//   }

//   return (
//     <Box
//       sx={{
//         maxWidth: "1200px",
//         mx: "auto",
//         p: { xs: 2, md: 4 },
//         backgroundColor: "#f8fafc",
//         minHeight: "100vh",
//       }}
//     >
//       <Paper
//         elevation={0}
//         sx={{
//           p: { xs: 3, md: 4 },
//           mb: 4,
//           borderRadius: 3,
//           backgroundColor: "white",
//           border: "1px solid #e2e8f0",
//           position: "relative",
//           overflow: "hidden",
//           "&::before": {
//             content: '""',
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             height: 4,
//             background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
//           },
//         }}
//       >
//         <Stack direction="row" spacing={3} alignItems="center">
//           <Avatar
//             sx={{
//               width: 64,
//               height: 64,
//               backgroundColor: "#3b82f6",
//               boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
//             }}
//           >
//             <Receipt sx={{ fontSize: 32 }} />
//           </Avatar>
//           <Box>
//             <Typography
//               variant="h4"
//               fontWeight="700"
//               color="#1e293b"
//               sx={{ mb: 1 }}
//             >
//               {id ? "Edit Expense" : "Create New Expense"}
//             </Typography>
//             <Typography variant="body1" color="#64748b">
//               {id
//                 ? "Update expense details"
//                 : "Add a new expense to your records"}
//             </Typography>
//           </Box>
//         </Stack>
//       </Paper>

//       <TASForm onSubmit={handleSubmit} defaultValues={defaultValues}>
//         <Grid container spacing={4}>
//           {/* Invoice & Date Section */}
//           <Grid item xs={12}>
//             <Card
//               sx={{
//                 borderRadius: 3,
//                 border: "1px solid #e2e8f0",
//                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//                 backgroundColor: "white",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <Stack direction="row" spacing={2} alignItems="center" mb={3}>
//                   <DateRange sx={{ color: "#3b82f6", fontSize: 24 }} />
//                   <Typography variant="h6" fontWeight="600" color="#1e293b">
//                     Invoice & Date Information
//                   </Typography>
//                 </Stack>
//                 <Divider sx={{ mb: 3 }} />
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={4}>
//                     <ExpenseAutoComplete
//                       label="Select Invoice"
//                       name="invoice_id"
//                       options={invoiceOption}
//                       size="normal"
//                       multiple={false} // Fixed: Set to false for single selection
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={4}>
//                     <TASDatepicker
//                       size="medium"
//                       fullWidth
//                       name="date"
//                       label="Invoice Date"
//                       sx={inputStyle}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={4}>
//                     <TASInput
//                       fullWidth
//                       name="invoiceCost"
//                       label="Invoice Cost"
//                       type="number"
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                            ৳
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={inputStyle}
//                     />
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Expense Items Section */}
//           <Grid item xs={12}>
//             <Card
//               sx={{
//                 borderRadius: 3,
//                 border: "1px solid #e2e8f0",
//                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//                 backgroundColor: "white",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <Stack
//                   direction="row"
//                   spacing={2}
//                   alignItems="center"
//                   justifyContent="space-between"
//                   mb={3}
//                 >
//                   <Stack direction="row" spacing={2} alignItems="center">
//                     <BusinessCenter sx={{ color: "#8b5cf6", fontSize: 24 }} />
//                     <Typography variant="h6" fontWeight="600" color="#1e293b">
//                       Expense Items
//                     </Typography>
//                   </Stack>
//                   <Chip
//                     label={`Total: $${totalExpenseAmount.toFixed(2)}`}
//                     sx={{
//                       backgroundColor: "#dcfce7",
//                       color: "#166534",
//                       fontWeight: "600",
//                     }}
//                   />
//                 </Stack>
//                 <Divider sx={{ mb: 3 }} />
//                 <Stack spacing={3}>
//                   {expenseItems.map((item, index) => (
//                     <Paper
//                       key={index}
//                       sx={{
//                         p: 3,
//                         borderRadius: 2,
//                         backgroundColor: "#f8fafc",
//                         border: "1px solid #e2e8f0",
//                       }}
//                     >
//                       <Grid container spacing={3} alignItems="center">
//                         <Grid item xs={12} md={5}>
//                           <TASInput
//                             fullWidth
//                             name={`item[${index}].name`}
//                             label={`Item ${index + 1} Name`}
//                             value={item.name}
//                             onChange={(e) =>
//                               handleExpenseItemChange(
//                                 index,
//                                 "name",
//                                 e.target.value
//                               )
//                             }
//                             InputProps={{
//                               startAdornment: (
//                                 <InputAdornment position="start">
//                                   <Description sx={{ color: "#6b7280" }} />
//                                 </InputAdornment>
//                               ),
//                             }}
//                             sx={inputStyle}
//                           />
//                         </Grid>
//                         <Grid item xs={12} md={4}>
//                           <TASInput
//                             fullWidth
//                             label="Amount"
//                             name={`item[${index}].amount`}
//                             type="number"
//                             value={item.amount}
//                             onChange={(e) =>
//                               handleExpenseItemChange(
//                                 index,
//                                 "amount",
//                                 e.target.value
//                               )
//                             }
//                             InputProps={{
//                               startAdornment: (
//                                 <InputAdornment position="start">
//                                ৳
//                                 </InputAdornment>
//                               ),
//                             }}
//                             sx={inputStyle}
//                           />
//                         </Grid>
//                         <Grid item xs={12} md={3}>
//                           <Stack
//                             direction="row"
//                             spacing={1}
//                             justifyContent="center"
//                           >
//                             <IconButton
//                               color="error"
//                               onClick={() => removeExpenseItem(index)}
//                               disabled={expenseItems.length === 1}
//                               sx={inputStyle}
//                             >
//                               <Delete />
//                             </IconButton>
//                           </Stack>
//                         </Grid>
//                       </Grid>
//                     </Paper>
//                   ))}
//                 </Stack>
//                 <Box display="flex" justifyContent="center" mt={3}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<Add />}
//                     onClick={addExpenseItem}
//                     sx={inputStyle}
//                   >
//                     Add New Item
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>

//           {/* Payment & Details Section */}
//           <Grid item xs={12}>
//             <Card
//               sx={{
//                 borderRadius: 3,
//                 border: "1px solid #e2e8f0",
//                 boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//                 backgroundColor: "white",
//               }}
//             >
//               <CardContent sx={{ p: 4 }}>
//                 <Stack direction="row" spacing={2} alignItems="center" mb={3}>
//                   <Payment sx={{ color: "#8b5cf6", fontSize: 24 }} />
//                   <Typography variant="h6" fontWeight="600" color="#1e293b">
//                     Payment Information
//                   </Typography>
//                 </Stack>
//                 <Divider sx={{ mb: 3 }} />
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     <TASSelect
//                       size="normal"
//                       name="payment_method"
//                       label="Payment Method"
//                       items={paymentMethods}
//                     />
//                   </Grid>
//                   {/* Conditional Payment Fields */}
//                   {["Bkash", "Nagad", "Rocket", "Other"].includes(
//                     defaultValues.payment_method
//                   ) && (
//                     <>
//                       <Grid item xs={12} md={3}>
//                         <TASInput
//                           fullWidth
//                           name="accountNumber"
//                           label="Account Number"
//                           sx={inputStyle}
//                         />
//                       </Grid>
//                       <Grid item xs={12} md={3}>
//                         <TASInput
//                           fullWidth
//                           name="transactionNumber"
//                           label="Transaction Number"
//                           sx={inputStyle}
//                         />
//                       </Grid>
//                     </>
//                   )}
//                   <Grid item xs={12}>
//                     <TASTextarea
//                       fullWidth
//                       name="note"
//                       minRows={4}
//                       placeholder="Add any additional notes about this expense..."
//                       sx={inputStyle}
//                     />
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>

//         {/* Submit Button */}
//         <Box display="flex" justifyContent="center" mt={4}>
//           <Button
//             variant="contained"
//             type="submit"
//             size="large"
//             sx={inputStyle}
//           >
//             {id ? "Update Expense" : "Create Expense"}
//           </Button>
//         </Box>
//       </TASForm>
//     </Box>
//   );
// };

// export default ExpenseForm;
