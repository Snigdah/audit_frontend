import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import SupervisorInfo from "../../components/supervisor/SupervisorInfo";

const SuperVisorDetails = () => {
  const { supervisorId } = useParams();
  return (
    <div>
      <PageHeader
        title="Supervisor Details"
        breadcrumbs={[
          { label: "Resource" },
          { label: "Supervisor", path: "/resource/supervisor" },
          { label: "Supervisor Details" },
        ]}
      />
      <div className="pb-2">
        {supervisorId && <SupervisorInfo supervisorId={supervisorId} />}
      </div>
    </div>
  );
};

export default SuperVisorDetails;
