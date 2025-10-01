// /* eslint-disable no-unsafe-optional-chaining */
// "use client"

// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import { Autocomplete, Box, Grid, TextField, InputAdornment } from "@mui/material"
// import {
//   carBrands,
//   cmDmOptions,
//   countries,
//   fuelType,
//   vehicleModels,
//   vehicleName,
//   vehicleTypes,
// } from "../../../../constant"
// import { useLocation } from "react-router-dom"
// import { useState, useEffect } from "react"
// import { useForm, Controller } from "react-hook-form"
// import { toast } from "react-toastify"
// import {
//   useCreateVehicleMutation,
//   useGetSingleVehicleQuery,
//   useUpdateVehicleMutation,
// } from "../../../../redux/api/vehicle"
// // Import Material UI icons
// import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
// import BadgeIcon from "@mui/icons-material/Badge"
// import SettingsIcon from "@mui/icons-material/Settings"
// import BuildIcon from "@mui/icons-material/Build"
// import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark"
// import DriveEtaIcon from "@mui/icons-material/DriveEta"
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
// import CategoryIcon from "@mui/icons-material/Category"
// import ColorLensIcon from "@mui/icons-material/ColorLens"
// import SpeedIcon from "@mui/icons-material/Speed"
// import LocalGasStationIcon from "@mui/icons-material/LocalGasStation"
// import PersonIcon from "@mui/icons-material/Person"
// import PhoneIcon from "@mui/icons-material/Phone"
// import FlagIcon from "@mui/icons-material/Flag"
// import AddCircleIcon from "@mui/icons-material/AddCircle"
// import EditIcon from "@mui/icons-material/Edit"
// import Loading from "../../../../components/Loading/Loading"

// const JobCardForm = ({ tenantDomain, onClose, id, user_type, vehicleData, isEditing }) => {
//   const [registrationError, setRegistrationError] = useState("")
//   const [driverCountryCode, setDriverCountryCode] = useState(countries[0])
//   const location = useLocation()
//   const [phoneNumber, setPhoneNumber] = useState("")
//   const [driverPhoneNumber, setDriverPhoneNumber] = useState("")
//   const [createVehicle, { isLoading: createLoading }] = useCreateVehicleMutation()
//   const [updateVehicle, { isLoading: updateLoading }] = useUpdateVehicleMutation()

//   const vehicleId = vehicleData?._id

//   const { data, isLoading: vehicleLoading } = useGetSingleVehicleQuery({
//     tenantDomain,
//     id: vehicleId,
//   })



//   const isLoading = createLoading || updateLoading || vehicleLoading

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     control,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm()

//   // Watch form values
//   const watchedValues = watch()

//   // Set default values when vehicleData changes (for editing)
//   useEffect(() => {
//     if (isEditing && data?.data) {
//       const vehicleData = data.data

//       // Set form values from vehicleData
//       reset({
//         carReg_no: vehicleData?.carReg_no || "",
//         car_registration_no: vehicleData?.car_registration_no || "",
//         chassis_no: vehicleData?.chassis_no || "",
//         engine_no: vehicleData?.engine_no || "",
//         vehicle_brand: vehicleData?.vehicle_brand || "",
//         vehicle_name: vehicleData?.vehicle_name || "",
//         vehicle_model: vehicleData?.vehicle_model?.toString() || "",
//         vehicle_category: vehicleData?.vehicle_category || "",
//         color_code: vehicleData?.color_code || "",
//         mileage: vehicleData?.mileageHistory?.[vehicleData?.mileageHistory.length - 1]?.mileage || "",
//         fuel_type: vehicleData?.fuel_type || "",
//         driver_name: vehicleData?.driver_name || "",
//         driver_contact: vehicleData?.driver_contact || "",
//       })

//       // Set year input
//       setYearSelectInput(vehicleData?.vehicle_model?.toString() || "")

//       // Set driver country code
//       if (vehicleData?.driver_country_code) {
//         const country = countries.find((c) => c.code === vehicleData?.driver_country_code)
//         if (country) setDriverCountryCode(country)
//       }

//       // Set driver phone number
//       setDriverPhoneNumber(vehicleData?.driver_contact || "")
//     } else {
//       // Reset form for new vehicle
//       reset({
//         carReg_no: "",
//         car_registration_no: "",
//         chassis_no: "",
//         engine_no: "",
//         vehicle_brand: "",
//         vehicle_name: "",
//         vehicle_model: "",
//         vehicle_category: "",
//         color_code: "",
//         mileage: "",
//         fuel_type: "",
//         driver_name: "",
//         driver_contact: "",
//       })

//       // Reset states
//       setYearSelectInput("")
//       setDriverCountryCode(countries[0])
//       setDriverPhoneNumber("")
//     }
//   }, [data, isEditing, reset])

//   const onSubmit = async (data) => {
//     const toastId = toast.loading(isEditing ? "Updating Vehicle..." : "Creating Vehicle...")

//     const submitData = {
//       Id: id,
//       user_type: user_type,
//       carReg_no: data.carReg_no,
//       vehicle_brand: data.vehicle_brand,
//       vehicle_name: data.vehicle_name,
//       car_registration_no: data.car_registration_no,
//       chassis_no: data.chassis_no,
//       engine_no: data.engine_no,
//       vehicle_category: data.vehicle_category,
//       color_code: data.color_code,
//       fuel_type: data.fuel_type,
//       vehicle_model: Number(data.vehicle_model),
//       mileageHistory: isEditing
//         ? vehicleData?.mileageHistory // Fixed reference to use vehicleData from data.data
//         : [
//             {
//               mileage: Number(data.mileage),
//               date: new Date(),
//             },
//           ],
//       driver_name: data.driver_name,
//       driver_contact: data.driver_contact,
//       driver_country_code: driverCountryCode.code,
//     }

//     // For editing, add the latest mileage if it's different
//     if (isEditing && vehicleData) {
//       const currentMileage = Number(data.mileage)
//       const lastMileage = vehicleData?.mileageHistory[vehicleData?.mileageHistory.length - 1]?.mileage

//       if (currentMileage !== lastMileage) {
//         submitData.mileageHistory = [
//           ...vehicleData?.mileageHistory,
//           {
//             mileage: currentMileage,
//             date: new Date(),
//           },
//         ]
//       }
//     }

//     try {
//       let res
//       if (isEditing) {
//         res = await updateVehicle({
//           tenantDomain,
//           id: vehicleData._id,
//           data: submitData,
//         }).unwrap()
//       } else {
//         res = await createVehicle({
//           tenantDomain,
//           data: submitData,
//         }).unwrap()
//       }

//       if (res.success) {
//         toast.update(toastId, {
//           render: res.message,
//           type: "success",
//           isLoading: false,
//           autoClose: 3000,
//         })
//         onClose()
//       } else {
//         toast.update(toastId, {
//           render: "Failed to " + (isEditing ? "update" : "create") + " vehicle!",
//           type: "error",
//           isLoading: false,
//           autoClose: 3000,
//         })
//       }
//     } catch (err) {
//       let errorMessage = "Failed to " + (isEditing ? "update" : "create") + " vehicle!"

//       // Backend custom message
//       if (err?.data?.message) {
//         errorMessage = err.data.message
//       }

//       // Backend errorSources array
//       if (err?.data?.errorSources?.length > 0) {
//         errorMessage = err.data.errorSources[0]?.message || errorMessage
//       }

//       // Mongo duplicate key
//       if (err?.data?.err?.code === 11000) {
//         const key = Object.keys(err.data.err.keyValue)[0]
//         const value = err.data.err.keyValue[key]
//         errorMessage = `${value} is already exists`
//       }

//       toast.update(toastId, {
//         render: errorMessage,
//         type: "error",
//         isLoading: false,
//         autoClose: 3000,
//       })
//     }
//   }

//   // year select only number 4 digit
//   const [filteredOptions, setFilteredOptions] = useState([])
//   const [yearSelectInput, setYearSelectInput] = useState("")

//   // Handle input changes
//   const handleYearSelectInput = (event) => {
//     const value = event.target.value
//     // Check if the input is a number and does not exceed 4 digits
//     if (/^\d{0,4}$/.test(value)) {
//       setYearSelectInput(value)
//       setValue("vehicle_model", value)
//       const filtered = vehicleModels.filter((option) => option.label.toLowerCase().startsWith(value.toLowerCase()))
//       setFilteredOptions(filtered)
//     }
//   }
//   const handleOptionClick = (option) => {
//     setYearSelectInput(option.label)
//     setValue("vehicle_model", option.label)
//     setFilteredOptions([])
//   }

//   const handleCarRegistrationChange = (e) => {
//     let value = e.target.value.replace(/[^0-9]/g, "")
//     if (value.length > 2) {
//       value = value.slice(0, 2) + "-" + value.slice(2)
//     }

//     if (value.length > 7) {
//       value = value.slice(0, 7)
//     }

//     setRegistrationError("") // Clear previous error
//     if (value.length !== 7) {
//       setRegistrationError("Car registration number must be 7 characters")
//     }

//     // Update input value
//     setValue("car_registration_no", value, {
//       shouldValidate: true,
//     })
//   }
//   const handleDriverPhoneNumberChange = (e) => {
//     const newPhoneNumber = e.target.value
//     if (
//       /^\d*$/.test(newPhoneNumber) &&
//       newPhoneNumber.length <= 10 &&
//       (newPhoneNumber === "" || !newPhoneNumber.startsWith("0") || newPhoneNumber.length > 1)
//     ) {
//       setDriverPhoneNumber(newPhoneNumber)
//       setValue("driver_contact", newPhoneNumber)
//     }
//   }

//   return (
//     <>
//       {vehicleLoading ? (
//         <Loading />
//       ) : (
//         <div className="flex items-center px-2 md:px-8">
//           <div className="w-full">
//             <h2 className="text-center text-[#42A1DA] font-bold text-2xl uppercase mb-3">
//               {isEditing ? (
//                 <EditIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//               ) : (
//                 <AddCircleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//               )}
//               {isEditing ? "Edit Vehicle" : "Add Vehicle"}
//             </h2>
//             <div>
//               <form onSubmit={handleSubmit(onSubmit)}>
//                 <Box>
//                   <Grid container spacing={2}>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <Controller
//                         name="carReg_no"
//                         control={control}
//                         defaultValue=""
//                         rules={{ required: "Vehicle reg no is required !" }}
//                         render={({ field }) => (
//                           <Autocomplete
//                             freeSolo
//                             fullWidth
//                             size="medium"
//                             id="reg"
//                             options={cmDmOptions.map((option) => option.label)}
//                             value={field.value || ""}
//                             onInputChange={(event, newValue) => {
//                               field.onChange(newValue)
//                             }}
//                             renderInput={(params) => (
//                               <TextField
//                                 size="medium"
//                                 {...params}
//                                 label="Vehicle Reg No"
//                                 error={!!errors.carReg_no}
//                                 helperText={errors.carReg_no?.message}
//                                 InputProps={{
//                                   ...params.InputProps,
//                                   startAdornment: (
//                                     <>
//                                       <InputAdornment position="start">
//                                         <BadgeIcon color="primary" />
//                                       </InputAdornment>
//                                       {params.InputProps.startAdornment}
//                                     </>
//                                   ),
//                                 }}
//                               />
//                             )}
//                           />
//                         )}
//                       />
//                     </Grid>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <TextField
//                         fullWidth
//                         size="medium"
//                         label="Car R (N)"
//                         {...register(
//                           "car_registration_no",
//                           { required: "Car reg no is required" },
//                           {
//                             pattern: {
//                               value: /^[\d-]+$/,
//                               message: "Only numbers and hyphens are allowed",
//                             },
//                             maxLength: {
//                               value: 7,
//                               message: "Car registration number must be exactly 7 characters",
//                             },
//                           },
//                         )}
//                         onChange={handleCarRegistrationChange}
//                         error={!!errors.car_registration_no}
//                         helperText={errors.car_registration_no?.message}
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <DirectionsCarIcon color="primary" />
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <TextField
//                         fullWidth
//                         size="medium"
//                         label="Chassis No (T&N)"
//                         {...register("chassis_no", {
//                           required: "Chassis no is required!",
//                         })}
//                         defaultValue={vehicleData?.chassis_no}
//                         error={!!errors.chassis_no}
//                         helperText={errors.chassis_no?.message}
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <SettingsIcon color="primary" />
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <TextField
//                         fullWidth
//                         size="medium"
//                         label="ENGINE NO & CC (T&N) "
//                         {...register("engine_no", {
//                           required: "Engin no is required!",
//                         })}
//                         error={!!errors.engine_no}
//                         helperText={errors.engine_no?.message}
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <BuildIcon color="primary" />
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <Controller
//                         name="vehicle_brand"
//                         control={control}
//                         defaultValue=""
//                         rules={{ required: "Vehicle brand is required!" }}
//                         render={({ field }) => (
//                           <Autocomplete
//                             size="medium"
//                             fullWidth
//                             freeSolo
//                             options={carBrands.map((option) => option.label)}
//                             value={field.value || ""}
//                             onInputChange={(event, newValue) => {
//                               field.onChange(newValue)
//                             }}
//                             renderInput={(params) => (
//                               <TextField
//                                 size="medium"
//                                 {...params}
//                                 label="Vehicle Brand"
//                                 error={!!errors.vehicle_brand}
//                                 helperText={errors.vehicle_brand?.message}
//                                 InputProps={{
//                                   ...params.InputProps,
//                                   startAdornment: (
//                                     <>
//                                       <InputAdornment position="start">
//                                         <BrandingWatermarkIcon color="primary" />
//                                       </InputAdornment>
//                                       {params.InputProps.startAdornment}
//                                     </>
//                                   ),
//                                 }}
//                               />
//                             )}
//                           />
//                         )}
//                       />
//                     </Grid>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <Controller
//                         name="vehicle_name"
//                         control={control}
//                         defaultValue=""
//                         rules={{ required: "Vehicle name is required!" }}
//                         render={({ field }) => (
//                           <Autocomplete
//                             fullWidth
//                             size="medium"
//                             freeSolo
//                             options={vehicleName.map((option) => option.value)}
//                             value={field.value || ""}
//                             onInputChange={(event, newValue) => {
//                               field.onChange(newValue)
//                             }}
//                             renderInput={(params) => (
//                               <TextField
//                                 fullWidth
//                                 size="medium"
//                                 {...params}
//                                 label="Vehicle Name "
//                                 error={!!errors.vehicle_name}
//                                 helperText={errors.vehicle_name?.message}
//                                 InputProps={{
//                                   ...params.InputProps,
//                                   startAdornment: (
//                                     <>
//                                       <InputAdornment position="start">
//                                         <DriveEtaIcon color="primary" />
//                                       </InputAdornment>
//                                       {params.InputProps.startAdornment}
//                                     </>
//                                   ),
//                                 }}
//                               />
//                             )}
//                             getOptionLabel={(option) => option || ""}
//                           />
//                         )}
//                       />
//                     </Grid>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <div className="relative">
//                         <div className="flex items-center border border-[#11111194] rounded-md">
//                           <div className="pl-3">
//                             <CalendarMonthIcon color="primary" />
//                           </div>
//                           <input
//                             value={yearSelectInput}
//                             onInput={handleYearSelectInput}
//                             {...register("vehicle_model")}
//                             type="text"
//                             className="border-0 outline-none w-[100%] h-14 p-3 rounded-md"
//                             placeholder="Vehicle Model"
//                           />
//                         </div>
//                         {yearSelectInput && (
//                           <ul className="options-list">
//                             {filteredOptions.map((option, index) => (
//                               <li key={index} onClick={() => handleOptionClick(option)}>
//                                 {option.label}
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                         {errors.vehicle_model && (
//                           <span className="text-sm text-red-400">{errors.vehicle_model.message}</span>
//                         )}
//                       </div>
//                     </Grid>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <Controller
//                         name="vehicle_category"
//                         control={control}
//                         defaultValue=""
//                         render={({ field }) => (
//                           <Autocomplete
//                             fullWidth
//                             size="medium"
//                             freeSolo
//                             options={vehicleTypes.map((option) => option.label)}
//                             value={field.value || ""}
//                             onInputChange={(event, newValue) => {
//                               field.onChange(newValue)
//                             }}
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 label=" Vehicle Categories "
//                                 InputProps={{
//                                   ...params.InputProps,
//                                   startAdornment: (
//                                     <>
//                                       <InputAdornment position="start">
//                                         <CategoryIcon color="primary" />
//                                       </InputAdornment>
//                                       {params.InputProps.startAdornment}
//                                     </>
//                                   ),
//                                 }}
//                               />
//                             )}
//                           />
//                         )}
//                       />
//                     </Grid>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <TextField
//                         fullWidth
//                         size="medium"
//                         freeSolo
//                         label="Color & Code (T&N) "
//                         {...register("color_code", {
//                           required: "Color & Code is required!",
//                         })}
//                         error={!!errors.color_code}
//                         helperText={errors.color_code?.message}
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <ColorLensIcon color="primary" />
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <TextField
//                         fullWidth
//                         label="Mileage (N)"
//                         {...register("mileage", {
//                           required: "Mileage is required!",
//                           pattern: {
//                             value: /^\d+$/,
//                             message: "Please enter a valid number.",
//                           },
//                         })}
//                         error={!!errors.mileage}
//                         helperText={errors.mileage?.message}
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <SpeedIcon color="primary" />
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>
//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <Controller
//                         name="fuel_type"
//                         control={control}
//                         defaultValue=""
//                         rules={{ required: "Fuel type is required!" }}
//                         render={({ field }) => (
//                           <Autocomplete
//                             fullWidth
//                             size="medium"
//                             freeSolo
//                             options={fuelType.map((option) => option.label)}
//                             value={field.value || ""}
//                             onInputChange={(event, newValue) => {
//                               field.onChange(newValue)
//                             }}
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 label=" Fuel Type"
//                                 error={!!errors.fuel_type}
//                                 helperText={errors.fuel_type?.message}
//                                 InputProps={{
//                                   ...params.InputProps,
//                                   startAdornment: (
//                                     <>
//                                       <InputAdornment position="start">
//                                         <LocalGasStationIcon color="primary" />
//                                       </InputAdornment>
//                                       {params.InputProps.startAdornment}
//                                     </>
//                                   ),
//                                 }}
//                               />
//                             )}
//                           />
//                         )}
//                       />
//                     </Grid>

//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <TextField
//                         fullWidth
//                         label="Driver Name (T)"
//                         {...register("driver_name")}
//                         InputProps={{
//                           startAdornment: (
//                             <InputAdornment position="start">
//                               <PersonIcon color="primary" />
//                             </InputAdornment>
//                           ),
//                         }}
//                       />
//                     </Grid>

//                     <Grid item lg={12} md={12} sm={12} xs={12}>
//                       <Grid container spacing={1}>
//                         <Grid item lg={3} md={4} sm={12} xs={12}>
//                           <Autocomplete
//                             fullWidth
//                             freeSolo
//                             options={countries}
//                             getOptionLabel={(option) => option.code}
//                             value={driverCountryCode}
//                             onChange={(event, newValue) => {
//                               setDriverCountryCode(newValue)
//                             }}
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 label="Select Country Code"
//                                 variant="outlined"
//                                 InputProps={{
//                                   ...params.InputProps,
//                                   startAdornment: (
//                                     <>
//                                       <InputAdornment position="start">
//                                         <FlagIcon color="primary" />
//                                       </InputAdornment>
//                                       {params.InputProps.startAdornment}
//                                     </>
//                                   ),
//                                 }}
//                               />
//                             )}
//                           />
//                         </Grid>
//                         <Grid item lg={9} md={8} sm={12} xs={12}>
//                           <TextField
//                             {...register("driver_contact")}
//                             fullWidth
//                             label="Driver Contact No (N)"
//                             variant="outlined"
//                             type="tel"
//                             value={driverPhoneNumber}
//                             onChange={handleDriverPhoneNumberChange}
//                             placeholder="Enter phone number"
//                             size="medium"
//                             InputProps={{
//                               startAdornment: (
//                                 <InputAdornment position="start">
//                                   <PhoneIcon color="primary" />
//                                 </InputAdornment>
//                               ),
//                             }}
//                           />
//                         </Grid>
//                       </Grid>
//                     </Grid>
//                   </Grid>
//                 </Box>

//                 <button
//                   disabled={isLoading}
//                   className="block mt-3 w-full bg-[#42A1DA] text-white font-bold p-4 rounded-lg"
//                 >
//                   {isLoading ? (
//                     "Processing..."
//                   ) : isEditing ? (
//                     <>
//                       <EditIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//                       Update Vehicle
//                     </>
//                   ) : (
//                     <>
//                       <AddCircleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//                       Add Vehicle
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default JobCardForm
