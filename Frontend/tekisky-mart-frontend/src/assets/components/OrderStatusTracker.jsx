const ORDER_STEPS = [
  { key: "Pending", label: "Order Placed" },
  { key: "Processing", label: "Packed" },
  { key: "Shipped", label: "Shipped" },
  { key: "Delivered", label: "Delivered" }
];

const OrderStatusTracker = ({ status }) => {
  const currentStep = ORDER_STEPS.findIndex(
    step => step.key === status
  );

  return (
    <div className="mt-6">
      <div className="flex items-start justify-between">
        {ORDER_STEPS.map((step, index) => (
          <div
            key={step.key}
            className="flex-1 flex flex-col items-center relative"
          >
            {/* LINE */}
            {index !== 0 && (
              <div
                className={`absolute top-4 left-0 w-1/2 h-1 ${
                  index <= currentStep
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
            )}
            {index !== ORDER_STEPS.length - 1 && (
              <div
                className={`absolute top-4 right-0 w-1/2 h-1 ${
                  index < currentStep
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
            )}

            {/* CIRCLE */}
            <div
              className={`z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                index <= currentStep
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-white"
              }`}
            >
              {index + 1}
            </div>

            {/* LABEL */}
            <span
              className={`mt-2 text-[10px] sm:text-xs text-center ${
                index <= currentStep
                  ? "text-green-700 font-medium"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
