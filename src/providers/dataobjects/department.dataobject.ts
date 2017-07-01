export abstract class DepartmentDataObject {

  abstract get departmentId(): string;
  abstract get departmentName(): string;


  public static init(departmentId: string, departmentName: string): DepartmentDataObject {
    return {
      "departmentId": departmentId,
      "departmentName": departmentName
    }
  }
}
