// components/common/SearchableSelectField.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Controller } from "react-hook-form";
import type { FieldError, Control, FieldValues } from "react-hook-form";
import { Select } from "antd";
import type { SelectProps } from "antd";
import debounce from "lodash/debounce";

export type SearchableSelectOption = {
  value: number | string;
  label: string;
};

type ControlledSearchableSelectProps = {
  name: string;
  control: Control<any>;
  label: string;
  required?: boolean;
  error?: FieldError;
  placeholder?: string;
  fetchOptions: (searchTerm: string) => Promise<SearchableSelectOption[]>;
  debounceMs?: number;
  allowClear?: boolean;
  className?: string;
  selectClassName?: string; // New prop for Select component styling
  rules?: any;
  defaultValue?: number | string;
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
  selectClassName = "", // Default empty
  rules = {},
  defaultValue,
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
    debouncedFetchRef.current("");
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    debouncedFetchRef.current(value);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedFetchRef.current.cancel();
    };
  }, []);

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
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
            placeholder={placeholder || `Search ${label.toLowerCase()}...`}
            optionFilterProp="label"
            filterOption={false}
            onSearch={handleSearch}
            onChange={(value) => {
              field.onChange(value);
              setSearchTerm("");
            }}
            loading={isLoading}
            allowClear={allowClear}
            size="middle"
            options={options}
            className={`custom-searchable-select ${selectClassName}`}
            style={{
              width: '100%',
              height: '40px', // Match your input field height
            }}
            notFoundContent={
              isLoading ? (
                <div className="py-2 text-center text-sm">Loading...</div>
              ) : searchTerm ? (
                <div className="py-2 text-center text-sm">No options found</div>
              ) : (
                <div className="py-2 text-center text-sm">Start typing to search</div>
              )
            }
          />
        )}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}