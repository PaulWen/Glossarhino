import {DepartmentDataObject} from "./department.dataobject";

export abstract class HomePageDepartmentDataobject {

    abstract get department(): DepartmentDataObject;
    abstract get countOfEntries(): number;

  public static init(countOfEntries: number, department: DepartmentDataObject): HomePageDepartmentDataobject {
    return {
      "department": department,
      "countOfEntries": countOfEntries,
    }
  }

}
