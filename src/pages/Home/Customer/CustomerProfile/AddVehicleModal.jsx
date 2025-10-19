/* eslint-disable react/prop-types */
import JobCardForm from "./JobCardForm";
import GarageModal from "../../../../components/Share/Modal/GarageModal";

const AddVehicleModal = ({ setOpen, open, performActionWithPermission, tenantDomain, onClose, reload, setReload, id, user_type, vehicleData }) => {
  const title = 'Create Vehicle'
  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title={title}
      maxWidth="sm"
    >

      <JobCardForm
        performActionWithPermission={performActionWithPermission}
        vehicleData={vehicleData}
        tenantDomain={tenantDomain}
        user_type={user_type}
        id={id}
        onClose={onClose}
        setReload={setReload}
        reload={reload}
      />
    </GarageModal>
  );
};


export default AddVehicleModal;
