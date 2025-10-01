import { useState, useEffect } from "react";

const useFormattedDate = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const parsedDate = new Date();
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = parsedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    setCurrentDate(formattedDate);
  }, []);

  return { currentDate };
};

export default useFormattedDate;