/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  useTheme,
  alpha,
} from "@mui/material";
import { Link } from "react-router-dom";
import swal from "sweetalert";

import {
  useDeleteDonationMutation,
  useGetAllDonationQuery,
} from "../../redux/api/donationApi";
import Loading from "../../components/Loading/Loading";
import { useAccountSummaryQuery } from "../../redux/api/meta.api";
import DonationStatisticCard from "./DonationStatisticCard";
import { useAppOptions } from "../../hooks/useAppOptions";
import Can from "../../components/Can";

const DonationList = () => {
  const theme = useTheme();
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const [deleteDonation, { isLoading: isDeleting }] =
    useDeleteDonationMutation();

  const { data: donationData, isLoading: donationLoading } =
    useGetAllDonationQuery({ tenantDomain });
  const { data: accountSummary } = useAccountSummaryQuery({ tenantDomain });

  const handleDelete = async (id) => {
    performActionWithPermission('/dashboard/donation-list', 'delete',
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "Are you sure that you want to delete this donation?",
          icon: "warning",
          dangerMode: true,
          buttons: ["Cancel", "Delete"],
        });

        if (willDelete) {
          try {
            await deleteDonation({ id, tenantDomain }).unwrap();
            swal("Deleted!", "Donation deleted successfully.", "success");
          } catch (error) {
            swal(
              "Error",
              "An error occurred while deleting the donation.",
              "error"
            );
          }
        }
      }, "Are you sure you want to delete this donation? This action cannot be undone"
    )
  }


  if (donationLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <DonationStatisticCard accountSummary={accountSummary} />

      <Card elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            p: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" color="primary" fontWeight="600">
            All Donations
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="donations table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                }}
              >
                <TableCell sx={{ fontWeight: "bold", py: 2 }}>Donor</TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }} align="center">
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }} align="center">
                  Purpose
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }} align="center">
                  Amount
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }} align="center">
                  Payment Method
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", py: 2 }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donationData?.data?.map((data, i) => (
                <TableRow
                  key={i}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                    },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ py: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600">
                        {data.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.donation_country}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Box>
                      <Typography variant="body2">
                        {data.mobile_number}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Chip
                      label={data.donation_purpose}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      color="primary"
                    >
                      ৳{data.donation_amount}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Chip
                      label={data.payment_method}
                      size="small"
                      color="secondary"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ py: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <Can page='/dashboard/donation-list' action='edit'>
                        <IconButton
                          title="Edit"
                          size="small"
                          component={Link}
                          to={`/dashboard/update-donation?id=${data?._id}`}
                          sx={{
                            backgroundColor: alpha(theme.palette.info.main, 0.1),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.info.main,
                                0.2
                              ),
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Can>
                      <Can page='/dashboard/donation-list' action='delete'>
                        <IconButton
                          onClick={() => handleDelete(data._id)}
                          disabled={isDeleting}
                          title="Delete"
                          size="small"
                          sx={{
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                0.2
                              ),
                            },
                            "&:disabled": { opacity: 0.5 },
                          }}
                        >
                          <DeleteIcon fontSize="small" className="text-red-600" />
                        </IconButton>
                      </Can>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default DonationList;
