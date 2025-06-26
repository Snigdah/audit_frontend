// Response from backend (used in GET, etc.)
export interface FloorResponse {
  id: number;
  buildingId: number;
  buildingName: string;
  floorLevel: number;
  floorName: string;
}

// Form values submitted from React Hook Form
export interface FloorFormData {
  floorName: string;
  floorLevel: number;
}

// DTO for floor creation
export interface FloorCreateDTO {
  buildingId: number;
  floorName: string;
  floorLevel: number;
}

// DTO for floor update
export interface FloorUpdateDTO {
  floorName: string;
}

// Floor model for create/update
export class FloorModel {
  id?: number;
  buildingId?: number;
  floorLevel?: number;
  floorName: string;

  constructor(data: {
    id?: number;
    buildingId?: number;
    floorLevel?: number;
    floorName: string;
  }) {
    this.id = data.id;
    this.buildingId = data.buildingId;
    this.floorLevel = data.floorLevel;
    this.floorName = data.floorName;
  }

  toCreatePayload(): FloorCreateDTO {
    if (
      this.buildingId === undefined ||
      this.floorLevel === undefined ||
      this.floorName === undefined
    ) {
      throw new Error("Missing required fields for creation");
    }
    return {
      buildingId: this.buildingId,
      floorName: this.floorName,
      floorLevel: this.floorLevel,
    };
  }

  toUpdatePayload(): FloorUpdateDTO {
    return {
      floorName: this.floorName,
    };
  }
}
