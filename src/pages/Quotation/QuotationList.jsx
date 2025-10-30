import QuotationTable from "./QuotationTable";
const QuotationList = () => {
  const isRecycled = false;
  return (
    <div className="max-w-full">
      <QuotationTable isRecycled={isRecycled} title="Quotation List " />
    </div>
  );
};

export default QuotationList;
