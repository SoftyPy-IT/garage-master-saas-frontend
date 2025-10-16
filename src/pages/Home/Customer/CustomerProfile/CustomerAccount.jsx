/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FaRegEdit } from "react-icons/fa";
import Card from "../../../../components/Card/Card";
import { Link } from "react-router-dom";
import { HiOutlineEye } from "react-icons/hi";
import { formatDate } from "../../../../utils/formateDate";
import { useState } from "react";
import VehicleDetailsModal from "./VehicleDetailsModal";

const CustomerAccount = ({ profileData, tenantDomain }) => {
  const [vehicleDetails, setVehicleDetails] = useState(false);
  const [getId, setGetId] = useState("");
  const handVehicleDetailsOpen = (id) => {
    setVehicleDetails(true);
    setGetId(id);
  };
  const handleVehicleDetailsClose = () => setVehicleDetails(false);

  const lastVehicle =
    profileData?.data?.vehicles?.length > 0
      ? [...profileData.data.vehicles].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
      : null;
  const beforeLastVehicle =
    profileData?.data?.vehicles?.length > 0
      ? [...profileData.data.vehicles].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[1]
      : null;

  const lastJobCard =
    profileData?.data?.jobCards?.length > 0
      ? [...profileData.data.jobCards].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
      : null;

  const beforeLastJobCard =
    profileData?.data?.jobCards?.length > 0
      ? [...profileData.data.jobCards].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[1]
      : null;
  const lastQuotation =
    profileData?.data?.quotations?.length > 0
      ? [...profileData.data.quotations].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
      : null;

  const beforeLastQuotation =
    profileData?.data?.quotations?.length > 0
      ? [...profileData.data.quotations].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[1]
      : null;

  const lastInvoice =
    profileData?.data?.invoices?.length > 0
      ? [...profileData.data.invoices].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
      : null;

  const beforeLastInvoice =
    profileData?.data?.invoices?.length > 0
      ? [...profileData.data.invoices].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[1]
      : null;
  const lastMoneyReceipt =
    profileData?.data?.money_receipts?.length > 0
      ? [...profileData.data.money_receipts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
      : null;

  const beforeLastMoneyReceipt =
    profileData?.data?.money_receipts?.length > 0
      ? [...profileData.data.money_receipts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[1]
      : null;

  return (
    <>
      <div className="customerProfileWrap">
        <div className="justify-between gap-5 flex-col lg:flex-row mt-5 flex">
          <Card>
            <h3 className="mb-4 text-xl font-semibold">Contact Info</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div className="flex">
                <div className="flex flex-col space-y-1 w-[105px] ">
                  <b>Customer Name</b>
                  <b>Customer Phone</b>
                  <b>Driver Name</b>
                  <b>Driver Phone</b>
                  <b>Company Name</b>
                  <b>Address</b>
                  <b>Reference Name</b>
                  <b>Date</b>
                </div>
                <div className="flex flex-col space-y-1 capitalize">
                  <span>: {profileData?.data?.customer_name}</span>
                  <span>: 0{profileData?.data?.customer_contact}</span>
                  <span>: {profileData?.data?.driver_name}</span>
                  <span>: 0{profileData?.data?.driver_contact}</span>
                  <span>: {profileData?.data?.company_name}</span>
                  <span>: {profileData?.data?.company_address}</span>
                  <span>: {profileData?.data?.reference_name}</span>
                  <span>: {formatDate(profileData?.data?.createdAt)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            {profileData?.data?.vehicles.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] md:text-xl font-semibold">
                    Recent Vehicle{" "}
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center my-3">
                    <div className="cardIcon ">
                      <p className="text-[10px]">
                        {lastVehicle
                          ? `${new Date(lastVehicle?.createdAt).toLocaleString(
                            "en-US",
                            { month: "short" }
                          )}`
                          : "No Invoice"}
                      </p>
                    </div>
                    <div className="ml-3">
                      {lastVehicle && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Vehicle name </b>:{" "}
                          <span className="ml-3">
                            {lastVehicle?.vehicle_name}
                          </span>
                        </div>
                      )}
                      {lastVehicle && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Car Reg no </b>:{" "}
                          <span className="ml-3">
                            {lastVehicle?.fullRegNum}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <b
                    onClick={() => handVehicleDetailsOpen(lastVehicle._id)}
                    className="cursor-pointer"
                  >
                    <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  </b>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center my-3">
                    <div className="cardIcon bg-[#48CAE4]">
                      <p className="text-[10px]">
                        {beforeLastVehicle
                          ? `${new Date(
                            beforeLastVehicle?.createdAt
                          ).toLocaleString("en-US", { month: "short" })}`
                          : "No Vehicle"}
                      </p>
                    </div>
                    <div className="ml-3">
                      {beforeLastVehicle && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Vehicle name </b>:{" "}
                          <span className="ml-3">
                            {beforeLastVehicle?.vehicle_name}
                          </span>
                        </div>
                      )}
                      {beforeLastVehicle && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Car Reg no </b>:{" "}
                          <span className="ml-3">
                            {beforeLastVehicle?.fullRegNum}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <b
                    onClick={() => handVehicleDetailsOpen(lastVehicle._id)}
                    className="cursor-pointer"
                  >
                    <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  </b>
                </div>
              </>
            ) : (
              <h3 className="text-xl flex items-center justify-center h-full font-bold ">
                No Vehicle founds!{" "}
              </h3>
            )}
          </Card>
        </div>
        <div className="justify-between gap-5 flex-col lg:flex-row mt-5 flex">
          <Card>
            {profileData?.data?.jobCards.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] md:text-xl font-semibold">
                    Recent Job Card{" "}
                  </h3>
                  <Link to="/dashboard/create-job-card">
                    {" "}
                    <FaRegEdit className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center my-3">
                    <div className="cardIcon ">
                      <p className="text-[10px]">
                        {lastJobCard
                          ? `${new Date(lastJobCard?.createdAt).toLocaleString(
                            "en-US",
                            { month: "short" }
                          )}`
                          : "No Job Card"}
                      </p>

                      <div>
                        <b>{lastJobCard?.date?.slice(0, 2)}</b>
                      </div>
                    </div>
                    {lastJobCard && (
                      <div className="ml-3 ">
                        <div className="flex items-center ">
                          <b className="recentJobs">Vehicle Name </b>:
                          <small className="ml-3">
                            {lastVehicle?.vehicle_name}
                          </small>
                        </div>

                        <div className="flex items-center">
                          <b className="recentJobs">Job No </b>:
                          <small className="ml-3"> {lastJobCard?.job_no}</small>
                        </div>
                      </div>
                    )}
                  </div>
                  <b className="cursor-pointer">
                    <Link to={`/dashboard/preview?id=${lastJobCard?._id}`}>
                      {" "}
                      <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    </Link>
                  </b>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center my-3">
                    <div className="cardIcon bg-[#48CAE4]">
                      <p className="text-[10px]">
                        {beforeLastJobCard
                          ? `${new Date(
                            beforeLastJobCard?.createdAt
                          ).toLocaleString("en-US", { month: "short" })}`
                          : "No Job Card"}
                      </p>

                      <div>
                        <b>{beforeLastJobCard?.date?.slice(0, 2)}</b>
                      </div>
                    </div>
                    <div className="ml-3">
                      {beforeLastJobCard && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Vehicle Name </b> :
                          <small className="ml-3">
                            {beforeLastVehicle?.vehicle_name}
                          </small>
                        </div>
                      )}
                      {beforeLastJobCard && (
                        <div className="flex items-center">
                          <b className="recentJobs"> Job No </b>:{" "}
                          <small className="ml-3 ">
                            {beforeLastJobCard?.job_no}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                  <b className="cursor-pointer">
                    <Link
                      to={`/dashboard/preview?id=${beforeLastJobCard?._id}`}
                    >
                      {" "}
                      <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    </Link>
                  </b>
                </div>
              </>
            ) : (
              <h3 className="text-xl flex items-center justify-center h-full font-bold ">
                No jobcard founds!{" "}
              </h3>
            )}
          </Card>
          <Card>
            {profileData?.data.quotations?.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] md:text-xl font-semibold">
                    Recent Quotation{" "}
                  </h3>
                  <Link to="/dashboard/create-quotation">
                    {" "}
                    <FaRegEdit className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center my-3">
                    <div className="cardIcon">
                      <p className="text-[10px]">
                        {lastQuotation
                          ? `${new Date(
                            lastQuotation?.createdAt
                          ).toLocaleString("en-US", { month: "short" })}`
                          : "No Quotation"}
                      </p>

                      {lastQuotation && (
                        <div>
                          <b>{lastQuotation?.date?.slice(0, 2)}</b>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      {lastQuotation && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Quotation Number </b>:{" "}
                          <small className="ml-3">
                            {lastQuotation?.job_no}
                          </small>
                        </div>
                      )}
                      {lastQuotation && (
                        <div className="flex items-center">
                          <b className="recentJobs">Vehicle Name</b>:{" "}
                          <small className="ml-3">
                            {lastQuotation?.vehicle?.vehicle_name}
                          </small>
                        </div>
                      )}
                      {lastQuotation && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Total Amount</b>:{" "}
                          <small className="ml-3">
                            ৳{lastQuotation?.net_total}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/quotation-view?id=${lastQuotation?._id}`}
                  >
                    <b className="cursor-pointer">
                      <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    </b>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center my-3">
                    <div className="cardIcon bg-[#48CAE4]">
                      <p className="text-[10px]">
                        {beforeLastQuotation
                          ? `${new Date(
                            beforeLastQuotation?.createdAt
                          ).toLocaleString("en-US", { month: "short" })}`
                          : "No Quotation"}
                      </p>

                      {beforeLastQuotation && (
                        <div>
                          <b>{beforeLastQuotation?.date?.slice(0, 2)}</b>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      {beforeLastQuotation && (
                        <div className="flex items-center">
                          <b className="recentJobs">Quotation Number </b>:{" "}
                          <small className="ml-3">
                            {beforeLastQuotation?.job_no}
                          </small>
                        </div>
                      )}
                      {beforeLastQuotation && (
                        <div className="flex items-center">
                          <b className="recentJobs">Vehicle Name </b>:{" "}
                          <small className="ml-3">
                            {beforeLastQuotation?.vehicle?.vehicle_name}
                          </small>
                        </div>
                      )}
                      {beforeLastQuotation && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Total Amount</b>:{" "}
                          <small className="ml-3">
                            ৳{beforeLastQuotation?.net_total}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/quotation-view?id=${beforeLastQuotation?._id}`}
                  >
                    <b className="cursor-pointer">
                      <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    </b>
                  </Link>
                </div>
              </>
            ) : (
              <h3 className="text-xl flex items-center justify-center h-full font-bold ">
                No Quotation Founds!{" "}
              </h3>
            )}
          </Card>
        </div>
        <div className="justify-between gap-5 flex-col lg:flex-row mt-5 flex">
          <Card>
            {profileData?.data?.invoices?.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Recent Invoice </h3>
                  <Link to="/dashboard/create-invoice">
                    {" "}
                    <FaRegEdit className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center my-3">
                    <div className="cardIcon ">
                      <p className="text-[10px]">
                        {lastInvoice
                          ? `${new Date(lastInvoice?.createdAt).toLocaleString(
                            "en-US",
                            { month: "short" }
                          )}`
                          : "No Invoice"}
                      </p>

                      {lastInvoice && (
                        <div>
                          <b>{lastInvoice?.date?.slice(0, 2)}</b>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      {lastInvoice && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Invoice No </b>:{" "}
                          <span className="ml-3">{lastInvoice?.job_no}</span>
                        </div>
                      )}
                      {lastInvoice && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Vehicle Name </b>:{" "}
                          <span className="ml-3">
                            {lastInvoice?.vehicle?.vehicle_name}
                          </span>
                        </div>
                      )}
                      {lastInvoice && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Total Amount</b>:{" "}
                          <span className="ml-3">
                            ৳{lastInvoice?.net_total}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link to={`/dashboard/detail?id=${lastInvoice?._id}`}>
                    <b className="cursor-pointer">
                      <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    </b>
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center my-3">
                    <div className="cardIcon bg-[#48CAE4]">
                      <p className="text-[10px]">
                        {beforeLastInvoice
                          ? `${new Date(
                            beforeLastInvoice?.createdAt
                          ).toLocaleString("en-US", { month: "short" })}`
                          : "No Invoice"}
                      </p>

                      {beforeLastInvoice && (
                        <div>
                          <b>{beforeLastInvoice?.date?.slice(0, 2)}</b>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      {beforeLastInvoice && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Invoice No </b>:
                          <span className="ml-3">
                            {beforeLastInvoice?.job_no}
                          </span>
                        </div>
                      )}
                      {beforeLastInvoice && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Vehicle Name </b>:{" "}
                          <span className="ml-3">
                            {beforeLastInvoice?.vehicle?.vehicle_name}
                          </span>
                        </div>
                      )}
                      {beforeLastInvoice && (
                        <div className="flex items-center ">
                          <b className="recentJobs">Total Amount</b>:{" "}
                          <span className="ml-3">
                            ৳{beforeLastInvoice?.net_total}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link to={`/dashboard/detail?id=${beforeLastInvoice?._id}`}>
                    <b className="cursor-pointer">
                      <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    </b>
                  </Link>
                </div>
              </>
            ) : (
              <h3 className="text-xl flex items-center justify-center h-full font-bold ">
                No Invoice founds!{" "}
              </h3>
            )}
          </Card>
          <Card>
            {profileData?.data?.money_receipts.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] md:text-xl font-semibold">
                    Recent Money Receipt{" "}
                  </h3>
                  <Link to="/dashboard/money-receive-create">
                    {" "}
                    <FaRegEdit className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center my-3">
                    <div className="cardIcon ">
                      <b className="block"></b>
                      <div>
                        <p className="text-[10px]">
                          {lastMoneyReceipt
                            ? `${new Date(
                              lastMoneyReceipt?.createdAt
                            ).toLocaleString("en-US", { month: "short" })}`
                            : "No Money Receipt"}
                        </p>
                        {lastMoneyReceipt && (
                          <b>{lastMoneyReceipt?.createdAt?.slice(0, 2)}</b>
                        )}
                      </div>
                    </div>
                    <div className="ml-3">
                      {lastMoneyReceipt && (
                        <div>
                          <div className="flex items-center">
                            <b className="recentJobs">Against bill no</b>:
                            <span className="ml-3">
                              {" "}
                              {lastMoneyReceipt?.job_no}
                            </span>
                          </div>
                        </div>
                      )}
                      {lastMoneyReceipt && (
                        <div>
                          <div className="flex items-center">
                            <b className="recentJobs">Remaining </b>:{" "}
                            <small className="ml-3">
                              {" "}
                              ৳{lastMoneyReceipt?.remaining}
                            </small>
                          </div>
                        </div>
                      )}
                      {lastMoneyReceipt && (
                        <div>
                          <div className="flex items-center">
                            <b className="recentJobs">Total Amount </b>:{" "}
                            <small className="ml-3">
                              {" "}
                              ৳{lastMoneyReceipt?.total_amount}
                            </small>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/money-receipt-view?id=${lastMoneyReceipt?._id}`}
                  >
                    <b className="cursor-pointer">
                      <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    </b>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center my-3">
                    <div className="cardIcon bg-[#48CAE4]">
                      <b className="block"></b>
                      <div>
                        <p className="text-[10px]">
                          {beforeLastMoneyReceipt
                            ? `${new Date(
                              beforeLastMoneyReceipt?.createdAt
                            ).toLocaleString("en-US", { month: "short" })}`
                            : "No Money Receipt"}
                        </p>
                        {beforeLastMoneyReceipt && (
                          <b>
                            {beforeLastMoneyReceipt?.createdAt?.slice(0, 2)}
                          </b>
                        )}
                      </div>
                    </div>
                    <div className="ml-3">
                      {beforeLastMoneyReceipt && (
                        <div>
                          <div className="flex items-center">
                            <b className="recentJobs">Against bill no</b>:{" "}
                            <span className="ml-3">
                              {" "}
                              {beforeLastMoneyReceipt?.job_no}
                            </span>
                          </div>
                        </div>
                      )}
                      {beforeLastMoneyReceipt && (
                        <div>
                          <div className="flex items-center">
                            <b className="recentJobs">Remaining</b>:{" "}
                            <small className="ml-3">
                              {" "}
                              ৳{beforeLastMoneyReceipt?.remaining}
                            </small>
                          </div>
                        </div>
                      )}
                      {beforeLastMoneyReceipt && (
                        <div>
                          <div className="flex items-center">
                            <b className="recentJobs">Total Amount </b>:{" "}
                            <small className="ml-3">
                              {" "}
                              ৳{beforeLastMoneyReceipt?.total_amount}
                            </small>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/dashboard/detail?id=${beforeLastMoneyReceipt?._id}`}
                  >
                    <b className="cursor-pointer">
                      <HiOutlineEye className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                    </b>
                  </Link>
                </div>
              </>
            ) : (
              <h3 className="text-xl flex items-center justify-center mb-10 h-full font-bold ">
                No Money Receipt founds!{" "}
              </h3>
            )}
          </Card>
        </div>
      </div>

      {vehicleDetails && (
        <VehicleDetailsModal
          handVehicleDetailsOpen={handVehicleDetailsOpen}
          handleVehicleDetailsClose={handleVehicleDetailsClose}
          getId={getId}
          tenantDomain={tenantDomain}
        />
      )}
    </>
  );
};

export default CustomerAccount;
