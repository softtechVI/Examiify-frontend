import  { useState } from "react";

interface PlanDescriptionProps {
  description: string;
}

const PlanDescription = ({ description }: PlanDescriptionProps) => {
  const [showFull, setShowFull] = useState(false);
  const maxLength = 100;

  const toggleShow = () => setShowFull(!showFull);

  const shouldTruncate = description.length > maxLength;

  return (
    <div className="mt-2 w-full">
      <p className="text-sm text-gray-600 break-words">
        <strong>Description:</strong>
      </p>

      <div
        className={`relative bg-gray-100 rounded p-2 mt-1 text-sm text-gray-700 w-full
          whitespace-pre-wrap break-words
          ${showFull ? "max-h-52 overflow-y-auto" : "max-h-[60px] overflow-hidden"}
        `}
        style={{ overflowX: "hidden" }}  
      >
        {showFull
          ? description
          : description.slice(0, maxLength) + (shouldTruncate ? "..." : "")}
      </div>

      {shouldTruncate && (
        <button
          className="text-blue-600 text-sm underline mt-1"
          onClick={toggleShow}
        >
          {showFull ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default PlanDescription;
