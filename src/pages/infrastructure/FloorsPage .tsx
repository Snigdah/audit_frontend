import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Floor } from "../../types/floor";
import type { Building } from "../../types/building";

const FloorsPage = () => {
  const { buildingId } = useParams<{ buildingId: string }>();
  const [building, setBuilding] = useState<Building | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBuildingAndFloors = async () => {
      setIsLoading(true);

      try {
        // Dummy data for demo
        const buildings: Building[] = [
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
        ];

        const selected = buildings.find(
          (b) => b.id === parseInt(buildingId || "", 10)
        );
        setBuilding(selected || null);

        const dummyFloors: Floor[] = [
          {
            id: 101,
            buildingId: 1,
            floorLevel: 8,
            floorName: "Executive Offices",
          },
          {
            id: 102,
            buildingId: 1,
            floorLevel: 7,
            floorName: "Administration",
          },
          { id: 201, buildingId: 2, floorLevel: 5, floorName: "Research Labs" },
        ];

        const filteredFloors = dummyFloors.filter(
          (f) => f.buildingId === Number(buildingId)
        );
        setFloors(filteredFloors);
      } catch (error) {
        console.error("Error loading floors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuildingAndFloors();
  }, [buildingId]);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (!building) return <p className="p-4 text-red-500">Building not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/buildings" className="text-blue-600 hover:underline">
            &larr; Back to Buildings
          </Link>
          <h2 className="text-2xl font-bold mt-2">
            {building.buildingName} – Floors
          </h2>
          <p className="text-sm text-gray-600">{building.location}</p>
        </div>

        {floors.length === 0 ? (
          <p>No floors found for this building.</p>
        ) : (
          <ul className="space-y-4">
            {floors.map((floor) => (
              <li
                key={floor.id}
                className="p-4 border rounded shadow-sm bg-white"
              >
                <strong>Floor {floor.floorLevel}:</strong> {floor.floorName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FloorsPage;
