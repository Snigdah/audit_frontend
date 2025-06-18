import BuildingList from "../../components/buildings/BuildingList";
import PageHeader from "../../components/common/PageHeader";

const Buildings = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Building"
        breadcrumbs={[{ label: "Infrastructure" }, { label: "Building" }]}
      />

      <BuildingList />
    </div>
  );
};

export default Buildings;
