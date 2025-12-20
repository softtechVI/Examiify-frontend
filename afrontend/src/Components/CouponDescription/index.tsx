import { useState } from "react";

interface CouponDescriptionProps {
  description: string;
}

const CouponDescription = ({ description }: CouponDescriptionProps) => {
  const [showFull, setShowFull] = useState(false);

  return (
    <div>
      <p
        className={`text-sm text-gray-600 mb-2 transition-all duration-300 ${
          showFull ? '' : 'line-clamp-2'
        }`}
      >
        {description}
      </p>
      {description.length > 100 && (
        <button
          className="text-gray-500 text-xs float-end"
          onClick={() => setShowFull(!showFull)}
        >
          {showFull ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default CouponDescription;
