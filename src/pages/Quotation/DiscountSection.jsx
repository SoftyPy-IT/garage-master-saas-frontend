/* eslint-disable react/prop-types */
import { formatNumber } from "../../utils/formateSemicolon";

const DiscountSection = ({
  grandTotal,
  discount,
  vat,
  tax,
  handleDiscountChange,
  handleVATChange,
  handleTaxChange,
  calculateFinalTotal,
  partsDiscountRef,
  netTotalAmountRef,
}) => {
  return (
    <div className="discountFieldWrap mt-5">
      <div className="flex items-center">
        <b className="mr-2"> Total Amount: </b>
        <span>{formatNumber(grandTotal)}</span>
      </div>
      <div>
        <b className="mr-2"> Discount: </b>
        <input
          className="py-1 text-center"
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, "");
            handleDiscountChange(rawValue);
          }}
          value={formatNumber(discount)}
          autoComplete="off"
          type="text"
          placeholder="Discount"
          ref={partsDiscountRef}
        />
      </div>
      <div>
        <b className="mr-2">Vat: </b>
        <input
          className="text-center"
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, "");
            handleVATChange(rawValue);
          }}
          value={formatNumber(vat)}
          autoComplete="off"
          type="text"
          placeholder="Vat"
        />
      </div>
      <div>
        <b className="mr-2">Tax: </b>
        <input
          className="text-center"
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, "");
            handleTaxChange(rawValue);
          }}
          value={formatNumber(tax)}
          autoComplete="off"
          type="text"
          placeholder="Tax"
        />
      </div>
      <div>
        <div className="flex items-center ml-3">
          <b className="mr-2">Final Total: </b>
          <span ref={netTotalAmountRef}>
            {formatNumber(calculateFinalTotal())}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscountSection;
