import {DepartmentDataobject} from "./department.dataobject";

export abstract class HomePageDepartmentDataobject {

    abstract get department(): DepartmentDataobject;
    abstract get countOfEntries(): number;

  public static init(countOfEntries: number, department: DepartmentDataobject): HomePageDepartmentDataobject {
    return {
      "department": department,
      "countOfEntries": countOfEntries,
    }
  }

}
