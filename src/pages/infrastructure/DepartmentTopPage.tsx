import PageHeader from "../../components/common/PageHeader";
import DepartmentTopList from "../../components/department/DepartmentTopList";

const DepartmentTopPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Building"
        breadcrumbs={[{ label: "Infrastructure" }, { label: "Department" }]}
      />

      <DepartmentTopList />
    </div>
  );
};

export default DepartmentTopPage;
