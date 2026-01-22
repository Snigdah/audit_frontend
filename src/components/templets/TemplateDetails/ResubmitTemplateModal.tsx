// ============================================
// ResubmitTemplateModal.tsx
// ============================================
import React, { useState, useEffect } from "react";
import { Modal, Spin, Button } from "antd";
import { ArrowLeft, X } from "lucide-react";
import Step2Structure from "../CreateTempletStep/Step2Structure";
import Step3Permissions from "../CreateTempletStep/Step3Permissions";
import Step4Review from "../CreateTempletStep/Step4Review";
import { TemplateService } from "../../../services/TempletService";
import { toast } from "../../common/Toast";
import type { 
  TemplateStructureRequest,
  TemplateSubmissionRequest
} from "../../../types/template";

interface ResubmitTemplateModalProps {
  templateId: number;
  initialStructure: TemplateStructureRequest;
  templateName?: string;
  description?: string;
  departmentName?: string;
  equipmentName?: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ResubmitTemplateModal: React.FC<ResubmitTemplateModalProps> = ({
  templateId,
  initialStructure,
  templateName = "Template",
  description = "",
  departmentName = "",
  equipmentName = "",
  open,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(1); // Start at step 1 (which is step 2 in the full flow)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [structure, setStructure] = useState<TemplateStructureRequest>(initialStructure);

  // Reset structure when modal opens or initialStructure changes
  useEffect(() => {
    if (open) {
      setStructure(initialStructure);
      setStep(1);
    }
  }, [open, initialStructure]);

  const steps = [
    { number: 1, title: "Design Structure", description: "Design the table structure" },
    { number: 2, title: "Set Permissions", description: "Configure cell permissions" }, 
    { number: 3, title: "Review & Submit", description: "Review and submit" }, 
  ];

  const handleFinalSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    
    try {
      const payload: TemplateSubmissionRequest = structure;

      await TemplateService.submitTemplate(templateId, payload);
      toast.success("Template resubmitted successfully");

      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.devMessage || "Failed to resubmit template"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setStep(1);
      setStructure(initialStructure);
      onClose();
    }
  };

  // Create a meta object for Step4Review with actual template data
  const meta = {
    templateName: templateName,
    description: description || "",
    departmentId: 0,
    departmentName: departmentName,
    equipmentId: 0,
    equipmentName: equipmentName,
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width="90%"
      style={{ maxWidth: "1200px" }}
      closeIcon={<X size={20} />}
      maskClosable={!isSubmitting}
      closable={!isSubmitting}
    >
      <div className="p-4">
        <div className="mb-4 flex items-center gap-4">
          <button 
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            type="button"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Resubmit Template</h1>
            <p className="text-gray-600 mt-1">
              Step {step} of {steps.length}: {steps.find(s => s.number === step)?.description || steps[step - 1]?.description}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
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
              <Step2Structure
                initialStructure={structure}
                onBack={handleClose}
                onNext={(data: TemplateStructureRequest) => {
                  setStructure(data);
                  setStep(2);
                }}
              />
            )}

            {step === 2 && structure && (
              <Step3Permissions
                structure={structure}
                onBack={() => setStep(1)}
                onNext={(updatedStructure: TemplateStructureRequest) => {
                  setStructure(updatedStructure);
                  setStep(3);
                }}
              />
            )}

            {step === 3 && structure && (
              <Step4Review
                meta={meta}
                structure={structure}
                onBack={() => setStep(2)}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </Spin>
      </div>
    </Modal>
  );
};

export default ResubmitTemplateModal;
