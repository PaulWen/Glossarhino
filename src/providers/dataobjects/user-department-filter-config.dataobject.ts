import {DepartmentFilterDataobject} from "./department-filter.dataobject";
import {AppConfig} from "../../app/app-config";
import {GlobalDepartmentConfigDataobject} from "./global-department-config.dataobject";

export abstract class UserDepartmentFilterConfigDataobject {


  abstract get _id(): string;
  abstract get departmentFilters(): Array<DepartmentFilterDataobject>;


  public static init(allDepartments: GlobalDepartmentConfigDataobject): UserDepartmentFilterConfigDataobject {
    let departmentFilters: Array<DepartmentFilterDataobject> = [];

    for (let department of allDepartments.departments) {
      departmentFilters.push(DepartmentFilterDataobject.init(department.departmentId, true))
    }


    return {
      "_id": AppConfig.USER_APP_SETTINGS_DEPARTMENT_FILTERS,
      "departmentFilters": departmentFilters
    }
  }

}
