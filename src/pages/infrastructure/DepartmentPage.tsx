import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import DepartmentList from "../../components/department/DepartmentList";
import FloorDetails from "../../components/floor/FloorDetails";

const DepartmentsPage = () => {
  const { buildingId, floorId } = useParams();
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Departments"
        breadcrumbs={[
          { label: "Infrastructure" },
          { label: "Buildings", path: "/infrastructure/building" },
          { label: "Floors", path: `/infrastructure/building/${buildingId}` },
          { label: "Departments" },
        ]}
      />
      <div className="pb-2">
        {floorId && <FloorDetails floorId={floorId} />}
      </div>
      <div className="pb-2">
        {floorId && <DepartmentList floorId={floorId} />}
      </div>
    </div>
  );
};

export default DepartmentsPage;
