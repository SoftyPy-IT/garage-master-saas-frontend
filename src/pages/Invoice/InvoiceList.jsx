import InvoiceTable from "./InvoiceTable";

const InvoiceList = () => {
  const isRecycled = false;
  return (
    <>
      <InvoiceTable isRecycled={isRecycled} title="Invoice List" />
    </>
  );
};

export default InvoiceList;
