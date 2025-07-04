import { useEffect, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { Button, Select, Spin, message } from "antd";
import ModalComponent from "../common/ModalComponent";
import CustomButton from "../common/CustomButton";
import DepartmentService from "../../services/DepartmentService";
import EquipmentService from "../../services/EquipmentService";
import { debounce } from "lodash";
import { toast } from "../common/Toast";
import type { EquipmentResponse } from "../../types/equipment";
import type { DepartmentEquipmentRequest } from "../../types/department";

const { Option } = Select;

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
  const [equipmentOptions, setEquipmentOptions] = useState<EquipmentResponse[]>(
    []
  );
  const [equipmentLoading, setEquipmentLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
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

  const fetchEquipments = debounce((search: string) => {
    setEquipmentLoading(true);
    EquipmentService.getAllEquipments(search)
      .then((data) => setEquipmentOptions(data))
      .catch((err) => {
        console.error(err);
        message.error("Failed to load equipments");
      })
      .finally(() => setEquipmentLoading(false));
  }, 500);

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
          {/* Equipment Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Select Equipment
            </label>
            <Controller
              name="equipmentId"
              control={control}
              rules={{ required: "Equipment is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select an equipment"
                  loading={equipmentLoading}
                  filterOption={false}
                  onSearch={(value) => fetchEquipments(value)}
                  onFocus={() => fetchEquipments("")}
                  onChange={(value) => field.onChange(value)}
                  className="w-full"
                  listHeight={200}
                  virtual
                >
                  {equipmentOptions.map((equipment) => (
                    <Option key={equipment.id} value={equipment.id}>
                      {equipment.equipmentName} ({equipment.equipmentNumber})
                    </Option>
                  ))}
                </Select>
              )}
            />

            {errors.equipmentId && (
              <span className="text-red-600 text-sm">
                {errors.equipmentId.message}
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

export default DepartmentEquipmentAddModal;
