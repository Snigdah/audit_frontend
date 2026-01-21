import { useState } from "react";
import { Card, Button, Space, Spin, Input } from "antd";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "../../../components/common/Toast";
import ModalComponent from "../../common/ModalComponent";
import CustomButton from "../../common/CustomButton";
import type { TemplateStatus, ReviewDecisionRequest } from "../../../types/template";
import { TemplateService } from "../../../services/TempletService";

const { TextArea } = Input;

interface TemplateActionsProps {
  templateId: number;
  status: TemplateStatus;
  submissionId?: number;
  onActionComplete: () => void;
}

interface ReviewFormData {
  reviewComment: string;
}

const TemplateActions = ({
  templateId,
  status,
  submissionId,
  onActionComplete,
}: TemplateActionsProps) => {
  const { authState } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewAction, setReviewAction] = useState<"APPROVED" | "REJECTED" | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      reviewComment: "",
    },
  });

  // Only show for PENDING status and ADMIN role
  if (status !== "PENDING" || authState.role !== "ADMIN") {
    return null;
  }

  const handleOpenModal = (action: "APPROVED" | "REJECTED") => {
    setReviewAction(action);
    setModalVisible(true);
    reset({ reviewComment: "" });
  };

  const handleCloseModal = () => {
    if (actionLoading) return;
    setModalVisible(false);
    setReviewAction(null);
    reset({ reviewComment: "" });
  };

  const handleFormSubmit: SubmitHandler<ReviewFormData> = async (data) => {
    if (!reviewAction || !submissionId) {
      toast.error("Missing submission information");
      return;
    }

    setActionLoading(true);
    try {
      const payload: ReviewDecisionRequest = {
        status: reviewAction,
        reviewComment: data.reviewComment,
      };

      await TemplateService.reviewTemplateSubmission(
        templateId,
        submissionId,
        payload
      );

      toast.success(
        reviewAction === "APPROVED"
          ? "Template approved successfully"
          : "Template rejected"
      );

      handleCloseModal();
      onActionComplete();
    } catch (err: any) {
      console.error("Error reviewing template:", err);
      toast.error(
        err.response?.data?.devMessage || "Failed to review template"
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Review Template Request
            </h3>
            <p className="text-sm text-gray-600">
              Approve or reject this template request
            </p>
          </div>
          <Space size="small">
            <Button
              icon={<CloseCircleOutlined />}
              onClick={() => handleOpenModal("REJECTED")}
              disabled={!submissionId}
              className="!bg-white !text-red-600 !border !border-red-300 hover:!bg-red-50 hover:!border-red-400 !px-4 !py-1.5 !h-9 rounded-md font-medium shadow-sm transition-all"
            >
              Reject
            </Button>
            <Button
              icon={<CheckCircleOutlined />}
              onClick={() => handleOpenModal("APPROVED")}
              disabled={!submissionId}
              className="!bg-gray-800 !text-white !border-0 hover:!bg-gray-700 !px-4 !py-1.5 !h-9 rounded-md font-medium shadow-sm transition-all"
            >
              Approve
            </Button>
          </Space>
        </div>
      </Card>

      {/* Review Modal */}
      <ModalComponent
        title={
          reviewAction === "APPROVED"
            ? "Approve Template Request"
            : "Reject Template Request"
        }
        visible={modalVisible}
        handleCancel={handleCloseModal}
        width={600}
      >
        <Spin spinning={actionLoading}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="mb-4">
              <label
                htmlFor="reviewComment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Review Comment
                {reviewAction === "REJECTED" && <span className="text-red-500">*</span>}
              </label>
              <Controller
                name="reviewComment"
                control={control}
                rules={{
                  required:
                    reviewAction === "REJECTED"
                      ? "Comment is required for rejection"
                      : false,
                  minLength: {
                    value: 5,
                    message: "Comment must be at least 5 characters",
                  },
                  maxLength: {
                    value: 500,
                    message: "Comment must not exceed 500 characters",
                  },
                }}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder={
                      reviewAction === "APPROVED"
                        ? "Add approval notes (optional)"
                        : "Explain the reason for rejection"
                    }
                    className={`w-full ${
                      errors.reviewComment ? "border-red-500" : ""
                    }`}
                  />
                )}
              />
              {errors.reviewComment && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.reviewComment.message}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-3 pt-2 border-t border-gray-200">
              {/* Cancel Button */}
              <Button
                className="w-full md:w-auto !bg-white !text-gray-600 !border !border-gray-300 hover:!bg-gray-50 hover:!border-gray-400 !py-1.5 !h-9 !px-4 rounded-md font-medium shadow-sm transition-all"
                onClick={handleCloseModal}
                disabled={actionLoading}
              >
                Cancel
              </Button>

              {/* Submit Button */}
              <CustomButton
                htmlType="submit"
                loading={actionLoading}
                className={`w-full md:w-auto min-w-[120px] !py-1.5 !h-9 !px-5 rounded-md font-medium shadow-sm transition-all ${
                  reviewAction === "APPROVED"
                    ? "!bg-gray-800 hover:!bg-gray-700 !text-white !border-0"
                    : "!bg-rose-600 hover:!bg-rose-700 !text-white !border-0"
                }`}
              >
                {reviewAction === "APPROVED" ? "Approve Template" : "Reject Template"}
              </CustomButton>
            </div>
          </form>
        </Spin>
      </ModalComponent>
    </>
  );
};

export default TemplateActions;