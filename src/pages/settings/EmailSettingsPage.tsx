import PageHeader from "../../components/common/PageHeader";
import EmailSettings from "../../components/settings/EmailSettings";

const EmailSettingsPage = () =>{
    return(
      <div className="min-h-screen">
        <PageHeader
            title="Email Settings"
            breadcrumbs={[{ label: "Settings" }, { label: "Email Settings" }]}
        />
        <EmailSettings />
    </div>
    )
}

export default EmailSettingsPage;