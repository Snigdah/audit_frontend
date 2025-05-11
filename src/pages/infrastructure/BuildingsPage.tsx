import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Building } from "../../types/building";
import BuildingCard from "../../components/BuildingCard ";

const BuildingsPage = () => {
  const navigate = useNavigate();
  const [buildings] = useState<Building[]>([
    {
      id: 1,
      buildingName: "Main Administration",
      totalFloor: 8,
      location: "Central Campus",
    },
    {
      id: 2,
      buildingName: "Science Complex",
      totalFloor: 5,
      location: "East Wing",
    },
    {
      id: 3,
      buildingName: "Library",
      totalFloor: 4,
      location: "North Campus",
    },
    {
      id: 4,
      buildingName: "Student Center",
      totalFloor: 3,
      location: "Central Plaza",
    },
    {
      id: 5,
      buildingName: "Engineering Hall",
      totalFloor: 6,
      location: "West Wing",
    },
    {
      id: 6,
      buildingName: "Underground Parking",
      totalFloor: 2,
      location: "Below Main Building",
    },
  ]);

  const handleViewFloors = (building: Building) => {
    navigate(`/infrastructure/building/${building.id}/floors/`, {
      state: { buildingName: building.buildingName },
    });
  };

  const handleAddBuilding = () => {
    // Logic for adding a new building
    console.log("Add new building clicked");
  };

  const handleEditBuilding = (building: Building) => {
    // Logic for editing a building
    console.log("Edit building:", building);
  };

  const handleDeleteBuilding = (building: Building) => {
    // Logic for deleting a building
    console.log("Delete building:", building);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Building Management
          </h1>
          <button
            onClick={handleAddBuilding}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add New Building
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((building) => (
            <BuildingCard
              key={building.id}
              building={building}
              onViewFloors={handleViewFloors}
              onEdit={handleEditBuilding}
              onDelete={handleDeleteBuilding}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildingsPage;
