/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

"use client";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../public/assets/logo.png";
import { usePermissions } from "../../context/PermissionContext";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import QuotationTable from "./QuotationTable";
import ActionButtons from "./ActionButtons";
import CompanyHeader from "./CompanyHeader";
import CustomerInfoForm from "./CustomerInfoForm";
import DiscountSection from "./DiscountSection";
import PartsItemsForm from "./PartsItemsForm";
import ServiceItemsForm from "./ServiceItemsForm";
import VehicleInfoForm from "./VehicleInfoForm";
import { useQuotationFormState } from "../../hooks/useQuotationFormState";
import { useQuotationData } from "../../hooks/useQuotationData";
import { useQuotationCalculations } from "../../hooks/useQuotationCalculations";
import { useQuotationHandlers } from "../../hooks/useQuotationHandlers";

const QuotationForm = ({ mode = "add" }) => {
  const formState = useQuotationFormState(mode);
  const {
    isEditMode,
    id,
    job_no,
    orderNumber,
    getDataWithChassisNo,
    setGetDataWithChassisNo,
    selectedDate,
    setSelectedDate,
    countryCode,
    setCountryCode,
    phoneNumber,
    setPhoneNumber,
    currentMileage,
    setCurrentMileage,
    mileageChanged,
    setMileageChanged,
    items,
    setItems,
    serviceItems,
    setServiceItems,
    filterType,
    setFilterType,
    goOtherButton,
    setGoOtherButton,
    productSuggestions,
    setProductSuggestions,
    showSuggestions,
    setShowSuggestions,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    activeInputType,
    setActiveInputType,
    activeInputIndex,
    setActiveInputIndex,
    addButton,
    setAddButton,
    serviceAddButton,
    setServiceAddButton,
    register,
    handleSubmit,
    reset,
    setFormValue,
    errors,
    partsDiscountRef,
    netTotalAmountRef,
  } = formState;

  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();

  const data = useQuotationData(tenantDomain, id, orderNumber, isEditMode);
  const {
    stockData,
    CompanyInfoData,
    jobCardData,
    specificQuotation,
    setSpecificQuotation,
    quotationLoading,
    quotationError,
    error,
    setError,
    reload,
    setReload,
    createQuotation,
    updateQuotation,
    removeQuotation,
    refetch,
    refetchQuotation,
    createLoading,
    updateLoading,
    removeLoading,
    setDiscount,
    setVAT,
    setTax,
  } = data;

  const calculations = useQuotationCalculations(
    items,
    serviceItems,
    specificQuotation,
    isEditMode,
    data.discount,
    data.vat,
    data.tax
  );
  const { grandTotal, partsTotal, serviceTotal, calculateFinalTotal } =
    calculations;

  const handlers = useQuotationHandlers(
    isEditMode,
    specificQuotation,
    setSpecificQuotation,
    items,
    setItems,
    serviceItems,
    setServiceItems,
    stockData,
    setProductSuggestions,
    setShowSuggestions,
    setActiveSuggestionIndex,
    setActiveInputType,
    setActiveInputIndex,
    removeQuotation,
    refetchQuotation,
    id,
    tenantDomain,
    setReload,
    setDiscount,
    setVAT
  );
  const {
    discount,
    vat,
    tax,
    removeButton,
    filterProductSuggestions,
    handleAddClick,
    handleServiceAdd,
    handleRemove,
    handleServiceRemove,
    handleServiceDescriptionChange,
    handleDescriptionChange,
    handleUnitChange,
    handleServiceUnitChange,
    handleQuantityChange,
    handleServiceQuantityChange,
    handleRateChange,
    handleServiceRateChange,
    handleDiscountChange,
    handleVATChange,
    handleTaxChange,
    handlePhoneNumberChange,
    handleRemoveButton,
    handlePartsAddButton,
    handleServiceAddButton,
    handleServiceDescriptionAdd,
    handleServiceDescriptionRemove,
    handleSelectSuggestion,
  } = handlers;

  // Initialize form data when quotation data is loaded in edit mode
  useEffect(() => {
    if (
      isEditMode &&
      specificQuotation &&
      typeof specificQuotation === "object"
    ) {
      const data = specificQuotation;
      if (data && typeof data === "object") {
        setDiscount(data.discount || "");
        setVAT(data.vat || "");
        setTax(data.tax || "");

        if (data.mileage) {
          setCurrentMileage(data.mileage.toString());
        }

        if (data.date) {
          setSelectedDate(data.date);
        }
      }
    }
  }, [
    isEditMode,
    specificQuotation,
    setDiscount,
    setVAT,
    setTax,
    setCurrentMileage,
    setSelectedDate,
  ]);

  // Set date for add mode
  useEffect(() => {
    if (!isEditMode) {
      if (jobCardData?.data?.date) {
        setSelectedDate(jobCardData?.data?.date);
      }
    }
  }, [isEditMode, jobCardData?.data?.date, setSelectedDate]);

  // Reset form when specificQuotation changes in edit mode
  useEffect(() => {
    if (
      isEditMode &&
      (!specificQuotation || Object.keys(specificQuotation).length === 0)
    ) {
      return;
    }

    if (isEditMode) {
      const resetData = {
        Id: specificQuotation?.Id,
        job_no: specificQuotation?.job_no,
        mileage:
          specificQuotation?.mileage || specificQuotation?.vehicle?.mileage,
      };

      if (specificQuotation?.user_type === "customer") {
        Object.assign(resetData, {
          company_name: specificQuotation?.customer?.company_name,
          customer_name: specificQuotation?.customer?.customer_name,
          customer_country_code:
            specificQuotation?.customer?.customer_country_code,
          customer_contact: specificQuotation?.customer?.customer_contact,
          customer_address: specificQuotation?.customer?.customer_address,
        });
      } else if (specificQuotation?.user_type === "company") {
        Object.assign(resetData, {
          company_name: specificQuotation?.company?.company_name,
          vehicle_username: specificQuotation?.company?.vehicle_username,
          company_address: specificQuotation?.company?.company_address,
          company_contact: specificQuotation?.company?.company_contact,
          company_country_code:
            specificQuotation?.company?.company_country_code,
          company_email: specificQuotation?.company?.company_email,
        });
      } else if (specificQuotation?.user_type === "showRoom") {
        Object.assign(resetData, {
          showRoom_name: specificQuotation?.showRoom?.showRoom_name,
          vehicle_username: specificQuotation?.showRoom?.vehicle_username,
          showRoom_address: specificQuotation?.showRoom?.showRoom_address,
          company_name: specificQuotation?.showRoom?.company_name,
          company_contact: specificQuotation?.showRoom?.company_contact,
          company_country_code:
            specificQuotation?.showRoom?.company_country_code,
        });
      }

      Object.assign(resetData, {
        carReg_no: specificQuotation?.vehicle?.carReg_no,
        car_registration_no: specificQuotation?.vehicle?.car_registration_no,
        engine_no: specificQuotation?.vehicle?.engine_no,
        vehicle_brand: specificQuotation?.vehicle?.vehicle_brand,
        vehicle_name: specificQuotation?.vehicle?.vehicle_name,
        chassis_no: specificQuotation?.vehicle?.chassis_no,
      });

      reset(resetData);
    } else {
      if (jobCardData?.data?.user_type === "customer") {
        reset({
          job_no: jobCardData?.data?.job_no,
          Id: jobCardData?.data?.Id,
          company_name: jobCardData?.data?.customer?.company_name,
          customer_name: jobCardData?.data?.customer?.customer_name,
          customer_country_code:
            jobCardData?.data?.customer?.customer_country_code,
          customer_contact: jobCardData?.data?.customer?.customer_contact,
          customer_address: jobCardData?.data?.customer?.customer_address,
          chassis_no: getDataWithChassisNo?.chassis_no,
          carReg_no: getDataWithChassisNo?.carReg_no,
          car_registration_no: getDataWithChassisNo?.car_registration_no,
          engine_no: getDataWithChassisNo?.engine_no,
          vehicle_brand: getDataWithChassisNo?.vehicle_brand,
          vehicle_name: getDataWithChassisNo?.vehicle_name,
          mileage: getDataWithChassisNo?.mileage,
        });
      }
      if (jobCardData?.data?.user_type === "company") {
        reset({
          job_no: jobCardData?.data?.job_no,
          Id: jobCardData?.data?.Id,
          company_name: jobCardData?.data?.company?.company_name,
          vehicle_username: jobCardData?.data?.company?.vehicle_username,
          company_address: jobCardData?.data?.company?.company_address,
          company_contact: jobCardData?.data?.company?.company_contact,
          company_country_code:
            jobCardData?.data?.company?.company_country_code,
          company_email: jobCardData?.data?.company?.company_email,
          customer_address: jobCardData?.data?.company?.customer_address,
          chassis_no: getDataWithChassisNo?.chassis_no,
          carReg_no: getDataWithChassisNo?.carReg_no,
          car_registration_no: getDataWithChassisNo?.car_registration_no,
          engine_no: getDataWithChassisNo?.engine_no,
          vehicle_brand: getDataWithChassisNo?.vehicle_brand,
          vehicle_name: getDataWithChassisNo?.vehicle_name,
          mileage: getDataWithChassisNo?.mileage,
        });
      }
      if (jobCardData?.data?.user_type === "showRoom") {
        reset({
          job_no: jobCardData?.data?.job_no,
          Id: jobCardData?.data?.Id,
          showRoom_name: jobCardData?.data?.showRoom?.showRoom_name,
          vehicle_username: jobCardData?.data?.showRoom?.vehicle_username,
          showRoom_address: jobCardData?.data?.showRoom?.showRoom_address,
          company_name: jobCardData?.data?.showRoom?.company_name,
          company_contact:
            phoneNumber || jobCardData?.data?.showRoom?.company_contact,
          company_country_code:
            jobCardData?.data?.showRoom?.company_country_code,
          chassis_no: getDataWithChassisNo?.chassis_no,
          carReg_no: getDataWithChassisNo?.carReg_no,
          car_registration_no: getDataWithChassisNo?.car_registration_no,
          engine_no: getDataWithChassisNo?.engine_no,
          vehicle_brand: getDataWithChassisNo?.vehicle_brand,
          vehicle_name: getDataWithChassisNo?.vehicle_name,
          mileage: getDataWithChassisNo?.mileage,
        });
      }
    }
  }, [
    specificQuotation,
    reset,
    isEditMode,
    jobCardData,
    getDataWithChassisNo,
    phoneNumber,
  ]);

  // Mileage change handler
  useEffect(() => {
    if (isEditMode && specificQuotation?.mileage) {
      setFormValue("mileage", specificQuotation.mileage);
      setCurrentMileage(specificQuotation.mileage.toString());
    }
  }, [isEditMode, specificQuotation?.mileage, setFormValue, setCurrentMileage]);

  useEffect(() => {
    setGetDataWithChassisNo(
      isEditMode ? specificQuotation?.vehicle : jobCardData?.data?.vehicle
    );
  }, [
    isEditMode,
    specificQuotation?.vehicle,
    jobCardData?.data?.vehicle,
    setGetDataWithChassisNo,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSuggestions) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSuggestions, setShowSuggestions]);

  // Form submission
  const onSubmit = async (data) => {
    performActionWithPermission(
      isEditMode
        ? "/dashboard/update-quotation"
        : "/dashboard/create-quotation",
      isEditMode ? "edit" : "create",
      async () => {
        const toastId = toast.loading(
          isEditMode ? "Updating Quotation..." : "Creating Quotation..."
        );

        try {
          const customer = {
            company_name: data.company_name,
            customer_name: data.customer_name,
            customer_contact: data.customer_contact,
            customer_country_code: data.company_country_code,
            customer_address: data.customer_address,
          };
          const company = {
            company_name: data.company_name,
            vehicle_username: data.vehicle_username,
            company_address: data.company_address,
            company_contact: data.company_contact,
            company_country_code: data.company_country_code,
          };
          const showRoom = {
            showRoom_name: data.showRoom_name,
            vehicle_username: data.vehicle_username,
            company_name: data.company_name,
            company_contact: data.company_contact,
            company_country_code: data.company_country_code,
            company_address: data.company_address,
          };
          data.mileage = Number(data.mileage);
          const newMileageValue = Number(data.mileage);

          const existingMileageHistory = isEditMode
            ? specificQuotation?.vehicle?.mileageHistory || []
            : getDataWithChassisNo?.mileageHistory || [];
          const updatedMileageHistory = [...existingMileageHistory];

          // Only add current mileage to history if it has changed
          if (mileageChanged && currentMileage) {
            const newMileageEntry = {
              mileage: Number(currentMileage),
              date: new Date().toISOString(),
            };

            // Check if this mileage value already exists in history
            const mileageExists = updatedMileageHistory.some(
              (entry) => entry.mileage === Number(currentMileage)
            );

            if (!mileageExists) {
              updatedMileageHistory.push(newMileageEntry);
            }
          }

          // Only add a new entry if it's a valid number and not already in the history
          if (!isNaN(newMileageValue) && newMileageValue > 0) {
            const mileageExists = updatedMileageHistory.some(
              (entry) => entry.mileage === newMileageValue
            );

            if (!mileageExists) {
              updatedMileageHistory.push({
                mileage: newMileageValue,
                date: new Date().toISOString(),
              });
            }
          }
          const vehicle = {
            carReg_no: data.carReg_no,
            car_registration_no: data.car_registration_no,
            chassis_no: data.chassis_no,
            engine_no: data.engine_no,
            vehicle_brand: data.vehicle_brand,
            vehicle_name: data.vehicle_name,
            mileageHistory: updatedMileageHistory,
          };

          // Prepare items for submission
          let preparedItems, preparedServiceItems;

          if (isEditMode) {
            preparedItems = [
              ...(specificQuotation?.input_data || []),
              ...items
                .filter((item) => item.total !== undefined && item.total !== "")
                .map((item) => ({
                  description: item.description,
                  quantity: item.quantity,
                  rate: item.rate,
                  unit: item.unit,
                  total: item.total,
                })),
            ];

            preparedServiceItems = [
              ...(specificQuotation?.service_input_data || []),
              ...serviceItems
                .filter((item) => item.total !== undefined && item.total !== "")
                .map((item) => ({
                  description: item.description,
                  quantity: item.quantity,
                  rate: item.rate,
                  unit: item.unit,
                  total: item.total,
                })),
            ];
          } else {
            preparedItems = prepareItemsForSubmission(items);
            preparedServiceItems = prepareItemsForSubmission(serviceItems);
          }

          const quotation = {
            user_type: isEditMode
              ? specificQuotation?.user_type
              : jobCardData?.data?.user_type,
            Id: isEditMode ? specificQuotation?.Id : jobCardData?.data?.Id,
            job_no: isEditMode ? specificQuotation?.job_no : orderNumber,
            date: selectedDate,
            parts_total: partsTotal,
            service_total: serviceTotal,
            total_amount: grandTotal,
            discount: discount,
            vat: vat,
            tax: tax,
            net_total: calculateFinalTotal(),
            input_data: preparedItems,
            service_input_data: preparedServiceItems,
            logo,
            mileage: data.mileage,
          };

          const values = {
            tenantDomain,
            customer,
            company,
            showRoom,
            vehicle,
            quotation,
          };

          if (isEditMode) {
            const newValue = {
              id: id,
              data: {
                ...values,
              },
            };
            const res = await updateQuotation(newValue).unwrap();
            if (res.success) {
              setReload(!reload);
              toast.success(res.message || "Quotation updated successfully");

              if (goOtherButton === "preview") {
                navigate(`/dashboard/quotation-view?id=${id}`);
                setGoOtherButton("");
              } else if (goOtherButton === "invoice") {
                navigate(
                  `/dashboard/create-invoice?order_no=${specificQuotation?.job_no}&id=${id}`
                );
                setGoOtherButton("");
              } else {
                const userTypeFromProfile = new URLSearchParams(
                  location.search
                ).get("user_type");
                const userFromProfile = new URLSearchParams(
                  location.search
                ).get("user");

                if (!userTypeFromProfile) {
                  navigate("/dashboard/quotation-list");
                }
                if (userTypeFromProfile === "company") {
                  navigate(`/dashboard/company-profile?id=${userFromProfile}`);
                }
                if (userTypeFromProfile === "customer") {
                  navigate(`/dashboard/customer-profile?id=${userFromProfile}`);
                }
                if (userTypeFromProfile === "showRoom") {
                  navigate(
                    `/dashboard/show-room-profile?id=${userFromProfile}`
                  );
                }
              }
            }
          } else {
            const res = await createQuotation(values).unwrap();
            if (res.success) {
              toast.success(res.message);
              if (goOtherButton === "preview") {
                navigate(`/dashboard/quotation-view?id=${res?.data?._id}`);
                setGoOtherButton("");
              } else if (goOtherButton === "invoice") {
                navigate(
                  `/dashboard/create-invoice?order_no=${jobCardData?.data?.job_no}&id=${res?.data?._id}`
                );
                setGoOtherButton("");
              } else {
                navigate("/dashboard/quotation-list");
                setGoOtherButton("");
              }
              refetch();
            }
          }
        } catch (err) {
          const errorMessage =
            err?.data?.message ||
            err?.message ||
            `Failed to ${isEditMode ? "update" : "create"} quotation`;
          toast.error(errorMessage);
        } finally {
          toast.dismiss(toastId);
        }
      },
      `You don't have permission to ${
        isEditMode ? "update" : "create"
      } quotation!`
    );
  };

  const prepareItemsForSubmission = (itemsArray) => {
    return itemsArray.map((item) => {
      if (item.product && item.warehouse) {
        return item;
      } else {
        return {
          ...item,
        };
      }
    });
  };

  const location = useLocation();
  const navigate = useNavigate();

  if (isEditMode && quotationLoading) {
    return (
      <div className="px-5 py-10">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Loading quotation data...</div>
        </div>
      </div>
    );
  }

  if (isEditMode && quotationError) {
    return (
      <div className="px-5 py-10">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl text-red-500">
            Error loading quotation:{" "}
            {quotationError?.data?.message ||
              quotationError?.message ||
              "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  if (
    isEditMode &&
    (!specificQuotation || Object.keys(specificQuotation).length === 0)
  ) {
    return (
      <div className="px-5 py-10">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">No quotation data found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-5 md:py-10">
      <CompanyHeader CompanyInfoData={CompanyInfoData} />
      <div className="mt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex md:flex-row flex-col justify-between items-center">
            <div className="hidden"></div>
            <div className="vehicleCard">
              {isEditMode ? "Update Quotation" : "Create Quotation"}
            </div>
            <div className="flex items-center gap-x-2">
              {isEditMode ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "170px" }}
                    label="Quotation Date"
                    value={selectedDate ? dayjs(selectedDate) : dayjs()}
                    onChange={(newValue) => {
                      if (newValue) {
                        const formattedDate = newValue.format("YYYY-MM-DD");
                        setSelectedDate(formattedDate);
                      }
                    }}
                    slotProps={{
                      textField: { fullWidth: true, variant: "outlined" },
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <input
                  type="date"
                  className="border px-3 py-1 rounded-md "
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  {...register("date", {
                    required: "Date is required!",
                  })}
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 my-10">
            <CustomerInfoForm
              register={register}
              isEditMode={isEditMode}
              specificQuotation={specificQuotation}
              jobCardData={jobCardData}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              phoneNumber={phoneNumber}
              handlePhoneNumberChange={handlePhoneNumberChange}
            />
            <VehicleInfoForm
              register={register}
              isEditMode={isEditMode}
              specificQuotation={specificQuotation}
              getDataWithChassisNo={getDataWithChassisNo}
              currentMileage={currentMileage}
              setCurrentMileage={setCurrentMileage}
              setMileageChanged={setMileageChanged}
              errors={errors}
              setSpecificQuotation={setSpecificQuotation}
              setGetDataWithChassisNo={setGetDataWithChassisNo}
            />
          </div>
          <ServiceItemsForm
            isEditMode={isEditMode}
            specificQuotation={specificQuotation}
            serviceItems={serviceItems}
            showSuggestions={showSuggestions}
            activeInputType={activeInputType}
            activeInputIndex={activeInputIndex}
            productSuggestions={productSuggestions}
            serviceAddButton={serviceAddButton}
            removeLoading={removeLoading}
            handleServiceDescriptionChange={handleServiceDescriptionChange}
            handleServiceQuantityChange={handleServiceQuantityChange}
            handleServiceUnitChange={handleServiceUnitChange}
            handleServiceRateChange={handleServiceRateChange}
            handleRemoveButton={handleRemoveButton}
            handleServiceAddButton={handleServiceAddButton}
            handleServiceDescriptionAdd={handleServiceDescriptionAdd}
            handleServiceDescriptionRemove={handleServiceDescriptionRemove}
            handleServiceAdd={handleServiceAdd}
            handleSelectSuggestion={handleSelectSuggestion}
          />
          <PartsItemsForm
            isEditMode={isEditMode}
            specificQuotation={specificQuotation}
            items={items}
            showSuggestions={showSuggestions}
            activeInputType={activeInputType}
            activeInputIndex={activeInputIndex}
            productSuggestions={productSuggestions}
            addButton={addButton}
            removeLoading={removeLoading}
            handleDescriptionChange={handleDescriptionChange}
            handleQuantityChange={handleQuantityChange}
            handleUnitChange={handleUnitChange}
            handleRateChange={handleRateChange}
            handleRemoveButton={handleRemoveButton}
            handlePartsAddButton={handlePartsAddButton}
            handleAddClick={handleAddClick}
            handleRemove={handleRemove}
            handleSelectSuggestion={handleSelectSuggestion}
          />
          <DiscountSection
            grandTotal={grandTotal}
            discount={discount}
            vat={vat}
            tax={tax}
            handleDiscountChange={handleDiscountChange}
            handleVATChange={handleVATChange}
            handleTaxChange={handleTaxChange}
            calculateFinalTotal={calculateFinalTotal}
            partsDiscountRef={partsDiscountRef}
            netTotalAmountRef={netTotalAmountRef}
          />
          <ActionButtons
            isEditMode={isEditMode}
            createLoading={createLoading}
            updateLoading={updateLoading}
            goOtherButton={goOtherButton}
            setGoOtherButton={setGoOtherButton}
            specificQuotation={specificQuotation}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
          />
        </form>
      </div>
      {error && <div className="pt-6 text-center text-red-400">{error}</div>}
      <QuotationTable />
    </div>
  );
};

export default QuotationForm;
