// EquipmentDetailsPage.tsx
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import EquipmentDetails from "../../components/equipment/EquipmentDetails";

const EquipmentDetailsPage = () => {
  const { equipmentId } = useParams();

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Equipment Details"
        breadcrumbs={[
          { label: "Resource" },
          { label: "Equipment", path: "/infrastructure/equipment" },
          { label: "Details" },
        ]}
      />
      <div className="pb-2">
        {equipmentId && <EquipmentDetails equipmentId={equipmentId} />}
      </div>
    </div>
  );
};

export default EquipmentDetailsPage;
