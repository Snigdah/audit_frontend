import type {
  FieldError,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";

type InputFieldProps = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  className?: string;
  labelClassName?: string;
  step?: string;
  required?: boolean;
  registerOptions?: RegisterOptions;
};

export const InputField = ({
  name,
  label,
  type = "text",
  placeholder,
  register,
  error,
  className = "",
  labelClassName = "",
  step,
  required = false,
  registerOptions,
}: InputFieldProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        {...register(name, registerOptions)}
        type={type}
        placeholder={placeholder}
        step={step}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );
};
