/* eslint-disable react/prop-types */
import Can from "../../components/Can";

const ActionButtons = ({
  isEditMode,
  createLoading,
  updateLoading,

  setGoOtherButton,
  specificQuotation,
}) => {
  return (
    <div className="flex flex-col md:flex-row mt-4 md:mt-8 buttonGroup">
      <div className="flex md:hidden justify-end md:justify-start submitQutationBtn order-2 md:order-3">
        <button type="submit" disabled={createLoading || updateLoading}>
          {isEditMode ? "Update Quotation" : "Add Quotation"}
        </button>
      </div>
      <div className="flex">
        <button type="button" onClick={() => setGoOtherButton("preview")}>
          Preview
        </button>
        <button type="button">Print</button>
        <button type="button" onClick={() => setGoOtherButton("invoice")}>
          Invoice
        </button>
        {isEditMode && (
          <a
            className="bg-[#42A0D9] text-white px-3 py-2 rounded-full"
            href={`${import.meta.env.VITE_API_URL}/quotations/quotation/${
              specificQuotation?._id
            }`}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
        )}
      </div>
      <div className="hidden md:flex justify-end md:justify-start submitQutationBtn order-2 md:order-3">
        <Can
          page={
            isEditMode
              ? "/dashboard/update-quotation"
              : "/dashboard/create-quotation"
          }
          action={isEditMode ? "edit" : "create"}
        >
          <button type="submit" disabled={createLoading || updateLoading}>
            {isEditMode ? "Update Quotation" : "Add Quotation"}
          </button>
        </Can>
      </div>
    </div>
  );
};

export default ActionButtons;
