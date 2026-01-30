import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import TemplateSubmissionDetail from "../../components/templets/TemplateDetails/TemplateSubmissionDetail";

const TemplateSubmissionDetailsPage = () => {
  const { templateRequestId, submissionId } = useParams<{
    templateRequestId: string;
    submissionId: string;
  }>();

  if (!templateRequestId || !submissionId) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Submission Details"
        breadcrumbs={[
          { label: "Reports" },
          { label: "Template Request", path: "/reports/template" },
          { label: "Details", path: `/report/template/${templateRequestId}` },
          { label: "Submission Details" },
        ]}
      />
      <div className="px-4 bg-white rounded-lg shadow-sm">
        <TemplateSubmissionDetail
          templateId={Number(templateRequestId)}
          submissionId={Number(submissionId)}
        />
      </div>
    </div>
  );
};

export default TemplateSubmissionDetailsPage;
