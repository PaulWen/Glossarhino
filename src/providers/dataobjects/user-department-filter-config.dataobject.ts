import {DepartmentFilterDataobject} from "./department-filter.dataobject";
import {AppConfig} from "../../app/app-config";
import {GlobalDepartmentConfigDataobject} from "./global-department-config.dataobject";

export abstract class UserDepartmentFilterConfigDataobject {


  abstract get _id(): string;
  abstract get selectedDepartments(): Array<number>;


  public static init(allDepartments: GlobalDepartmentConfigDataobject): UserDepartmentFilterConfigDataobject {
    let selectedDepartments: Array<number> = [];

    for (let department of allDepartments.departments) {
      selectedDepartments.push(department.departmentId)
    }


    return {
      "_id": AppConfig.USER_APP_SETTINGS_DEPARTMENT_FILTERS,
      "selectedDepartments": selectedDepartments
    }
  }

}
