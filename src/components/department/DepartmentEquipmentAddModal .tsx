import { useEffect, useState, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin } from "antd";
import ModalComponent from "../common/ModalComponent";
import CustomButton from "../common/CustomButton";
import DepartmentService from "../../services/DepartmentService";
import { toast } from "../common/Toast";
import type { DepartmentEquipmentRequest } from "../../types/department";
import type { EquipmentResponse } from "../../types/equipment";
import {
  ControlledSearchableSelect,
  type SearchableSelectOption,
} from "../common/SearchableSelectField";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  departmentId: number;
}

const DepartmentEquipmentAddModal = ({
  visible,
  onCancel,
  onSuccess,
  departmentId,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
    setValue,
  } = useForm<DepartmentEquipmentRequest>({
    defaultValues: {
      departmentId: departmentId,
      equipmentId: undefined,
    },
  });

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  const fetchEquipments = useMemo(() => {
    const fetcher = async (
      search: string
    ): Promise<SearchableSelectOption[]> => {
      try {
        const data: EquipmentResponse[] =
          await DepartmentService.getEquipmentsByDepartmentDropdown(
            departmentId,
            search
          );
        return data.map((eq) => ({
          value: eq.id,
          label: `${eq.equipmentName} (${eq.equipmentNumber})`,
        }));
      } catch (err) {
        console.error(err);
        return [];
      }
    };

    const wrapped = (search: string): Promise<SearchableSelectOption[]> =>
      fetcher(search);

    return wrapped;
  }, [departmentId]);

  const handleFormSubmit: SubmitHandler<DepartmentEquipmentRequest> = (
    data
  ) => {
    setIsSubmitting(true);
    DepartmentService.assignEquipment(data)
      .then(() => {
        toast.success("Equipment assigned successfully");
        onSuccess();
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          error.response?.data?.devMessage || "Failed to assign equipment"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <ModalComponent
      title="Assign Equipment"
      visible={visible}
      handleCancel={onCancel}
      width={600}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <ControlledSearchableSelect
            name="equipmentId"
            control={control}
            label="Select Equipment"
            placeholder="Search or select an equipment..."
            fetchOptions={fetchEquipments}
            debounceMs={300}
            allowClear
            rules={{ required: "Equipment is required" }}
            className="w-full"
            selectClassName="searchable-select-custom"
            onSelectChange={(value: number | string) =>
              setValue("equipmentId", Number(value))
            }
            error={errors.equipmentId}
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
              Assign
            </CustomButton>
          </div>
        </form>
      </Spin>
    </ModalComponent>
  );
};

export default DepartmentEquipmentAddModal;
