import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin, message } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import DesignationService from "../../services/DesignationService";
import { DesignationModel, type Designation } from "../../types/designation";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";

interface Props {
  visible: boolean;
  editingData?: Designation | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const DesignationAddOrUpdate = ({
  visible,
  editingData,
  onCancel,
  onSuccess,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!editingData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<{ designationName: string }>({
    defaultValues: {
      designationName: "",
    },
  });

  // Handle modal state and form initialization
  useEffect(() => {
    if (!visible) {
      reset({ designationName: "" });
      return;
    }

    editingData
      ? setValue("designationName", editingData.name)
      : reset({ designationName: "" });
  }, [visible, editingData, setValue, reset]);

  const handleFormSubmit: SubmitHandler<{ designationName: string }> = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = new DesignationModel(
        data.designationName,
        isEditMode ? editingData?.id : undefined
      );

      if (isEditMode) {
        await DesignationService.updateDesignation(payload);
        toast.success("Designation updated");
      } else {
        await DesignationService.createDesignation(payload);
        toast.success("Designation created");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.devMessage || "Designation operation failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCancel = () => {
    if (isSubmitting) return;
    onCancel();
  };

  return (
    <ModalComponent
      title={isEditMode ? "Edit Designation" : "Add New Designation"}
      visible={visible}
      handleCancel={handleCancel}
      width={600}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <InputField
            name="designationName"
            label="Designation Name"
            placeholder="Enter designation name (e.g. Senior Developer)"
            register={register}
            error={errors.designationName}
            required
            registerOptions={{
              required: "Designation name is required",
              minLength: {
                value: 2,
                message: "Designation name must be at least 2 characters",
              },
              maxLength: {
                value: 100,
                message: "Designation name must not exceed 100 characters",
              },
            }}
          />

          <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-3 pt-2 border-t border-gray-200">
            {/* Cancel Button */}
            <Button
              className="w-full md:w-auto !bg-white !text-red-600 !border !border-red-500 hover:!bg-red-50 hover:!text-red-700 !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
              onClick={handleCancel}
              disabled={isSubmitting}
              size="large"
            >
              Cancel
            </Button>

            {/* Submit Button */}
            <CustomButton
              htmlType="submit"
              loading={isSubmitting}
              disabled={!isDirty && isEditMode}
              className="w-full md:w-auto min-w-[100px] !bg-gray-900 hover:!bg-gray-700 !text-white !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
              size="large"
            >
              {isEditMode ? "Update" : "Add "}
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default DesignationAddOrUpdate;
