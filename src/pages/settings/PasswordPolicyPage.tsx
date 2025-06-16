import PageHeader from "../../components/common/PageHeader";
import PasswordPolicy from "../../components/settings/PasswordPolicy";

const PasswordPolicyPage = () => {
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Password Policy Configuration"
        breadcrumbs={[{ label: "Settings" }, { label: "Password Policy" }]}
      />

      <PasswordPolicy />
    </div>
  );
};

export default PasswordPolicyPage;
