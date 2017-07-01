import {DepartmentDataObject} from "./department.dataobject";

export abstract class HomePageDepartmentDataobject {

  abstract get details(): DepartmentDataObject;

  abstract get countOfEntries(): number;

  public static init(countOfEntries: number, details: DepartmentDataObject): HomePageDepartmentDataobject {
    return {
      "details": details,
      "countOfEntries": countOfEntries
    };
  }

}
