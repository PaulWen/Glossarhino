export abstract class DepartmentDataobject {

  abstract get departmentId(): number;
  abstract get departmentName(): string;


  public static init(departmentId: number, departmentName: string): DepartmentDataobject {
    return {
      "departmentId": departmentId,
      "departmentName": departmentName
    }
  }
}
