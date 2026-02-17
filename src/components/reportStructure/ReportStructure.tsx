interface ReportStructureProps {
    reportId: string;
}

const ReportStructure = ({ reportId }: ReportStructureProps) => {
  return <div>Report Structure Component for report ID: {reportId}</div>;
}

export default ReportStructure;