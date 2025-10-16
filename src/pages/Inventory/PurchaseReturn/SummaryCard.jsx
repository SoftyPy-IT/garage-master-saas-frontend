/* eslint-disable react/prop-types */
export const SummaryCard = ({ value, title, icon, gradient, avatarColor }) => (
  <div className="rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:translate-y-[-5px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]">
    <div className="flex items-center p-3 md:p-4 lg:py-6 rounded-xl h-full" style={{ background: gradient }}>
      <div
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
        style={{ backgroundColor: avatarColor }}
      >
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className="text-sm font-medium text-gray-500">{title}</p>
      </div>
    </div>
  </div>
);