import PageHeader from "../../components/common/PageHeader";
import OperatorList from "../../components/operator/OperatorList";

const OperatorPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Operator"
        breadcrumbs={[{ label: "Resource" }, { label: "Operator" }]}
      />
      <OperatorList />
    </div>
  );
};

export default OperatorPage;
