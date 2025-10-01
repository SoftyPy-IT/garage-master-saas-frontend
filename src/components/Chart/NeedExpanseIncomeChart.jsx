/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  import { useGetAllQuotationsQuery } from "../../redux/api/quotation";
  import { useGetAllJobCardsQuery } from "../../redux/api/jobCard";
  import { useGetAllInvoicesQuery } from "../../redux/api/invoice";
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "10px",
            border: "1px solid #cccccc",
          }}
        >
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Series1: ${payload[0].value}%`}</p>
          <p className="intro">{`Series2: ${payload[1].value}%`}</p>
          <p className="intro">{`Series3: ${payload[2].value}%`}</p>
        </div>
      );
    }
  
    return null;
  };
  
  export default function ExpanseIncomeChart() {
    const { data: jobCardData } = useGetAllJobCardsQuery({
      limit: 10,
      page: 1,
    });
  
    const { data: qutationData } = useGetAllQuotationsQuery({
      limit: 10,
      page: 1,
    });
  
    const { data: invoiceData } = useGetAllInvoicesQuery({
      limit: 10,
      page: 1,
    });
  
    const data = [
      { name: "Jobcard", series1: 0, series2: 6, series3: 7 },
      { name: "Quotation", series1: 2, series2: 3, series3: 5 },
      { name: "Invoice", series1: 2, series2: 7, series3: 3 },
    ];

    return (
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="series1" stroke="#8884d8" />
          <Line type="monotone" dataKey="series2" stroke="#82ca9d" />
          <Line type="monotone" dataKey="series3" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  