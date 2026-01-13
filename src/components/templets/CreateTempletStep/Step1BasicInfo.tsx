// ============================================
// Step1BasicInfo.tsx
// ============================================
import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import type { TemplateMetaForm } from "../../../types/template";
import { InputField } from "../../common/InputField";
import CustomButton from "../../common/CustomButton";

interface Step1BasicInfoProps {
  form: UseFormReturn<TemplateMetaForm>;
  onNext: () => void;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ form, onNext }) => {
  const { register, trigger, formState: { errors } } = form;

  const handleNext = async (): Promise<void> => {
    const valid = await trigger([
      "templateName",
      "departmentId",
      "equipmentId",
    ]);
    if (valid) onNext();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
      
      <div className="space-y-4">
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
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Describe what this template is used for..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            name="departmentId"
            label="Department ID"
            type="number"
            placeholder="Enter department ID"
            register={register}
            error={errors.departmentId}
            required
            registerOptions={{
              required: "Department ID is required",
              min: {
                value: 1,
                message: "Department ID must be greater than 0",
              },
            }}
          />

          <InputField
            name="equipmentId"
            label="Equipment ID"
            type="number"
            placeholder="Enter equipment ID"
            register={register}
            error={errors.equipmentId}
            required
            registerOptions={{
              required: "Equipment ID is required",
              min: {
                value: 1,
                message: "Equipment ID must be greater than 0",
              },
            }}
          />
        </div>

        <div className="pt-6 border-t border-gray-200 flex justify-end">
          <CustomButton
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
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