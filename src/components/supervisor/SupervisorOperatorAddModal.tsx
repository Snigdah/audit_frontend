import { useEffect, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { Button, Select, Spin, message } from "antd";
import ModalComponent from "../common/ModalComponent";
import CustomButton from "../common/CustomButton";
import SupervisorService from "../../services/SupervisorService";
import OperatorService from "../../services/OperatorService";
import { debounce } from "lodash";
import { toast } from "../common/Toast";
import type { OperatorSimple } from "../../types/operator";
import type { SupervisorOperatorRequest } from "../../types/supervisor";

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  supervisorId: number;
}

const SupervisorOperatorAddModal = ({
  visible,
  onCancel,
  onSuccess,
  supervisorId,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operatorOptions, setOperatorOptions] = useState<OperatorSimple[]>([]);
  const [operatorLoading, setOperatorLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<SupervisorOperatorRequest>({
    defaultValues: {
      supervisorId: supervisorId,
      operatorId: undefined,
    },
  });

  useEffect(() => {
    if (!visible) {
      reset();
    } else {
      // Auto-fetch operators when modal opens
      fetchOperators("");
    }
  }, [visible, reset]);

  const fetchOperators = debounce((search: string) => {
    setOperatorLoading(true);
    OperatorService.getAllOperatorsDropdown(search)
      .then((data) => setOperatorOptions(data))
      .catch((err) => {
        console.error(err);
        message.error("Failed to load operators");
      })
      .finally(() => setOperatorLoading(false));
  }, 500);

  const handleFormSubmit: SubmitHandler<SupervisorOperatorRequest> = (data) => {
    setIsSubmitting(true);
    SupervisorService.assignOperator(data)
      .then(() => {
        toast.success("Operator assigned successfully");
        onSuccess();
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          error.response?.data?.devMessage || "Failed to assign operator"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
          {/* Operator Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Select Operator
            </label>
            <Controller
              name="operatorId"
              control={control}
              rules={{ required: "Operator is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select an operator"
                  loading={operatorLoading}
                  filterOption={false}
                  onSearch={(value) => fetchOperators(value)}
                  onChange={(value) => field.onChange(value)}
                  className="w-full"
                  listHeight={200}
                  virtual
                >
                  {operatorOptions.map((operator) => (
                    <Option key={operator.id} value={operator.id}>
                      {operator.name} ({operator.employeeId})
                    </Option>
                  ))}
                </Select>
              )}
            />

            {errors.operatorId && (
              <span className="text-red-600 text-sm">
                {errors.operatorId.message}
              </span>
            )}
          </div>

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

export default SupervisorOperatorAddModal;
