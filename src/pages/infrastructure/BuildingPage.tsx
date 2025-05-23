import BuildingList from "../../components/buildings/BuildingList";
import PageHeader from "../../components/common/PageHeader";

const Buildings = () => {
  return (
    <div className="p-4  min-h-screen">
      <PageHeader
        title="Building"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Buildings" },
        ]}
      />

      <BuildingList />
    </div>
  );
};

export default Buildings;
