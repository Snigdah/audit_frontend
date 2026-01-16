// components/common/SearchableSelectField.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Controller } from "react-hook-form";
import type { FieldError, Control } from "react-hook-form";
import { Select } from "antd";
import debounce from "lodash/debounce";

export type SearchableSelectOption = {
  value: number | string;
  label: string;
};

type ControlledSearchableSelectProps = {
  name: string;
  control: Control<any>;
  label?: string;
  required?: boolean;
  error?: FieldError;
  placeholder?: string;
  fetchOptions: (searchTerm: string) => Promise<SearchableSelectOption[]>;
  debounceMs?: number;
  allowClear?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  rules?: any;
  defaultValue?: number | string;
  disabled?: boolean;
};

export function ControlledSearchableSelect({
  name,
  control,
  label,
  required = false,
  error,
  placeholder,
  fetchOptions,
  debounceMs = 300,
  allowClear = true,
  className = "",
  labelClassName = "",
  selectClassName = "",
  rules = {},
  defaultValue,
  disabled = false,
}: ControlledSearchableSelectProps) {
  const [options, setOptions] = useState<SearchableSelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedFetchRef = useRef(
    debounce(async (searchValue: string) => {
      setIsLoading(true);
      try {
        const data = await fetchOptions(searchValue);
        setOptions(data);
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs)
  );

  // Initial load
  useEffect(() => {
    if (!disabled) {
      debouncedFetchRef.current("");
    }
  }, [disabled]);

  const handleSearch = useCallback((value: string) => {
    if (!disabled) {
      setSearchTerm(value);
      debouncedFetchRef.current(value);
    }
  }, [disabled]);

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedFetchRef.current.cancel();
    };
  }, []);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName} ${disabled ? 'opacity-60' : ''}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label} is required` : false,
          ...rules,
        }}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Select
            {...field}
            showSearch
            placeholder={disabled ? "Disabled - select department first" : (placeholder || `Search ${label?.toLowerCase()}...`)}
            optionFilterProp="label"
            filterOption={false}
            onSearch={handleSearch}
            onChange={(value) => {
              field.onChange(value);
              setSearchTerm("");
            }}
            loading={isLoading}
            allowClear={allowClear && !disabled}
            size="middle"
            options={options}
            className={`w-full ${selectClassName} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            style={{
              width: '100%',
            }}
            disabled={disabled}
            notFoundContent={
              disabled ? (
                <div className="py-2 text-center text-sm text-gray-500">Please select department first</div>
              ) : isLoading ? (
                <div className="py-2 text-center text-sm text-gray-500">Loading...</div>
              ) : searchTerm ? (
                <div className="py-2 text-center text-sm text-gray-500">No options found</div>
              ) : (
                <div className="py-2 text-center text-sm text-gray-500">Start typing to search</div>
              )
            }
          />
        )}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error.message || "This field is required"}
        </p>
      )}
    </div>
  );
}