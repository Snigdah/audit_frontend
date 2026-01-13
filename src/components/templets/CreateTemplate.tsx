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

  // STEP 1 (simple form)
  const form = useForm<TemplateMetaForm>({
    defaultValues: {
      templateName: "",
      description: "",
      departmentId: undefined as any,
      equipmentId: undefined as any,
    },
  });

  // STEP 2 (complex structure)
  const [structure, setStructure] = useState<TemplateStructureRequest | null>(null);

  const handleFinalSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    
    try {
      const payload: TemplateRequest = {
        ...form.getValues(),
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

  // Progress steps configuration
  const steps = [
    { number: 1, title: "Basic Info", description: "Enter template details" },
    { number: 2, title: "Design Structure", description: "Design the table structure" },
    { number: 3, title: "Set Permissions", description: "Configure cell permissions" }, 
    { number: 4, title: "Review & Submit", description: "Review and submit for approval" }, 
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back button */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            type="button"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Template</h1>
            <p className="text-gray-600 mt-1">Step {step} of 3: {steps[step-1]?.description}</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.number}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepItem.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepItem.number}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      step >= stepItem.number ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {stepItem.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step > stepItem.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
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
                onBack={() => setStep(1)}
                onNext={(data: TemplateStructureRequest) => {
                  setStructure(data);
                  setStep(3);
                }}
              />
            )}

            {step === 3 && structure && ( // NEW PERMISSIONS STEP
              <Step3Permissions
                structure={structure}
                onBack={() => setStep(2)}
                onNext={(updatedStructure: TemplateStructureRequest) => {
                  setStructure(updatedStructure);
                  setStep(4); // Now goes to Step 4 (review)
                }}
              />
            )}

             {step === 4 && structure && ( // RENAMED FROM Step3Review to Step4Review
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
    </div>
  );
};

export default CreateTemplate;