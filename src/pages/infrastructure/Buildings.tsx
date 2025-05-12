import { useEffect, useState } from "react";
import type { Building, BuildingResponse } from "../../types/building";
import BuildingService from "../../services/BuildingService";

const Buildings = () => {
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await BuildingService.getAllBuildings();
        setBuildings(data);
      } catch (error) {
        console.error("Failed to fetch buildings", error);
      }
    };

    fetchBuildings();
  }, []);

  return (
    <div>
      <h2>Building List</h2>
      <ul>
        {buildings.map((building) => (
          <li key={building.id}>
            <strong>{building.buildingName}</strong> — Total Floors:{" "}
            {building.totalFloor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Buildings;
