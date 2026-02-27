import { useEffect, useState, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button, Spin } from "antd";
import ModalComponent from "../common/ModalComponent";
import CustomButton from "../common/CustomButton";
import EquipmentService from "../../services/EquipmentService";
import OperatorService from "../../services/OperatorService";
import { toast } from "../common/Toast";
import type { OperatorSimple } from "../../types/operator";
import type { EquipmentOperatorRequest } from "../../types/equipment";
import {
  ControlledSearchableSelect,
  type SearchableSelectOption,
} from "../common/SearchableSelectField";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  equipmentId: number;
}

const EquipmentOperatorAddModal = ({
  visible,
  onCancel,
  onSuccess,
  equipmentId,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
    setValue,
  } = useForm<EquipmentOperatorRequest>({
    defaultValues: {
      equipmentId,
      operatorId: undefined,
    },
  });

  useEffect(() => {
    if (!visible) reset();
  }, [visible, reset]);

  const fetchOperators = useMemo(() => {
    const fetcher = async (
      search: string
    ): Promise<SearchableSelectOption[]> => {
      try {
        const data: OperatorSimple[] =
          await OperatorService.getAllOperatorsDropdown(search);
        return data.map((op) => ({
          value: op.id,
          label: `${op.name} (${op.employeeId})`,
        }));
      } catch (err) {
        console.error(err);
        return [];
      }
    };

    const debounced = (
      ...args: [string]
    ): Promise<SearchableSelectOption[]> =>
      new Promise((resolve) => {
        void fetcher(args[0]).then(resolve);
      });

    return debounced;
  }, []);

  const handleFormSubmit: SubmitHandler<EquipmentOperatorRequest> = async (
    data
  ) => {
    setIsSubmitting(true);
    try {
      await EquipmentService.assignOperator(data);
      toast.success("Operator assigned successfully");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.devMessage || "Failed to assign operator"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalComponent
      title="Assign Operator"
      visible={visible}
      handleCancel={onCancel}
      width={600}
    >
      <Spin spinning={isSubmitting}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <ControlledSearchableSelect
            name="operatorId"
            control={control}
            label="Select Operator"
            placeholder="Search or select an operator..."
            fetchOptions={fetchOperators}
            debounceMs={300}
            allowClear
            rules={{ required: "Operator is required" }}
            className="w-full"
            selectClassName="searchable-select-custom"
            onSelectChange={(value: number | string) =>
              setValue("operatorId", Number(value))
            }
            error={errors.operatorId}
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

export default EquipmentOperatorAddModal;
