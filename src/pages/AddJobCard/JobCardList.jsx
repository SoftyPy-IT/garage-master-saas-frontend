import { useMovetoRecyclebinJobCardMutation } from "../../redux/api/jobCard";
import JobCardTable from "./JobCardTable";
import swal from "sweetalert";
import { useTenantDomain } from "../../hooks/useTenantDomain";

const JobCardList = () => {
  const { tenantDomain } = useTenantDomain();
  const [movetoRecyclebinJobCard, { isLoading: movedLoading }] =
    useMovetoRecyclebinJobCardMutation();

  const handleMoveToRecycled = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to move this jobcard to Recycle bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await movetoRecyclebinJobCard({ tenantDomain, id }).unwrap();
        swal("Moved!", "Job card moved to Recycle bin.", "success");
      } catch (error) {
        swal("Error", "An error occurred while moving the job card.", "error");
      }
    }
  };

  return (
    <JobCardTable
      movedLoading={movedLoading}
      title="Job Card List"
      handleMoveToRecycled={handleMoveToRecycled}
      isRecycled={false}
    />
  );
};

export default JobCardList;
