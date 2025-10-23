"use client"
import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material"
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material"



const mockUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@autofixgarage.com",
    phone: "+1 (555) 987-6543",
    role: "Manager",
    subscriptionPlan: "Professional",
    subscriptionStatus: "active",
    joinDate: "2023-01-15",
    lastLogin: "2024-01-02 10:30 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@quickfix.com",
    phone: "+1 (555) 123-7890",
    role: "Admin",
    subscriptionPlan: "Enterprise",
    subscriptionStatus: "active",
    joinDate: "2023-03-20",
    lastLogin: "2024-01-01 02:15 PM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@speedyauto.com",
    phone: "+1 (555) 456-1234",
    role: "Technician",
    subscriptionPlan: "Basic",
    subscriptionStatus: "expired",
    joinDate: "2023-06-10",
    lastLogin: "2023-12-15 09:45 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@elitegarage.com",
    phone: "+1 (555) 789-0123",
    role: "Manager",
    subscriptionPlan: "Professional",
    subscriptionStatus: "inactive",
    joinDate: "2023-08-05",
    lastLogin: "2023-12-28 11:20 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@proauto.com",
    phone: "+1 (555) 321-6547",
    role: "Receptionist",
    subscriptionPlan: "Basic",
    subscriptionStatus: "active",
    joinDate: "2023-09-12",
    lastLogin: "2024-01-01 04:10 PM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminUserListPage() {
  const [users] = useState(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    filterUsers(term, statusFilter, planFilter)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    filterUsers(searchTerm, status, planFilter)
  }

  const handlePlanFilter = (plan) => {
    setPlanFilter(plan)
    filterUsers(searchTerm, statusFilter, plan)
  }

  const filterUsers = (search, status, plan) => {
    let filtered = users

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.role.toLowerCase().includes(search),
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((user) => user.subscriptionStatus === status)
    }

    if (plan !== "all") {
      filtered = filtered.filter((user) => user.subscriptionPlan === plan)
    }

    setFilteredUsers(filtered)
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "warning"
      case "expired":
        return "error"
      default:
        return "default"
    }
  }

  const getPlanColor = (plan) => {
    switch (plan) {
      case "Enterprise":
        return "primary"
      case "Professional":
        return "secondary"
      case "Basic":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <Box>
      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h2" color="primary">
              User Management
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} size="large">
              Add New User
            </Button>
          </Box>

          {/* Filters */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Subscription Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Subscription Status"
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  startAdornment={<FilterIcon sx={{ mr: 1, color: "action.active" }} />}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Subscription Plan</InputLabel>
                <Select value={planFilter} label="Subscription Plan" onChange={(e) => handlePlanFilter(e.target.value)}>
                  <MenuItem value="all">All Plans</MenuItem>
                  <MenuItem value="Basic">Basic</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Users Table */}
          <TableContainer component={Paper} elevation={1}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>User</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Contact</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Subscription</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Last Login</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={user.avatar} sx={{ mr: 2, width: 40, height: 40 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" display="flex" alignItems="center">
                          <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          {user.email}
                        </Typography>
                        <Typography variant="body2" display="flex" alignItems="center" color="text.secondary">
                          <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          {user.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.subscriptionPlan}
                        color={getPlanColor(user.subscriptionPlan)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.subscriptionStatus.toUpperCase()}
                        color={getStatusColor(user.subscriptionStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.lastLogin}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary" onClick={() => handleViewUser(user)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton size="small" color="secondary">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredUsers.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No users found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Avatar src={selectedUser?.avatar} sx={{ mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                User ID: {selectedUser?.id}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" value={selectedUser.email} disabled variant="filled" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" value={selectedUser.phone} disabled variant="filled" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Role" value={selectedUser.role} disabled variant="filled" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Subscription Plan"
                  value={selectedUser.subscriptionPlan}
                  disabled
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Join Date" value={selectedUser.joinDate} disabled variant="filled" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Login" value={selectedUser.lastLogin} disabled variant="filled" />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" gap={2} alignItems="center">
                  <Typography variant="body2">Subscription Status:</Typography>
                  <Chip
                    label={selectedUser.subscriptionStatus.toUpperCase()}
                    color={getStatusColor(selectedUser.subscriptionStatus)}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<EditIcon />}>
            Edit User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}