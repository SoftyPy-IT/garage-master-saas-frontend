import EmployeeSalaryForm from "./EmployeeSalaryForm";

const UpdateEmployeeSalary = () => {
    const id = new URLSearchParams(location.search).get("id");
    

    return <EmployeeSalaryForm id={id}/>
};

export default UpdateEmployeeSalary;