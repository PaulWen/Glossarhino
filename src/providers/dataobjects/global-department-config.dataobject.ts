import {DepartmentDataobject} from "./department.dataobject";


export abstract class GlobalDepartmentConfigDataobject {

  abstract get departments(): Array<DepartmentDataobject>;

  public static getDepartmentById(globalDepartmentConfigDataobject: GlobalDepartmentConfigDataobject, departmentId: number): DepartmentDataobject {
    for (let department of globalDepartmentConfigDataobject.departments) {
      if (department.departmentId == departmentId) {
        return department;
      }
    }
    return null;
  }

}
