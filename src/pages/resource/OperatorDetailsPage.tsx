import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import OperatorInfo from "../../components/operator/OperatorInfo";
import OperatorEquipments from "../../components/operator/OperatorEquipments";
import OperatorSupervisor from "../../components/operator/OperatorSupervisor";

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
        {operatorId && <OperatorEquipments operatorId={operatorId} />}
      </div>

      <div className="pb-2">
        {operatorId && <OperatorSupervisor operatorId={operatorId} />}
      </div>
    </div>
  );
};

export default OperatorDetailsPage;
