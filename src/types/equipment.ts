// Equipment Request
export interface EquipmentRequest {
  equipmentNumber: string;
  name: string;
}

// Equipment Response
export interface EquipmentResponse {
  id: number;
  equipmentNumber: string;
  equipmentName: string;
  lastModifiedTime?: string; // Optional as per your backend design
}
