/* eslint-disable @typescript-eslint/no-explicit-any */
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputProps {
  value?: string;
  onChange: (value?: string) => void;
  defaultCountry?: string;
  error?: string | null;
}

export function PhoneInputCustom({
  value,
  onChange,
  defaultCountry = "UG",
  error = null,
}: PhoneInputProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry as any}
        value={value}
        onChange={onChange}
        placeholder="Enter phone number"
        className={`w-full sm:w-full md:w-full px-4 h-14 text-base rounded-xl border transition-shadow ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        } shadow-sm hover:shadow-md focus:shadow-lg outline-none`}
      />
    </div>
  );
}
