import React from 'react';

interface IndigoLogoProps {
  className?: string;
  showText?: boolean;
}

export const IndigoLogo: React.FC<IndigoLogoProps> = ({
  className = "h-11",
  showText = true
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Square Framed Brand Logo as per official asset */}
      <svg
        viewBox="0 0 160 160"
        className="h-full w-auto aspect-square shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Square Purple Border Frame */}
        <rect
          x="6"
          y="6"
          width="148"
          height="148"
          stroke="#4b0082"
          strokeWidth="4"
          fill="none"
        />

        {/* Brand Name Typography */}
        <g fill="#4b0082" fontFamily="Playfair Display, Georgia, serif">
          {/* 'indigo' */}
          <text
            x="80"
            y="54"
            textAnchor="middle"
            fontSize="40"
            fontWeight="600"
            letterSpacing="-1.5"
          >
            indigo
          </text>

          {/* '&' */}
          <text
            x="80"
            y="94"
            textAnchor="middle"
            fontSize="38"
            fontWeight="400"
            fontStyle="italic"
          >
            &
          </text>

          {/* 'CO' */}
          <text
            x="80"
            y="134"
            textAnchor="middle"
            fontSize="38"
            fontWeight="600"
            letterSpacing="2"
          >
            CO
          </text>
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col justify-center select-none">
          <span className="text-xl sm:text-2xl font-black text-[#4b0082] tracking-tight font-serif-brand leading-none">
            Indigo & Co.
          </span>
          <span className="text-[9px] sm:text-[10px] tracking-[2.5px] uppercase text-[#4b0082]/70 font-bold mt-1">
            indigoandco.in
          </span>
        </div>
      )}
    </div>
  );
};
