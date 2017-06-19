export abstract class DepartmentFilterDataobject {

  abstract get departmentId(): number;

  abstract get filtered(): boolean;
  abstract set filtered(filtered: boolean);

}
