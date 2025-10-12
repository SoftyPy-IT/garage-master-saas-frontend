/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from "react";
import logo from "../../../../public/assets/logo.png";
import { useReactToPrint } from "react-to-print";
import { usePDF } from "react-to-pdf";
import { Link, useLocation, useNavigate } from "react-router-dom";


const ViewExpense = () => {
  const componentRef = useRef();
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const navigate = useNavigate();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [invoicePreview, setInvoicePreview] = useState({});
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/invoice/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setInvoicePreview(data);
          setLoading(false);
          const p = Math.ceil(data?.input_data?.length / 20);
          const arr = Array.from({ length: p }, (_, index) => index + 1);

          setPages(arr);
        });
    }
  }, [id]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;
  const itemsPerPages = 24;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const secondEndIndex = startIndex + itemsPerPages;

  const firstPageData = invoicePreview?.input_data?.slice(startIndex, endIndex);

  // Calculate the start index for the second page
  const secondPageStartIndex = endIndex;
  const secondPageData = invoicePreview?.input_data?.slice(
    secondPageStartIndex,
    secondPageStartIndex + itemsPerPages
  );

  // Calculate the start index for the third page
  const thirdPageStartIndex = secondPageStartIndex + itemsPerPage;
  const thirdPageData = invoicePreview?.input_data?.slice(
    thirdPageStartIndex,
    thirdPageStartIndex + itemsPerPages
  );

  // Calculate the start index for the fourth page
  const fourthPageStartIndex = thirdPageStartIndex + itemsPerPage;
  const fourthPageData = invoicePreview?.input_data?.slice(
    fourthPageStartIndex,
    fourthPageStartIndex + itemsPerPages
  );

  // Calculate the start index for the fifth page
  const fifthPageStartIndex = fourthPageStartIndex + itemsPerPage;
  const fifthPageData = invoicePreview?.input_data?.slice(
    fifthPageStartIndex,
    fifthPageStartIndex + itemsPerPages
  );

  // Calculate the start index for the sixth page
  const sixthPageStartIndex = fifthPageStartIndex + itemsPerPage;
  const sixthPageData = invoicePreview?.input_data?.slice(
    sixthPageStartIndex,
    sixthPageStartIndex + itemsPerPage
  );

  const lastValue = pages[pages.length - 1];

  const amountInWords = (amount) => {
    const numberWords = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tensWords = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convertLessThanOneThousand = (num) => {
      if (num === 0) {
        return "";
      }

      let result = "";

      if (num >= 100) {
        result += numberWords[Math.floor(num / 100)] + " Hundred ";
        num %= 100;
      }

      if (num >= 20) {
        result += tensWords[Math.floor(num / 10)] + " ";
        num %= 10;
      }

      if (num > 0) {
        result += numberWords[num] + " ";
      }

      return result;
    };

    const convert = (num) => {
      if (num === 0) {
        return "Zero";
      }

      let result = "";

      let integerPart = Math.floor(num);
      const decimalPart = Math.round((num - integerPart) * 100);

      if (integerPart >= 10000000) {
        result +=
          convertLessThanOneThousand(Math.floor(integerPart / 10000000)) +
          "Crore ";
        integerPart %= 10000000;
      }

      if (integerPart >= 100000) {
        result +=
          convertLessThanOneThousand(Math.floor(integerPart / 100000)) +
          "Lakh ";
        integerPart %= 100000;
      }

      if (integerPart >= 1000) {
        result +=
          convertLessThanOneThousand(Math.floor(integerPart / 1000)) +
          "Thousand ";
        integerPart %= 1000;
      }

      result += convertLessThanOneThousand(integerPart);

      if (decimalPart > 0) {
        result +=
          "Taka " +
          " " +
          "and" +
          " " +
          convertLessThanOneThousand(decimalPart) +
          "Paisa ";
      } else {
        result += "Taka";
      }

      return result;
    };

    const takaInWords = convert(amount);
    return `${takaInWords} only`
  };

  const totalAmountInWords = amountInWords(invoicePreview.total_amount);

  return (
    <div ref={componentRef} className="h-screen">
      {pages.length > 0 &&
        pages.map((page) => (
          <main ref={targetRef} key={page} className="invoicePrintWrap">
            <div>
              <div className="pb-5 px-14 invoicePrint">
                <div>
                  <div className=" mb-2 mx-auto text-center border-b-2 border-[#351E98] pb-2">
                    <div className="flex items-center justify-between w-full mt-5 mb-2">
                      <img className="w-[120px] " src={logo} alt="logo" />
                      <div>
                        <h2 className="trustAutoTitle qoutationTitle">Garage Master </h2>
                        <small className="block">Office: Ka-93/4/C, Kuril Bishawroad, Dhaka-1229</small>
                      </div>
                      <div className="text-left">
                        <small className="block"><small className="font-bold">Mobile:</small> 345689789666</small>
                        <small className="block"><small className="font-bold">Email:</small> trustautosolution@gmail.com</small>
                        <small className="block font-bold ">trustautosolution.com</small>
                      </div>
                    </div>

                  </div>
                  {page === 1 && (
                    <div className="px-10">
                      <div className="flex text-[12px] items-center justify-between border-b-2 pb-1 border-[#351E98]">
                        <span>  <b>Customer ID:</b> TSA001</span>
                        <b className="mr-5 uppercase">Invoice</b>
                        <b>Date: {invoicePreview?.date} </b>
                      </div>

                      <div className="flex items-center justify-between mx-auto mt-2 invoiceInformaiton">
                        <div className="flex justify-between w-[40%]">
                          <div className="invoiceCustomerInfo">
                            <b>SL NO</b>
                            <b>Company</b>
                            <b>Customer</b>
                            <b>Phone</b>
                            <b>Address</b>
                          </div>
                          <div className="invoiceCustomerInfo">
                            <small>: 03</small>
                            <small>: SoftyPy PVT LTD </small>
                            <small>: Customer</small>
                            <small>: 3456789044</small>
                            <small>: Kuril Bishawroad </small>
                          </div>
                        </div>
                        <div className="invoiceLine"></div>
                        <div className="flex w-[40%] justify-between ">
                          <div className="invoiceCustomerInfo">
                            <b>Registration No </b>
                            <b>Chassis No </b>
                            <b>Engine & CC </b>
                            <b>Vehicle Name </b>
                            <b>Mileage </b>
                          </div>
                          <div className="invoiceCustomerInfo">
                            <small>: 03566666</small>
                            <small>: 85456 </small>
                            <small>: 456</small>
                            <small>: 3454</small>
                            <small>: 765</small>
                          </div>
                        </div>

                      </div>


                    </div>
                  )}

                  <table className="mt-5 invoiceTable2 qutationTables">
                    <thead className="tableWrap">
                      <tr>
                        <th className="serialNo">SL No</th>
                        <th>Description</th>
                        <th>Quantity </th>
                        <th>Rate</th>
                        <th>Amount </th>
                      </tr>
                    </thead>
                    <tbody>
                      {page === 1 && (
                        <>
                          {firstPageData
                            ?.slice(startIndex, endIndex)
                            .map((data, index) => (
                              <tr key={data._id}>
                                <td>{startIndex + index + 1}</td>
                                <td>{data.description}</td>
                                <td>{data.quantity}</td>
                                <td>{data.rate}</td>
                                <td>{data.total}</td>
                              </tr>
                            ))}
                        </>
                      )}
                      {page === 2 && (
                        <>
                          {secondPageData
                            ?.slice(startIndex, secondEndIndex)
                            .map((data, index) => (
                              <tr key={data._id}>
                                <td>{index + 21}</td>
                                <td>{data.description}</td>
                                <td>{data.quantity}</td>
                                <td>{data.rate}</td>
                                <td>{data.total}</td>
                              </tr>
                            ))}
                        </>
                      )}
                      {page === 3 && (
                        <>
                          {thirdPageData
                            ?.slice(startIndex, secondEndIndex)
                            .map((data, index) => (
                              <tr key={data._id}>
                                <td>{index + 45}</td>
                                <td>{data.description}</td>
                                <td>{data.quantity}</td>
                                <td>{data.rate}</td>
                                <td>{data.total}</td>
                              </tr>
                            ))}
                        </>
                      )}
                      {page === 4 && (
                        <>
                          {fourthPageData
                            ?.slice(startIndex, secondEndIndex)
                            .map((data, index) => (
                              <tr key={data._id}>
                                <td>{index + 69}</td>
                                <td>{data.description}</td>
                                <td>{data.quantity}</td>
                                <td>{data.rate}</td>
                                <td>{data.total}</td>
                              </tr>
                            ))}
                        </>
                      )}
                      {page === 5 && (
                        <>
                          {fifthPageData
                            ?.slice(startIndex, secondEndIndex)
                            .map((data, index) => (
                              <tr key={data._id}>
                                <td>{index + 93}</td>
                                <td>{data.description}</td>
                                <td>{data.quantity}</td>
                                <td>{data.rate}</td>
                                <td>{data.total}</td>
                              </tr>
                            ))}
                        </>
                      )}
                      {page === 6 && (
                        <>
                          {sixthPageData
                            ?.slice(startIndex, endIndex)
                            .map((data, index) => (
                              <tr key={data._id}>
                                <td>{index + 113}</td>
                                <td>{data.description}</td>
                                <td>{data.quantity}</td>
                                <td>{data.rate}</td>
                                <td>{data.total}</td>
                              </tr>
                            ))}
                        </>
                      )}

                    </tbody>
                  </table>
                  <div className="flex justify-between items-end mt-3 border-b-[1px] pb-3 border-[#ddd]">
                    <div className="mt-5 text-[12px]">
                      <b className="">In words:</b>{" "}
                      {totalAmountInWords}
                    </div>
                    <div className="flex netTotalAmounts">
                      <div className="">
                        <b> Total Amount </b>
                        <b> Discount </b>
                        <b> VAT </b>
                        <b> Net Total </b>
                        <b> Advance</b>
                        <b> Due </b>
                      </div>
                      <div>
                        <small> : 57896</small>
                        <small> : 5%</small>
                        <small> : 56</small>
                        <small> : 57896</small>
                        <small> : 57896</small>
                        <small> : 57896</small>
                      </div>
                    </div>
                  </div>
                </div>


                <div>
                  {page === lastValue && (
                    <div className="customerSignatureWrap">
                      <b className="text-sm customerSignatur">
                        Customer Signature :{" "}
                      </b>
                      <b className="text-sm customerSignatur">Garage Master</b>
                    </div>
                  )}

                </div>

              </div>
            </div>
            {page === lastValue && (
              <div className="printInvoiceBtnGroup">
                <button onClick={handlePrint}>Print </button>
                <button onClick={() => toPDF()}>Pdf </button>

                <Link to="/dashboard/create-invoice">
                  <button> Edit </button>
                </Link>

                <Link to="/dashboard/create-quotation">
                  {" "}
                  <button> Qutation </button>
                </Link>
              </div>
            )}
          </main>
        ))}
    </div>
  );
};

export default ViewExpense;