import {DepartmentDataObject} from "./department.dataobject";


export abstract class GlobalDepartmentConfigDataObject {

  abstract get departments(): Array<DepartmentDataObject>;

  public static getDepartmentById(globalDepartmentConfigDataobject: GlobalDepartmentConfigDataObject, departmentId: number): DepartmentDataObject {
    for (let department of globalDepartmentConfigDataobject.departments) {
      if (department.departmentId == departmentId) {
        return department;
      }
    }
    return null;
  };

}
