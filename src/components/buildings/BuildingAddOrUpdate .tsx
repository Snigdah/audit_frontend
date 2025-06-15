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
        console.log(payload);

        await BuildingService.updateBuilding(payload);
        message.success("Building updated successfully!");
      } else {
        await BuildingService.createBuilding(payload);
        message.success("Building created successfully!");
      }

      onSuccess();
    } catch (error) {
      console.error("Building operation failed:", error);
      message.error(
        isEditMode
          ? "Failed to update building. Please try again."
          : "Failed to create building. Please try again."
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
                value: 100,
                message: "Building name must not exceed 100 characters",
              },
              pattern: {
                value: /^[a-zA-Z0-9\s\-_.()]+$/,
                message: "Building name contains invalid characters",
              },
            }}
          />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button onClick={handleCancel} disabled={isSubmitting} size="large">
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              loading={isSubmitting}
              disabled={!isDirty && isEditMode}
              size="large"
              className="min-w-[100px]"
            >
              {isEditMode ? "Update Building" : "Add Building"}
            </Button>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default BuildingAddOrUpdate;
