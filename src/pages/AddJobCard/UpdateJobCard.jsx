/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useAppOptions } from "../../hooks/useAppOptions";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { useGetSingleJobCardQuery, useUpdateJobCardMutation } from "../../redux/api/jobCard";
import Loading from "../../components/Loading/Loading";
import BaseJobCard from "./BaseJobCard";
import { USER_TYPES } from "../../config/jobCardFormConfig";
import { getFormattedDate } from "../../constant/jobCard";

const UpdateJobCard = () => {
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = useAppOptions();
  const location = useNavigate();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const userTypeFromProfile = new URLSearchParams(location.search).get("user_type");
  const userFromProfile = new URLSearchParams(location.search).get("user");

  const [clickControl, setClickControl] = useState(null);
  const [getDataWithChassisNo, setGetDataWithChassisNo] = useState("");

  const { data: CompanyInfoData } = useGetCompanyProfileQuery({ tenantDomain });
  const [updateJobCard, { isLoading: updateJobCardLoading }] = useUpdateJobCardMutation();

  const { data, isLoading, refetch } = useGetSingleJobCardQuery({
    tenantDomain,
    id,
  });

  const singleCard = data?.data;

  console.log('single job card', singleCard )

  const handleSubmitJobCard = async (data) => {
    return performActionWithPermission(
      '/dashboard/update-jobcard',
      'edit',
      async () => {
        const toastId = toast.loading("Updating Jobcard...");

        try {
          const updatedCard = prepareUpdateData(data);
          const res = await updateJobCard(updatedCard).unwrap();

          if (res.success) {
            toast.success(res.message);
            handleNavigation(res.data);
            refetch();
          }
        } catch (err) {
          toast.error(err?.data?.message || "Something went wrong!");
        } finally {
          toast.dismiss(toastId);
        }
      },
      "You don't have permission to edit job card"
    );
  };

  const prepareUpdateData = (data) => {
    const userType = singleCard?.user_type || USER_TYPES.CUSTOMER;
    const formattedDate = getFormattedDate();

    // Prepare user data based on user type
    const userData = prepareUserUpdateData(data, userType);

    // Prepare vehicle data
    const vehicle = prepareVehicleUpdateData(data);

    // Prepare job card data
    const jobCard = prepareJobCardUpdateData(data, formattedDate);

    return {
      tenantDomain: tenantDomain,
      id,
      data: {
        ...userData,
        vehicle,
        jobCard: {
          ...jobCard,
          user_type: userType,
          Id: singleCard?.Id || data.Id,
        }
      }
    };
  };

  const prepareUserUpdateData = (data, userType) => {
    const baseData = {
      company_name: data.company_name,
      vehicle_username: data.vehicle_username,
      company_address: data.company_address,
      driver_name: data.driver_name,
      driver_contact: data.driver_contact,
      driver_country_code: data.driver_country_code,
      reference_name: data.reference_name,
    };

    const userTypeData = {
      [USER_TYPES.CUSTOMER]: {
        customer: {
          ...baseData,
          customer_name: data.customer_name,
          customer_contact: data.customer_contact,
          customer_country_code: data.customer_country_code,
          customer_email: data.customer_email,
          customer_address: data.customer_address,
          customerOwnerPhone: data.customerOwnerPhone,
          customerOwnerName: data.customerOwnerName,
          customerOwnerCountryCode: data.customerOwnerCountryCode,
        }
      },
      [USER_TYPES.COMPANY]: {
        company: {
          ...baseData,
          company_contact: data.company_contact,
          company_country_code: data.company_country_code,
          company_email: data.company_email,
          customer_address: data.customer_address,
          companyOwnerPhone: data.companyOwnerPhone,
          companyOwnerName: data.companyOwnerName,
          companyOwnerCountryCode: data.companyOwnerCountryCode,
        }
      },
      [USER_TYPES.SHOWROOM]: {
        showroom: {
          showRoom_name: data.showRoom_name,
          vehicle_username: data.vehicle_username,
          showRoom_address: data.showRoom_address,
          company_name: data.company_name,
          company_contact: data.company_contact,
          company_country_code: data.company_country_code,
          company_email: data.company_email,
          company_address: data.company_address,
          driver_name: data.driver_name,
          driver_contact: data.driver_contact,
          driver_country_code: data.driver_country_code,
          reference_name: data.reference_name,
        }
      }
    };

    return userTypeData[userType] || userTypeData[USER_TYPES.CUSTOMER];
  };

  const prepareVehicleUpdateData = (data) => {
    const existingMileageHistory = getDataWithChassisNo?.mileageHistory || singleCard?.vehicle?.mileageHistory || [];

    return {
      carReg_no: data.carReg_no,
      car_registration_no: data.car_registration_no,
      chassis_no: data.chassis_no,
      engine_no: data.engine_no,
      vehicle_brand: data.vehicle_brand,
      vehicle_name: data.vehicle_name,
      vehicle_model: Number(data.vehicle_model),
      vehicle_category: data.vehicle_category,
      color_code: data.color_code,
      mileageHistory: existingMileageHistory,
      fuel_type: data.fuel_type,
    };
  };

  const prepareJobCardUpdateData = (data, formattedDate) => ({
    job_no: singleCard?.job_no,
    date: formattedDate,
    vehicle_interior_parts: data.vehicle_interior_parts,
    reported_defect: data.reported_defect,
    reported_action: data.reported_action,
    note: data.note,
    vehicle_body_report: data.vehicle_body_report,
    technician_name: data.technician_name,
    technician_signature: data.technician_signature,
    technician_date: data.technician_date,
    vehicle_owner: data.vehicle_owner,
    mileage: Number(data.mileage),
  });

  const handleNavigation = (data) => {
    const navigationMap = {
      "preview": `/dashboard/preview?id=${data._id}`,
      "quotation": `/dashboard/create-quotation?order_no=${data.job_no}`,
      "invoice": `/dashboard/create-invoice?order_no=${data.job_no}`,
      "null": "/dashboard/jobcard-list"
    };

    if (clickControl === null && !userTypeFromProfile) {
      navigate("/dashboard/jobcard-list");
    } else if (clickControl === null && userTypeFromProfile) {
      navigate(`/dashboard/${userTypeFromProfile}-profile?id=${userFromProfile}`);
    } else {
      navigate(navigationMap[clickControl] || navigationMap["null"]);
    }
  };

  const handleChassisChange = (vehicleData) => {
    setGetDataWithChassisNo(vehicleData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-xl">
        <Loading />
      </div>
    );
  }

  return (
    <div className="my-10">
      <BaseJobCard
        mode="update"
        initialData={singleCard}
        onSubmit={handleSubmitJobCard}
        loading={updateJobCardLoading}
        CompanyInfoData={CompanyInfoData}
        onChassisChange={handleChassisChange}
        jobCardData={{
          paddedJobNumber: singleCard?.job_no,
          userDetails: { data: singleCard?.customer || singleCard?.company || singleCard?.showroom }
        }}
      />
    </div>
  );
};

export default UpdateJobCard;