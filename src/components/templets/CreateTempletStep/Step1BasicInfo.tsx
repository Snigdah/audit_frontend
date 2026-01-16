import React, { useEffect, useState, useMemo } from "react";
import { useWatch, type UseFormReturn } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import type { TemplateMetaForm } from "../../../types/template";
import { InputField } from "../../common/InputField";
import CustomButton from "../../common/CustomButton";
import DepartmentService from "../../../services/DepartmentService";
import type { Department } from "../../../types/department";
import type { EquipmentResponse } from "../../../types/equipment";
import { ControlledSearchableSelect } from "../../common/SearchableSelectField";
import type { SearchableSelectOption } from "../../common/SearchableSelectField";

interface Step1BasicInfoProps {
  form: UseFormReturn<TemplateMetaForm>;
  onNext: () => void;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ form, onNext }) => {
  const { control, register, trigger, formState: { errors }, setValue } = form;

  // State to store fetched data for name lookup
  const [departments, setDepartments] = useState<Department[]>([]);
  const [equipments, setEquipments] = useState<EquipmentResponse[]>([]);

  // Watch departmentId to trigger equipment fetch
  const departmentId = useWatch({
    control,
    name: "departmentId",
  });

  // Clear equipment when department changes
  useEffect(() => {
    setValue("equipmentId", null as any);
    setValue("equipmentName", undefined);
    setEquipments([]); // Clear equipment list
  }, [departmentId, setValue]);

  const handleNext = async (): Promise<void> => {
    const valid = await trigger([
      "templateName",
      "departmentId",
      "equipmentId",
    ]);
    if (valid) onNext();
  };

  // Department fetch function
  const fetchDepartments = async (searchTerm: string): Promise<SearchableSelectOption[]> => {
    try {
      const depts: Department[] = await DepartmentService.searchDepartments(searchTerm);
      setDepartments(depts);
      return depts.map(dept => ({ 
        value: dept.id, 
        label: dept.name 
      }));
    } catch (error) {
      console.error("Error fetching departments:", error);
      return [];
    }
  };

  // Equipment fetch function - memoized with departmentId
  const fetchEquipments = useMemo(() => {
    return async (searchTerm: string): Promise<SearchableSelectOption[]> => {
      if (!departmentId) return [];
      try {
        const eqs: EquipmentResponse[] = await DepartmentService.getEquipmentsByDepartmentDropdown(
          departmentId, 
          searchTerm
        );
        setEquipments(eqs);
        return eqs.map(eq => ({ 
          value: eq.id, 
          label: `${eq.equipmentName} (${eq.equipmentNumber})`
        }));
      } catch (error) {
        console.error("Error fetching equipment:", error);
        return [];
      }
    };
  }, [departmentId]);

  // Handle department selection
  const handleDepartmentChange = (value: number | string): void => {
    const deptId = Number(value);
    const selected = departments.find(dept => dept.id === deptId);
    if (selected) {
      setValue("departmentName", selected.name);
    }
  };

  // Handle equipment selection
  const handleEquipmentChange = (value: number | string): void => {
    const eqId = Number(value);
    const selected = equipments.find(eq => eq.id === eqId);
    if (selected) {
      setValue("equipmentName", `${selected.equipmentName} (${selected.equipmentNumber})`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
      
      <div className="space-y-6">
        <InputField
          name="templateName"
          label="Template Name"
          placeholder="Enter template name (e.g., Daily QC Check)"
          register={register}
          error={errors.templateName}
          required
          registerOptions={{
            required: "Template name is required",
            minLength: {
              value: 3,
              message: "Template name must be at least 3 characters",
            },
            maxLength: {
              value: 100,
              message: "Template name must not exceed 100 characters",
            },
          }}
          className="mb-0"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ControlledSearchableSelect
            name="departmentId"
            control={control}
            label="Department"
            required
            error={errors.departmentId}
            placeholder="Search or select department..."
            fetchOptions={fetchDepartments}
            debounceMs={300}
            allowClear
            rules={{
              validate: (value: number) => value > 0 || "Please select a department",
            }}
            className="mb-0"
            selectClassName="w-full h-10"
            onSelectChange={handleDepartmentChange}
          />

          <ControlledSearchableSelect
            key={departmentId || 'no-dept'}
            name="equipmentId"
            control={control}
            label="Equipment"
            required
            error={errors.equipmentId}
            placeholder={departmentId ? "Search or select equipment..." : "Select department first"}
            fetchOptions={fetchEquipments}
            debounceMs={300}
            allowClear
            rules={{
              required: "Equipment is required",
              validate: (value: number) => value > 0 || "Please select an equipment",
            }}
            className="mb-0"
            selectClassName="searchable-select-custom"
            disabled={!departmentId}
            onSelectChange={handleEquipmentChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Describe what this template is used for..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="pt-6 border-t border-gray-200 flex justify-end">
          <CustomButton
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md text-sm font-medium"
            size="large"
          >
            Next Step <ArrowRight size={18} className="ml-2" />
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;