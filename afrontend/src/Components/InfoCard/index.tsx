import  { useState } from "react";
import { Link } from "react-router-dom";

interface InfoCardProps {
  imageSrc: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgColor?: string;
  hoverScale?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

function InfoCard({
  imageSrc,
  title,
  description,
  buttonText,
  buttonLink,
  bgColor = "#E1E4E4",
  hoverScale = "scale-105",
  textColor = "#049F99",
  buttonBgColor = "#049F99",
  buttonTextColor = "#ffffff",
}: InfoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`h-60 w-80 flex flex-col items-center justify-center rounded-lg shadow-2xl transition-all duration-300 ease-in-out ${
        isHovered ? hoverScale : "scale-100"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <img src={imageSrc} alt={title} className="mb-2 h-16 rounded" />
      <h1 className="text-xl font-bold mb-2" style={{ color: textColor }}>
        {title}
      </h1>
      <p className="mb-4 text-center px-4" style={{ color: textColor }}>
        {description}
      </p>
      <Link
        to={buttonLink}
        className="font-bold px-4 py-2 rounded transition-colors duration-500"
        style={{
          backgroundColor: buttonBgColor,
          color: buttonTextColor,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {buttonText}
      </Link>
    </div>
  );
}

export default InfoCard;
