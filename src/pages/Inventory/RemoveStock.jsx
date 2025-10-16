"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Zoom,
  Fade,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  useTheme,
  Avatar,
  Chip,
  Alert,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import SaveIcon from "@mui/icons-material/Save"
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import DescriptionIcon from "@mui/icons-material/Description"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { alpha } from "@mui/material/styles"


const products = [
  {
    id: 1,
    code: "EP001",
    name: "ইঞ্জিন অয়েল ফিল্টার",
    category: "ইঞ্জিন পার্টস",
    currentStock: 25,
    unit: "পিস",
  },
  {
    id: 2,
    code: "BS002",
    name: "ব্রেক প্যাড",
    category: "ব্রেক সিস্টেম",
    currentStock: 15,
    unit: "সেট",
  },
  {
    id: 3,
    code: "SS003",
    name: "শক অ্যাবজরবার",
    category: "সাসপেনশন",
    currentStock: 8,
    unit: "পিস",
  },
  {
    id: 4,
    code: "EL004",
    name: "হেডলাইট বাল্ব",
    category: "ইলেকট্রিক্যাল",
    currentStock: 30,
    unit: "পিস",
  },
  {
    id: 5,
    code: "LB005",
    name: "ইঞ্জিন অয়েল",
    category: "লুব্রিকেন্টস",
    currentStock: 40,
    unit: "লিটার",
  },
]

const locations = ["মেইন ওয়্যারহাউজ", "শোরুম A", "শোরুম B", "শোরুম C", "সার্ভিস সেন্টার"]
const reasons = ["ড্যামেজড প্রোডাক্ট", "এক্সপায়ার্ড প্রোডাক্ট", "ইনভেন্টরি অ্যাডজাস্টমেন্ট", "ফিজিক্যাল কাউন্ট অ্যাডজাস্টমেন্ট", "অন্যান্য"]

export default function RemoveStockPage() {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [referenceNo, setReferenceNo] = useState(
    `REM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
  )
  const [location, setLocation] = useState("")
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const [stockItems, setStockItems] = useState([{ id: 1, product: null, quantity: 1, note: "" }])
  const [errors, setErrors] = useState({})

  const steps = ["বেসিক ইনফরমেশন", "পণ্য সিলেক্ট করুন", "সম্পন্ন করুন"]

  const handleAddItem = () => {
    const newItem = {
      id: Math.max(...stockItems.map((item) => item.id), 0) + 1,
      product: null,
      quantity: 1,
      note: "",
    }
    setStockItems([...stockItems, newItem])
  }

  const handleRemoveItem = (id) => {
    setStockItems(stockItems.filter((item) => item.id !== id))
    // Remove any errors for this item
    const newErrors = { ...errors }
    delete newErrors[id]
    setErrors(newErrors)
  }

  const handleProductChange = (id, newProduct) => {
    setStockItems(stockItems.map((item) => (item.id === id ? { ...item, product: newProduct, quantity: 1 } : item)))
    // Clear error for this item
    const newErrors = { ...errors }
    delete newErrors[id]
    setErrors(newErrors)
  }

  const handleQuantityChange = (id, quantity) => {
    const item = stockItems.find((item) => item.id === id)

    if (item && item.product) {
      // Validate quantity against current stock
      if (quantity > item.product.currentStock) {
        setErrors({ ...errors, [id]: "স্টকের চেয়ে বেশি পরিমাণ" })
      } else {
        // Clear error if it exists
        const newErrors = { ...errors }
        delete newErrors[id]
        setErrors(newErrors)
      }
    }

    setStockItems(stockItems.map((item) => (item.id === id ? { ...item, quantity: quantity } : item)))
  }

  const handleNoteChange = (id, note) => {
    setStockItems(stockItems.map((item) => (item.id === id ? { ...item, note: note } : item)))
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSubmit = () => {
    // Validate all items
    let hasErrors = false
    const newErrors = {}

    stockItems.forEach((item) => {
      if (item.product && item.quantity > item.product.currentStock) {
        newErrors[item.id] = "স্টকের চেয়ে বেশি পরিমাণ"
        hasErrors = true
      }
    })

    setErrors(newErrors)

    if (!hasErrors) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setLoading(false)
        setActiveStep(2) // Move to completion step
      }, 1500)
    }
  }

  const getTotalItems = () => {
    return stockItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="তারিখ"
                  type="date"
                  fullWidth
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "white",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="রেফারেন্স নং"
                  fullWidth
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "white",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "white",
                    },
                  }}
                >
                  <InputLabel>লোকেশন</InputLabel>
                  <Select value={location} label="লোকেশন" onChange={(e) => setLocation(e.target.value)}>
                    {locations.map((loc) => (
                      <MenuItem key={loc} value={loc}>
                        {loc}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "white",
                    },
                  }}
                >
                  <InputLabel>কারণ</InputLabel>
                  <Select value={reason} label="কারণ" onChange={(e) => setReason(e.target.value)}>
                    {reasons.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="নোট"
                  fullWidth
                  multiline
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "white",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Fade>
        )
      case 1:
        return (
          <Fade in={activeStep === 1}>
            <Box>
              {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  কিছু আইটেমের পরিমাণ স্টকের চেয়ে বেশি। অনুগ্রহ করে সংশোধন করুন।
                </Alert>
              )}

              <TableContainer
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  mb: 3,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: alpha(theme.palette.error.main, 0.1) }}>
                      <TableCell width="40%" sx={{ fontWeight: "bold" }}>
                        পণ্য
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        বর্তমান স্টক
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        পরিমাণ
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>ইউনিট</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>নোট</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        অ্যাকশন
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockItems.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{
                          "&:hover": { backgroundColor: alpha(theme.palette.error.main, 0.04) },
                          transition: "background-color 0.2s ease",
                          ...(errors[item.id] && { backgroundColor: alpha(theme.palette.error.main, 0.08) }),
                        }}
                      >
                        <TableCell>
                          <Autocomplete
                            options={products}
                            getOptionLabel={(option) => `${option.name} (${option.code})`}
                            value={item.product}
                            onChange={(_, newValue) => handleProductChange(item.id, newValue)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="পণ্য নির্বাচন করুন"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "white",
                                  },
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={item.product ? item.product.currentStock : 0}
                            size="small"
                            color={
                              item.product
                                ? item.product.currentStock > 10
                                  ? "success"
                                  : item.product.currentStock > 0
                                    ? "warning"
                                    : "error"
                                : "default"
                            }
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                            InputProps={{
                              inputProps: {
                                min: 1,
                                max: item.product ? item.product.currentStock : 1,
                              },
                            }}
                            error={Boolean(errors[item.id])}
                            helperText={errors[item.id] || ""}
                            sx={{
                              width: 80,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: "white",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>{item.product ? item.product.unit : ""}</TableCell>
                        <TableCell>
                          <TextField
                            placeholder="নোট"
                            value={item.note}
                            onChange={(e) => handleNoteChange(item.id, e.target.value)}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: "white",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="রিমুভ করুন" TransitionComponent={Zoom}>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveItem(item.id)}
                              sx={{
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                                "&:hover": {
                                  backgroundColor: alpha(theme.palette.error.main, 0.2),
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 3,
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                  },
                }}
              >
                আরও পণ্য যোগ করুন
              </Button>
            </Box>
          </Fade>
        )
      case 2:
        return (
          <Fade in={activeStep === 2}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.success.main,
                  width: 80,
                  height: 80,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.4)}`,
                  margin: "0 auto 24px",
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 48 }} />
              </Avatar>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.success.main }}>
                সফলভাবে সম্পন্ন হয়েছে!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                স্টক সফলভাবে রিমুভ করা হয়েছে। রেফারেন্স নং: {referenceNo}
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 4,
                    mr: 2,
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                  href="/inventory/stock"
                >
                  স্টক পেইজে যান
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 4,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }}
                  onClick={() => {
                    setActiveStep(0)
                    setDate(new Date().toISOString().split("T")[0])
                    setReferenceNo(
                      `REM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
                    )
                    setLocation("")
                    setReason("")
                    setNote("")
                    setStockItems([{ id: 1, product: null, quantity: 1, note: "" }])
                    setErrors({})
                  }}
                >
                  নতুন স্টক রিমুভ করুন
                </Button>
              </Box>
            </Box>
          </Fade>
        )
      default:
        return "Unknown step"
    }
  }

  return (
    <Box sx={{margin:'30px 0px'}}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link color="inherit" href="/dashboard" sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2">ড্যাশবোর্ড</Typography>
        </Link>
        <Link color="inherit" href="/inventory" sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2">ইনভেন্টরি</Typography>
        </Link>
        <Typography color="text.primary" variant="body2">
          স্টক রিমুভ করুন
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #f44336 30%, #ff9800 90%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            mb: 1,
          }}
        >
          স্টক রিমুভ করুন
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          ড্যামেজড, এক্সপায়ার্ড বা অন্যান্য কারণে স্টক থেকে পণ্য রিমুভ করুন
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          mb: 4,
          background: "linear-gradient(to right, #fff5f5, #ffe0e0)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      ...(index < activeStep && {
                        color: theme.palette.error.main,
                      }),
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 4 }} />

          {getStepContent(activeStep)}

          {loading && <LinearProgress sx={{ mt: 4 }} />}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0 || activeStep === 2}
              onClick={handleBack}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 4,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              পেছনে
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? null : activeStep === 0 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!location || !reason}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 4,
                    bgcolor: theme.palette.error.main,
                    "&:hover": {
                      bgcolor: theme.palette.error.dark,
                    },
                    boxShadow: `0 8px 16px ${alpha(theme.palette.error.main, 0.3)}`,
                  }}
                >
                  পরবর্তী
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    stockItems.length === 0 ||
                    stockItems.some((item) => item.product === null) ||
                    stockItems.some((item) => item.quantity <= 0) ||
                    Object.keys(errors).length > 0
                  }
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 4,
                    bgcolor: theme.palette.error.main,
                    "&:hover": {
                      bgcolor: theme.palette.error.dark,
                    },
                    boxShadow: `0 8px 16px ${alpha(theme.palette.error.main, 0.3)}`,
                  }}
                >
                  স্টক রিমুভ করুন
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#f44336",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(244, 67, 54, 0.3)",
                  }}
                >
                  <RemoveCircleIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  স্টক রিমুভ ইনফরমেশন
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                স্টক রিমুভ করার সময় সঠিক পরিমাণ নিশ্চিত করুন। পরিমাণ বর্তমান স্টকের চেয়ে বেশি হতে পারবে না।
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                মোট আইটেম: {getTotalItems()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#ff9800",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(255, 152, 0, 0.3)",
                  }}
                >
                  <WarningAmberIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  সতর্কতা
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                স্টক রিমুভ করার পর এটি আর ফিরিয়ে আনা যাবে না। অনুগ্রহ করে সঠিক কারণ এবং পরিমাণ নিশ্চিত করুন।
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                নির্বাচিত কারণ: {reason || "নির্বাচন করা হয়নি"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: "#00bcd4",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 8px rgba(0, 188, 212, 0.3)",
                  }}
                >
                  <DescriptionIcon />
                </Avatar>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
                  ডকুমেন্টেশন
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                স্টক রিমুভ করার কারণ এবং অন্যান্য গুরুত্বপূর্ণ তথ্য রেকর্ড করুন। এটি ভবিষ্যতে অডিট এবং হিসাবের জন্য গুরুত্বপূর্ণ।
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                রেফারেন্স নং: {referenceNo}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
