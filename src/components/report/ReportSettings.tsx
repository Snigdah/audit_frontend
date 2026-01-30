import ReportTime from "../reportSettings/ReportTime";

interface ReportSettingsProps {
    reportId: string;
}

const ReportSettings = ({ reportId }: ReportSettingsProps) => {
  return (
    <>
      <ReportTime reportId={reportId} />
    </>
  )
}

export default ReportSettings;