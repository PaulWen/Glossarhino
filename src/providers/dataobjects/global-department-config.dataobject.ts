import {DepartmentDataObject} from "./department.dataobject";


export abstract class GlobalDepartmentConfigDataobject {

  abstract get departments(): Array<DepartmentDataObject>;

  public static getDepartmentById(globalDepartmentConfigDataobject: GlobalDepartmentConfigDataobject, departmentId: number): DepartmentDataObject {
    for (let department of globalDepartmentConfigDataobject.departments) {
      if (department.departmentId == departmentId) {
        return department;
      }
    }
    return null;
  }

}
