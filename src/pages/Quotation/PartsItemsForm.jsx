/* eslint-disable react/prop-types */
import { suggestionStyles } from "../../utils/customStyle";
import { formatNumber } from "../../utils/formateSemicolon";
import { unitOptions } from "../../utils/options";

const PartsItemsForm = ({
  isEditMode,
  specificQuotation,
  items,
  showSuggestions,
  activeInputType,
  activeInputIndex,
  productSuggestions,
  addButton,
  removeLoading,
  handleDescriptionChange,
  handleQuantityChange,
  handleUnitChange,
  handleRateChange,
  handleRemoveButton,
  handlePartsAddButton,
  handleAddClick,
  handleRemove,
  handleSelectSuggestion,
  activeSuggestionIndex,
}) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-2 items-center font-bold mb-5 md:mb-1 mt-5">
        <label className="col-span-6 md:col-span-1 text-center hidden md:block">
          SL No
        </label>
        <label className="col-span-12 md:col-span-6 text-center">
          Parts Description
        </label>
        <label className="col-span-6 md:col-span-2 text-center hidden md:block">
          Qty
        </label>
        <label className="col-span-6 md:col-span-1 text-center hidden md:block">
          Rate
        </label>
        <label className="col-span-6 md:col-span-1 text-center hidden md:block">
          Amount
        </label>
        <label className="opacity-0 col-span-6 md:col-span-1 hidden md:block">
          hidden items for responsive
        </label>
      </div>

      {/* Existing Parts Items for Edit Mode */}
      {isEditMode && specificQuotation?.input_data?.length > 0 && (
        <>
          {specificQuotation.input_data.map((item, i) => (
            <div key={i}>
              <div className="grid grid-cols-12 gap-2 items-center mt-3">
                <div className="col-span-12 md:col-span-1">
                  <input
                    className="inputField"
                    autoComplete="off"
                    type="text"
                    placeholder="SL No"
                    defaultValue={`${i + 1 < 10 ? `0${i + 1}` : i + 1}`}
                    required
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <div style={suggestionStyles.suggestionContainer}>
                    <input
                      className="inputField"
                      autoComplete="off"
                      type="text"
                      placeholder="Description"
                      onChange={(e) =>
                        handleDescriptionChange(i, e.target.value)
                      }
                      value={item.description || ""}
                      required
                    />
                    {showSuggestions &&
                      activeInputType === "parts" &&
                      activeInputIndex === i && (
                        <div style={suggestionStyles.suggestionsList}>
                          {productSuggestions.map((product, index) => (
                            <div
                              key={product._id}
                              style={{
                                ...suggestionStyles.suggestionItem,
                                ...(index === activeSuggestionIndex
                                  ? suggestionStyles.suggestionItemActive
                                  : {}),
                              }}
                              onClick={() => handleSelectSuggestion(product)}
                            >
                              <div
                                style={suggestionStyles.suggestionItemContent}
                              >
                                <span
                                  style={suggestionStyles.suggestionItemName}
                                >
                                  {product.product.product_name}
                                </span>
                                <span
                                  style={suggestionStyles.suggestionItemPrice}
                                >
                                  Stock: {product.stock}
                                </span>
                                <span
                                  style={suggestionStyles.suggestionItemPrice}
                                >
                                  {product.product.unit?.short_name}
                                </span>
                                <span
                                  style={suggestionStyles.suggestionItemPrice}
                                >
                                  {product.product?.sellingPrice}
                                </span>
                                <span
                                  style={suggestionStyles.suggestionItemPrice}
                                >
                                  WH: {product.warehouse?.name}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-2 flex gap-2">
                  <div className="grid grid-cols-12 quotationSelect">
                    <input
                      className="inputField col-span-3"
                      autoComplete="off"
                      type="text"
                      placeholder="Qty"
                      onChange={(e) => handleQuantityChange(i, e.target.value)}
                      value={item.quantity || ""}
                      required
                    />
                    <select
                      className="inputField col-span-9"
                      onChange={(e) => handleUnitChange(i, e.target.value)}
                      value={item.unit || ""}
                      required
                    >
                      <option value="" disabled>
                        Select Unit
                      </option>
                      {unitOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-1">
                  <input
                    className="inputField"
                    autoComplete="off"
                    placeholder="Rate"
                    onChange={(e) => handleRateChange(i, e.target.value)}
                    required
                    type="text"
                    value={item.rateDisplay || item.rate || ""}
                  />
                </div>
                <div className="col-span-12 md:col-span-1">
                  <input
                    className="inputField"
                    autoComplete="off"
                    type="text"
                    placeholder="Amount"
                    value={formatNumber(item.total)}
                    readOnly
                  />
                </div>
                <div className="col-span-12 md:col-span-1">
                  <button
                    type="button"
                    disabled={removeLoading}
                    onClick={() => handleRemoveButton(i, "parts")}
                    className="w-full bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md py-2 px-2 justify-center"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Add New Parts Items Button for Edit Mode */}
      {isEditMode && (
        <div className="flex items-center justify-end mt-2">
          {!addButton && (
            <button
              type="button"
              onClick={handlePartsAddButton}
              className="w-[135px] bg-[#42A1DA] hover:bg-[#42A1DA] text-white p-2 rounded-md"
            >
              Add new
            </button>
          )}
          {addButton && (
            <button
              type="button"
              onClick={handlePartsAddButton}
              className="border w-[135px] border-[#42A1DA] hover:border-[#42A1DA] text-black rounded-md px-2 py-2 mb-2"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* New Parts Items */}
      {(!isEditMode || (isEditMode && addButton)) && (
        <>
          {items.map((item, i) => {
            return (
              <div key={i}>
                <div className="grid grid-cols-12 gap-2 items-center mt-3">
                  <div className="col-span-12 md:col-span-1">
                    <input
                      className="inputField"
                      autoComplete="off"
                      type="text"
                      placeholder="SL No"
                      defaultValue={`${i + 1 < 10 ? `0${i + 1}` : i + 1}`}
                      required
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div style={suggestionStyles.suggestionContainer}>
                      <input
                        className="inputField"
                        autoComplete="off"
                        type="text"
                        placeholder="Description"
                        onChange={(e) =>
                          handleDescriptionChange(i, e.target.value)
                        }
                        value={item.description}
                        required
                      />
                      {showSuggestions &&
                        activeInputType === "parts" &&
                        activeInputIndex === i && (
                          <div style={suggestionStyles.suggestionsList}>
                            {productSuggestions.map((product, index) => (
                              <div
                                key={product._id}
                                style={{
                                  ...suggestionStyles.suggestionItem,
                                  ...(index === activeSuggestionIndex
                                    ? suggestionStyles.suggestionItemActive
                                    : {}),
                                }}
                                onClick={() => handleSelectSuggestion(product)}
                              >
                                <div
                                  style={suggestionStyles.suggestionItemContent}
                                >
                                  <span
                                    style={suggestionStyles.suggestionItemName}
                                  >
                                    {product.product.product_name}
                                  </span>
                                  <span
                                    style={suggestionStyles.suggestionItemPrice}
                                  >
                                    Stock: {product.stock}
                                  </span>
                                  <span
                                    style={suggestionStyles.suggestionItemPrice}
                                  >
                                    {product.product.unit?.short_name}
                                  </span>
                                  <span
                                    style={suggestionStyles.suggestionItemPrice}
                                  >
                                    {product.product?.sellingPrice}
                                  </span>
                                  <span
                                    style={suggestionStyles.suggestionItemPrice}
                                  >
                                    WH: {product.warehouse?.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-2 flex gap-2">
                    <div className="grid grid-cols-12 quotationSelect">
                      <input
                        className="inputField col-span-3"
                        autoComplete="off"
                        type="text"
                        placeholder="Qty"
                        onChange={(e) =>
                          handleQuantityChange(i, e.target.value)
                        }
                        value={item.quantity}
                        required
                      />
                      <select
                        className="inputField col-span-9"
                        onChange={(e) => handleUnitChange(i, e.target.value)}
                        value={item.unit || ""}
                        required
                      >
                        <option value="" disabled>
                          Select Unit
                        </option>
                        {unitOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-1">
                    <input
                      className="inputField"
                      autoComplete="off"
                      placeholder="Rate"
                      onChange={(e) => handleRateChange(i, e.target.value)}
                      required
                      type="text"
                      value={item.rateDisplay || ""}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-1">
                    <input
                      className="inputField"
                      autoComplete="off"
                      type="text"
                      placeholder="Amount"
                      value={formatNumber(item.total)}
                      readOnly
                    />
                  </div>
                  <div className="col-span-12 md:col-span-1">
                    {items.length !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemove(i)}
                        className="w-full bg-[#FF4C4C] hover:bg-[#FF3333] text-white rounded-md py-2 px-2 justify-center"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-1">
                  {items.length - 1 === i && (
                    <button
                      type="button"
                      onClick={handleAddClick}
                      className="w-[135px] bg-[#42A1DA] hover:bg-[#42A1DA] text-white p-2 rounded-md"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default PartsItemsForm;
