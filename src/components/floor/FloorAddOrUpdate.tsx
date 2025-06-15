import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin, message } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import type { FloorFormData, FloorResponse } from "../../types/floor";
import { FloorModel } from "../../types/floor";
import FloorService from "../../services/FloorService.ts";

interface Props {
  visible: boolean;
  buildingId: number;
  editingData?: FloorResponse | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const FloorAddOrUpdate = ({
  visible,
  editingData,
  buildingId,
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
  } = useForm<FloorFormData>({
    defaultValues: {
      floorName: "",
      floorLevel: 1,
    },
  });

  useEffect(() => {
    if (visible) {
      if (editingData) {
        setValue("floorName", editingData.floorName);
        setValue("floorLevel", editingData.floorLevel);
      } else {
        reset({ floorName: "", floorLevel: 1 });
      }
    } else {
      reset({ floorName: "", floorLevel: 1 });
    }
  }, [visible, editingData, setValue, reset]);

  const handleFormSubmit: SubmitHandler<FloorFormData> = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = new FloorModel({
        id: editingData?.id,
        buildingId: buildingId,
        floorLevel: data.floorLevel,
        floorName: data.floorName,
      });

      if (isEditMode) {
        await FloorService.updateFloor(payload);
        message.success("Floor updated successfully!");
      } else {
        await FloorService.createFloor(payload);
        message.success("Floor created successfully!");
      }

      onSuccess();
    } catch (error) {
      console.error("Floor operation failed:", error);
      message.error(
        isEditMode
          ? "Failed to update floor. Please try again."
          : "Failed to create floor. Please try again."
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
      title={isEditMode ? "Edit Floor" : "Add New Floor"}
      visible={visible}
      handleCancel={handleCancel}
      width={600}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <InputField
            name="floorName"
            label="Floor Name"
            placeholder="Enter floor name (e.g. Ground Floor)"
            register={register}
            error={errors.floorName}
            required
            registerOptions={{
              required: "Floor name is required",
              minLength: {
                value: 2,
                message: "Floor name must be at least 2 characters",
              },
              maxLength: {
                value: 20,
                message: "Floor name must not exceed 20 characters",
              },
            }}
          />
          {editingData ? (
            ""
          ) : (
            <InputField
              name="floorLevel"
              label="Floor Level"
              placeholder="Enter floor level (e.g. 1)"
              register={register}
              type="number"
              error={errors.floorLevel}
              required
              registerOptions={{
                required: "Floor level is required",
                min: { value: 0, message: "Floor level must be 0 or more" },
              }}
            />
          )}

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
              {isEditMode ? "Update Floor" : "Add Floor"}
            </Button>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default FloorAddOrUpdate;
