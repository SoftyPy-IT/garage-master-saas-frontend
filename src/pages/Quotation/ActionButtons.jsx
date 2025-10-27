/* eslint-disable react/prop-types */
import Can from "../Can";

const ActionButtons = ({
    onSubmit,
    onPreview,
    onPrint,
    onInvoice,
    isLoading = false,
    quotationId,
    tenantDomain,
    mode = "create",
    permissionPage = "/dashboard/create-quotation",
    permissionAction = "create"
}) => {
    const getSubmitButtonText = () => {
        return mode === "create" ? "Add Quotation" : "Update Quotation";
    };

    return (
        <div className="flex flex-col md:flex-row mt-4 md:mt-8 buttonGroup">
            <div className="flex md:hidden justify-end md:justify-start submitQutationBtn order-2 md:order-3">
                <Can page={permissionPage} action={permissionAction}>
                    <button type="button" onClick={onSubmit} disabled={isLoading}>
                        {getSubmitButtonText()}
                    </button>
                </Can>
            </div>

            <div className="flex">
                <button type="button" onClick={onPreview}>Preview</button>
                <button type="button" onClick={onPrint}>Print</button>
                <button type="button" onClick={onInvoice}>Invoice</button>
                {quotationId && (
                    <a
                        className="bg-[#42A0D9] text-white px-3 py-2 rounded-full mx-2"
                        href={`${import.meta.env.VITE_API_URL}/quotations/quotation/${quotationId}?tenantDomain=${tenantDomain}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Download
                    </a>
                )}
            </div>

            <div className="hidden md:flex justify-end md:justify-start submitQutationBtn order-2 md:order-3">
                <Can page={permissionPage} action={permissionAction}>
                    <button type="button" onClick={onSubmit} disabled={isLoading}>
                        {getSubmitButtonText()}
                    </button>
                </Can>
            </div>
        </div>
    );
};

export default ActionButtons;