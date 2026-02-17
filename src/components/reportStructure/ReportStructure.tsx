import StructureChangeList from "./StructureChangeList";

interface ReportStructureProps {
  reportId: string;
  onOpenChangeRequest?: () => void;
}

const ReportStructure = ({ reportId, onOpenChangeRequest }: ReportStructureProps) => {
  return (
    <StructureChangeList
      reportId={reportId}
      onOpenChangeRequest={onOpenChangeRequest}
    />
  );
};

export default ReportStructure;
