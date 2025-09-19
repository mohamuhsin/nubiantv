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
    <div className="w-full">
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        // cast defaultCountry to any to bypass TS issue
        defaultCountry={defaultCountry as any}
        value={value}
        onChange={onChange}
        placeholder="Enter phone number"
        className={`w-full h-12 px-3 text-sm rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
