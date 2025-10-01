/* eslint-disable react/prop-types */
import { IoCloseSharp } from "react-icons/io5";
import JobCardForm from "./JobCardForm";

const AddVehicleModal = ({ tenantDomain, onClose, reload, setReload, id, user_type, vehicleData }) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white shadow-md  rounded-xl p-3 max-w-full 
        w-[75%] sm:w-[80%] md:w-[470px] lg:w-[870px] max-h-[90vh] flex flex-col"
      >
        <div className="flex justify-end">
          <IoCloseSharp
            size={25}
            onClick={onClose}
            className="text-white rounded-full cursor-pointer bg-[#A0A0A0] p-1"
          />
        </div>
        <div className="overflow-y-auto flex-grow">
          <JobCardForm
          vehicleData={vehicleData}
            tenantDomain={tenantDomain}
            user_type={user_type}
            id={id}
            onClose={onClose}
            setReload={setReload}
            reload={reload}
          />
        </div>
      </div>
    </div>
  );
};


export default AddVehicleModal;
