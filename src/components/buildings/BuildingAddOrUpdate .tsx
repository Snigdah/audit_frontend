import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin, message } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import BuildingService from "../../services/BuildingService";
import {
  BuildingModel,
  type BuildingFormData,
  type BuildingResponse,
} from "../../types/building";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";

interface Props {
  visible: boolean;
  editingData?: BuildingResponse | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const BuildingAddOrUpdate = ({
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
  } = useForm<BuildingFormData>({
    defaultValues: {
      name: "",
    },
  });

  // Handle modal open/close and form reset
  useEffect(() => {
    if (visible) {
      if (editingData) {
        // Edit mode: populate form with existing data
        setValue("name", editingData.buildingName);
      } else {
        // Add mode: reset form
        reset({ name: "" });
      }
    } else {
      // Modal closed: always reset form
      reset({ name: "" });
    }
  }, [visible, editingData, setValue, reset]);

  const handleFormSubmit: SubmitHandler<BuildingFormData> = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = new BuildingModel(
        data.name,
        isEditMode ? editingData?.id : undefined
      );

      if (isEditMode) {
        await BuildingService.updateBuilding(payload);
        toast.success("Building updated");
      } else {
        await BuildingService.createBuilding(payload);
        toast.success("Building created");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.devMessage || "Building operation failed"
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
      title={isEditMode ? "Edit Building" : "Add New Building"}
      visible={visible}
      handleCancel={handleCancel}
      width={600}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <InputField
            name="name"
            label="Building Name"
            placeholder="Enter building name (e.g. Main Office)"
            register={register}
            error={errors.name}
            required
            registerOptions={{
              required: "Building name is required",
              minLength: {
                value: 2,
                message: "Building name must be at least 2 characters",
              },
              maxLength: {
                value: 20,
                message: "Building name must not exceed 20 characters",
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
              {isEditMode ? "Update Building" : "Add Building"}
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default BuildingAddOrUpdate;
