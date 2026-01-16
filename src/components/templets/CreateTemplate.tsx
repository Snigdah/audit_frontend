// ============================================
// CreateTemplate.tsx - Main Component
// ============================================
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Spin } from "antd";
import { ArrowLeft } from "lucide-react";
import Step1BasicInfo from "./CreateTempletStep/Step1BasicInfo";
import Step2Structure from "./CreateTempletStep/Step2Structure";
import CustomButton from "../common/CustomButton";
import { TemplateService } from "../../services/TempletService";
import { toast } from "../common/Toast";
import type { 
  TemplateRequest, 
  TemplateStructureRequest,
  TemplateMetaForm 
} from "../../types/template";
import Step3Permissions from "./CreateTempletStep/Step3Permissions";
import Step4Review from "./CreateTempletStep/Step4Review";

interface CreateTemplateProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateTemplate: React.FC<CreateTemplateProps> = ({ onCancel, onSuccess }) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<TemplateMetaForm>({
    defaultValues: {
      templateName: "",
      description: "",
      departmentId: undefined as any,
      equipmentId: undefined as any,
    },
  });

  const [structure, setStructure] = useState<TemplateStructureRequest | null>(null);

  const handleFinalSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    
    try {
      const formValues = form.getValues();
      
      // Only send IDs to the API, not names
      const payload: TemplateRequest = {
        templateName: formValues.templateName,
        description: formValues.description,
        departmentId: formValues.departmentId,
        equipmentId: formValues.equipmentId,
        templateStructureRequest: structure!,
      };

      await TemplateService.createTemplateRequest(payload);
      toast.success("Template created successfully and sent for approval");
      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.devMessage || "Failed to create template"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", description: "Enter template details" },
    { number: 2, title: "Design Structure", description: "Design the table structure" },
    { number: 3, title: "Set Permissions", description: "Configure cell permissions" }, 
    { number: 4, title: "Review & Submit", description: "Review and submit for approval" }, 
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            type="button"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Template</h1>
            <p className="text-gray-600 mt-1">Step {step} of 4: {steps[step-1]?.description}</p>
          </div>
        </div>

        {/* Responsive Progress Indicator */}
        <div className="mb-4 bg-white rounded-lg shadow-sm p-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max sm:min-w-0">
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.number}>
                <div className="flex items-center flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step >= stepItem.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepItem.number}
                  </div>
                  <div className="ml-2 hidden md:block">
                    <div className={`text-xs font-medium whitespace-nowrap ${
                      step >= stepItem.number ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {stepItem.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 min-w-[20px] ${
                    step > stepItem.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Spin spinning={isSubmitting}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {step === 1 && (
              <Step1BasicInfo
                form={form}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <Step2Structure
                initialStructure={structure}
                onBack={() => setStep(1)}
                onNext={(data: TemplateStructureRequest) => {
                  setStructure(data);
                  setStep(3);
                }}
              />
            )}

            {step === 3 && structure && (
              <Step3Permissions
                structure={structure}
                onBack={() => setStep(2)}
                onNext={(updatedStructure: TemplateStructureRequest) => {
                  setStructure(updatedStructure);
                  setStep(4);
                }}
              />
            )}

             {step === 4 && structure && (
              <Step4Review
                meta={form.getValues()}
                structure={structure}
                onBack={() => setStep(3)}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </Spin>
    </div>
  );
};

export default CreateTemplate;