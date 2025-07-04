import PageHeader from "../../components/common/PageHeader";
import EquipmentTopList from "../../components/equipment/EquipmentTopList";

const EquipmentTopPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Equipment"
        breadcrumbs={[{ label: "Infrastructure" }, { label: "Equipment" }]}
      />

      <EquipmentTopList />
    </div>
  );
};

export default EquipmentTopPage;
