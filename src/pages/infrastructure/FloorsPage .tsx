import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import BuildingDetails from "../../components/buildings/BuildingDetails";
import FloorList from "../../components/floor/FloorList";

const FloorsPage = () => {
  const { buildingId } = useParams();

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Floor"
        breadcrumbs={[
          { label: "Buildings", path: "/infrastructure/building" },
          { label: "Floors" },
        ]}
      />
      <div className="pb-8">
        {buildingId && <BuildingDetails buildingId={buildingId} />}
      </div>

      <div className="pb-8">
        {buildingId && <FloorList buildingId={buildingId} />}
      </div>
    </div>
  );
};

export default FloorsPage;
