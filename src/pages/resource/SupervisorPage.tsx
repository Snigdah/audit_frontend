import PageHeader from "../../components/common/PageHeader";
import SupervisorList from "../../components/supervisor/SupervisorList";

const SupervisorPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Supervisor"
        breadcrumbs={[{ label: "Resource" }, { label: "Supervisor" }]}
      />
      <SupervisorList />
    </div>
  );
};

export default SupervisorPage;
