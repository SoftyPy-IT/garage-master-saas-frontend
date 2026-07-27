import { useAppOptions } from "../../hooks/useAppOptions";
import {
  useMoveRecycledQuotationMutation,
  useRestoreFromPendingQuotationMutation,
} from "../../redux/api/quotation";
import QuotationTable from "./QuotationTable";
import swal from "sweetalert";

const PendingQuotation = () => {
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  const [moveRecycledQuotation] = useMoveRecycledQuotationMutation();
  const [restoreFromPendingQuotation] = useRestoreFromPendingQuotationMutation();

  const handleMoveToRecycled = async (id) => {
    performActionWithPermission(
      "/dashboard/quotation-list",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "You want to move this quotation to Recycle Bin?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await moveRecycledQuotation({ tenantDomain, id }).unwrap();
            swal("Moved!", "Quotation moved to Recycle Bin.", "success");
          } catch (error) {
            swal("Error", "Failed to move quotation.", "error");
          }
        }
      },
      "You don't have permission to delete this quotation",
    );
  };

  const handleRestoreFromPending = async (id) => {
    const willRestore = await swal({
      title: "Are you sure?",
      text: "You want to restore this quotation to the main list?",
      icon: "warning",
      buttons: true,
    });

    if (willRestore) {
      try {
        await restoreFromPendingQuotation({ tenantDomain, id }).unwrap();
        swal("Restored!", "Quotation restored to main list.", "success");
      } catch (error) {
        swal(
          "Error",
          error?.data?.message || "Failed to restore quotation.",
          "error",
        );
      }
    }
  };

  return (
    <div className="max-w-full">
      <QuotationTable
        isRecycled={false}
        isPendingList={true}
        title="Pending Quotation List"
        handleMoveAction={handleMoveToRecycled}
        handlePendingAction={handleRestoreFromPending}
      />
    </div>
  );
};

export default PendingQuotation;
