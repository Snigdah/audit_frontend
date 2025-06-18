export interface Designation {
  id: number;
  name: string;
}

// For form submission
export interface DesignationFormData {
  designationName: string;
}

// For handling in component/service layer
export class DesignationModel {
  designationName: string;
  id?: number;

  constructor(designationName: string, id?: number) {
    this.designationName = designationName;
    this.id = id;
  }
}
