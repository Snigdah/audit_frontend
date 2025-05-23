import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin, message } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import BuildingService from "../../services/BuildingService";
import { BuildingModel, type BuildingFormData } from "../../types/building";

interface Props {
  initialData?: BuildingFormData | null;
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  loading?: boolean;
}

const BuildingAddOrUpdate = ({
  initialData,
  visible,
  onCancel,
  onSuccess,
  loading = false,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BuildingFormData>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (visible) {
      reset(initialData || { name: "" });
    }
  }, [visible, initialData, reset]);

  const handleFormSubmit: SubmitHandler<BuildingFormData> = (data) => {
    setIsSubmitting(true);

    const payload = new BuildingModel(
      data.name,
      isEditMode && initialData ? (initialData as any).id : undefined
    );

    const serviceCall = isEditMode
      ? BuildingService.updateBuilding(payload)
      : BuildingService.createBuilding(payload);

    serviceCall
      .then((response) => {
        message.success(
          isEditMode
            ? "Building updated successfully!"
            : "Building created successfully!"
        );

        if (!isEditMode) {
          reset();
        }

        onSuccess();
        onCancel();
      })
      .catch((error) => {
        console.error("Building operation failed:", error);
        message.error(
          isEditMode
            ? "Failed to update building. Please try again."
            : "Failed to create building. Please try again."
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    reset();
    onCancel();
  };

  return (
    <ModalComponent
      title={isEditMode ? "Edit Building" : "Add New Building"}
      visible={visible}
      handleCancel={handleCancel}
      width={600}
    >
      <Spin spinning={loading || isSubmitting}>
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
