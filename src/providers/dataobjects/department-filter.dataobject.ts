export abstract class DepartmentFilterDataobject {

  abstract get departmentId(): number;

  abstract get filtered(): boolean;
  abstract set filtered(filtered: boolean);

  public static init(departmentId: number, filtered:boolean): DepartmentFilterDataobject {
    return {
      "departmentId": departmentId,
      "filtered": filtered
    }
  }

}
