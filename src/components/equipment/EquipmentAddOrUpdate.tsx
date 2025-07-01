import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import EquipmentService from "../../services/EquipmentService";
import type { EquipmentResponse } from "../../types/equipment";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";

interface EquipmentFormData {
  equipmentNumber: string;
  name: string;
}

interface Props {
  visible: boolean;
  editingData?: EquipmentResponse | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EquipmentAddOrUpdate = ({
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
  } = useForm<EquipmentFormData>({
    defaultValues: {
      equipmentNumber: "",
      name: "",
    },
  });

  useEffect(() => {
    if (visible) {
      if (editingData) {
        setValue("equipmentNumber", editingData.equipmentNumber);
        setValue("name", editingData.equipmentName);
      } else {
        reset({ equipmentNumber: "", name: "" });
      }
    } else {
      reset({ equipmentNumber: "", name: "" });
    }
  }, [visible, editingData, setValue, reset]);

  const handleFormSubmit: SubmitHandler<EquipmentFormData> = async (data) => {
    setIsSubmitting(true);

    try {
      if (isEditMode && editingData?.id) {
        await EquipmentService.updateEquipment(editingData.id, data);
        toast.success("Equipment updated");
      } else {
        await EquipmentService.createEquipment(data);
        toast.success("Equipment created");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.devMessage || "Equipment operation failed"
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
      title={isEditMode ? "Edit Equipment" : "Add New Equipment"}
      visible={visible}
      handleCancel={handleCancel}
      width={600}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <InputField
            name="equipmentNumber"
            label="Equipment Number"
            placeholder="Enter equipment number"
            register={register}
            error={errors.equipmentNumber}
            required
            registerOptions={{
              required: "Equipment number is required",
              minLength: {
                value: 2,
                message: "Equipment number must be at least 2 characters",
              },
              maxLength: {
                value: 20,
                message: "Equipment number must not exceed 20 characters",
              },
            }}
          />

          <InputField
            name="name"
            label="Equipment Name"
            placeholder="Enter equipment name"
            register={register}
            error={errors.name}
            required
            registerOptions={{
              required: "Equipment name is required",
              minLength: {
                value: 2,
                message: "Equipment name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Equipment name must not exceed 50 characters",
              },
            }}
          />

          <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-3 pt-2 border-t border-gray-200">
            <Button
              className="w-full md:w-auto !bg-white !text-red-600 !border !border-red-500 hover:!bg-red-50 hover:!text-red-700 !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
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
              className="w-full md:w-auto min-w-[100px] !bg-gray-900 hover:!bg-gray-700 !text-white !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
              size="large"
            >
              {isEditMode ? "Update Equipment" : "Add Equipment"}
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default EquipmentAddOrUpdate;
