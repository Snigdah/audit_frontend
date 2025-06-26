import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin, message } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import type { DepartmentFormData, Department } from "../../types/department";
import { DepartmentModel } from "../../types/department";
import DepartmentService from "../../services/DepartmentService";
import CustomButton from "../common/CustomButton";
import { toast } from "../common/Toast";

interface Props {
  visible: boolean;
  floorId: number;
  editingData?: Department | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const DepartmentAddOrUpdate = ({
  visible,
  editingData,
  floorId,
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
  } = useForm<DepartmentFormData>({
    defaultValues: {
      deptName: "",
    },
  });

  useEffect(() => {
    if (visible) {
      if (editingData) {
        setValue("deptName", editingData.name);
      } else {
        reset({ deptName: "" });
      }
    } else {
      reset({ deptName: "" });
    }
  }, [visible, editingData, setValue, reset]);

  const handleFormSubmit: SubmitHandler<DepartmentFormData> = async (data) => {
    setIsSubmitting(true);

    try {
      const payload = new DepartmentModel(
        data.deptName,
        floorId,
        editingData?.id
      );

      if (isEditMode) {
        await DepartmentService.updateDepartment(payload);
        toast.success("Department updated");
      } else {
        await DepartmentService.createDepartment(payload);
        toast.success("Department created");
      }

      onSuccess();
    } catch (error: any) {
      toast.error(
        error.response?.data?.devMessage || "Department operation failed"
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
      title={isEditMode ? "Edit Department" : "Add New Department"}
      visible={visible}
      handleCancel={handleCancel}
      width={600}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <InputField
            name="deptName"
            label="Department Name"
            placeholder="Enter department name (e.g. HR, IT)"
            register={register}
            error={errors.deptName}
            required
            registerOptions={{
              required: "Department name is required",
              minLength: {
                value: 2,
                message: "Department name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Department name must not exceed 50 characters",
              },
            }}
          />

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
              {isEditMode ? "Update Department" : "Add Department"}
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default DepartmentAddOrUpdate;
