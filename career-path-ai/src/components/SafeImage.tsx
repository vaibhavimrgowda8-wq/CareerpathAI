import React, { useState } from "react";
import { User } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  variant?: "photo" | "avatar";
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = "",
  fallbackLabel,
  variant = "photo",
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-950 text-sky-100 ${className}`}
      >
        <User className={variant === "avatar" ? "h-6 w-6 opacity-80" : "h-10 w-10 opacity-75"} />
        {fallbackLabel && (
          <span className="mt-2 px-3 text-center text-xs font-medium text-sky-200/80">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
