import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import OperatorInfo from "../../components/operator/OperatorInfo";
import OperatorSupervisor from "../../components/operator/OperatorSupervisor";
import OperatorEquipment from "../../components/operator/OperatorEquipment";

const OperatorDetailsPage = () => {
  const { operatorId } = useParams();
  return (
    <div>
      <PageHeader
        title="Operator Details"
        breadcrumbs={[
          { label: "Resource" },
          { label: "Operator", path: "/resource/operator" },
          { label: "Operator Details" },
        ]}
      />
      <div className="pb-2">
        {operatorId && <OperatorInfo operatorId={operatorId} />}
      </div>
      <div className="pb-2">
        {operatorId && <OperatorSupervisor operatorId={operatorId} />}
      </div>
      <div className="pb-2">
        {operatorId && <OperatorEquipment operatorId={operatorId} />}
      </div>
    </div>
  );
};

export default OperatorDetailsPage;
