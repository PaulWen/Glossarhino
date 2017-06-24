export abstract class DepartmentDataObject {

  abstract get departmentId(): number;
  abstract get departmentName(): string;


  public static init(departmentId: number, departmentName: string): DepartmentDataObject {
    return {
      "departmentId": departmentId,
      "departmentName": departmentName
    }
  }
}
