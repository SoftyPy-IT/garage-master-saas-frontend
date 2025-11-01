import { useState, useEffect } from "react";

export const useQuotationCalculations = (items = [], serviceItems = [], specificQuotation = {}) => {
    const [partsTotal, setPartsTotal] = useState(0);
    const [serviceTotal, setServiceTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [vat, setVAT] = useState(0);
    const [tax, setTax] = useState(0);

    // Calculate totals whenever items change
    useEffect(() => {
        const calculateTotals = () => {
            // Calculate parts total
            const existingPartsTotal = specificQuotation?.input_data?.reduce(
                (sum, item) => sum + (Number.parseFloat(item.total) || 0), 0
            ) || 0;
            const newPartsTotal = items.reduce(
                (sum, item) => sum + (Number.parseFloat(item.total) || 0), 0
            );

            // Calculate service total
            const existingServiceTotal = specificQuotation?.service_input_data?.reduce(
                (sum, item) => sum + (Number.parseFloat(item.total) || 0), 0
            ) || 0;
            const newServiceTotal = serviceItems.reduce(
                (sum, item) => sum + (Number.parseFloat(item.total) || 0), 0
            );

            const totalPartsAmount = existingPartsTotal + newPartsTotal;
            const totalServiceAmount = existingServiceTotal + newServiceTotal;
            const grandTotalAmount = totalPartsAmount + totalServiceAmount;

            setPartsTotal(totalPartsAmount);
            setServiceTotal(totalServiceAmount);
            setGrandTotal(grandTotalAmount);
        };

        calculateTotals();
    }, [items, serviceItems, specificQuotation]);

    const calculateFinalTotal = () => {
        let currentPartsTotal = partsTotal;
        let currentServiceTotal = serviceTotal;

        // Fallback to specificQuotation data if current totals are 0
        if (currentPartsTotal === 0 && specificQuotation?.parts_total) {
            currentPartsTotal = Number(specificQuotation.parts_total);
        }
        if (currentServiceTotal === 0 && specificQuotation?.service_total) {
            currentServiceTotal = Number(specificQuotation.service_total);
        }

        const currentGrandTotal = currentPartsTotal + currentServiceTotal;

        // Use current discount or fallback to specificQuotation
        let effectiveDiscount = discount;
        if (discount === "" && specificQuotation?.discount !== undefined) {
            effectiveDiscount = Number(specificQuotation.discount) || 0;
        }

        let totalAfterDiscount = currentGrandTotal - effectiveDiscount;
        totalAfterDiscount = totalAfterDiscount < 0 ? 0 : totalAfterDiscount;

        // Use current VAT or fallback to specificQuotation
        let effectiveVat = vat;
        if (vat === "" && specificQuotation?.vat !== undefined) {
            effectiveVat = Number(specificQuotation.vat) || 0;
        }

        const vatAmount = totalAfterDiscount * (effectiveVat / 100);
        const totalAfterVat = totalAfterDiscount + vatAmount;

        // Use current tax or fallback to specificQuotation
        let effectiveTax = tax;
        if (tax === "" && specificQuotation?.tax !== undefined) {
            effectiveTax = Number(specificQuotation.tax) || 0;
        }

        const taxAmount = totalAfterVat * (effectiveTax / 100);
        const finalTotal = totalAfterVat + taxAmount;

        return Number.parseFloat(finalTotal).toFixed(2);
    };

    const handleDiscountChange = (value) => {
        const parsedValue = value === "" ? 0 : Number.parseFloat(value);
        if (!isNaN(parsedValue)) {
            setDiscount(parsedValue);
        }
    };

    const handleVATChange = (value) => {
        const parsedValue = value === "" ? 0 : Number.parseFloat(value);
        if (!isNaN(parsedValue)) {
            setVAT(parsedValue);
        }
    };

    const handleTaxChange = (value) => {
        const parsedValue = value === "" ? 0 : Number.parseFloat(value);
        if (!isNaN(parsedValue)) {
            setTax(parsedValue);
        }
    };

    return {
        partsTotal,
        serviceTotal,
        grandTotal,
        discount,
        vat,
        tax,
        setDiscount,
        setVAT,
        setTax,
        calculateFinalTotal,
        handleDiscountChange,
        handleVATChange,
        handleTaxChange,
    };
};