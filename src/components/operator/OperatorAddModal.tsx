import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin } from "antd";
import ModalComponent from "../common/ModalComponent";
import { InputField } from "../common/InputField";
import CustomButton from "../common/CustomButton";
import { ControlledSearchableSelect } from "../common/SearchableSelectField";
import type { SearchableSelectOption } from "../common/SearchableSelectField";
import AuthService from "../../services/AuthService";
import DesignationService from "../../services/DesignationService";
import type { RegisterRequest } from "../../types/auth";
import { toast } from "../common/Toast";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const OperatorAddModal = ({ visible, onCancel, onSuccess }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<Omit<RegisterRequest, "role">>({
    defaultValues: {
      employeeId: "",
      userName: "",
      password: "",
      designation: undefined,
    },
  });

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  const fetchDesignations = async (
    searchTerm: string
  ): Promise<SearchableSelectOption[]> => {
    try {
      const data = await DesignationService.searchDesignations(searchTerm);
      return data.map((d) => ({
          value: d.id,
          label: d.name,
        }));
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const handleFormSubmit: SubmitHandler<Omit<RegisterRequest, "role">> = (
    data
  ) => {
    setIsSubmitting(true);

    const payload: RegisterRequest = {
      ...data,
      role: "OPERATOR",
    };

    AuthService.register(payload)
      .then(() => {
        toast.success("Operator registered successfully");
        onSuccess();
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.devMessage || "Failed to register operator"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <ModalComponent
      title="Add New Operator"
      visible={visible}
      handleCancel={onCancel}
      width={600}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <InputField
            name="employeeId"
            label="Employee ID"
            placeholder="Enter employee ID"
            register={register}
            error={errors.employeeId}
            required
            registerOptions={{ required: "Employee ID is required" }}
          />

          <InputField
            name="userName"
            label="Operator Name"
            placeholder="Enter operator name"
            register={register}
            error={errors.userName}
            required
            registerOptions={{ required: "Operator name is required" }}
          />

          <InputField
            name="password"
            label="Password"
            placeholder="Enter password"
            type="password"
            register={register}
            error={errors.password}
            required
            registerOptions={{ required: "Password is required" }}
          />

          <ControlledSearchableSelect
            name="designation"
            control={control}
            label="Designation"
            required
            error={errors.designation}
            placeholder="Search or select designation..."
            fetchOptions={fetchDesignations}
            debounceMs={300}
            allowClear
            rules={{ required: "Designation is required" }}
            className="mb-0"
          />

          <div className="flex flex-col-reverse md:flex-row justify-end gap-3 mt-3 pt-2 border-t border-gray-200">
            <Button
              className="w-full md:w-auto !bg-white !text-red-600 !border !border-red-500 hover:!bg-red-50 hover:!text-red-700 !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
              onClick={onCancel}
              disabled={isSubmitting}
              size="large"
            >
              Cancel
            </Button>

            <CustomButton
              htmlType="submit"
              loading={isSubmitting}
              disabled={!isDirty}
              className="w-full md:w-auto min-w-[100px] !bg-gray-900 hover:!bg-gray-700 !text-white !py-2 !min-h-[36px] !px-4 sm:!px-6 rounded-md font-medium shadow-sm"
              size="large"
            >
              Add
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default OperatorAddModal;
