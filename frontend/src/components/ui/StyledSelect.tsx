import React from "react";

interface StyledSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
}

export const StyledSelect: React.FC<StyledSelectProps> = ({
  children,
  label,
  error,
  className = "",
  ...props
}) => {
  const baseClasses = `
    w-full px-4 py-3 
    bg-gradient-to-r from-slate-800/90 via-purple-700/80 to-slate-800/90
    border border-purple-500/30
    rounded-lg 
    text-white font-medium
    focus:border-cyan-400 
    focus:outline-none 
    focus:ring-2 
    focus:ring-purple-500/50
    transition-all duration-200
    hover:border-purple-400
    backdrop-blur-sm
    shadow-lg shadow-purple-500/20
    appearance-none
    cursor-pointer
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-cyan-400 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select className={baseClasses} {...props}>
          {children}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export const StyledOption: React.FC<
  React.OptionHTMLAttributes<HTMLOptionElement>
> = ({ children, ...props }) => {
  return (
    <option
      className="bg-slate-800 text-white py-2 px-4 hover:bg-purple-700"
      {...props}
    >
      {children}
    </option>
  );
};

export default StyledSelect;
