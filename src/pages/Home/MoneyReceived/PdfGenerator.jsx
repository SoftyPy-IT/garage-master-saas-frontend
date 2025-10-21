/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Email, Home, WhatsApp, LocalPhone } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../../public/assets/logo.png";
import "./MoneyReceived.css";
import "./PrintStyle.css";
import { useGetSingleMoneyReceiptQuery } from "../../../redux/api/money-receipt";
import Loading from "../../../components/Loading/Loading";
import { Button } from "@mui/material";
import { useGetCompanyProfileQuery } from "../../../redux/api/companyProfile";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
const PdfGenerator = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");

  const { tenantDomain } = useTenantDomain();
  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });
  const companyProfileData = {
    companyName: CompanyInfoData?.data?.companyName,
    address: CompanyInfoData?.data?.address,
    website: CompanyInfoData?.data?.website,
    phone: CompanyInfoData?.data?.phone,
    email: CompanyInfoData?.data?.email,
    logo: CompanyInfoData?.data?.logo[0],
    companyNameBN: CompanyInfoData?.data?.companyNameBN,
  };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { data: singleMoneyReceipt, isLoading } = useGetSingleMoneyReceiptQuery(
    {
      tenantDomain,
      id,
    }
  );


  if (isLoading) {
    return <Loading />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <section className="viewMoneyReceiptWrap">
      <div className="moneyWraps">
        <div id="content-id">
          <div ref={componentRef} className="moneyFormWrap">
            <div className="flex items-center justify-between  lg:flex-row gap-3">
              <div className="logoWrap logoWrap2">
                <img
                  className=""
                  src={CompanyInfoData?.data?.logo}
                  alt="logo"
                />
              </div>

              <div className="moneyHead moneyHead2">
                <div className="flex-1 text-center">
                  <h2 className="text-3xl">
                    {CompanyInfoData?.data?.companyNameBN}
                  </h2>
                  <h3 className="text-lg md:text-xl english-font mt-1 text-[#4671A1] font-bold">
                    ({CompanyInfoData?.data?.companyName})
                  </h3>
                </div>
                <span className="mt-5 block">
                  It's trusted computerized Organization for all kinds of
                  vehicle Cheque up & maintenance such as computerized Engine
                  Analysis, Engine tune up, Denting, Painting, Engine, AC,
                  Electrical Works & Car Wash.{" "}
                </span>
              </div>
              <div className="hotlineWrap">
                <div className="flex items-center">
                  <LocalPhone className="hotlineIcon" />
                  <small>{CompanyInfoData?.data?.phone}</small>
                </div>
                <div className="flex items-center">
                  <Email className="hotlineIcon" />
                  <small>{CompanyInfoData?.data?.email}</small>
                </div>
                <div className="flex items-center">
                  <Home className="hotlineIcon"> </Home>
                  <small>{CompanyInfoData?.data?.address}</small>
                </div>
                <div className="flex items-center">
                  <WhatsApp className="hotlineIcon" />
                  <small>{CompanyInfoData?.data?.whatsapp}</small>
                </div>
              </div>
            </div>
            <div className="receivedBtn2 mt-2">
              <button className="print-button">Money Receipt</button>
            </div>

            <div className="flex justify-between ">
              <small>
                Money Receipt ID : {singleMoneyReceipt?.data?.moneyReceiptId}{" "}
              </small>
              <small>
                Date : {formatDate(singleMoneyReceipt?.data?.default_date)}{" "}
              </small>
            </div>
            <div className="allInputWraps">
              <div className=" payAdvance mt-2">
                <div className="flex items-center justify-center receivedField ">
                  <label className="receivedMoneyText2 capitalize">
                    Received with thanks from :
                  </label>

                  <span className="text-sm capitalize">
                    {singleMoneyReceipt?.data?.thanks_from}
                  </span>
                </div>
              </div>

              <div className=" payAdvance mt-2">
                <div className="flex items-center justify-center  receivedField">
                  {singleMoneyReceipt?.data?.against_bill_no_method ===
                    "Advance against bill no" ? (
                    <label className="advance2 capitalize">
                      {singleMoneyReceipt?.data?.against_bill_no_method} :
                    </label>
                  ) : (
                    <label className="againstBillText capitalize">
                      {singleMoneyReceipt?.data?.against_bill_no_method} :
                    </label>
                  )}
                  <span className="text-sm">
                    {singleMoneyReceipt?.data?.invoice?.invoice_no}
                  </span>
                </div>
                <div className="flex items-center justify-center receivedField">
                  <label className="vehicleText2">Vehicle No : </label>
                  <span className="text-sm">
                    {singleMoneyReceipt?.data?.vehicle?.fullRegNum}
                  </span>{" "}
                </div>
              </div>
              <div className=" payAdvance mt-2">
                <div className="flex items-center justify-center receivedField">
                  <label className="paymentText">Payment Method : </label>
                  <span className="text-sm">
                    {singleMoneyReceipt?.data?.payment_method === "Bkash"
                      ? "Bkash"
                      : singleMoneyReceipt?.data?.payment_method === "Nagad"
                        ? "Nagad"
                        : singleMoneyReceipt?.data?.payment_method === "Rocket"
                          ? "Rocket"
                          : singleMoneyReceipt?.data?.payment_method ===
                            "Bank Transfer"
                            ? "Bank Transfer"
                            : singleMoneyReceipt?.data?.payment_method === "Check"
                              ? "Cheque"
                              : singleMoneyReceipt?.data?.payment_method === "Other"
                                ? "Other"
                                : singleMoneyReceipt?.data?.payment_method === "Cash"
                                  ? "Cash"
                                  : ""}
                  </span>
                </div>
              </div>

              <div className="payAdvance mt-2">
                <div className="flex items-center justify-center  receivedField ">
                  <label className="text-[11px] text-capitalize">
                    {singleMoneyReceipt?.data?.payment_method === "Bkash" ? (
                      <small className="rocketNumber text-sm">
                        Bkash Number :
                      </small>
                    ) : singleMoneyReceipt?.data.payment_method === "Nagad" ? (
                      <small className="rocketNumber text-sm">
                        Nagad Number :
                      </small>
                    ) : singleMoneyReceipt?.data.payment_method === "Rocket" ? (
                      <small className="rocketNumber text-sm">
                        Rocket Number :
                      </small>
                    ) : singleMoneyReceipt?.data.payment_method === "Check" ? (
                      <small className="accountNumber text-sm">
                        Cheque Number :
                      </small>
                    ) : singleMoneyReceipt?.data.payment_method ===
                      "Bank Transfer" ? (
                      <small className="accountNumber text-sm">
                        Account No :
                      </small>
                    ) : singleMoneyReceipt?.data.payment_method === "Cash" ? (
                      <small className="chas_by text-sm">Case By :</small>
                    ) : null}
                  </label>
                  {(singleMoneyReceipt?.data?.payment_method === "Bkash" ||
                    singleMoneyReceipt?.data?.payment_method === "Nagad" ||
                    singleMoneyReceipt?.data?.payment_method === "Rocket" ||
                    singleMoneyReceipt?.data?.payment_method ===
                    "Bank Transfer") && (
                      <span className="text-sm">
                        {singleMoneyReceipt?.data?.account_number}
                      </span>
                    )}
                  {singleMoneyReceipt?.data?.payment_method === "Cash" && (
                    <span className="text-sm ">
                      {singleMoneyReceipt?.data?.cash_by}
                    </span>
                  )}
                  {singleMoneyReceipt?.data?.payment_method === "Check" && (
                    <span className="text-sm">
                      {singleMoneyReceipt?.data?.check_number}
                    </span>
                  )}
                </div>
                {singleMoneyReceipt?.data?.payment_method === "Check" ? (
                  <div className="flex items-center justify-center receivedField ">
                    <label className="checkDate">Cheque Date : </label>
                    <span className="text-sm">
                      {singleMoneyReceipt?.data?.check_date}
                    </span>
                  </div>
                ) : (
                  <div className="flex  items-center justify-center receivedField">
                    <label className="date"> Date : </label>
                    <span className="text-sm">
                      {formatDate(singleMoneyReceipt?.data?.date)}
                    </span>
                  </div>
                )}
              </div>
              <div className=" payAdvance mt-2">
                <div className="flex items-center justify-between receivedField">
                  <div>
                    <>
                      {(singleMoneyReceipt?.data?.payment_method === "Bkash" ||
                        singleMoneyReceipt?.data?.payment_method === "Nagad" ||
                        singleMoneyReceipt?.data?.payment_method === "Rocket" ||
                        singleMoneyReceipt?.data?.payment_method ===
                        "Bank Transfer") && (
                          <label className="transactionId capitalize">
                            Transaction ID :
                          </label>
                        )}
                      {singleMoneyReceipt?.data?.payment_method === "Check" && (
                        <label className="bankName">Bank Name : </label>
                      )}
                    </>
                  </div>
                  <>
                    {(singleMoneyReceipt?.data?.payment_method === "Bkash" ||
                      singleMoneyReceipt?.data?.payment_method === "Nagad" ||
                      singleMoneyReceipt?.data?.payment_method === "Rocket" ||
                      singleMoneyReceipt?.data?.payment_method ===
                      "Bank Transfer") && (
                        <span className="text-sm ">
                          {singleMoneyReceipt?.data?.transaction_id}
                        </span>
                      )}
                    {singleMoneyReceipt?.data?.payment_method === "Check" && (
                      <span className="text-sm">
                        {singleMoneyReceipt?.data?.bank_name}
                      </span>
                    )}
                  </>
                </div>

                {singleMoneyReceipt?.data?.payment_method === "Check" && (
                  <div className="flex items-center justify-center receivedField">
                    <label className="paymentDate">Payment Date : </label>
                    <span className="text-sm">
                      {singleMoneyReceipt?.data?.payment_date}
                    </span>
                  </div>
                )}
              </div>
              <div className="amount flex items-center justify-between mt-2">
                <div className="flex  items-center justify-center ">
                  <label className="totalAmountText">Total Amount Tk :</label>
                  <input
                    readOnly
                    type="text"
                    defaultValue={singleMoneyReceipt?.data?.total_amount}
                  />
                </div>
                <>
                  {singleMoneyReceipt?.data?.against_bill_no_method ===
                    "Advance against bill no" ? (
                    <>
                      {singleMoneyReceipt?.data?.advance && (
                        <div className="flex items-center justify-center receivedField">
                          <label className="">Advance :</label>
                          <input
                            readOnly
                            type="text"
                            defaultValue={singleMoneyReceipt?.data?.advance}
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-center receivedField">
                        <div className="flex">
                          {singleMoneyReceipt?.data?.against_bill_no_method ===
                            "Advance against bill no" ? (
                            <label className="">Remaining :</label>
                          ) : (
                            <label className="">Paid :</label>
                          )}
                        </div>

                        <input
                          readOnly
                          type="text"
                          defaultValue={singleMoneyReceipt?.data?.remaining}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center receivedField">
                      <label className="flex">
                        {singleMoneyReceipt?.data?.against_bill_no_method ===
                          "Advance against bill no"
                          ? "Remaining"
                          : "Paid"}{" "}
                        :
                      </label>
                      <input
                        readOnly
                        type="text"
                        defaultValue={singleMoneyReceipt?.data?.advance}
                      />
                    </div>
                  )}
                </>
              </div>
              <div className="wordTaka mt-2 receivedField flex items-center justify-center">
                <label className="tkText capitalize ">in word (taka) :</label>
                <span className="text-[12px]">
                  {singleMoneyReceipt?.data?.advance_in_words}
                </span>
              </div>
            </div>

            <div className="flex justify-between mt-16 mb-5 text-[12px] ">
              <div className="text-center signature">
                <div className="border-t border-black pt-1 mx-auto w-48">
                  Client Signature
                </div>
              </div>
              <div className="text-center signature">
                <div className="border-t border-black pt-1 mx-auto w-48">
                  Authorized Signature
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="moneyReceiptBtnGroup mt-5 gap-x-2">
        <button onClick={handlePrint}>Print </button>
        {singleMoneyReceipt?.data?._id && (
          <a
            className="bg-[#82017F] text-white px-3 py-2 text-[12px] rounded-full mr-2"
            href={`${import.meta.env.VITE_API_URL}/money-receipts/money/${singleMoneyReceipt.data._id
              }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
                JSON.stringify(companyProfileData)
              )}`}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
        )}
        <Link to={`/dashboard/money-receipt-update?id=${id}`}>
          <Button> Edit </Button>
        </Link>
      </div>
    </section>
  );
};

export default PdfGenerator;
