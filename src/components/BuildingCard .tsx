import type { Building } from "../types/building";

interface BuildingCardProps {
  building: Building;
  onViewFloors: (building: Building) => void;
  onEdit?: (building: Building) => void;
  onDelete?: (building: Building) => void;
}

const BuildingCard = ({
  building,
  onViewFloors,
  onEdit,
  onDelete,
}: BuildingCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800">
            {building.buildingName}
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {building.totalFloor}{" "}
            {building.totalFloor === 1 ? "Floor" : "Floors"}
          </span>
        </div>

        <div className="mt-4 flex items-center text-gray-600">
          <LocationIcon />
          <span>{building.location}</span>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => onViewFloors(building)}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Floors
          </button>
          <div className="flex space-x-2">
            {onEdit && (
              <IconButton
                onClick={() => onEdit(building)}
                icon={<EditIcon />}
                ariaLabel="Edit Building"
                className="text-gray-500 hover:text-gray-700"
              />
            )}
            {onDelete && (
              <IconButton
                onClick={() => onDelete(building)}
                icon={<DeleteIcon />}
                ariaLabel="Delete Building"
                className="text-red-500 hover:text-red-700"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for better readability and reusability
const LocationIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
  className?: string;
}

const IconButton = ({
  onClick,
  icon,
  ariaLabel,
  className = "",
}: IconButtonProps) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`p-2 rounded-full hover:bg-gray-100 ${className}`}
  >
    {icon}
  </button>
);

export default BuildingCard;
