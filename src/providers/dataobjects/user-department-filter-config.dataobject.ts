import {AppConfig} from "../../app/app-config";
import {GlobalDepartmentConfigDataObject} from "./global-department-config.dataobject";

export abstract class UserDepartmentFilterConfigDataObject {


  abstract get _id(): string;

  abstract get selectedDepartments(): Array<string>;
  abstract set selectedDepartments(selectedDepartments: Array<string>);


  public static isDepartmentSelected(userDepartmentFilterConfigDataObject: UserDepartmentFilterConfigDataObject, departmentId: string): boolean {
    return userDepartmentFilterConfigDataObject.selectedDepartments.indexOf(departmentId) > -1;
  }

  public static init(allDepartments: GlobalDepartmentConfigDataObject): UserDepartmentFilterConfigDataObject {
    let selectedDepartments: Array<string> = [];

    for (let department of allDepartments.departments) {
      selectedDepartments.push(department.departmentId)
    }

    return {
      "_id": AppConfig.USER_APP_SETTINGS_DEPARTMENT_FILTERS,
      "selectedDepartments": selectedDepartments
    }
  }

}
