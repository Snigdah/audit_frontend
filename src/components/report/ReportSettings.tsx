import ReportOperator from "../reportSettings/ReportOperator";
import ReportTime from "../reportSettings/ReportTime";

interface ReportSettingsProps {
    reportId: string;
}

const ReportSettings = ({ reportId }: ReportSettingsProps) => {
  return (
    <>
      <ReportTime reportId={reportId} />
      <ReportOperator reportId={reportId} />
    </>
  )
}

export default ReportSettings;