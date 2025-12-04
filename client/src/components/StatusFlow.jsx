const STATUS_STEPS = [
  { key: "open", label: "Open", color: "#0EA5E9" },
  { key: "in-progress", label: "In Progress", color: "#F59E0B" },
  { key: "resolved", label: "Resolved", color: "#10B981" },
  { key: "closed", label: "Closed", color: "#6B7280" }
];

const StatusFlow = ({ currentStatus, onChange, role, isCreator, isAssignee }) => {

  // ---- Permission Logic ----
  const canClick = (next) => {
    if (role === "admin") return true;

    // support / senior support
    if (["support", "senior_support"].includes(role)) {
      if (currentStatus === "open" && next === "in-progress") return true;
      if (currentStatus === "in-progress" && next === "resolved") return true;
      return false;
    }

    // employee creator
    if (role === "employee" && isCreator) {
      if (currentStatus === "resolved" && next === "closed") return true;
      return false;
    }

    return false;
  };

  return (
    <div className="flex items-center gap-3 w-full">
      {STATUS_STEPS.map((step, index) => {
        const isActive = currentStatus === step.key;
        const clickable = canClick(step.key);

        return (
          <div key={step.key} className="flex items-center">
            {/* BOX */}
            <div
              onClick={() => clickable && onChange(step.key)}
              className={`
                px-6 py-3 rounded-md font-medium text-white shadow-md relative
                transition-all duration-200 min-w-[150px] text-center
                ${isActive ? "ring-2 ring-primary scale-[1.03]" : ""}
                ${clickable ? "cursor-pointer hover:opacity-90" : "opacity-60 cursor-not-allowed"}
              `}
              style={{ backgroundColor: step.color }}
            >
              {step.label}
            </div>

            {/* ARROW */}
            {index < STATUS_STEPS.length - 1 && (
              <div className="text-gray-500 font-bold text-lg mx-2">→</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatusFlow;