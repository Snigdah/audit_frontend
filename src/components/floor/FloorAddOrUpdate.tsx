import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import type { FloorFormData, FloorResponse } from "../../types/floor";
import { FloorModel } from "../../types/floor";
import FloorService from "../../services/FloorService.ts";
import CustomButton from "../common/CustomButton.tsx";
import { toast } from "../common/Toast.tsx";

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
        toast.success("Floor updated");
      } else {
        await FloorService.createFloor(payload);
        toast.success("Floor created");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.devMessage || "Floor operation failed");
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

          <div className="flex flex-col-reverse gap-3 mt-3 pt-2 border-t border-gray-200 sm:flex-row sm:justify-end">
            <Button
              className="w-full sm:w-auto !bg-white !text-red-600 !border !border-red-500 hover:!bg-red-50 hover:!text-red-700 !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
              onClick={handleCancel}
              disabled={isSubmitting}
              size="large"
            >
              Cancel
            </Button>

            <CustomButton
              htmlType="submit"
              loading={isSubmitting}
              disabled={!isDirty && isEditMode}
              size="large"
              className="w-full sm:w-auto min-w-[100px] !bg-gray-900 hover:!bg-gray-700 !text-white !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
            >
              {isEditMode ? "Update Floor" : "Add Floor"}
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default FloorAddOrUpdate;
