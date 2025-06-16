import PageHeader from "../../components/common/PageHeader";

const DesignationPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Designation"
        breadcrumbs={[{ label: "Settings" }, { label: "Designation" }]}
      />
      <div>
        <h1>This is designation page</h1>
      </div>
    </div>
  );
};

export default DesignationPage;
