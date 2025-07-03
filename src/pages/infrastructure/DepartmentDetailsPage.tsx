import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import DepartmentDetails from "../../components/department/DepartmentDetails";
import DepartmentSupervisor from "../../components/department/DepartmentSupervisor";
import DepartmentEquipment from "../../components/department/DepartmentEquipment";

const DepartmentDetailsPage = () => {
  const { departmentId } = useParams();
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Department Details"
        breadcrumbs={[
          { label: "Resource" },
          { label: "Department", path: "/infrastructure/department" },
          { label: "Details" },
        ]}
      />
      <div className="pb-2">
        {departmentId && <DepartmentDetails departmentId={departmentId} />}
      </div>
      <div className="pb-2">
        {departmentId && <DepartmentSupervisor departmentId={departmentId} />}
      </div>
      <div className="pb-2">
        {departmentId && <DepartmentEquipment departmentId={departmentId} />}
      </div>
    </div>
  );
};

export default DepartmentDetailsPage;
