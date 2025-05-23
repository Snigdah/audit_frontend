export interface Building {
  id: number;
  buildingName: string;
  totalFloor: number;
}

export interface BuildingFormData {
  name: string;
}

export interface BuildingResponse {
  id: number;
  buildingName: string;
  totalFloor: number;
}

export class BuildingModel {
  name: string;
  id?: number;

  constructor(name: string, id?: number) {
    this.name = name;
    this.id = id;
  }
}
