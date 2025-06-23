import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";

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
    </div>
  );
};

export default DepartmentsPage;
