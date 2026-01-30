interface ReportOperatorProps {
    reportId: string;
}

const ReportOperator = ({ reportId }: ReportOperatorProps) => {
  return <div>Report Operator Component for Report ID: {reportId}</div>;
}

export default ReportOperator;